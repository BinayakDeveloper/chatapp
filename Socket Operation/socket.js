const database = require("../Database/usersDatabase");
const chatDatabase = require("../Database/chatDatabase");
// const recentDatabase = require("../Database/recentDatabase");

async function socket(io) {
  io.on("connection", async (socket) => {
    // Update Online Status
    let user = await database.findById(socket.handshake.auth.userId);
    if (user != null) {
      await user.updateOne({ $set: { onlineStatus: "Online" } });
      await user.updateOne({ $set: { isOnline: true } });
    }

    //   Send Online Status To Frontend
    socket.broadcast.emit("onlineStatus", { uid: user.uid });
    socket.broadcast.emit("chat-user-status", { onlineStatus: "Online" });

    // Get User Requests

    socket.on("getUserDetails", async (data) => {
      let user = await database.findOne({ _id: data.id });
      socket.emit("fetchUserDetails", { user });
    });

    socket.on("sendMessage", async (data) => {
      let relationalId1 = data.senderId + data.receiverId;
      let relationalId2 = data.receiverId + data.senderId;

      let dbChecker1 = await chatDatabase.findOne({
        relationalId: relationalId1,
      });

      let dbChecker2 = await chatDatabase.findOne({
        relationalId: relationalId2,
      });

      if (dbChecker1 == null && dbChecker2 == null) {
        await chatDatabase({
          relationalId: relationalId1,
          message: [
            {
              senderId: data.senderId,
              receiverId: data.receiverId,
              message: data.message,
            },
          ],
        }).save();
      } else if (dbChecker1 != null && dbChecker2 == null) {
        dbChecker1.message.push({
          senderId: data.senderId,
          receiverId: data.receiverId,
          message: data.message,
        });
        await dbChecker1.save();
      } else if (dbChecker1 == null && dbChecker2 != null) {
        dbChecker2.message.push({
          senderId: data.senderId,
          receiverId: data.receiverId,
          message: data.message,
        });
        await dbChecker2.save();
      }

      socket.broadcast.emit("receiveMessage", {
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
      });
    });

    socket.on("retriveChats", async (data) => {
      let relationalId1 = data.senderId + data.receiverId;
      let relationalId2 = data.receiverId + data.senderId;

      let dbChecker1 = await chatDatabase.findOne({
        relationalId: relationalId1,
      });

      let dbChecker2 = await chatDatabase.findOne({
        relationalId: relationalId2,
      });

      if (dbChecker1 == null && dbChecker2 == null) {
      } else if (dbChecker1 != null && dbChecker2 == null) {
        let chats = dbChecker1.message;
        socket.emit("displayChats", chats);
      } else if (dbChecker1 == null && dbChecker2 != null) {
        let chats = dbChecker2.message;
        socket.emit("displayChats", chats);
      }
    });

    socket.on("clearChat", async (data) => {
      let relationalId1 = data.senderId + data.receiverId;
      let relationalId2 = data.receiverId + data.senderId;

      let dbChecker1 = await chatDatabase.findOne({
        relationalId: relationalId1,
      });

      let dbChecker2 = await chatDatabase.findOne({
        relationalId: relationalId2,
      });

      if (dbChecker1 == null && dbChecker2 == null) {
      } else if (dbChecker1 != null && dbChecker2 == null) {
        let chats = dbChecker1.message;
        chats.splice(0, chats.length);
        await dbChecker1.save();
        socket.emit("clearChats");
      } else if (dbChecker1 == null && dbChecker2 != null) {
        let chats = dbChecker2.message;
        chats.splice(0, chats.length);
        await dbChecker2.save();
        socket.emit("clearChats");
      }
    });

    // socket.on("addToRecentChat", async (data) => {
    //   let selectedUser = await database.findById(data.userId);
    //   let userExistance = await recentDatabase.findOne({
    //     selectorId: data.selectorId,
    //     user: selectedUser,
    //   });
    //   if (userExistance == null) {
    //     await recentDatabase({
    //       selectorId: data.selectorId,
    //       user: selectedUser,
    //     }).save();
    //   }
    //   let recentChats = await recentDatabase.find({});
    //   let dbUsers = [];
    //   recentChats.forEach(async (val) => {
    //     let uid = val.user.uid;
    //     let user = await database.findOne({ uid: uid });
    //     dbUsers.push(user);
    //     if (dbUsers.length == recentChats.length) {
    //       socket.emit("displayRecentChats", { dbUsers, recentChats });
    //     }
    //   });
    // });

    // let recentChats = await recentDatabase.find({});
    // let dbUsers = [];
    // recentChats.forEach(async (val) => {
    //   let uid = val.user.uid;
    //   let user = await database.findOne({ uid: uid });
    //   dbUsers.push(user);
    //   if (dbUsers.length == recentChats.length) {
    //     socket.emit("displayRecentChats", { dbUsers, recentChats });
    //   }
    // });

    socket.on("disconnect", async () => {
      // Update Offline Status
      let user = await database.findById(socket.handshake.auth.userId);
      if (user != null) {
        await user.updateOne({ $set: { onlineStatus: "Offline" } });
        await user.updateOne({ $set: { isOnline: false } });
      }

      //   Send Offline Status To Frontend
      socket.broadcast.emit("offlineStatus", { uid: user.uid });
      socket.broadcast.emit("chat-user-status", { onlineStatus: "Offline" });
    });
  });
}

module.exports = { socket };
