export const contactDetails = {
  msg: 'This is the contact API route for v1. The details of this route is described below.',
  routes: {
    '\\': {
      desc: 'Send a contact message to a host site contact.',
      method: 'POST',
      data: {
        name: {
          firstName: 'A string of the first name. Required.',
          lastName: 'A string of the last name.',
        },
        senderEmail: 'A string of the sender email. Must be a valid email. Required.',
        receiverEmail: 'A string of the receiver email. Must be a valid email. Required.',
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
  return res.status(200).json(req.body);
}

function Contact(express) {
  const router = express.Router();
  router.get('/', get);
  router.post('/', post);

  return router;
}

export default Contact;
