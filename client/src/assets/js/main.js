import $ from 'jquery'
import './modal';


window.$ = $;

$('.site-nav__item--toggle').on('click', function (e) {
  e.preventDefault();
  $('.site-menu--mobile').addClass('is-visible')
})

$('.site-menu__btn-close').on('click', function () {
  $('.site-menu--mobile').removeClass('is-visible')
})



$('body').on('keyup', '.form__control--funnel-search', (event) => {
  let query = $(event.target).val();
  let categoryId = $('.filter-list').find('.filter-list__btn.is-active').data('category-id');
  $('.search-results').trigger('filter.jobs',[categoryId, query]);

});
$('body').on('click', '.filter-list__btn', (event) => {
  event.preventDefault();
  const $this = $(event.target);
  const categoryId = $this.data('category-id');
  const query = $('.form__control--funnel-search').val();

  $('.search-results').trigger('filter.jobs',[categoryId, query]);

  $this.closest('.filter-list').find('.filter-list__btn.is-active').removeClass('is-active');
  $this.addClass('is-active');

});


$('body').on('filter.jobs','.search-results',(event, categoryId = '*', query = '') => {
  const $searchResults = $(event.target),
    $resultList = $searchResults.find('.result-list'),
    $results = $resultList.children();

  $results.show();

  if (categoryId != '*')
  {
    $results.filter((idx, elem) => elem.getAttribute('data-category-id') != categoryId).hide();
  }
  if (query)
  {
    $results.filter((ids, elem) => {
      const matchPattern = new RegExp(query, 'i');
      return !$(elem).children().text().match(matchPattern)

    }).hide()
  }

});

