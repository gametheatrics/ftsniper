require('dotenv').config()
const { createSpinner } = require('nanospinner')
const { ethers } = require('ethers')
const { buyShares, sellShares, checkBuyPrice, checkSellPrice } = require('./trading')
const { getUserAddress } = require('./apiCalls');
const { manualTrade, startListening } = require('./menu');
const ftABI = require('./abift.json')
const { input } = require('@inquirer/prompts')
const axios = require('axios');
const userPrivateKey = process.env.USER_KEY
const friendTechContractAddress = process.env.FRIENDTECH_CONTRACT


const provider = new ethers.getDefaultProvider(process.env.RPC)


async function main() {
    console.log('made by @gametheatrics')
    console.log('Initializing....')
    const connectedFriendTech = new ethers.Wallet(userPrivateKey, provider)
    const friendTechContract = new ethers.Contract(friendTechContractAddress, ftABI, connectedFriendTech)
    console.log('Connected to RPC')
    myJWT = process.env.JWT

    manualTrade(friendTechContract)

}



main()