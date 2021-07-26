const headerNavIcon = document.querySelector('.burger-icon');
const headerNav = document.querySelector('.burger-nav');

if (headerNavIcon) {
	headerNavIcon.addEventListener('click', function() {
		document.body.classList.toggle('lock');
		headerNavIcon.classList.toggle('active');
		headerNav.classList.toggle('active');
	});
}
