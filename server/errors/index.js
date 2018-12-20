/* eslint-disable quote-props */
/* eslint-disable no-unused-expressions */
exports.handle404 = (err, req, res, next) => {
  err.status === 404
    ? res.status(404).send({ msg: err.msg })
    : next(err);
};

exports.handle400 = (err, req, res, next) => {
  const codes = {
    '22P02': 'invalid input syntax for integer',
    '42703': 'column does not exist in table',
    '23502': `${err.column} is required`,
    '23503': 'invalid input syntax',
  };

  codes[err.code]
    ? res.status(400).send({ msg: codes[err.code] })
    : next(err);
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ msg: 'method not allowed' });
};
