//During the test the env variable is set to test
require('dotenv').config();
let mendix = require('../server/utils/mendix');

//Require the dev-dependencies

let chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

// Then either:
let {expect, assert} = chai;
let test_user = process.env.TEST_USER,
  test_pass = process.env.TEST_PASS;
let login_res=['HouseNumber',
  'Addition',
  'Email',
  'IBAN',
  'FirstName',
  'IsActive',
  'City',
  'HasSubscription',
  'Username',
  'PhoneNumber',
  'Street',
  'LastName',
  'PostCode',
  'IdUser']
chai.use(chaiAsPromised);
//Our parent block
describe('Users', () => {
  beforeEach((done) => {
    done();
  });

  /*
  * Test the /GET route
  */


  describe('/GET user/login', () => {
    it('it should LOGIN auth as test user', async () => {
      const response = await mendix.forUser(test_user, test_pass).get('/user/login'),
        data = response.data;

      expect(response).to.have.property('status',200),
      expect(data)
        .to.be.an('object')
        .and
        .to.have.keys(login_res)

    });
  });

});
