const dotenv = require('dotenv');
const path = require('path');

// Specify the path to the .env file relative to test.js
dotenv.config({ path: path.resolve(__dirname, '../.env') });const ethers = require('ethers');
const ftABI = require('./abift.json');
const {getDetailsFromAddress } = require('./apiCalls');


const provider = new ethers.JsonRpcProvider(process.env.RPC);

// Replace with the address of the contract that emits the "Trade" event
const contractAddress = '0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4';

// Create a contract instance
const contract = new ethers.Contract(contractAddress, ftABI, provider);

function logCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    console.log(`${hours}:${minutes}:${seconds}`);
}

contract.on('Trade', async (trader, subject, isBuy,ethAmount, supply, event) => {

    if (trader === subject && isBuy === true && ethers.formatEther(ethAmount) == '0.000000000000000001' /**&& ethAmount == '0' && supply <=3**/) {
        async function processTrade() {
            const [success, address] = await getDetailsFromAddress(trader);
            console.log(trader)
            let lowerAddress = address.toLowerCase();
            logCurrentTime();
            console.log(lowerAddress);
            console.log('---------------')
             //todo logic for ape
            // if (lowerAddress == '') {
            //     
            // }
    
        }

        // Call the async function
        await processTrade();
    }
});


