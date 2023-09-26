const path = require('path')
const ethers = require('ethers')
const ftABI = require('../abift.json')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, '../.env') })
const { getUserAddress, getDetailsFromAddress } = require('../apiCalls')
const {getLowerCaseUserNameTime} = require('./dictManager')

function startTradeEventListener() {
  // Specify the path to the .env file relative to this module
  dotenv.config({ path: path.resolve(__dirname, '../.env') })

  const provider = new ethers.JsonRpcProvider(process.env.RPC)

  // Replace with the address of the contract that emits the "Trade" event
  const contractAddress = '0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4'

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, ftABI, provider)

  function logCurrentTime() {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0');
    console.log(`${hours}:${minutes}:${seconds}`);
  }

  contract.on('Trade', async (trader, subject, isBuy, ethAmount, supply, event) => {
    if (
      trader === subject &&
      isBuy === true &&
      ethers.formatEther(ethAmount) === '0.000000000000000001'
    ) {
      async function processTrade() {
        console.log(trader);
  
        const dictAddress = getLowerCaseUserNameTime(trader)
          if (!dictAddress==false){
              logCurrentTime()
              console.log(`*${dictAddress[1]}`)
              console.log(`*${dictAddress[0]}`)
              //APE LOGIC 
          } else {
            //getting address from kosetto
            const [success, payload] = await getDetailsFromAddress(trader)
            const lowerAddress = payload.toLowerCase()
            logCurrentTime()
            console.log(lowerAddress)
            
        }
        console.log('---------------')
      }

      // Call the async function
      await processTrade();
    }
  });
}

// Export the function for use in other modules
module.exports = { startTradeEventListener };
