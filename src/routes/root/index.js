import { contactDetails } from '../contact';

export default (req, res) => res.status(200).json({
  msg: 'This is the root API route for v1. The various routes are described below.',
  routes: {
    '\\contact': contactDetails,
  },
});
