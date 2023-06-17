const inputs = document.querySelectorAll("input");
const eyeBtn = document.querySelector(".fa-eye-slash");
const invalidDetails = document.querySelector("p.invalidDetails");

let type = "pass";

eyeBtn.addEventListener("click", () => {
  if (type == "pass") {
    inputs[1].setAttribute("type", "text");
    type = "text";
    eyeBtn.classList.remove("fa-eye-slash");
    eyeBtn.classList.add("fa-eye");
  } else if (type == "text") {
    inputs[1].setAttribute("type", "password");
    type = "pass";
    eyeBtn.classList.remove("fa-eye");
    eyeBtn.classList.add("fa-eye-slash");
  }
});

setInterval(() => {
  let innerText = invalidDetails.textContent;
  if (innerText != "") {
    invalidDetails.style.opacity = "1";
    setTimeout(() => {
      invalidDetails.style.opacity = "0";
      invalidDetails.innerHTML = "";
    }, 3000);
  }
}, 100);
