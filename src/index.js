import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import https from 'https';
import fs from 'fs';

import Routes from './routes';

dotenv.config();
const app = express();

const {
  PORT = 7777, DEV, HOST = '0.0.0.0', PRIVATE_KEY_FILE, CERTIFICATE_FILE,
} = dotenv.config().parsed;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(compression());
if (DEV) app.use(morgan('dev'));

const whitelist = [
  'https://ssmith-wombatweb.github.io',
  'https://www.simeonsmith.me',
  'https://www.designbright.org',
  'https://designbright.org',
  'https://165.227.7.212',
  'http://192.168.86.200',
];

if (process.env.DEV) whitelist.push(undefined);

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use('/api/v1', Routes(express));

app.get('/', (req, res) => {
  res.status(307).redirect('/api/v1');
});

export default https.createServer({
  key: fs.readFileSync(PRIVATE_KEY_FILE),
  cert: fs.readFileSync(CERTIFICATE_FILE),
}, app).listen(PORT, HOST, () => {
  if (process.env.DEV) console.log(`UTIL API running on ${HOST}:${PORT}.`);
});
