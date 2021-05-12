"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
var http = require('http').createServer(server_1.app);
var io = require('socket.io')(http);
/*

socket.on('unsubscribe',function(room){
  try{
    console.log('[socket]','leave room :', room);
    socket.leave(room);
    socket.to(room).emit('user left', socket.id);
  }catch(e){
    console.log('[error]','leave room :', e);
    socket.emit('error','couldnt perform requested action');
  }
})
*/
io.on('connection', function (socket) {
    console.log('connection!', socket.handshake.query.uuid, socket.id);
    // socket.emit('connection', 'can you hear me?', 1, 2, 'abc');
    socket.on('disconnect', function () { return console.log('disconnection'); });
    // io.emit("connection", "hi!")
    socket.on('message', function (_a) {
        var name = _a.name, message = _a.message;
        io.emit('message', { name: name, message: message });
    });
});
//I know exactly when to subscribe to rooms! on friend socket
http.listen(4000, function () {
    console.log('listening on port 4000');
});
