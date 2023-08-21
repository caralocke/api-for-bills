const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const jsonErrorHandler = (err, req, res, next) => {
  res.status(500).send({ error: err });
};



app.use(cors({
  origin: "*"
}))

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(jsonErrorHandler);

app.get('/', (req, res) => {
  res.status(200);
  res.send("Welcome to the root of URL of Server");
});

app.use('/', require(path.join(__dirname, 'routes/bills')));

app.use((req, res, next) => {
  const err = new Error(`${req.method} ${req.url} Not Found`);
  err.status = 404;
  next(err);
});



app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(
    `Express Server started on Port ${app.get(
      'port'
    )} | Environment : ${app.get('env')}`
  );
});

module.exports = app;