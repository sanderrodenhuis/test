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

let orders_res=[
  "Status",
  "IdJob",
  "Comments",
  "IsCancelled",
  "IdOrder",
  "IdClient",
  "FulfillmentDateTime"
];

//Our parent block
describe('Orders', () => {
  beforeEach((done) => {
    done();
  });

  /*
  * Test the /GET route
  */
  // const regexId = '[^\/]\d+$';

  describe('/GET orders', () => {
    it('it should GET all orders auth as admin user', async () => {
      const response = await mendix.get('/orders'),
        ordersUrls = response.data;
      expect (response).to.have.property('status',200);
      expect (ordersUrls).to.be.an('array');
      ordersUrls.map((ordersUrl) => {
        expect (ordersUrl).to.be.an('string');
        let ids = ordersUrl.split("/");
        let orderId = ids.pop();
        describe(`GET /orders/${orderId}`, () => {
          it(`Should get an order`, async () => {
            let responseOrder = await mendix.forUser(admin_user, admin_pass).get(`/orders/${orderId}`),
              resOrder = responseOrder.data;
            expect (responseOrder).to.have.property('status',200);
            expect (resOrder).to.be.an('object');
            expect (resOrder).to.have.keys(orders_res);
          })
        })
      });
      return Promise.resolve(ordersUrls);
    });
  });

});
