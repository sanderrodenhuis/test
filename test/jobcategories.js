//During the test the env variable is set to test
require('dotenv').config();
const mendix = require('../server/utils/mendix/request'),
  mockJobcategory = require('./data/jobcategory');

//Require the dev-dependencies

const chai = require('chai'),
  chaiAsPromised = require("chai-as-promised");

// Then either:
const {expect, assert} = chai;


chai.use(chaiAsPromised);

// const test_user = process.env.TEST_USER,
//   test_pass = process.env.TEST_PASS,
//   admin_user = process.env.MENDIX_USER,
//   admin_pass = process.env.MENDIX_PASS;

//Our parent block
describe('Job Categories', () => {
  let params = '?data=true',
    jobcategories_res,
    jobcategories_data;

  before(async () => {
    jobcategories_res = await mendix.get(`/jobcategories/${params}`);
    jobcategories_data = jobcategories_res.data;
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

  describe(`GET /jobcategories/${params}`, () => {
    it('Should GET all the jobcategories', async () => {
      try {
        expect (jobcategories_res).to.have.property('status',200);
        expect (jobcategories_data).to.be.an('array');
        jobcategories_data.map((jobcategory) => {
          expect (jobcategory).to.have.keys(Object.keys(mockJobcategory))
        })
        describe(`GET /jobcategories/IdJobCategory`, () => {
          jobcategories_data.map((jobcategory) => {
            it(`Should get jobcategory ID: ${jobcategory.IdJobCategory}`, async () => {
              try {

                let response = await mendix.get('/jobcategories/' + jobcategory.IdJobCategory),
                  resJob = response.data;
                expect (response).to.have.property('status',200);
                expect (resJob).to.be.an('object');
                expect (resJob).to.have.keys(Object.keys(mockJobcategory))
                expect(resJob).to.deep.equal(jobcategory);

              } catch(response) {
                assert(response === 200, 'IdJobCategory ' + jobcategory.IdJobCategory + ' failed');
              }
            })
          })
        })
      } catch(response) {
        assert(response === 200, `GET /jobcategories/${params} failed Status: ${response}`);
        // message,showDiff,actual,expected
      }

    })
  });
});

