import mockRequest from '../../lib/mock-request';

//import nock from 'nock'; // Needs to be imported first before papi because it overrides http and so does node-fetch

import Papi from '../../src';
import * as mock from './mocks';
import should from 'should';
import * as models from '../../src/models';
import _ from 'lodash';

const api = new Papi();

api.auth.set({jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTRmMGRiNzMwOGFmYTEyYjUzNjIwNTg4In0.CvXGDKAJYZkoH3nnEirtlGlwRzErv1ANOJ-dVkUAnjo#_login_post'});

//var mockRequest = nock(api.options.host).matchHeader('authorization', function() { return `Bearer ${api.auth.session.jwt}`; });
mockRequest.config({host: api.options.host});

describe('Accounts Resource', function() {
  it('find should return one item', function(done) {
    mockRequest.get(`/accounts/pressly`).reply(200, mock.organizations[0]);

    api.$resource('accounts').$find('pressly').then((res) => {
      res.username.should.equal('pressly');
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
