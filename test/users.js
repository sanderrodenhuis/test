//During the test the env variable is set to test
require('dotenv').config();
let mendix = require('../server/utils/mendix');

//Require the dev-dependencies

let chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

// Then either:
let {expect }= chai;
// let {expect, assert} = chai;


chai.use(chaiAsPromised);

let test_user = process.env.TEST_USER,
  test_pass = process.env.TEST_PASS,
  admin_user = process.env.MENDIX_USER,
  admin_pass = process.env.MENDIX_PASS;

let user_res=['HouseNumber',
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
        .to.have.keys(user_res)

      describe('POST /user/emailcheck', () => {
        it(`Should check if the email exists`, async () => {
          const response = await mendix.forUser(admin_user, admin_pass).post('/user/emailcheck',{"email":data.Email});
          expect (response).to.have.property('status',200);

        })
      })

      describe('GET /users/{id}', () => {
        it(`Should get user info`, async () => {
          const response = await mendix.get('/users/'+data.IdUser),
            resUser = response.data;
          expect (response).to.have.property('status',200);
          expect (resUser).to.be.an('object');
          expect (resUser).to.have.keys(user_res)
          expect(resUser).to.deep.equal(data);

        })
      })

    });
  });

});
