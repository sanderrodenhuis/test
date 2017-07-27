const Request = require('./request'),
      Validators = require('./validators'),
      Jwt = require('jsonwebtoken');

class Api {
  constructor({res, req, app}) {
    this.app = app;
    this.req = req;
    this.res = res;
  }
  
  async fetchJobCategories() {
    return Request.get('/jobcategories/?data=true')
      .then(({data}) => data);
  }
  
  async fetchOrders() {
    throw Error('Needs new implementation');
    return Request.get('/orders')
      .then(urls => Promise.all(urls.data.map(url => Request.get(url))))
      .then(orders => [].concat(...orders.map(order => order.data)));
  }
  
  async fetchOrder(orderId) {
    throw Error('Needs new implementation');
    return Request.get('/orders/'+orderId)
      .then(order => order.data);
  }
  
  async fetchOrderInvoice (orderId) {
    throw Error('Needs new implementation');
    return Request.get('/invoices/' + orderId)
      .then(order => order.data);
  }
  
  async cancelOrder (orderId){
    throw Error('Needs new implementation');
    return Request.put('/orders/',{
      IdOrder: orderId,
      IsCancelled: true
    }).then(order => order.data);
  }
  
  async createOrder({Comments,FulfillmentDateTime,Quantity, IdClient, idServicePartner, IdJob}) {
    throw Error('Needs new implementation');
  }
  
  async addPhotoToOrder (orderId, photoId) {
    throw Error('Needs new implementation');
  }
  
  async createUser ({NewPassword, HouseNumber, Addition, Email, IBAN, FirstName, IsActive, City, HasSubscription, ConfirmPassword, Username, PhoneNumber, Street, LastName, PostCode}) {
    const user = {NewPassword, HouseNumber, Addition, Email, IBAN, FirstName, IsActive, City, HasSubscription, ConfirmPassword, Username, PhoneNumber, Street, LastName, PostCode};
    const validation = Validators.newUser(user);
    
    if (validation)
      throw validation;
    
    const emailExists = await this.userEmailExists(Email);
    
    if (emailExists)
      throw {Email: 'Email is al in gebruik'};
    
    let {data} = await Request.post('/user/', user);
    
    let validUntil = new Date();
    validUntil.setDate(date.getDate() + 7);
    validUntil.getTime();
    
    let payload = Jwt.sign({
      u: data.IdUser,
      v: ~~(validUntil.getTime() / 1000)
    }, process.env.JWT_SECRET);
    
    await this.app.mail.send(Email, 'Activeer je account', 'emails/account/verification', {
      baseUrl: this.req.protocol + '://' + this.req.get('host'),
      payload
    });
    
    // we don't catch it. if it throws, we want it to be caught externally
    
    return Request.post('/users/', user).then(order => order.data);
  }
  
  async updateAccount ({NewPassword, HouseNumber, Addition, Email, IBAN, FirstName, IsActive, City, HasSubscription, ConfirmPassword, Username, PhoneNumber, Street, LastName, PostCode}) {
    const user = {NewPassword, HouseNumber, Addition, Email, IBAN, FirstName, IsActive, City, HasSubscription, ConfirmPassword, Username, PhoneNumber, Street, LastName, PostCode};
    const validation = Validators.newUser(user);

    if (validation)
      throw validation;

    const emailExists = await Api.userEmailExists(Email);

    if (emailExists)
      throw {Email: 'Email is al in gebruik'};
    try {
      let {data} = await Request.put('/user/', user);
    } catch(e) {
      return e;
    }

  }
  
  async userLogin (username, password) {
    try {
      let {data, status} = await Request.forUser(username, password).get('/user/login');
      if (status !== 200)
        throw Error('Credentials incorrect');
      return data;
    } catch(e) {
      return false;
    }
  }
  
  async userEmailExists (Email) {
    try
    {
      let response = await Request.post('/user/emailcheck',{Email});
      return response.status !== 200;
    } catch(e) {
      return true;
    }
  }

  async userForgotPassword (Email) {
    const emailExists = await this.userEmailExists(Email);
    if (!emailExists)
      throw {Email: 'TODO email doesn\' exists' };
    let validUntil = new Date();
    validUntil.setDate ( validUntil.getDate() + 7 );

    let payload = Jwt.sign({
      e: Email,
      v: ~~(validUntil.getTime() / 1000)
    }, process.env.JWT_SECRET);
try{

    await this.app.mail.send(Email, 'Nieuw wachtwoord', 'emails/account/reset-password', {
      baseUrl: this.req.protocol + '://' + this.req.get('host'),
      payload
    });

}catch(e){console.log(e)};
  }
}


module.exports = Api;
