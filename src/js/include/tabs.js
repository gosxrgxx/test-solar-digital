'use strict'

const tabsButton = document.querySelectorAll('.tabs__nav-item');
const tabsBody = document.querySelectorAll('.tabs__info-body');

function onTabClick(item) {
	item.addEventListener('click', function() {
		let currentButton = item;
		let tabId = currentButton.getAttribute('data-tab');
		let currentTab = document.querySelector(tabId);

		if ( !currentButton.classList.contains('active')) {
			tabsButton.forEach(function(item) {
				item.classList.remove('active');
			});

			tabsBody.forEach(function(item) {
				item.classList.remove('active');
			});

			currentButton.classList.add('active');
			currentTab.classList.add('active');
		}

	});
}

tabsButton.forEach(onTabClick);
