import $ from './jquery';

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
    const $this = $(event.target),
          $filterList = $this.closest('.filter-list');
    let $target = $($filterList.data('target'));
    
    $filterList.find('.is-active').removeClass('is-active');
    $this.addClass('is-active');
    $filterList.toggleClass('is-expanded');
    if (! $target.length)
      $target = $filterList;
    $target.trigger('filtered',[$this.data('filter-data')]);
  });
  
});
