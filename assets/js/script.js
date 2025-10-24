"use strict";

// modal variables
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

// modal function (safe)
const modalCloseFunc = function () { if (modal) modal.classList.add('closed'); };

// modal event listeners (guarded)
if (modalCloseOverlay) modalCloseOverlay.addEventListener('click', modalCloseFunc);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', modalCloseFunc);





// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener (guarded)
if (toastCloseBtn) {
  toastCloseBtn.addEventListener('click', function () {
    if (notificationToast) notificationToast.classList.add('closed');
  });
}





// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

// make the loop safe by using the smallest collection length
const menuCount = Math.min(mobileMenuOpenBtn.length, mobileMenu.length, mobileMenuCloseBtn.length);

for (let i = 0; i < menuCount; i++) {

  // mobile menu function (safe)
  const mobileMenuCloseFunc = function () {
    if (mobileMenu[i]) mobileMenu[i].classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  };

  if (mobileMenuOpenBtn[i]) {
    mobileMenuOpenBtn[i].addEventListener('click', function () {
      if (mobileMenu[i]) mobileMenu[i].classList.add('active');
      if (overlay) overlay.classList.add('active');
    });
  }

  if (mobileMenuCloseBtn[i]) mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
  // don't attach overlay listener here repeatedly (attached once below)

}
// attach overlay click to close all mobile menus (safe)
if (overlay) {
  overlay.addEventListener('click', function () {
    mobileMenu.forEach(m => m.classList.remove('active'));
    overlay.classList.remove('active');
  });
}

// attach close handler to any mobile menu close buttons (safe)
if (mobileMenuCloseBtn.length) {
  mobileMenuCloseBtn.forEach(btn => {
    btn.addEventListener('click', function () {
      mobileMenu.forEach(m => m.classList.remove('active'));
      if (overlay) overlay.classList.remove('active');
    });
  });
}





// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {

  accordionBtn[i].addEventListener('click', function () {
    const nextEl = this.nextElementSibling;
    if (!nextEl) return; // nothing to toggle

    const clickedBtn = nextEl.classList.contains('active');

    for (let j = 0; j < accordion.length; j++) {

      if (clickedBtn) break;

      if (accordion[j].classList.contains('active')) {

        accordion[j].classList.remove('active');
        if (accordionBtn[j]) accordionBtn[j].classList.remove('active');

      }

    }

    nextEl.classList.toggle('active');
    this.classList.toggle('active');

  });

}