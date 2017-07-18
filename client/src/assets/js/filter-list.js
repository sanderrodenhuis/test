import $ from 'jquery'

$(() => {

  const $body = $('body');

  $body.on('click','.filter-list__title',(event) => {
    event.preventDefault();
    const $target = $(event.target),
      $filterList = $target.closest('.filter-list');
    $filterList.toggleClass('is-expanded');
  });
  $body.on('click','.filter-list__link',(event) => {
    event.preventDefault();
    const $target = $(event.target),
      $filterList = $target.closest('.filter-list');

    $filterList.find('.is-active').removeClass('is-active');
    $target.addClass('is-active');
    $filterList.toggleClass('is-expanded');
    $filterList.trigger('filtered',[$target.data('filter-data')]);
  });

});
