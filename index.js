const express = require('express');
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const logger = require('morgan');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3020;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(logger('tiny'));
app.use(bodyParser.json());

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