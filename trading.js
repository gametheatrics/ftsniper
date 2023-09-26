const { ethers } = require('ethers')

/**
 * Buys shares using Ethereum smart contracts.
 *
 * @param {object} contract - Contract object with signer
 * @param {string} subject - Address of the subject
 * @param {string} numberOfShares - Number of shares to buy
 */
async function buyShares(contract, subject, numberOfShares) {
  try {
    // Calculate the buy price after fees
    const buyPriceAfterFee = await checkBuyPrice(contract, subject, numberOfShares)

    // Perform the share purchase transaction
    const result = await contract.buyShares(subject, numberOfShares, { value: buyPriceAfterFee })
    return [true,buyPriceAfterFee]
  } catch (error) {
    return [error]
  }
}

/**
 * Checks the buy price of shares after fees.
 *
 * @param {object} contract - Contract object with signer
 * @param {string} subject - Address of the subject
 * @param {string} numberOfShares - Number of shares to buy
 * @returns {string} - Buy price after fees
 */
async function checkBuyPrice(contract, subject, numberOfShares) {
  try {
    // Retrieve the buy price after fees
    const buyPrice = await contract.getBuyPriceAfterFee(subject, numberOfShares)
    return buyPrice
  } catch (error) {
        return error.message
  }
}

/**
 * Sells shares using Ethereum smart contracts.
 *
 * @param {object} contract - Contract object with signer
 * @param {string} subject - Address of the subject
 * @param {string} numberOfShares - Number of shares to sell
 */
async function sellShares(contract, subject, numberOfShares) {
  try {
    // Calculate the sell price after fees
    const sellPriceAfterFee = await checkSellPrice(contract, subject, numberOfShares)

    // Perform the share sale transaction
    const result = await contract.sellShares(subject, numberOfShares, { value: sellPriceAfterFee })
    return [true,sellPriceAfterFee]
  } catch (error) {
    return [error.message]  }
}

/**
 * Checks the sell price of shares after fees.
 *
 * @param {object} contract - Contract object with signer
 * @param {string} subject - Address of the subject
 * @param {string} numberOfShares - Number of shares to sell
 * @returns {string} - Sell price after fees
 */
async function checkSellPrice(contract, subject, numberOfShares) {
  try {
    // Retrieve the sell price after fees
    const sellPrice = await contract.getSellPriceAfterFee(subject, numberOfShares)
    return sellPrice
  } catch (error) {
    return [error.message]
  }
}

module.exports = {
  buyShares,
  checkBuyPrice,
  sellShares,
  checkSellPrice
}
