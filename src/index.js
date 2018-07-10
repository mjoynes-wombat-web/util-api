import express from 'express';
import bodyParser from 'body-parser';
import env from 'dotenv';
import morgan from 'morgan';

import Routes from './routes';

env.config();
const app = express();

const { PORT } = process.env;

app.use(bodyParser.json());
if (process.env.DEV) app.use(morgan('dev'));

app.use('/', Routes(express));

app.get('/', (req, res) => {
  res.status(307).redirect('/api/v1');
});

app.get('/api/v1', (req, res) => res.status(200).json({
  msg: 'This is the root API route for v1. The various routes are described below.',
  routes: {
  },
}));

export default app.listen(PORT, () => {

});
