import Root from './root';
import Contact from './contact';

export default (express) => {
  const router = express.Router();
  router.use('/contact', Contact(express));
  router.get('/', Root);
  return router;
};
