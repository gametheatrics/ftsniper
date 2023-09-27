const path = require('path')
const ethers = require('ethers')
const ftABI = require('../abift.json')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, '../.env') })

//const { getUserAddress, getDetailsFromAddress } = require('../apiCalls')
const {ape} = require('../trading')
const {getLowerCaseUserNameTime, getApeStatus} = require('./dictManager')
function startTradeEventListener() {

  const userPrivateKey = process.env.USER_KEY
  const friendTechContractAddress = process.env.FRIENDTECH_CONTRACT

  const provider = new ethers.JsonRpcProvider(process.env.RPC)
  const connectedFriendTech = new ethers.Wallet(userPrivateKey, provider)

    // Create a contract instance

  const friendTechContract = new ethers.Contract(friendTechContractAddress, ftABI, connectedFriendTech)

  function logCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0'); // Get milliseconds
  
    console.log(`${hours}:${minutes}:${seconds}.${milliseconds}`);
  }

  friendTechContract.on('Trade', async (trader, subject, isBuy, ethAmount, supply, event) => {
    if (
      trader === subject &&
      isBuy === true 
      && supply.toString() === '0'
    ) {
      async function processTrade() {
        //console.log(trader)
        const dictAddress = getLowerCaseUserNameTime(trader)
          if (!dictAddress==false){
              logCurrentTime()
              console.log(`*${dictAddress[1]}`)
              console.log(`*${dictAddress[0]}`)
              console.log('---------------')

              let apeStatus = getApeStatus(dictAddress[0])
              if (!apeStatus==false){
                console.log(apeStatus)
                ape(friendTechContract,trader,apeStatus[1])
              }
          } 
       }

      // Call the async function
      await processTrade();
    }
  });
}

// Export the function for use in other modules
module.exports = { startTradeEventListener };
