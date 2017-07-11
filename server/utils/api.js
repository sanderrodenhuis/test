const Mendix = require('./mendix');

let Api = {};

Api.fetchJobCategories = async () => {
  return Mendix.get('/jobcategories/?data=true')
    .then(({data}) => data);
};

Api.fetchOrders = async () => {
  throw Error('Needs new implementation');
  return Mendix.get('/orders')
    .then(urls => Promise.all(urls.data.map(url => Mendix.get(url))))
    .then(orders => [].concat(...orders.map(order => order.data)));
};
Api.fetchOrder = async (orderId) => {
  throw Error('Needs new implementation');
  return Mendix.get('/orders/'+orderId)
    .then(order => order.data);
};
Api.fetchOrderInvoice = async (orderId) => {
  throw Error('Needs new implementation');
  return Mendix.get('/invoices/' + orderId)
    .then(order => order.data);
};
Api.cancelOrder = async (orderId) => {
  throw Error('Needs new implementation');
  return Mendix.put('/orders/',{
    IdOrder: orderId,
    IsCancelled: true
  }).then(order => order.data);
};
Api.createOrder = async ({Comments,FulfillmentDateTime,Quantity, IdClient, idServicePartner, IdJob}) =>{
  throw Error('Needs new implementation');
  throw Error('Not yet implemented. Waiting on details from Tim');
};
Api.addPhotoToOrder = async(orderId, photoId) => {
  throw Error('Needs new implementation');
  
  throw Error('Not yet implemented.');
};

Api.createAccount = async ({NewPassword, HouseNumber, Addition, Email, IBAN, FirstName, IsActive, City, HasSubscription, ConfirmPassword, Username, PhoneNumber, Street, LastName, PostCode}) => {
  throw Error('Needs new implementation');
  return Mendix.post('/account/', {
    FirstName, LastName,
    Username, NewPassword, ConfirmPassword,
    Email, IBAN, PhoneNumber,
    Street, HouseNumber, Addition, PostCode, City,
    HasSubscription, IsActive
  }).then(order => order.data);
};
Api.updateAccount = async ({NewPassword, HouseNumber, Addition, Email, IBAN, FirstName, IsActive, City, HasSubscription, ConfirmPassword, Username, PhoneNumber, Street, LastName, PostCode}) => {
  throw Error('Needs new implementation');
  return Mendix.forUser(Username, ConfirmPassword).put('/account/', {
    FirstName, LastName,
    Username, NewPassword, ConfirmPassword,
    Email, IBAN, PhoneNumber,
    Street, HouseNumber, Addition, PostCode, City,
    HasSubscription, IsActive
  }).then(order => order.data);
};

Api.userLogin = async (username, password) => {
  try {
    let {data, status} = await Mendix.forUser(username, password).get('/user/login');
    if (status !== 200)
      throw Error('Credentials incorrect');
    return data;
  } catch(e) {
    return false;
  }
};
Api.userEmailExists = async (email) => {
  try
  {
    let response = await Mendix.post('/user/emailcheck',{email});
    return response.status !== 200;
  } catch(e) {
    return true;
  }
};


module.exports = Api;
