const dotenv = require('dotenv');
const path = require('path');

// Specify the path to the .env file relative to test.js
dotenv.config({ path: path.resolve(__dirname, '../.env') });const ethers = require('ethers');
const { getUserAddress, getDetailsFromAddress } = require('../apiCalls');

// Create a JsonRpcProvider with your custom Ethereum network URL
const provider = new ethers.JsonRpcProvider(process.env.RPC);

// Define the function signature you want to filter for (in hexadecimal)
const functionSignature = '0x6945b123';

function logCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    console.log(`${hours}:${minutes}:${seconds}`);
  }

// Function to process a transaction
async function processTransaction(txHash, blockNumber, txDetails) {
  try {
    // Get the address from the transaction
    const sender = txDetails.from.toLowerCase();
    // Extract the address argument
    const subject = '0x' + txDetails.data.slice(34, 74).toLowerCase();

    // Check if sender and subject match
    if (sender === subject) {
      console.log(sender)
      console.log(`txhash: ${txHash}`)
      // Get details from the address in parallel
      const [success, payload] = await getDetailsFromAddress(sender);
      
      let lowerAddress = payload.toLowerCase()
      logCurrentTime();
      console.log(lowerAddress);
      console.log('---------------')

      //todo logic for ape
            // if (lowerAddress == '') {
            //     
            // }
    }

  } catch (error) {
    console.error('Error processing transaction:', error);
  }
}

// Listen for new blocks and process transactions
async function processBlocks(blockNumbers) {
  try {
    for (const blockNumber of blockNumbers) {
      const block = await provider.getBlock(blockNumber);
      if (block && block.transactions.length > 0) {
        
        // Process each transaction in parallel
        await Promise.all(
          block.transactions.map(async (txHash) => {
            try {
              const txDetails = await provider.getTransaction(txHash);

              // Check if the transaction input data contains the function signature
              if (txDetails && txDetails.data.startsWith(functionSignature)) {
                await processTransaction(txHash, blockNumber, txDetails);
              }
            } catch (error) {
              console.error('Error fetching transaction details:', error);
            }
          })
        );
      }
    }
  } catch (error) {
    console.error('Error fetching blocks:', error);
  }
}

// Listen for new blocks
provider.on('block', async (blockNumber) => {
  processBlocks([blockNumber]);
});

// Handle errors
provider.on('error', (error) => {
  console.error('Provider error:', error);
});
