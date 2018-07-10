import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';

import Routes from './routes';

dotenv.config();
const app = express();

const { PORT } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
if (process.env.DEV) app.use(morgan('dev'));

app.use('/api/v1', Routes(express));

app.get('/', (req, res) => {
  res.status(307).redirect('/api/v1');
});

export default app.listen(PORT, () => {

});
