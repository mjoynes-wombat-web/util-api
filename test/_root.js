import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';

import server from '../src';

process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

chai.use(chaiHttp);

describe('Root Route', () => {
  describe('GET Root', () => {
    it('Get should return api instructions', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          // Tests for main instructions.
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.nested.property('msg');
          expect(res.body).to.have.nested.property('routes');

          // Tests for Contact route instructions.
          expect(res.body.routes).to.have.nested.property('\\contact');
          expect(res.body.routes['\\contact']).to.have.nested.property('msg');

          // Test for \contact\ route instructions.
          expect(res.body.routes['\\contact'].routes).to.have.nested.property('\\');
          expect(res.body.routes['\\contact'].routes['\\']).to.have.nested.property('desc');
          expect(res.body.routes['\\contact'].routes['\\']).to.have.nested.property('method');
          expect(res.body.routes['\\contact'].routes['\\']).to.have.nested.property('data');
          expect(Object.keys(res.body.routes['\\contact'].routes['\\'].data)).to.have.lengthOf(11);
          expect(Object.keys(res.body.routes['\\contact'].routes['\\'].data)).to.be.eql([
            'firstName',
            'lastName',
            'senderEmail',
            'receiverName',
            'receiverEmail',
            'subject',
            'greeting',
            'msg',
            'receptionMsg',
            'confirmation',
            'signOff',
          ]);

          done();
        });
    });
  });
});
