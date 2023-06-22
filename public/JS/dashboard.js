// Search User From Database

const addUserBtn = document.querySelector(".addUser");
const allUsersContainer = document.querySelector(".allUsersContainer");
const closeBtn = document.querySelector(".fa-close");
const addUserSearch = document.querySelector(".searchUser input");
const userName = document.querySelectorAll(
  ".allUsers .user .user-details .name p"
);

// const recentUsers = document.querySelectorAll(".recentUsers .user");

// recentUsers.forEach((user, ind) => {
//   user.addEventListener("click", () => {
//     console.log(user);
//     document.querySelector(".chats").innerHTML = "";
//     socket.emit("getUserDetails", { id: user.id });
//   });
// });

addUserBtn.addEventListener("click", () => {
  allUsersContainer.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  addUserSearch.value = "";
  userName.forEach((val) => {
    let userContainer = val.parentElement.parentElement.parentElement;
    userContainer.style.display = "flex";
  });
  allUsersContainer.style.display = "none";
});

addUserSearch.addEventListener("input", () => {
  let typedName = addUserSearch.value.toLowerCase();
  userName.forEach((val) => {
    if (val.innerHTML.toLowerCase().includes(typedName)) {
      let userContainer = val.parentElement.parentElement.parentElement;
      userContainer.style.display = "flex";
    } else {
      let userContainer = val.parentElement.parentElement.parentElement;
      userContainer.style.display = "none";
    }
  });
});

// Retrive Recent Chats
const databaseUsers = document.querySelectorAll(".allUsers .user");

databaseUsers.forEach((val) => {
  val.addEventListener("click", () => {
    let selectorId = document.querySelector(".profile").id;
    socket.emit("addToRecentChat", { userId: val.id, selectorId });
  });
  location.reload();
});

socket.on("displayRecentChats", (data) => {
  const recentUsersContainer = document.querySelector(".recentUsers");
  let recentUsersHTML = "";
  let { dbUsers, recentChats } = data;
  recentChats.forEach((val, ind) => {
    let selectorId = document.querySelector(".profile").id;
    if (val.selectorId == selectorId) {
      recentUsersHTML += `<div class="user" id="${val.user._id}">
                    <div
                      class="user-profilepic"
                      style="--profile-bgcolor: ${val.user.colorCode}"
                    >
                      <p>${val.user.name.slice(0, 1).toUpperCase()}</p>
                    </div>
                    <div class="user-details">
                      <div class="name">
                        <p>${val.user.name}</p>
                      </div>
                      <div class="status">
                        <p id="${val.user.uid}">${dbUsers[ind].onlineStatus}</p>
                      </div>
                    </div>
                    </div>`;
    }
  });

  recentUsersContainer.innerHTML = recentUsersHTML;
  const recentUsers = document.querySelectorAll(".recentUsers .user");
  recentUsers.forEach((user) => {
    user.addEventListener("click", () => {
      document.querySelector(".chats").innerHTML = "";
      socket.emit("getUserDetails", { id: user.id });
    });
  });
});

// Search User From Recent Chats

const recentSearchInput = document.querySelector(".search input");
const recentUserName = document.querySelectorAll(
  ".recentUsers .user .user-details .name p"
);

recentSearchInput.addEventListener("input", () => {
  let typedName = recentSearchInput.value.toLowerCase();
  recentUserName.forEach((val) => {
    if (val.innerHTML.toLowerCase().includes(typedName)) {
      let userContainer = val.parentElement.parentElement.parentElement;
      userContainer.style.display = "flex";
    } else {
      let userContainer = val.parentElement.parentElement.parentElement;
      userContainer.style.display = "none";
    }
  });
});

// Display Chat Options

const threeDots = document.querySelector(".fa-ellipsis");
const optMenu = document.querySelector(".optionMenu");
const clearChat = document.querySelector("#clearchat");

threeDots.addEventListener("click", () => {
  optMenu.classList.toggle("optDisplay");
});

// Clear Chats

clearChat.addEventListener("click", () => {
  let senderId = document.querySelector(".profile").id;
  let receiverId = document.querySelector(".userDetails").id;
  socket.emit("clearChat", { senderId, receiverId });
});

socket.on("clearChats", () => {
  document.querySelector(".chats").innerHTML = "";
  optMenu.classList.remove("optDisplay");
});

// Manage Message Input

const textInp = document.querySelector("textarea");
const sendBtn = document.querySelector(".fa-paper-plane");

textInp.addEventListener("input", (e) => {
  if (textInp.value.length != 0 && textInp.value.trim() != "") {
    sendBtn.style.display = "block";
  } else {
    sendBtn.style.display = "none";
  }
});

textInp.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && textInp.value.trim() != "") {
    sendBtn.click();
  }
});

