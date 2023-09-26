const {feed, searchUserName, getLowerCaseUserName} = require('../data/dictManager')

const {startBlockListener} = require('../data/blockListener')

async function testA(){
    feed()
    }

async function testB(){
    
    startBlockListener()
}

testB()
