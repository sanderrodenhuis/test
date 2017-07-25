//During the test the env variable is set to test
require('dotenv').config();
const mendix = require('../server/utils/mendix'),
  mockOrder = require('./data/order');

//Require the dev-dependencies

const chai = require('chai'),
  chaiAsPromised = require("chai-as-promised");

// Then either:
const {expect, assert} = chai;

chai.use(chaiAsPromised);

const
// test_user = process.env.TEST_USER,
//   test_pass = process.env.TEST_PASS,
  admin_user = process.env.MENDIX_USER,
  admin_pass = process.env.MENDIX_PASS;

//Our parent block
describe('Orders', () => {
  let params = '',// TODO add param when the api definition is updated '?data=true',
    orders_res,
    orders_data;

  before(async () => {
    orders_res = await mendix.get(`/orders/${params}`),
    orders_data = orders_res.data;
  })

  // beforeEach(async () => {
  //   await sync();

  // })

  // afterEach(async () => {
  //   await drop();
  // })
  /*
  * Test the /GET route
  */

  describe(`GET /orders/${params}`, () => {
    it('it should GET all orders auth as admin user', async () => {
      try {
        expect (orders_res).to.have.property('status',200);
        expect (orders_data).to.be.an('array');
        orders_data.map((ordersUrl) => {
          expect (ordersUrl).to.be.an('string');
          let ids = ordersUrl.split("/");
          let orderId = ids.pop();
          describe(`GET /orders/${orderId}`, () => {
            it(`Should get an order`, async () => {
              let responseOrder = await mendix.forUser(admin_user, admin_pass).get(`/orders/${orderId}`),
                resOrder = responseOrder.data;
              expect (responseOrder).to.have.property('status',200);
              expect (resOrder).to.be.an('object')
                .and
                .to.have.keys(Object.keys(mockOrder));
            })
          })
        })
      } catch(response) {
        assert(response === 200, `GET /orders/${params} failed Status: ${response}`);
        // message,showDiff,actual,expected
      }
    });
  });

  const current_date = new Date().toISOString(),
    order = {
      "Comments":"a test comment",
      "FulfillmentDateTime":current_date,
      "IdClient": 1,
      "IdJob": 2
    },
    order_get={
      "Status":"Done",
      "IsCancelled":false,
      "Comments":"a test comment",
      "FulfillmentDateTime":current_date,
      "IdClient": 1,
      "IdJob": 2
    };
  describe('/POST orders',  () => {
    let idOrder = null;
    it('it should insert a new order auth as admin user', async () => {
      const response = await mendix.forUser(admin_user, admin_pass).post('/orders/', order);
      idOrder = response.data;
      expect (response).to.have.property('status', 201);
      expect (idOrder).to.be.an('object')
        .and
        .to.have.keys('IdOrder');
    });
    it('it should GET last order inserted auth as admin user', async () => {
      const response = await mendix.forUser(admin_user, admin_pass).get('/orders/' + idOrder.IdOrder),
        order_res = response.data;
      expect (response).to.have.property('status', 200);
      expect (order_res).to.be.an('object')
        .and
        .to.have.keys(Object.keys(order_get).concat(['IdOrder']));
    });
    it('it should remove last order inserted auth as admin user', async () => {
      const response = await mendix.forUser(admin_user, admin_pass).put('/orders/' + idOrder.IdOrder,{"IsCancelled":true});
      expect (response).to.have.property('status', 200);
    });
    it('it should GET /users/IdUser/orders auth as admin user', async () => {
      const response = await mendix.forUser(admin_user, admin_pass).get('/users/' + order.IdClient + '/orders'),
        user_order_res = response.data;
      expect (response).to.have.property('status', 200);
      expect (user_order_res).to.be.an('Array');
    });
  });
});
