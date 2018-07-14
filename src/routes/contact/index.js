import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import isValidEmail from 'ssmith-is-valid-email';

dotenv.config();

function validatePost(req, res, {
  firstName,
  senderEmail,
  receiverName,
  receiverEmail,
  subject,
  msg,
}) {
  if (!firstName) {
    return {
      msg: 'The first name is missing.',
      reqBody: req.body,
    };
  }
  if (!senderEmail) {
    return {
      msg: 'The sender email is missing.',
      reqBody: req.body,
    };
  }
  if (!isValidEmail(senderEmail)) {
    return {
      msg: 'The sender email is invalid.',
      reqBody: req.body,
    };
  }
  if (!receiverName) {
    return {
      msg: 'The receiver name is missing.',
      reqBody: req.body,
    };
  }
  if (!receiverEmail) {
    return {
      msg: 'The receiver email is missing.',
      reqBody: req.body,
    };
  }
  if (!isValidEmail(receiverEmail)) {
    return {
      msg: 'The receiver email is invalid.',
      reqBody: req.body,
    };
  }
  if (!subject) {
    return {
      msg: 'The subject is missing.',
      reqBody: req.body,
    };
  }
  if (!msg) {
    return {
      msg: 'The message is missing.',
      reqBody: req.body,
    };
  }

  return null;
}

function receiverMsg({
  greeting = 'Hello',
  firstName,
  lastName,
  confirmation,
  msg,
  signOff = 'Thank you',
  receiverName,
}) {
  return `\
${greeting} ${firstName}${lastName ? ` ${lastName}` : ''},

${confirmation
    ? `${confirmation}
${msg}`
    : msg}

${signOff},
${receiverName}
`;
}

function confirmMsg({
  firstName,
  lastName,
  msg,
  greeting = 'Hello',
  receptionMsg,
  receiverName,
  signOff = 'Thank you',
}) {
  return `\
${greeting} ${receiverName},

${receptionMsg
    ? `${receptionMsg}
${msg}`
    : msg}

${signOff},
${firstName}${lastName ? ` ${lastName}` : ''}
`;
}

export const contactDetails = {
  msg: 'This is the contact API route for v1. The details of this route is described below.',
  routes: {
    '\\': {
      desc: 'Send a contact message to a host site contact.',
      method: 'POST',
      data: {
        firstName: 'A string of the first name. Required.',
        lastName: 'A string of the last name.',
        senderEmail: 'A string of the sender email. Must be a valid email. Required.',
        receiverName: 'A string of the receivers name. Required.',
        receiverEmail: 'A string of the receiver email. Must be a valid email. Required.',
        subject: 'A string of the message from the sender. Required.',
        greeting: 'A string with the greeting to the sender. Will be formatted like so "$greeting $firstName $lastName,". If missing will use "Hello".',
        msg: 'A string of the message from the sender. Required.',
        receptionMsg: 'A string of a intro reception message to be sent to the receiver. If missing only the msg will be sent with the contact info.',
        confirmation: 'A string of a confirmation message to be sent back to the sender. Will not send confirmation message if missing.',
        signOff: 'A string with the sign off response to the sender and receiver. Will be formatted like so "$signOff, $receiverName". If missing will use "Thank you,"',
      },
    },
  },
};

function get(req, res) {
  return res.status(200).json(contactDetails);
}

function post(req, res) {
  const { EMAIL_LOGIN, EMAIL_PASS } = process.env;

  const {
    senderEmail,
    receiverEmail,
    subject,
    confirmation,
  } = req.body;

  const invalidPostJSON = validatePost(req, res, req.body);

  if (invalidPostJSON) return res.status(400).json(invalidPostJSON);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_LOGIN,
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
    text: confirmMsg(req.body),
  };

  const confirmationMsg = {
    from: receiverEmail,
    to: senderEmail,
    subject,
    text: receiverMsg(req.body),
  };

  return transporter.sendMail(
    receiverMessage,
    (receiverError, receiverInfo) => {
      let receiverMsgResponse;
      if (receiverError) {
        receiverMsgResponse = {
          msg: `Your contact request failed. Please email ${receiverEmail} directly.`,
          code: receiverError.responseCode,
          error: receiverError,
        };
        return res.status(receiverMsgResponse.code).json(receiverMsgResponse);
      }

      const newReceiverInfo = receiverInfo;
      newReceiverInfo.msg = receiverMessage;

      if (confirmation) {
        return transporter.sendMail(
          confirmationMsg,
          (confirmError, confirmInfo) => {
            let confirmMsgResponse;
            if (confirmError) {
              confirmMsgResponse = {
                msg: 'You message was sent but the confirmation message failed.',
                code: confirmError.responseCode,
                error: confirmError,
                receiverInfo: newReceiverInfo,
              };
              return res.status(confirmMsgResponse.code).json(confirmMsgResponse);
            }

            const newConfirmInfo = confirmInfo;
            newConfirmInfo.msg = confirmationMsg;

            confirmMsgResponse = {
              msg: 'Your message was successfully sent.',
              code: 200,
              info: {
                newConfirmInfo,
                newReceiverInfo,
              },
            };

            return res.status(confirmMsgResponse.code).json(confirmMsgResponse);
          },
        );
      }

      return res.status(200).json({
        msg: 'Your message was successfully sent.',
        code: 200,
        info: {
          newReceiverInfo,
        },
      });
    },
  );
}

function Contact(express) {
  const router = express.Router();
  router.get('/', get);
  router.post('/', post);

  return router;
}

export default Contact;
