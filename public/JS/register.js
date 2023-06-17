const inputs = document.querySelectorAll("input");
const eyeBtn = document.querySelector(".fa-eye-slash");
const sameuser = document.querySelector("p.sameuser");
let type = "pass";

eyeBtn.addEventListener("click", () => {
  if (type == "pass") {
    inputs[2].setAttribute("type", "text");
    type = "text";
    eyeBtn.classList.remove("fa-eye-slash");
    eyeBtn.classList.add("fa-eye");
  } else if (type == "text") {
    inputs[2].setAttribute("type", "password");
    type = "pass";
    eyeBtn.classList.remove("fa-eye");
    eyeBtn.classList.add("fa-eye-slash");
  }
});

setInterval(() => {
  let innerText = sameuser.textContent;
  if (innerText != "") {
    sameuser.style.opacity = "1";
    setTimeout(() => {
      sameuser.style.opacity = "0";
      sameuser.innerHTML = "";
    }, 3000);
  }
}, 100);
