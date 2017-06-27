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




$('body').on('click', '.filter-list__btn', (e) => {
  e.preventDefault();
  let id = e.target.getAttribute('data-category-id');

  $('.search-results').trigger('filter.jobs', [id]);
});

$('.form__control--funnel-search').bind('input', function (e) {
  console.log($(e.target).val());
  const query = $(e.target).val();
  $('.search-results').trigger('filter.jobs',[undefined, query]);

});



$('body').on('filter.jobs','.search-results',(event, categoryId = '*', query = '') => {
  console.log(event, categoryId, query);

  const $searchResults = $(event.target),
    $resultList = $searchResults.find('.result-list'),
    $results = $resultList.children();

  $results.show();

  if (categoryId != '*')
  {
    $results.filter((idx, elem) => elem.getAttribute('data-category-id') !== categoryId).hide();
  }
  if (query)
  {
    $results.filter((ids, elem) => {
      const matchPattern = new RegExp(query, 'i');
      return !$(elem).children().text().match(matchPattern)

    }).hide()
  }

});




// function showResults(id) {
//   console.log(id);
//
//   $('.result-list').children().filter(function(idx, el) {
//       console.log(el, idx);
//       el.getAttribute('data-category-id') !== categoryId).hide();
//   })
// }
