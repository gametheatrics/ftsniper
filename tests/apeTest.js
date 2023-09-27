const ethers = require('ethers')
const path = require('path')
const dotenv = require('dotenv') // Import dotenv properly

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Now you can access environment variables defined in your .env file
const userPrivateKey = process.env.USER_KEY
const friendTechContractAddress = process.env.FRIENDTECH_CONTRACT

const {calculatePrice,ape,buyShares,sellShares,checkBuyPrice} = require('../trading')
const ftABI = require('../abift.json')
const provider = new ethers.getDefaultProvider('http://127.0.0.1:8545/')




// Ethereum RPC URL
//const rpcUrl = 'http://127.0.0.1:8545/';





async function main() {
        console.log('made by @gametheatrics')
        console.log('Initializing....')
        const connectedFriendTech = new ethers.Wallet(userPrivateKey, provider)
        const friendTechContract = new ethers.Contract(friendTechContractAddress, ftABI, connectedFriendTech)
        console.log('Connected to RPC')
        myJWT = process.env.JWT

        let result

        // result = await buyShares(friendTechContract,'0xcb17058ef7cc2b6833b72b132e94dd559ee750b5',1)
        // console.log(result)

        result = await checkBuyPrice(friendTechContract,'0x677C833a839073fC7F2527bc430Aeca7bC3589ED',1)
        console.log(result)
        
        // // result = await checkBuyPrice(friendTechContract,'0x60060303cf55f18f34e16b98e43f7ae9530a2c1e',1)
        // // console.log(result)

        console.log(await ape(friendTechContract,'0x677C833a839073fC7F2527bc430Aeca7bC3589ED','9'))
        
        
        

       
        
    
    
}

main()