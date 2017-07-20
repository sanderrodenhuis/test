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

let jobs_res=[
  "IdJob",
  "Description",
  "Warranty",
  "JobCategories",
  "NormalPrice",
  "DiscountPrice",
  "MakeSureYouHaveOrPrepare",
  "WhatWeDo",
  "WhatWeDontDo",
  "Name",
  "ShowToCustomer"]
//Our parent block
describe('Jobs', () => {
  beforeEach((done) => {
    done();
  });

  /*
  * Test the /GET route
  */


  let jobs = [];
  describe('GET /jobs/?data=true', () => {
    it('Should GET all the jobs', async () => {
      const response = await mendix.get('/jobs/?data=true'),
        jobs = response.data;
      expect (response).to.have.property('status',200);
      expect (jobs).to.be.an('array');
      jobs.map((job) => {
        expect (job).to.have.keys(jobs_res)
        describe('GET /jobs/{id}', () => {
          it(`Should get job`, async () => {
            return Promise.all(jobs.map(async (job) => {
              try {
                let response = await mendix.get('/jobs/'+job.IdJob),
                  resJob = response.data;
                expect (response).to.have.property('status',200);
                expect (resJob).to.be.an('object');
                expect (resJob).to.have.keys(jobs_res)
                expect(resJob).to.deep.equal(job);
              } catch(response) {
                assert(response.status !== 200, 'JobID ' + job.IdJob + ' failed');
              }
            }));
          })
        })
      })
      return Promise.resolve(jobs);
    })
  });



});

