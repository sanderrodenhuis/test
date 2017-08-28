const Request = require('./request'),
      Validators = require('./validators'),
      {pick, createUserActivateToken, createPasswordResetToken, postCode} = require('../helpers'),
      fs = require('fs'),
      FormData = require('form-data');
      
class Api {
  constructor({res, req, app}) {
    this.app = app;
    this.req = req;
    this.res = res;
    this.validators = Validators;
  }
  async fetchJobs() {
    return Request.get('/jobs?data=true')
      .then(({data}) => data);
  }
  async fetchJob(IdJob) {
    return Request.get('/jobs/' + IdJob)
      .then(({data}) => data);
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
  
  async fetchOrder(IdOrder) {
    return Request.get('/orders/'+IdOrder)
      .then(order => order.data);
  }
  async fetchOrdersByUser(IdUser) {
    return Request.get('/users/' + IdUser + '/orders?data=true')
      .then(response => response.data)
      .catch(err => []);
  }
  
  async fetchOrderInvoice (orderId) {
    return Request.get('/orders/' + orderId + '/invoice/')
      .then(order => order.data);
  }
  async fetchTimeslots(IdJob, date, PostCode, HouseNumber, Addition)
  {
    return Request.get('/timeslots/', {
        params: {
          Date: date + 'T12:00:00+0100',
          HouseNumber: HouseNumber,
          PostCode: postCode(PostCode).replace(/ /g,''),
          Addition,
          IdJob
        }
      })
      .then(response => response.data)
      .catch(err => []);
  }
  
  async cancelOrder (orderId){
    throw Error('Needs new implementation');
    return Request.put('/orders/',{
      IdOrder: orderId,
      IsCancelled: true
    }).then(order => order.data);
  }
  
  async createOrder({Comments,FulfillmentDateTime,IdClient, IdJob}) {
    
    try{
      await this.fetchUser(IdClient)
    } catch(e) {
      throw Error('IdClient doesn\'t exist');
    }
    try {
      await this.fetchJob(IdJob);
    } catch(e) {
      throw Error('IdJob doesn\'t exist');
    }
    try {
      let {data} = await Request.post('/orders', {
        Comments,
        FulfillmentDateTime,
        IdClient,
        IdJob
      });
      return data;
    } catch(e) {
      throw Error('Could not create order (probably date field...)');
    }
  }
  
  async createOrderPhoto (IdOrder, filePath) {
    let stream = fs.readFileSync(filePath);
    let formData = new FormData();
    formData.append('photo', fs.createReadStream(filePath));
    let response = await Request.post('/orders/' + IdOrder + '/photos/', stream, {headers: formData.getHeaders() });
    return response.data;
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
      return data;
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
