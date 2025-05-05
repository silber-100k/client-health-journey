import db from "./index";

export const messageRepo = {
  saveMessage,
  readMessageHistory,
  updateMessage,
  updateNotification,
  getNumber,
  markNotification
};

async function saveMessage(id,message,sender,receiver,status) {
  const newMessage = await db.Message.create([{id,
    message,sender,receiver,status}]);
  return newMessage[0];
}

async function updateMessage(id, status) {
  try {
    console.log("Updating message status to:", status);

    const updatedMessage = await db.Message.findOneAndUpdate(
      { id },                // filter by your custom id field
      { $set: { status } },  // update only the status field
      { new: true }          // return the updated document
    );

    if (!updatedMessage) {
      console.warn(`Message with id ${id} not found.`);
      return null;
    }

    return updatedMessage;
  } catch (error) {
    console.error("Error updating message:", error);
    throw error; // or handle error as needed
  }
}

async function updateNotification(receiver) {
  try {
    console.log("Updating notification", receiver);

    const updatedNotification = await db.Notification.findOneAndUpdate(
      { email: receiver },
      { $inc: { unreadCount: 1 } },
      { upsert: true, new: true }
    );
    return updatedNotification;
  } catch (error) {
    console.error("Error updated Notification", error);
    throw error; // or handle error as needed
  }
}

async function markNotification(email) {
  try {
 
    const update = await db.Notification.findOneAndUpdate(
      { email: email },
      { $set: { unreadCount: 0 } }
    );
    return update;
  } catch (error) {
    console.error("Error updated Notification", error);
    throw error; // or handle error as needed
  }
}

async function getNumber(email) {
  try {

    const getNumber = await db.Notification.findOne({email:email});
    return getNumber;
  } catch (error) {
    console.error("Error updated Notification", error);
    throw error; // or handle error as needed
  }
}


async function readMessageHistory(sender,receiver) {

  try {
    // Fetch messages between sender and receiver, sorted oldest first
    const messages = await db.Message.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timeStamp: 1 });

    // Map messages to a simplified format
    const projectedMessages = messages.map((msg) => ({
      id:msg.id,
      from: msg.sender,
      to:msg.receiver,
      message: msg.message,
      timestamp:msg.timeStamp,
      status:msg.status
    }));

    return projectedMessages;
  } catch (error) {
    console.error("Error fetching message history:", error);
    throw error; // or return an empty array or custom error response
  }

}
