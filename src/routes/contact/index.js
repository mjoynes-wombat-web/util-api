import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const contactDetails = {
  msg: 'This is the contact API route for v1. The details of this route is described below.',
  routes: {
    '\\': {
      desc: 'Send a contact message to a host site contact.',
      method: 'POST',
      data: {
        name: {
          first: 'A string of the first name. Required.',
          last: 'A string of the last name.',
        },
        senderEmail: 'A string of the sender email. Must be a valid email. Required.',
        receiverEmail: 'A string of the receiver email. Must be a valid email. Required.',
        subject: 'A string of the message from the sender. Required.',
        msg: 'A string of the message from the sender. Required.',
        confirmation: 'A string of a confirmation message to be sent back to the sender. Will not send confirmation message if missing.',
        greeting: 'A string with the greeting to the sender. Will be formatted like so "$greeting $firstName $lastName,"',
        receptionMsg: 'A string of a reception message to be sent to the receiver. If missing only the msg will be sent with the contact info.',
        receiverName: 'A string of the receivers name. Required',
        signOff: 'A string with the sign off response to the sender and receiver. Will be formatted like so "$signOff, $receiverName"',
      },
    },
  },
};

function get(req, res) {
  contactDetails.error = 'There is no data to GET from this route. Details of this route have been included.';
  return res.status(404).json(contactDetails);
}

function post(req, res) {
  const { EMAIL_PASS } = process.env;
  console.log(req.body);

  const {
    name,
    senderEmail,
    receiverEmail,
    subject,
    msg,
    confirmation,
    greeting,
    receptionMsg,
    receiverName,
    signOff,
  } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
    secure: true,
    auth: {
      user: receiverEmail,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const receiverMessage = {
    from: senderEmail,
    to: receiverEmail,
    subject,
    text: `\
${greeting} ${receiverName},

${receptionMsg}
${msg}

${signOff},
${name.first} ${name.last}
`,
  };

  const confirmationMsg = {
    from: receiverEmail,
    to: senderEmail,
    subject,
    text: `\
${greeting} ${name.first} ${name.last},

${confirmation}
${msg}

${signOff},
${receiverName}
`,
  };

  return res.status(200).send(receiverMessage);
}

function Contact(express) {
  const router = express.Router();
  router.get('/', get);
  router.post('/', post);

  return router;
}

export default Contact;
