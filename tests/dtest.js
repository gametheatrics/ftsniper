const path = require('path')
const ethers = require('ethers')
const ftABI = require('../abift.json')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, '../.env') })
const { getUserAddress, getDetailsFromAddress } = require('../apiCalls')
const {feed, searchUserName, getLowerCaseUserNameTime, getApeStatus} = require('../data/dictManager')

let trader = '0x734379C13D3c845183db27Ca1Fa5283b400DaDe1'

const dictAddress = getLowerCaseUserNameTime(trader)
        console.log(dictAddress)

console.log(getApeStatus('smartgamblinggg')[0])
console.log(getApeStatus('sMarTGambLinGgG')[1])