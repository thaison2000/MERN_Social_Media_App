import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

const addNewUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};


const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId._id === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addNewUser(userId, socket.id);
    console.log(onlineUsers)
  });

  socket.on("sendNotification", ({ senderId, receiverId }) => {
   if(getUser(receiverId)){
        const receiver = getUser(receiverId);
        console.log(receiverId)
        io.to(receiver.socketId).emit("getNotification", {
        senderId,
        timestamp: Date.now()
    });
   }
  });


  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(5000);