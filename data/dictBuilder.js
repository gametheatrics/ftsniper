const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

// Specify the path to the .env file relative to test.js
dotenv.config({ path: path.resolve(__dirname, '../.env') });
myJWT = process.env.JWT

// Define the base URL
const BASE_URL = 'https://prod-api.kosetto.com';

// Define common headers
const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Referer': 'https://www.friend.tech/'
};

function writeDataToFile(address, userName, time, filename) {
  const data = `${address.toLowerCase()}, ${userName.toLowerCase()}, ${time}\n`;

  fs.appendFile(filename, data, (err) => {
    if (err) {
      console.error('Error appending data to file:', err);
    } 
  });
}

function searchUserName(userName, filename) {
  const lowerCaseUserName = userName.toLowerCase();
  const data = fs.readFileSync(filename, 'utf-8');
  const lines = data.split('\n').filter(Boolean); // Split lines and remove empty lines

  for (const line of lines) {
    const [address, storedUserName, time] = line.split(', ');
    if (storedUserName === lowerCaseUserName) {
      return line.split(', '); // Return the line as an array
    }
  }

  return null; // No exact match found
}

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')

  return(`${hours}:${minutes}:${seconds}`)
}

function getRandomWaitTime(minSeconds, maxSeconds) {
  const minMilliseconds = minSeconds * 1000;
  const maxMilliseconds = maxSeconds * 1000;
  return Math.floor(Math.random() * (maxMilliseconds - minMilliseconds + 1)) + minMilliseconds;
}

async function getUserById(id) {
  
  const url = `${BASE_URL}/users/by-id/${id}`;

  // Add Authorization header to common headers for this specific request
  const headers = {
    ...COMMON_HEADERS,
    'Authorization': myJWT,
  }

  try {
    const response = await axios.get(url, { headers });
    return ([true,response.data])

  } catch (error) {
    return [false,error]
  }
}

async function sync() {
  console.log('Syncing to current feed...')
  let i = 150000;

  const stepSizes = [50000, 25000, 12500, 6250, 3125, 1562, 781, 390, 195, 97, 48, 24, 12, 6, 3, 1]
  for (const stepSize of stepSizes) {
    while (true) {
      let response = await getUserById(i);
      if (response[0] === false) {
        i -= stepSize;
        
        await new Promise(resolve => setTimeout(resolve, getRandomWaitTime(1,5))); // Pause for 1-5 second
        break;
      }
      i += stepSize;
    }
  }
  if (i == 1){
    return[false,'IP Flagged, dont try again immediately']
  }
  return [true,i]
}

async function feed(){
  const mayonaise = await sync()

  if (!mayonaise[0]==true){
    console.log(mayonaise[1])
  } else {
    currentId = mayonaise[1]
  }

  while (true) {
    
    response = await getUserById(currentId)
    if (response[0]==false){
      await new Promise((resolve) => setTimeout(resolve, getRandomWaitTime(3,8))); // Wait for some random time between 1 and 10
      continue

    }
    console.log(response[1].id)
    const userAddr = (response[1].address)
    console.log(response[1].address)
    const userName = (response[1].twitterUsername)
    console.log(response[1].twitterUsername)
    const currentTime = getCurrentTime()
    console.log(currentTime)

    writeDataToFile(userAddr,userName,currentTime,'dict.txt')
    console.log('--------------------')
    currentId++; // Increment i after waiting
    await new Promise((resolve) => setTimeout(resolve, getRandomWaitTime(0,1))); // Wait for some random time between 1 and 10

  }
  

}