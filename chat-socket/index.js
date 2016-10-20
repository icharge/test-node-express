var ChatWrapper = function (http) {


  var io = require('socket.io')(http);
  io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
      console.log('Message :', msg);
      io.emit('chat message', msg);
    });
  });
  
  
  
};
module.exports = ChatWrapper;