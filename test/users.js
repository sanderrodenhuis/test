//During the test the env variable is set to test
require('dotenv').config();
const mendix = require('../server/utils/mendix'),
  mockUser = require('./data/user');

//Require the dev-dependencies

const chai = require('chai'),
  chaiAsPromised = require("chai-as-promised");

// Then either:
const {expect, assert} = chai;


chai.use(chaiAsPromised);

const test_user = process.env.TEST_USER,
  test_pass = process.env.TEST_PASS,
  admin_user = process.env.MENDIX_USER,
  admin_pass = process.env.MENDIX_PASS;


//Our parent block
describe('Users', () => {
// let params = '?data=true';
  let login_res,
    login_data;
  before(async () => {
  //   await sync();
    login_res = await mendix.forUser(test_user, test_pass).get('/user/login'),
    login_data = login_res.data;
  })

  // beforeEach(async () => {
  //   await sync();
  // })

  // afterEach(async () => {
  //   await drop();
  // })

  /*
  * Test the GET user/login`
  */

  describe(`GET user/login`, () => {
    it(`it should LOGIN auth as test user`, async () => {

      expect(login_res).to.have.property('status',200),
      expect(login_data)
        .to.be.an('object')
        .and
        .to.have.keys(Object.keys(mockUser));

      describe('POST /user/emailcheck', () => {
        it(`Should check if the email exists`, async () => {
          try {
            const response = await mendix.forUser(admin_user, admin_pass).post('/user/emailcheck',{"email":login_data.Email});
            expect (response).to.have.property('status',200);
          } catch(response) {
            assert((response.status | false) !== 400, login_data.Email);
          }

        })
      })


      describe(`GET /users/${login_data.IdUser}`, () => {
        it(`Should get user info and check if equal to the login response`, async () => {
          try {
            const response = await mendix.get('/users/'+login_data.IdUser),
              resUser = response.data;
            expect (response).to.have.property('status',200);
            expect (resUser).to.be.an('object')
              .and
              .to.have.keys(Object.keys(mockUser))
              .and
              .to.deep.equal(login_data);
          } catch(response) {
            assert((response.status | false) !== 200, `GET /users/${login_data.IdUser} failed Status: ${response.status}`);
          }

        })
      })

    });
  });

  let generate_user_data = () => {
    const uid = (new Date().getTime()).toString(36);
    return {
      "NewPassword":"TestTest123",
      "HouseNumber":"123",
      "Addition":"",
      "Email":"email"+uid+"@techtribe.nl",
      "IBAN":"",
      "FirstName":"User"+uid,
      "IsActive":"true",
      "City":"Amsterdam",
      "HasSubscription":"false",
      "ConfirmPassword":"TestTest123",
      "Username":"email"+uid+"@techtribe.nl",
      "PhoneNumber":"06111"+uid,
      "Street":"Street"+uid,
      "LastName":"Surname"+uid,
      "PostCode":"1100 AB"
    };

  }
  let response,
    resPostUser,
    resPutUser,
    user_new = generate_user_data(),
    user_updated = generate_user_data();


  describe('POST /users', () => {

    it(`it should insert a new user: ${user_new.Username} auth as admin user`, async () => {
      try {
        response = await mendix.forUser(admin_user, admin_pass).post('/users', user_new),
        resPostUser = response.data;
        expect (response).to.have.property('status',200);
        expect (resPostUser).to.be.an('object')
          .and
          .to.have.keys(Object.keys(mockUser));
        describe(`GET /users/${resPostUser.IdUser }`, () => {
          it(`Should get userInfo and check if equal to the create user response`, async () => {
            try {
              const response = await mendix.get('/users/'+resPostUser.IdUser),
                resGetUser = response.data;
              expect (response).to.have.property('status',200);
              expect (resGetUser).to.be.an('object')
                .and
                .to.have.keys(Object.keys(mockUser))
                .and
                .to.deep.equal(resPostUser);
            } catch(response) {
              assert(response !== 200, `GET /users/${resPostUser.IdUser} failed Status: ${response }`);
            }
          })
        });
        describe(`PUT /users/${resPostUser.IdUser }`, () => {
          it(`Should update userInfo`, async () => {
            try {
              const response = await mendix.put('/users/'+resPostUser.IdUser, user_updated);
              resPutUser = response.data;
              expect (response).to.have.property('status',200);
              expect (resPutUser).to.be.an('object')
                .and
                .to.have.keys(Object.keys(mockUser));
            } catch(response) {
              assert(response !== 200, `PUT /users/${resPostUser.IdUser} failed Status: ${response }`);
            }
          })
        });
        describe(`GET /users/${resPostUser.IdUser }`, () => {
          it(`Should get userInfo UPDATED and check if equal to the create user response`, async () => {
            try {
              const response = await mendix.get('/users/'+resPostUser.IdUser),
                resGetUser = response.data;
              expect (response).to.have.property('status',200);
              expect (resGetUser).to.be.an('object')
                .and
                .to.have.keys(Object.keys(mockUser))
                .and
                .to.deep.equal(resPutUser);
            } catch(response) {
              assert(response !== 200, `GET /users/${resPostUser.IdUser} failed Status: ${response }`);
            }
          })
        });
      } catch(response) {
        assert(response   === 400, `/POST /users failed Status: ${response}`);
      }
    });

  });
});
