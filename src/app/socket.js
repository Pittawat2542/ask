module.exports = function(io) {
  io.on('connection', function (socket) {
    socket.on('teacher', function(data) {
    });
  });
};
