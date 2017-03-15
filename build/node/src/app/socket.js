module.exports = function(io) {
  io.on('connection', function (socket) {
    socket.on('attendee', function(data) {
      console.log("[-- LOGIN! --] NAME:" + data.name + ", POSITION:" + data.position);
    });
  });
};
