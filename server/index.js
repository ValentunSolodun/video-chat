const OpenTok = require('opentok');
const express = require('express');
const app = express();
const port = 3001;
const config = require('./const/config');

const opentok = new OpenTok(config.openTok.apiKey, config.openTok.secret);

app.get('/create-session', (req, res) => {
  opentok.createSession(function(err, session) {
    if (err) {
      res.send({});
      return
    }
    res.send({
      sessionId: session.sessionId,
      token: opentok.generateToken(session.sessionId),
    })
  });
});

app.listen(port, () => console.log('server created on port - ' + port))
