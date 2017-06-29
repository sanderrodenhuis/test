const Mendix = require('./mendix');

let Api = {};

Api.fetchJobCategories = async () => {
  return Mendix.get('/jobcategories/')
    .then(urls => Promise.all(urls.data.map(url => Mendix.get(url))))
    .then(categories => [].concat(...categories.map(category => category.data)));
};

Api.fetchOrders = async () => {
  return Mendix.get('/orders')
    .then(urls => Promise.all(urls.data.map(url => Mendix.get(url))))
    .then(orders => [].concat(...orders.map(order => order.data)));
};
Api.fetchOrder = async (orderId) => {
  return Mendix.get('/orders/'+orderId)
    .then(order => order.data);
};
Api.cancelOrder = async (orderId) => {

};

Api.login = async (username, password) => {
  let {data} = await Mendix.forUser(username,password).get('/account');
  return data;
};

module.exports = Api;
