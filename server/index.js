const OpenTok = require('opentok');
const express = require('express');
const app = express();
let http = require('http').createServer(app);
const path = require('path');
const {Users} = require('./models/User');
let io = require('socket.io')(http);
const port = 3001;
const config = require('./const/config');
const cors = require('cors');
const bodyParser = require("body-parser");
const _ = require('lodash');

const opentok = new OpenTok(config.openTok.apiKey, config.openTok.secret);
const onlineUsers = [];
let ongoingCalls = [];

// ongoingCalls = new Proxy(ongoingCalls, {
//   set(target, prop, val) {
//     if (_.isArray(val) && val.length === 2) {
//       target.push(val);
//       _.forEach(val, v => io.to(v).emit('clients-connected'));
//       return true;
//     } else {
//       return false;
//     }
//   },
//   deleteProperty(target, prop) {
//     console.log(prop);
//   },
// });

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('*', (req, res, next) => {
  const {name} = req.body;
  const getExistUser = Users.findOne({name});
  if (!getExistUser) {
    res.sendStatus(403);
    return
  }

  req.user = getExistUser;
  next()
});

setInterval(() => {
  // console.log(onlineUsers);
  console.log(ongoingCalls);
}, 2000)

getOnlineUsersNamesById = async (users) => {
  return await Promise.all(
    _.map(onlineUsers, async u => {
      const getUserName = await Users.findOne({where: {id: u.userId}});
      return {
        userId: u.userId,
        userName: getUserName.name,
        socketId: u.socketId
      }
    })
  )
}

const getPairOngoingCallUsers = (socketId) => _.findIndex(ongoingCalls, (c) => c.includes(socketId));

const handlerConnected = (clients, io) => {
  if (!_.isArray(clients) && clients.length !== 2) return;
  ongoingCalls.push(clients);
  _.forEach(clients, cl => io.to(cl).emit('clients-connected'))
};

const handlerDisconnected = (socketId, io) => {
  const foundIndex = getPairOngoingCallUsers(socketId)
  if(!~foundIndex) return;
  _.forEach(ongoingCalls[foundIndex], c => io.to(c).emit('disconnected'));
  ongoingCalls.splice(foundIndex, 1);
};

io.on('connection', function (socket) {
  console.log('user connected') ;
  socket.on('set-online', async (userId) => {
    const foundIndex = _.findIndex(onlineUsers, {userId});
    if (~foundIndex) {
      onlineUsers[foundIndex].socketId = socket.id;
      return;
    }
    onlineUsers.push({userId, socketId: socket.id});
    const transformedUsers = await getOnlineUsersNamesById(onlineUsers);
    io.emit('get-online-users', transformedUsers);
  });

  socket.on('set-offline', async (userId) => {
    const foundIndex = _.findIndex(onlineUsers, {userId});
    if (~foundIndex) onlineUsers.splice(foundIndex, 1);
    const transformedUsers = await getOnlineUsersNamesById(onlineUsers);
    io.emit('get-online-users', transformedUsers);
  });

  socket.on('cancel-call', async () => {
    handlerDisconnected(socket.id, io);
  });

  socket.on('end-call', async () => {
    handlerDisconnected(socket.id, io);
  });

  socket.on('start-call', async (userId) => {
    const foundIndex = _.findIndex(onlineUsers, {userId});
    if(~getPairOngoingCallUsers(onlineUsers[foundIndex].socketId)) {
      //TODO: maybe emit to client that user has call already
      return
    }
    if (~foundIndex) {
      opentok.createSession({mediaMode: "routed"}, async function (err, session) {
        if (err) {
          io.to(socket.id).emit('created-room-error');
          return
        }
        const dataForSession = {
          apiKey: config.openTok.apiKey,
          sessionId: session.sessionId,
          token: session.generateToken()
        }
        io.to(socket.id).emit('created-session', dataForSession);
        const getUserName = await Users.findOne({where: {id: userId}});
        io.to(onlineUsers[foundIndex].socketId).emit('incoming-call',
          {userName: getUserName.name, ...dataForSession});
        handlerConnected([socket.id, onlineUsers[foundIndex].socketId], io);
      });
    }
  });

  socket.on('disconnect', async () => {
    const foundIndex = _.findIndex(onlineUsers, {socketId: socket.id});
    if (~foundIndex) onlineUsers.splice(foundIndex, 1);
    const transformedUsers = await getOnlineUsersNamesById(onlineUsers);
    io.emit('get-online-users', transformedUsers);
    handlerDisconnected(socket.id, this);
    console.log('user disconnected');
  });
});

app.post('/login', async (req, res) => {
  const {name, password} = req.body;
  const getExistUser = await Users.findOne({where: {name, password}});
  if (!getExistUser) {
    res.send({});
    return;
  }
  return res.send(getExistUser);
});

app.get('/create-session', (req, res) => {
  opentok.createSession({mediaMode: "routed"}, function (err, session) {
    if (err) {
      res.send({});
      return
    }
    res.send({
      apiKey: config.openTok.apiKey,
      sessionId: session.sessionId,
      token: session.generateToken()
    })
  });
});

// app.use(express.static(path.join(__dirname, 'build')));
// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

http.listen(port, () => console.log('server created on port - ' + port))
