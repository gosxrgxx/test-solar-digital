var mainNav = document.querySelector('.header');

window.onscroll = function() {
	windowScroll();
};

function windowScroll() {
	mainNav.classList.toggle("sticky", mainNav.scrollTop > 250 || document.documentElement.scrollTop > 250);
}
