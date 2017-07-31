const Request = require('./request'),
      Validators = require('./validators'),
      {pick, createUserActivateToken, createPasswordResetToken} = require('../helpers');

class Api {
  constructor({res, req, app}) {
    this.app = app;
    this.req = req;
    this.res = res;
    this.validators = Validators;
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

  async fetchUser(userId) {
    const {data} = await Request.get(`/users/${userId}`);
    return data;
  }
  async fetchUserByEmail(email) {
    const {data} = await Request.get(`/users/`, {params: {Email: email}});
    return data;
  }

  async createUser (userData) {
    const user = pick(userData, 'NewPassword', 'HouseNumber', 'Addition', 'Email', 'IBAN', 'FirstName', 'IsActive', 'City', 'HasSubscription', 'ConfirmPassword', 'Username', 'PhoneNumber', 'Street', 'LastName', 'PostCode');
    const validation = Validators.newUser(user);

    if (validation)
      throw validation;

    const emailExists = await this.userEmailExists(user.Email);

    if (emailExists)
      throw {Email: ['Email is al in gebruik']};
    try
    {
      let {data} = await Request.post('/users/', user);

      await this.app.mail.send(user.Email, 'Activeer je account', 'emails/account/verification', {
        baseUrl: this.req.protocol + '://' + this.req.get('host'),
        payload: createUserActivateToken(data)
      });
    } catch(error) {
      throw Error(error.data.errorMessage);
    }
  }
  async updateUser (IdUser, userData) {
    let updatedUser = pick(userData, 'HouseNumber','Addition', 'IBAN','FirstName','HasSubscription','PhoneNumber','LastName','PostCode');
    let updatedPass = pick(userData, 'NewPassword','ConfirmPassword');
    let validation = Validators.editUser(updatedUser) || {};

    if (updatedPass.NewPassword)
      validation = Object.assign({},validation,Validators.editUserPassword(updatedPass));
    
    let user = await this.fetchUser(IdUser);

    if (! user)
      throw Error('Somethign went wrong (user)');
    
    if (Object.keys(validation).length)
      throw validation;

    updatedUser = Object.assign({}, user, updatedUser);
    
    if (updatedPass.NewPassword)
      updatedUser = Object.assign(updatedUser, updatedPass);
    
    let {data} = await Request.put(`/users/${IdUser}`, updatedUser);
    return data;
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
      throw Error('Email does not exist');

    let payload = createPasswordResetToken({Email:Email});
    try{
      await this.app.mail.send(Email, 'Nieuw wachtwoord', 'emails/account/reset-password', {
        baseUrl: this.req.protocol + '://' + this.req.get('host'),
        payload
      });

    }catch(e){
      throw Error('Email could not be sent');
    };
  }
}


module.exports = Api;
