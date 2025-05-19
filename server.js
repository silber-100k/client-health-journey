const http = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
const db = require("./db");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = http.createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  let onlineUsers = [];
  io.on("connection", (socket) => {
    socket.emit('online_users', onlineUsers);

    socket.on('user_login', async (email) => {
      // const notification = await db.Notification.findOne({ email });
      // socket.emit("unread_count", notification?.unreadCount || 0);

      const exists = onlineUsers.find(user => user.email === email);
      if (!exists) {
        onlineUsers.push({ email, socketId: socket.id });
      } else {
        exists.socketId = socket.id;
      }

      socket.broadcast.emit('online_users', onlineUsers);

      socket.on("get_user_list", () => {
        socket.emit("online_users", onlineUsers);
      });
    });

    socket.on('send-message', (data) => {
      const receiver = onlineUsers.find(user => user.email === data.to)
      if (receiver) {
        socket.to(receiver.socketId).emit("msg-recieve", data);
      }
      socket.emit('message-status', { messageId: data.id, status: 'sent' })
    });

    socket.on("message_delivered", ({ messageId, from }) => {
      const receiver = onlineUsers.find(user => user.email === from)
      socket.to(receiver.socketId).emit("message-status", { messageId, status: "delivered" })
    })

    socket.on('messages_viewed', async ({ messageIds, viewerEmail }) => {
      try {
        // 1. Update messages status to 'delivered'
        await sql`
          UPDATE "Message"
          SET status = 'delivered'
          WHERE id = ANY(${messageIds}) 
            AND receiver = ${viewerEmail}
            AND status = 'sent'
        `;

        // 2. Fetch updated messages
        const updatedMessages = await sql`
          SELECT id, sender FROM "Message" WHERE id = ANY(${messageIds})
        `;

        // 3. Notify senders about delivery update
        updatedMessages.forEach(msg => {
          const receiver = onlineUsers.find(user => user.email === msg.sender);
          if (receiver) {
            socket.to(receiver.socketId).emit('message-status', {
              messageId: msg.id,
              status: 'delivered',
            });
          }
        });
      } catch (error) {
        console.error('Error updating message status:', error);
      }
    });


    socket.on('disconnect', () => {

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