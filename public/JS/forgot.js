const invalidEmail = document.querySelector(".bottom p");
setInterval(() => {
  let innerText = invalidEmail.textContent;
  if (innerText != "") {
    invalidEmail.style.opacity = "1";
    setTimeout(() => {
      invalidEmail.style.opacity = "0";
      invalidEmail.innerHTML = "";
    }, 3000);
  }
}, 100);
