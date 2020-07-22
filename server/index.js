const OpenTok = require('opentok');
const express = require('express');
const app = express();
const port = 3001;
const config = require('./const/config');
const cors = require('cors');
const bodyParser = require("body-parser");

const opentok = new OpenTok(config.openTok.apiKey, config.openTok.secret);

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/create-session', (req, res) => {
  opentok.createSession(function(err, session) {
    if (err) {
      res.send({});
      return
    }
    res.send({
      apiKey: config.openTok.apiKey,
      sessionId: session.sessionId,
      token: opentok.generateToken(session.sessionId),
    })
  });
});

app.listen(port, () => console.log('server created on port - ' + port))
