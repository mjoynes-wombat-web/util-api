# Wombat Web Utility API

[![Code Coverage](https://codecov.io/gh/ssmith-wombatweb/util-api/branch/develop/graph/badge.svg)](https://codecov.io/gh/ssmith-wombatweb/util-api/branch/develop)
[![Dependencies](https://david-dm.org/ssmith-wombatweb/util-api.svg)](https://david-dm.org/ssmith-wombatweb/util-api.svg)

A utility api for Wombat Web sites.

### Author 
Written by Simeon Smith.

[Portfolio](https://www.simeonsmith.me) | [Resume](https://resume.simeonsmith.me) | [Github](https://github.com/ssmith-wombatweb)

## Setup

### Installation

Run the following commands.

```
npm i
npm run build
```

### Environment Variables

Set the following environment variables.

```
PORT=####
DEV=true // Only set in development.
EMAIL_PASS=YOUR_PASS
```

### Dependencies

These are the dependencies for this project.

```
"dependencies": {
  "body-parser": "^1.18.3",
  "dotenv": "^6.0.0",
  "express": "^4.16.3",
  "morgan": "^1.9.0",
  "nodemailer": "^4.6.7",
  "ssmith-is-valid-email": "^1.0.3"
},
```

## Usage

### Starting Application

Run `npm start` to run the application.

## Testing

[![Code Coverage](https://codecov.io/gh/ssmith-wombatweb/util-api/branch/develop/graph/badge.svg)](https://codecov.io/gh/ssmith-wombatweb/util-api/branch/develop)

Run `npm run test` to test the application.

# API Access

## Get the API Instructions

### `[GET /api/v1/]`

Getting this route will return JSON data describing the functionality of the API.

### Sample Response

```
{
    "msg": "This is the root API route for v1. The various routes are described below.",
    "routes": {
        "\contact": {
            "msg": "This is the contact API route for v1. The details of this route is described below.",
            "routes": {
                "\": {
                    "desc": "Send a contact message to a host site contact.",
                    "method": "POST",
                    "data": {
                        "firstName": "A string of the first name. Required.",
                        "lastName": "A string of the last name.",
                        "senderEmail": "A string of the sender email. Must be a valid email. Required.",
                        "receiverName": "A string of the receivers name. Required.",
                        "receiverEmail": "A string of the receiver email. Must be a valid email. Required.",
                        "subject": "A string of the message from the sender. Required.",
                        "greeting": "A string with the greeting to the sender. Will be formatted like so "$greeting $firstName $lastName,". If missing will use "Hello".",
                        "msg": "A string of the message from the sender. Required.",
                        "receptionMsg": "A string of a intro reception message to be sent to the receiver. If missing only the msg will be sent with the contact info.",
                        "confirmation": "A string of a confirmation message to be sent back to the sender. Will not send confirmation message if missing.",
                        "signOff": "A string with the sign off response to the sender and receiver. Will be formatted like so "$signOff, $receiverName". If missing will use "Thank you,""
                    }
                }
            }
        }
    }
}
```

## Get the Contact Route Instructions

### `[GET \api\v1\contact]`

Getting this route will return JSON data describing the functionality of the contact route.

### Sample Response

```
{
    "msg": "This is the contact API route for v1. The details of this route is described below.",
    "routes": {
        "\": {
            "desc": "Send a contact message to a host site contact.",
            "method": "POST",
            "data": {
                "firstName": "A string of the first name. Required.",
                "lastName": "A string of the last name.",
                "senderEmail": "A string of the sender email. Must be a valid email. Required.",
                "receiverName": "A string of the receivers name. Required.",
                "receiverEmail": "A string of the receiver email. Must be a valid email. Required.",
                "subject": "A string of the message from the sender. Required.",
                "greeting": "A string with the greeting to the sender. Will be formatted like so "$greeting $firstName $lastName,". If missing will use "Hello".",
                "msg": "A string of the message from the sender. Required.",
                "receptionMsg": "A string of a intro reception message to be sent to the receiver. If missing only the msg will be sent with the contact info.",
                "confirmation": "A string of a confirmation message to be sent back to the sender. Will not send confirmation message if missing.",
                "signOff": "A string with the sign off response to the sender and receiver. Will be formatted like so "$signOff, $receiverName". If missing will use "Thank you,""
            }
        }
    }
}
```

## Send a Message

### `[POST \api\v1\contact]`

Positing to this route with the information below will send a message.

### Required Input

The following must be sent as raw JSON data.

```
{
  "firstName":"Senders First Name",  // Required
  "lastName":"Senders Last Name",
  "senderEmail":"Email of person sending the message.", // Required
  "receiverEmail":"Email of person receiving the message.", // Required
  "subject":"Subject for email.", // Required
  "msg":"This is a message for the receiver.", // Required
  "confirmation":"This is a confirmation message for the sender.", // Optional, will not send confirmation message if missing.
  "greeting":"Good Morning", // Optional. Will default to 'Hello'.
  "receptionMsg":"A intro message for the receivers email.",
  "receiverName":"Receivers name.", // Required
  "signOff":"Sincerely" // Option. Will default to 'Thank you'.
}
```

### Sample Response

```
{
    "msg": "Your message was successfully sent.",
    "code": 200,
    "info": {
        "newConfirmInfo": {
            "accepted": [
                "tofieldya@gmail.com"
            ],
            "rejected": [],
            "envelopeTime": 198,
            "messageTime": 840,
            "messageSize": 409,
            "response": "250 2.0.0 OK 1531519660 s12-v6sm38800057pfm.41 - gsmtp",
            "envelope": {
                "from": "ssmith@wombatweb.us",
                "to": [
                    "tofieldya@gmail.com"
                ]
            },
            "messageId": "<8992d6be-7c4a-1a3a-6a2c-ab663296de35@wombatweb.us>",
            "msg": {
                "from": "ssmith@wombatweb.us",
                "to": "tofieldya@gmail.com",
                "subject": "Subject for email.",
                "text": "Good Morning Simeon Smith,\n\nThis is a confirmation message for the sender.\nThis is a message for the receiver.\n\nSincerely,\nWombat Web\n"
            }
        },
        "newReceiverInfo": {
            "accepted": [
                "ssmith@wombatweb.us"
            ],
            "rejected": [],
            "envelopeTime": 336,
            "messageTime": 886,
            "messageSize": 400,
            "response": "250 2.0.0 OK 1531519659 a11-v6sm47591247pfl.66 - gsmtp",
            "envelope": {
                "from": "tofieldya@gmail.com",
                "to": [
                    "ssmith@wombatweb.us"
                ]
            },
            "messageId": "<1d80a76e-a04b-92bd-fcf2-912f2753a156@gmail.com>",
            "msg": {
                "from": "tofieldya@gmail.com",
                "to": "ssmith@wombatweb.us",
                "subject": "Subject for email.",
                "text": "Good Morning Wombat Web,\n\nA intro message for the receivers email.\nThis is a message for the receiver.\n\nSincerely,\nSimeon Smith\n"
            }
        }
    }
}
```

### Sample Email

Good Morning Wombat Web,

A intro message for the receivers email.
This is a message for the receiver.

Sincerely,
Simeon Smith

### Sample Confirmation

Good Morning Simeon Smith,

This is a confirmation message for the sender.
This is a message for the receiver.

Sincerely,
Wombat Web