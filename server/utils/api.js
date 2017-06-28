const Mendix = require('./mendix');

let Api = {};

Api.fetchJobCategories = async () => {
  return Mendix.get('/jobcategories/')
    .then(urls => Promise.all(urls.data.map(url => Mendix.get(url))))
    .then(categories => [].concat(...categories.map(category => category.data)));
};


Api.login = async (username, password) => {
  let {data} = await Mendix.forUser(username,password).get('/account');
  return data;
};

module.exports = Api;
