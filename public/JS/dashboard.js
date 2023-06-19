// Search User From Database

const addUserBtn = document.querySelector(".addUser");
const allUsersContainer = document.querySelector(".allUsersContainer");
const closeBtn = document.querySelector(".fa-close");
const addUserSearch = document.querySelector(".searchUser input");
const databaseUsers = document.querySelectorAll(".allUsers .user");
const userName = document.querySelectorAll(
  ".allUsers .user .user-details .name p"
);

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

// Search User From Recent Chats

const recentSearchInput = document.querySelector(".search input");
const recentUsers = document.querySelector(".recentUsers .user");
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
