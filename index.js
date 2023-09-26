require('dotenv').config()
const { createSpinner } = require('nanospinner')
const { ethers } = require('ethers')
const { buyShares, sellShares, checkBuyPrice, checkSellPrice } = require('./trading')
const { getUserAddress } = require('./apiCalls');
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

async function manualTrade(friendTechContract){
    while (true) {

        let helpers = {
            twitter: null,
            quantity: null,
            direction: null,
            buyPrice: null,
            sellPrice: null,
            lfg: null
        }
         
        
        helpers.twitter = await input({ message: 'twitter: ' })

        //input validation and checking if user exists
        const userAddressDataAndStatus = await getUserAddress(helpers.twitter, myJWT)
        if (userAddressDataAndStatus[0] == false) {
            console.log(userAddressDataAndStatus[1])
            continue
        }
        const subject = userAddressDataAndStatus[1]

        //getting buy price to show order
        helpers.buyPrice = ethers.formatEther(await checkBuyPrice(friendTechContract, subject, '1'))
        helpers.sellPrice = ethers.formatEther(await checkSellPrice(friendTechContract, subject, '1'))

        helpers.direction = await input({ message: '(b)uy or (s)ell: ' })

        //input validation
        if (helpers.direction !== 'b' && helpers.direction !== 's'){
            continue
        }

        helpers.quantity = await input({ message: 'qty: ' })

        helpers.more = await input({
            message: `${helpers.direction} ${helpers.quantity} ${helpers.twitter}\n${helpers.buyPrice} | ${helpers.sellPrice}\n(r)un?`
        })

        if (helpers.more == 'r') {
            const spinner = createSpinner('Sending tx').start()


            //add price as well here

            let status

            if (helpers.direction === 'b') {
                status = await buyShares(friendTechContract, subject, helpers.quantity)
               
            }
            if (helpers.direction === 's') {
                status = await sellShares(friendTechContract, subject, helpers.quantity)
                

            }
            
            if (status[0] == true) {
                spinner.success({ text: `${ethers.formatEther(status[1])} ETH` })
            }
            else {
                spinner.error({ text: ` ${status[0]}` })
            }
        }


        let repeat = await input({ message: '(q)uit or (c)ontinue? ' })
        if (repeat === 'q') {
            break
        }
    }
}

main()