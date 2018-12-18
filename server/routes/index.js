const api = require('express').Router();
const topics = require('./topics');
const articles = require('./articles');

api.use('/topics', topics);
api.use('/articles', articles);

// /* eslint-disable global-require */
// const router = require('express').Router();
// const CustomError = require('../CustomError');

// // eslint-disable-next-line consistent-return
// router.use(async (req, res) => {
//   try {
//     // eslint-disable-next-line import/no-dynamic-require
//     const route = require(`.${req.path}`)[req.method];

//     try {
//       const { result, status } = await route(req);
//       res.status(status).send(result);
//     } catch (err) {
//       if (err instanceof CustomError) {
//         return res.status(err.status).send({
//           error: err.code,
//           description: err.message,
//         });
//       }

//       console.error(err);

//       return res.status(500).send({
//         error: 'GENERIC',
//         description: 'Something went wrong. Please try again or contact support.',
//       });
//     }
//   } catch (err) {
//     res.status(404).send({
//       error: 'NOT_FOUND',
//       description: 'The resource you tried to access does not exist.',
//     });
//   }
// });

module.exports = api;
