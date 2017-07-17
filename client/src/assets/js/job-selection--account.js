import $ from 'jquery'

$(() => {
  const $body = $('body');
  // expand and collapse for the funnel/task-selection/filter-list
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
    $filterList.trigger('filtered');
  });

  $('.selection').each((idx, elem) => {
    const $selection = $(elem),
      $selectionFilters = $selection.find('.selection__filters'),
      $selectionResults = $selection.find('.selection__results');

    const fnFilter = () => {
      const categoryId = $selectionFilters.find('.is-active').data('category-id');
      $selectionResults.trigger('filter',[null,categoryId]);
    };

    $selectionFilters.on('filtered',fnFilter);

    $selectionResults.on('filter',(event, query = '', categoryId = '*') => {
      const $items = $selectionResults.find('.list-overview');
      categoryId = categoryId.toString();
      $items.removeClass('is-hidden');

      if (categoryId !== '*')
        $items.filter((idx,elem) => $(elem).data('category-id').toString() !== categoryId).addClass('is-hidden');

      if (query)
      {
        const regex = new RegExp(query, 'i');
        $items.filter((idx, elem) => !$(elem).text().match(regex)).addClass('is-hidden');
      }
    });
  });
});
