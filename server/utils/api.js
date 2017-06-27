var Mendix = require('./mendix');

let Api = {}

Api.fetchJobCategories = async () => {
  return Mendix.get('/jobcategories/')
    .then(urls => Promise.all(urls.data.map(url => Mendix.get(url))))
    .then(categories => [].concat(...categories.map(category => category.data)));
};

module.exports = Api;
