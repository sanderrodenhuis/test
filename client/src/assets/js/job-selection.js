import $ from 'jquery'

$(() => {
  const $body = $('body');
  // expand and collapse for the filter-list
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
    $filterList.trigger('filtered');
  });

  $('.selection').each((idx, elem) => {
    const $jobSelection = $(elem),
          $jobSelectionForm = $jobSelection.find('.selection__form'),
          $selectionFilters = $jobSelection.find('.selection__filters'),
          $jobSelectionJobs = $jobSelection.find('.selection__results');

    const fnFilter = () => {
      const query = $jobSelectionForm.find('input').val(),
            categoryId = $selectionFilters.find('.is-active').data('category-id');
      $jobSelectionJobs.trigger('filter',[query,categoryId]);
    };
    $jobSelectionForm.on('keyup','input',fnFilter);
    $selectionFilters.on('filtered',fnFilter);

    $jobSelectionJobs.on('filter',(event, query = '', categoryId = '*') => {
      const $items = $jobSelectionJobs.find('.result-list__item');
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
