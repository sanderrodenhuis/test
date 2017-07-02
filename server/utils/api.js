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
Api.fetchOrderInvoice = async (orderId) => {
  return Mendix.get('/invoices/' + orderId)
    .then(order => order.data);
};
Api.cancelOrder = async (orderId) => {
  return Mendix.put('/orders/',{
    IdOrder: orderId,
    IsCancelled: true
  }).then(order => order.data);
};
Api.createOrder = async ({Comments,FulfillmentDateTime,Quantity, IdClient, idServicePartner, IdJob}) =>{
  throw Error('Not yet implemented. Waiting on details from Tim');
};
Api.addPhotoToOrder = async(orderId, photoId) => {
  throw Error('Not yet implemented.');
};

Api.createAccount = async ({NewPassword, HouseNumber, Addition, Email, IBAN, FirstName, IsActive, City, HasSubscription, ConfirmPassword, Username, PhoneNumber, Street, LastName, PostCode}) => {
  return Mendix.post('/account/', {
    FirstName, LastName,
    Username, NewPassword, ConfirmPassword,
    Email, IBAN, PhoneNumber,
    Street, HouseNumber, Addition, PostCode, City,
    HasSubscription, IsActive
  }).then(order => order.data);
};
Api.updateAccount = async ({NewPassword, HouseNumber, Addition, Email, IBAN, FirstName, IsActive, City, HasSubscription, ConfirmPassword, Username, PhoneNumber, Street, LastName, PostCode}) => {
  return Mendix.forUser(Username, ConfirmPassword).put('/account/', {
    FirstName, LastName,
    Username, NewPassword, ConfirmPassword,
    Email, IBAN, PhoneNumber,
    Street, HouseNumber, Addition, PostCode, City,
    HasSubscription, IsActive
  }).then(order => order.data);
};
Api.login = async (username, password) => {
  let {data} = await Mendix.forUser(username,password).get('/account/');
  return data;
};

module.exports = Api;
