const axios = require('axios');

const axiosForUser = (username, password) => {
  return axios.create({
    baseURL: process.env.MENDIX_URL,
    auth: {
      username: username,
      password: password,
    }
  });
};

const request = axiosForUser(process.env.MENDIX_USER, process.env.MENDIX_PASS);

request.forUser = axiosForUser;

module.exports = request;
