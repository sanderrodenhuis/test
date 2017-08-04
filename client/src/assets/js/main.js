import './globals';
import $ from './jquery';
import './forms';
import './modal';
import './job-selection';
import './datepicker';
import './timepicker';
import './datepicker-info';
import './photo-upload';
// import './form-validation';
import './booking-step';
import './filter-list';
import './form--account';

import './page--account-overview';

import './form--login';
import './form--forgot-password';
import './form--reset-password';
import './form--select-appointment';

import './helpers';

$(() => {
  $('.site-nav__item--toggle').on('click', (event) => {
    event.preventDefault();
    $('.site-menu--mobile').addClass('is-visible')
  });

  $('.site-menu__btn-close').on('click', () => {
    $('.site-menu--mobile').removeClass('is-visible')
  });


  $('.site-footer__icon').on('click', () => {
    $('html,body').animate({scrollTop: 0}, 800);
    return false;
  });

});



