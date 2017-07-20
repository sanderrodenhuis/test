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

let jobcategories_res=[
  "IdJobCategory",
  "Jobs",
  "Name"]
//Our parent block
describe('Job Categories', () => {
  beforeEach((done) => {
    done();
  });

  /*
  * Test the /GET route
  */


  let jobcategories = [];
  describe('GET /jobcategories/?data=true', () => {
    it('Should GET all the jobcategories', async () => {
      const response = await mendix.get('/jobcategories/?data=true'),
        jobcategories = response.data;
      expect (response).to.have.property('status',200);
      expect (jobcategories).to.be.an('array');
      jobcategories.map((jobcategory) => {
        expect (jobcategory).to.have.keys(jobcategories_res)
        describe('GET /jobcategories/{id}', () => {
          it(`Should get jobcategory`, async () => {
            return Promise.all(jobcategories.map(async (jobcategory) => {
              try {
                let response = await mendix.get('/jobcategories/'+jobcategory.IdJobCategory),
                  resJob = response.data;
                expect (response).to.have.property('status',200);
                expect (resJob).to.be.an('object');
                expect (resJob).to.have.keys(jobcategories_res)
                expect(resJob).to.deep.equal(jobcategory);
              } catch(response) {
                assert(response.status !== 200, 'JobID ' + jobcategory.IdJobCategory + ' failed');
              }
            }));
          })
        })
      })
      return Promise.resolve(jobcategories);
    })
  });
});

