const icon = document.querySelector(".icon");
const socialMobile = document.querySelector("#social-mobile");

icon.addEventListener("click", function () {
  this.classList.toggle("icon--active");
  socialMobile.classList.toggle("social--mobile");
  //   document.body.classList.toggle("no-scroll");
});