// Socket Works

sendBtn.addEventListener("click", () => {
  let senderId = document.querySelector(".profile").id;
  let receiverId = document.querySelector(".userDetails").id;
  const message = textInp.value.trim();
  textInp.value = "";
  textInp.blur();
  let chatContainer = document.querySelector(".chats");

  let outgoingMsg = `<div class="outgoing">
                    <p>${message}</p>
                  </div>`;
  chatContainer.insertAdjacentHTML("beforeend", outgoingMsg);

  socket.emit("sendMessage", { senderId, receiverId, message });
});

socket.on("receiveMessage", (data) => {
  let senderId = document.querySelector(".profile").id;
  let receiverId = document.querySelector(".userDetails").id;
  if (data.senderId == senderId && data.receiverId == receiverId) {
    let chatContainer = document.querySelector(".chats");
    let outgoingMsg = `<div class="outgoing">
                    <p>${data.message}</p>
                  </div>`;
    chatContainer.insertAdjacentHTML("beforeend", outgoingMsg);
  } else if (data.senderId == receiverId && data.receiverId == senderId) {
    let chatContainer = document.querySelector(".chats");
    let incomingMsg = `<div class="incoming">
                    <p>${data.message}</p>
                  </div>`;
    chatContainer.insertAdjacentHTML("beforeend", incomingMsg);
  }
});

// Socket Listeners
socket.on("onlineStatus", (uid) => {
  let textContainer = document.getElementById(uid.uid);
  if (textContainer != null) {
    textContainer.textContent = "Online";
  }
});

socket.on("offlineStatus", (uid) => {
  let textContainer = document.getElementById(uid.uid);
  if (textContainer != null) {
    textContainer.textContent = "Offline";
  }
});

// User Click Events

socket.on("fetchUserDetails", (data) => {
  let user = data.user;
  document.querySelector(".userDetails").id = user._id;
  let sessionStart = document.querySelector(".sessionStart");
  let chatElements = document.querySelector(".chatElements");
  let chatProfilepic = document.querySelector("#chat-profilepic");
  let chatUsername = document.querySelector("#chat-username");
  let chatOnlineStatus = document.getElementById("chat-onlineStatus");
  let useProfilePic = document.querySelector(".user-profile-pic");

  sessionStart.style.display = "none";
  chatElements.style.display = "flex";
  chatProfilepic.textContent = user.name.slice(0, 1).toUpperCase();
  chatUsername.textContent = user.name;
  useProfilePic.style.background = user.colorCode;

  if (user.onlineStatus == "Online") {
    chatOnlineStatus.textContent = user.onlineStatus;
    document
      .querySelector(".user-profile-pic")
      .insertAdjacentHTML("beforeend", "<div class='userOnlineStatus'></div>");
  } else if (user.onlineStatus == "Offline") {
    chatOnlineStatus.textContent = user.onlineStatus;
    let userOnlineStatus = document
      .querySelector(".user-profile-pic")
      .querySelector(".userOnlineStatus");
    if (userOnlineStatus != null) {
      userOnlineStatus.remove();
    }
  }

  socket.on("chat-user-status", (data) => {
    if (data.onlineStatus == "Online") {
      chatOnlineStatus.textContent = data.onlineStatus;
      document
        .querySelector(".user-profile-pic")
        .insertAdjacentHTML(
          "beforeend",
          "<div class='userOnlineStatus'></div>"
        );
    } else if (data.onlineStatus == "Offline") {
      chatOnlineStatus.textContent = data.onlineStatus;
      let userOnlineStatus = document
        .querySelector(".user-profile-pic")
        .querySelector(".userOnlineStatus");
      if (userOnlineStatus != null) {
        userOnlineStatus.remove();
      }
    }
  });

  // Retrive Chats
  let senderId = document.querySelector(".profile").id;
  let receiverId = document.querySelector(".userDetails").id;
  socket.emit("retriveChats", { senderId, receiverId });
  socket.on("displayChats", (data) => {
    let chatContainer = document.querySelector(".chats");
    let html = "";
    data.forEach((val) => {
      let senderId = document.querySelector(".profile").id;
      let receiverId = document.querySelector(".userDetails").id;
      if (val.senderId == senderId) {
        let outgoingMsg = `<div class="outgoing">
                    <p>${val.message}</p>
                  </div>`;
        html += outgoingMsg;
      } else if (val.senderId == receiverId) {
        let incomingMsg = `<div class="incoming">
                    <p>${val.message}</p>
                  </div>`;
        html += incomingMsg;
      } else if (val.senderId != senderId || val.senderId != receiverId) {
        html = "";
      }
    });
    chatContainer.innerHTML = html;
  });
});
