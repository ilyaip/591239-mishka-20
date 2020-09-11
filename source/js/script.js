var menuToggle = document.querySelector(".page-header__toggle");
var close = document.querySelector(".main-nav--closed");
var nav = document.querySelector(".main-nav");
var modal = document.querySelector(".modal-size");
var buttonSize = document.querySelector(".product-week__button-order");
var modalClose = document.querySelector(".modal-size__button-sub");
var productButton = document.querySelector(".production__button");


// menuToggle.addEventListener("click", function (evt) {
//   nav.classList.add("main-nav--closed");
// }

// Мобильное меню
nav.classList.add("main-nav--closed");

menuToggle.onclick = function() {
  nav.classList.toggle("main-nav--closed");
  menuToggle.classList.toggle("page-header__toggle-1");
}

//Модалка выбора размера
modal.classList.add("modal-size--closed");

buttonSize.onclick = function() {
  event.preventDefault();
  modal.classList.remove("modal-size--closed");
  modal.classList.add("modal-size--absolute");
}

//productButton.onclick = function () {
//  modal.classList.remove("modal-size--closed");
//  modal.classList.add("modal-size--absolute");
//}


modalClose.onclick = function() {
  modal.classList.add("modal-size--closed");
}
