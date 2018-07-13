import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';

import server from '../src';

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('Contacts Route', () => {
  describe('GET \\Contact', () => {
    it('Get should return \\contact route instructions.', (done) => {
      chai.request(server)
        .get('/api/v1/contact')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.nested.property('msg');
          expect(res.body).to.have.nested.property('routes');


          expect(res.body.routes).to.have.nested.property('\\');
          expect(res.body.routes['\\']).to.have.nested.property('desc');
          expect(res.body.routes['\\']).to.have.nested.property('method');
          expect(res.body.routes['\\']).to.have.nested.property('data');
          expect(Object.keys(res.body.routes['\\'].data)).to.have.lengthOf(11);
          expect(Object.keys(res.body.routes['\\'].data)).to.be.eql([
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
