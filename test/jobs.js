//During the test the env variable is set to test
require('dotenv').config();
const mendix = require('../server/utils/mendix/request'),
  mockJob = require('./data/job');

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
describe('Jobs', async () => {
  let params = '?data=true',
    jobs_res,
    jobs_data;

  before(async () => {
    jobs_res = await mendix.get(`/jobs/${params}`);
    jobs_data = jobs_res.data;
  })

  // beforeEach(async () => {
  //   await sync();

  // })

  // afterEach(async () => {
  //   await drop();
  // })

  describe(`GET /jobs/${params}`,  () => {
    it('Should GET all the jobs', async () => {
      try {
        expect (jobs_res).to.have.property('status',200);
        expect (jobs_data).to.be.an('array');
        jobs_data.map((job) => {
          expect (job).to.have.keys(Object.keys(mockJob))
        })
        describe(`GET /jobs/IdJob`, () => {
          jobs_data.map((job) => {
            it(`Should get job ID: ${job.IdJob}`, async() => {
              try {
                let response = await mendix.get('/jobs/'+job.IdJob),
                  resJob = response.data;
                expect (response).to.have.property('status',200);
                expect (resJob).to.be.an('object')
                  .and
                  .to.have.keys(Object.keys(mockJob))
                  .and
                  .to.deep.equal(job);
              } catch(response) {
                assert(response === 200, 'JobID ' + job.IdJob + ' failed');
              }
            })
          })
        })
      } catch(response) {
        assert(response === 200, `GET /jobs/${params} failed Status: ${response}`);
        // message,showDiff,actual,expected
      }

    })
  });
});

