const axios = require('axios');

// Define the base URL
const BASE_URL = 'https://prod-api.kosetto.com';

// Define common headers
const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Referer': 'https://www.friend.tech/'
};

async function getUserAddress(userName, auth_token) {
  const url = `${BASE_URL}/search/users?username=${userName}`;

  // Add Authorization header to common headers for this specific request
  const headers = {
    ...COMMON_HEADERS,
    'Authorization': auth_token,
  };

  try {
    const response = await axios.get(url, { headers });
    // console.log(response.data.users[0].address)
    
    return [true, response.data.users[0].address];
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        return [false, 'User does not exist'];
      } else if (error.response.status === 401) {
        return [false, 'JWT may be invalid or some other issue'];
      } else {
        return [false, error.response];
      }
    } else {
      return [false, error.message];
    }
  }
}


async function getDetailsFromAddress(ethAddress) {
  const url = `${BASE_URL}/users/${ethAddress}`;
  
  // Add Authorization header to common headers for this specific request
  const headers = {
    ...COMMON_HEADERS,
  };
  
  try {
    const response = await axios.get(url, { headers });
    
    return [true, response.data.twitterUsername];
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        return [false, 'User does not exist'];
      } else if (error.response.status === 401) {
        return [false, 'JWT may be invalid or some other issue'];
      } else {
        return [false, error.response];
      }
    } else {
      return [false, error.message];
    }
  }
}

// async function getRecentJoiners(auth_token) {
//   const url = `${BASE_URL}/lists/recently-joined`;

//   // Add Authorization header to common headers for this specific request
//   const headers = {
//     ...COMMON_HEADERS,
//     'Authorization': auth_token,
//   };

//   try {
//     const response = await axios.get(url, { headers });
//     // console.log(response.data.users[0].address)
    
//     return [true, response];
//   } catch (error) {
//     if (error.response) {
//       if (error.response.status === 404) {
//         return [false, 'User does not exist'];
//       } else if (error.response.status === 401) {
//         return [false, 'JWT may be invalid or some other issue', error.response.data];
//       } else {
//         return [false, error.response];
//       }
//     } else {
//       return [false, error.message];
//     }
//   }
// }
module.exports = { getUserAddress, getDetailsFromAddress };
