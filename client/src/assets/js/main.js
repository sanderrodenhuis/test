import $ from './jquery'
import './modal';
import './job-selection';
import './datepicker';
import './photo-upload';
import './form-validation';
import './booking-step';
import './filter-list';

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
