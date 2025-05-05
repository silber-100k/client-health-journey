const http = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
const db = require("./db");

const dev = process.env.NODE_ENV !== "production";
const hostname = "192.168.142.167";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = http.createServer(handler);

  const io = new Server(httpServer,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
  });

  let onlineUsers = [];
  io.on("connection", (socket) => {
    console.log("connect to socket", socket.id);

    socket.emit('online_users', onlineUsers);

    socket.on('user_login', async (email) => {
      console.log(`User logged in: ${email}`);

    // const notification = await db.Notification.findOne({ email });
    // socket.emit("unread_count", notification?.unreadCount || 0);

    const exists = onlineUsers.find(user => user.email === email);
    if (!exists) {
      onlineUsers.push({ email, socketId: socket.id });
    } else {
      // Update socketId if user reconnects
      exists.socketId = socket.id;
    }

    socket.broadcast.emit('online_users', onlineUsers);

    socket.on("get_user_list",() => {
      socket.emit("online_users", onlineUsers);
    });
  });

  socket.on('send-message', (data) => {
    const receiver = onlineUsers.find(user => user.email === data.to)
   if (receiver) {
     socket.to(receiver.socketId).emit("msg-recieve", data);
   }
   socket.emit('message-status',{messageId:data.id, status:'sent'})
   });

   socket.on("message_delivered", ({messageId, from}) => {
    const receiver = onlineUsers.find(user=>user.email === from)
    socket.to(receiver.socketId).emit("message-status",{messageId,status:"delivered"})
   })

   socket.on('messages_viewed', async ({ messageIds, viewerEmail }) => {
    // Update all messages to 'delivered' where _id in messageIds and receiver = viewerId
    await db.Message.updateMany(
      { id: { $in: messageIds }, receiver: viewerEmail, status: 'sent' },
      { $set: { status: 'delivered' } }
    );
  
    // Notify senders about delivery update
    const updatedMessages = await db.Message.find({ id: { $in: messageIds } });
    updatedMessages.forEach(msg => {
      const receiver = onlineUsers.find(user => user.email === msg.from)
      if(receiver){
      socket.to(receiver.socketId).emit('message-status', {
        messageId: msg.id,
        status: 'delivered',
      });
    }
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove user from onlineUsers
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);

    // Broadcast updated user list to all remaining users
    io.emit('online_users', onlineUsers);
  });

  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});