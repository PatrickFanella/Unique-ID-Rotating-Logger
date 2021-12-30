const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const uuid = require('node-uuid');
const rfs = require('rotating-file-stream'); // version 2.x

//*------------
//* MORGAN LOGGING ERROR TO CONSOLE ELSE TO ACCESS.LOG
//*------------
// create a rotating write stream in the log/ directory
const accessLogStream = rfs.createStream('access.log', {
  interval: '1m', //! rotate time (change me!)
  path: path.join(__dirname, 'log'),
  compress: 'gzip',
  maxFiles: 5,
  maxSize: '1MB',
});
//create and assign token id
morgan.token('id', function getId(req) {
  return req.id;
});
app.use(assignId);

function assignId(req, res, next) {
  req.id = uuid.v4();
  next();
}
// log only 4xx and 5xx responses to console
app.use(morgan('dev', {skip: function (req, res) {
      return res.statusCode < 400;
    },
  }),
);

// log all requests to accessLogStream
app.use(morgan(' :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" _id= :id', { stream: accessLogStream }));

//*REQUESTS

app.get('/', (req, res) => {
  res.send('Home Page!');
});

//*SERVER
PORT = process.env.PORT || 4000;
app
  .listen(PORT, () => {
    console.log('Connected to port ' + PORT);
  })
  .on('error', console.log);
