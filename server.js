const http = require('node:http');
const next = require('next');
const { Server } = require('socket.io');

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
  const pendingNotifications = new Map();
  
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
      const notificationTimeout = setTimeout(async () => {
      await sendEmailNotification(data);
      pendingNotifications.delete(data.id);
      }, 900000); 

      pendingNotifications.set(data.id, notificationTimeout);
      const receiver = onlineUsers.find(user => user.email === data.to)
      if (receiver) {
        socket.to(receiver.socketId).emit("msg-recieve", data);
      }
      socket.emit('message-status', { messageId: data.id, status: 'sent' })
    });

    socket.on("message_delivered", ({ messageId, from }) => {
        if (pendingNotifications.has(messageId)) {
        clearTimeout(pendingNotifications.get(messageId));
        pendingNotifications.delete(messageId);
      }      const receiver = onlineUsers.find(user => user.email === from)
      socket.to(receiver.socketId).emit("message-status", { messageId, status: "delivered" })
    })

    socket.on('messages_viewed', async (updatedMessages) => {
      try {
        updatedMessages.forEach(msg => {
        if (pendingNotifications.has(msg.id)) {
        clearTimeout(pendingNotifications.get(msg.id));
        pendingNotifications.delete(msg.id);
      }
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

async function sendEmailNotification(message) {
    try {
          const respond = await fetch(`http://${hostname}:${port}/api/notification`, {
            method: "POST",
            body: JSON.stringify({
              senderE: message.from,
              time: formatDate(new Date()),
              receiver: message.to,
            }),
          });
          const data = await respond.json();
          if (!data.status) {
            console.log(data.message || "Failed Notification");
          }
        } catch (error) {
          console.log(error);
        }

}

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long", // e.g. "April"
      day: "numeric", // e.g. 21
      hour: "numeric", // e.g. 10 PM
      minute: "2-digit", // e.g. 15
      hour12: true, // 12-hour clock with AM/PM
    }).format(date);
  };
