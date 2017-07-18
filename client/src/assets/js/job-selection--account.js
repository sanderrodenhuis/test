import $ from 'jquery'

$(() => {


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
      const $items = $selectionResults.find('.job-list__item');
      categoryId = categoryId.toString();
      $items.removeClass('is-hidden');

      if (categoryId !== '*')
        $items.filter((idx,elem) => $(elem).data('category-id').toString() !== categoryId).addClass('is-hidden');


    });
  });
});
