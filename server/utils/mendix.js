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

const mendix = axiosForUser(process.env.MENDIX_USER, process.env.MENDIX_PASS);

mendix.forUser = axiosForUser;

module.exports = mendix;
