import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';

import server from '../src';

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('Contacts Route', () => {
  describe('GET /api/v1/contact', () => {
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
  describe('POST /api/v1/contact', () => {
    it('Posting will all properties returns confirmations for sent message and sent confirmation.', (done) => {
      const msgDetails = {
        firstName: 'Simeon',
        lastName: 'Smith',
        senderEmail: 'tofieldya@gmail.com',
        receiverName: 'Wombat Web',
        receiverEmail: 'ssmith@wombatweb.us',
        subject: 'This is a test.',
        greeting: 'Good Morning',
        msg: 'This is a message for the receiver.',
        receptionMsg: 'This message was sent as a test.',
        confirmation: 'The following message was sent.',
        signOff: 'Cheers',
      };

      chai.request(server)
        .post('/api/v1/contact')
        .type('json')
        .send(msgDetails)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.nested.property('msg');
          expect(res.body).to.have.nested.property('code');
          expect(res.body.code).to.equal(200);
          expect(res.body).to.have.nested.property('info');

          expect(res.body.info).to.have.nested.property('newConfirmInfo');
          expect(Object.keys(res.body.info.newConfirmInfo)).to.have.lengthOf(9);
          expect(Object.keys(res.body.info.newConfirmInfo)).to.be.eql([
            'accepted',
            'rejected',
            'envelopeTime',
            'messageTime',
            'messageSize',
            'response',
            'envelope',
            'messageId',
            'msg',
          ]);
          expect(res.body.info.newConfirmInfo.accepted).to.be.eql([
            msgDetails.senderEmail,
          ]);
          expect(Object.keys(res.body.info.newConfirmInfo.envelope)).to.have.lengthOf(2);
          expect(Object.keys(res.body.info.newConfirmInfo.envelope)).to.be.eql([
            'from',
            'to',
          ]);
          expect(res.body.info.newConfirmInfo.envelope.from).to.be.equal(msgDetails.receiverEmail);
          expect(res.body.info.newConfirmInfo.envelope.to).to.be.eql([
            msgDetails.senderEmail,
          ]);
          expect(Object.keys(res.body.info.newConfirmInfo.msg)).to.have.lengthOf(4);
          expect(Object.keys(res.body.info.newConfirmInfo.msg)).to.be.eql([
            'from',
            'to',
            'subject',
            'text',
          ]);
          expect(res.body.info.newConfirmInfo.msg.from).to.be.equal(msgDetails.receiverEmail);
          expect(res.body.info.newConfirmInfo.msg.to).to.be.equal(msgDetails.senderEmail);
          expect(res.body.info.newConfirmInfo.msg.subject).to.be.equal(msgDetails.subject);
          expect(res.body.info.newConfirmInfo.msg.text).to.be.equal(`\
${msgDetails.greeting} ${msgDetails.firstName} ${msgDetails.lastName},

${msgDetails.confirmation}
${msgDetails.msg}

${msgDetails.signOff},
${msgDetails.receiverName}
`);

          expect(res.body.info).to.have.nested.property('newReceiverInfo');
          expect(Object.keys(res.body.info.newReceiverInfo)).to.have.lengthOf(9);
          expect(Object.keys(res.body.info.newReceiverInfo)).to.be.eql([
            'accepted',
            'rejected',
            'envelopeTime',
            'messageTime',
            'messageSize',
            'response',
            'envelope',
            'messageId',
            'msg',
          ]);
          expect(res.body.info.newReceiverInfo.accepted).to.be.eql([
            msgDetails.receiverEmail,
          ]);
          expect(Object.keys(res.body.info.newReceiverInfo.envelope)).to.have.lengthOf(2);
          expect(Object.keys(res.body.info.newReceiverInfo.envelope)).to.be.eql([
            'from',
            'to',
          ]);
          expect(res.body.info.newReceiverInfo.envelope.from).to.be.equal(msgDetails.senderEmail);
          expect(res.body.info.newReceiverInfo.envelope.to).to.be.eql([
            msgDetails.receiverEmail,
          ]);
          expect(Object.keys(res.body.info.newReceiverInfo.msg)).to.have.lengthOf(4);
          expect(Object.keys(res.body.info.newReceiverInfo.msg)).to.be.eql([
            'from',
            'to',
            'subject',
            'text',
          ]);
          expect(res.body.info.newReceiverInfo.msg.from).to.be.equal(msgDetails.senderEmail);
          expect(res.body.info.newReceiverInfo.msg.to).to.be.equal(msgDetails.receiverEmail);
          expect(res.body.info.newReceiverInfo.msg.subject).to.be.equal(msgDetails.subject);
          expect(res.body.info.newReceiverInfo.msg.text).to.be.equal(`\
${msgDetails.greeting} ${msgDetails.receiverName},

${msgDetails.receptionMsg}
${msgDetails.msg}

${msgDetails.signOff},
${msgDetails.firstName} ${msgDetails.lastName}
`);

          done();
        });
    });
  });
});
