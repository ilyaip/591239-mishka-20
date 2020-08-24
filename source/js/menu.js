var menuToggle = document.querySelector(".main-nav__toggle");
var close = document.querySelector(".main-nav--closed");
var nav = document.querySelector(".main-nav");

// menuToggle.addEventListener("click", function (evt) {
//   nav.classList.add("main-nav--closed");
// }

menuToggle.onclick = function() {
  nav.classList.toggle("main-nav--closed");
  menuToggle.classList.toggle("main-nav__toggle-1");
}
