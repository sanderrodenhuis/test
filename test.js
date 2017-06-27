require('dotenv').config();
var Api = require('./server/utils/api');


Api.fetchJobCategories().then(console.log);
