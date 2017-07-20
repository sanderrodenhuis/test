//During the test the env variable is set to test
require('dotenv').config();
let mendix = require('../server/utils/mendix');

//Require the dev-dependencies

let chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

// Then either:
let {expect, assert} = chai;
let test_user = process.env.TEST_USER,
  test_pass = process.env.TEST_PASS,
  admin_user = process.env.MENDIX_USER,
  admin_pass = process.env.MENDIX_PASS;


chai.use(chaiAsPromised);
//Our parent block
describe('Orders', () => {
  beforeEach((done) => {
    done();
  });

  /*
  * Test the /GET route
  */


  // describe('/GET orders', () => {
  //   it('it should GET all orders auth as test user', () => {
  //     return Promise.all([
  //       expect(mendix.forUser(test_user, test_pass).get('/orders')).to.eventually.have.property('status',200),
  //       expect(mendix.forUser(test_user, test_pass).get('/orders').then((response)=>{return response.data})).to.eventually.be.an('array')
  //     ]);
  //   });
  // });

  describe('/GET orders', () => {
    it('it should GET all orders auth as admin user', () => {
      return Promise.all([
        expect(mendix.forUser(admin_user, admin_pass).get('/orders')).to.eventually.have.property('status',200),
        expect(mendix.forUser(admin_user, admin_pass).get('/orders').then((response)=>{return response.data})).to.eventually.be.an('array')
      ]);
    });
  });

});
