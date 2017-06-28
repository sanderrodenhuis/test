import $ from 'jquery'
import './modal';
import './search-result';


window.$ = $;

$('.site-nav__item--toggle').on('click', function (e) {
  e.preventDefault();
  $('.site-menu--mobile').addClass('is-visible')
})

$('.site-menu__btn-close').on('click', function () {
  $('.site-menu--mobile').removeClass('is-visible')
})


