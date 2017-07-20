//During the test the env variable is set to test
require('dotenv').config();
let mendix = require('../server/utils/mendix');

//Require the dev-dependencies

let chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

// Then either:
let {expect, assert} = chai;


chai.use(chaiAsPromised);
//Our parent block
describe('Job Categories', () => {
  beforeEach((done) => {
    done();
  });

  /*
  * Test the /GET route
  */


  describe('/GET jobcategories', () => {
    it('it should GET all the jobcategories', () => {
      return Promise.all([
        expect(mendix.get('/jobcategories')).to.eventually.have.property('status',200),
        expect(mendix.get('/jobcategories').then((response)=>{return response.data})).to.eventually.be.an('array')
      ]);
    });
  });

});
