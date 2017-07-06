import $ from './jquery'
import './modal';
import './job-selection';
import './datepicker';
import './photo-upload';
import './form-validation';

$('.site-nav__item--toggle').on('click', function (e) {
  e.preventDefault();
  $('.site-menu--mobile').addClass('is-visible')
})

$('.site-menu__btn-close').on('click', function () {
  $('.site-menu--mobile').removeClass('is-visible')
})

