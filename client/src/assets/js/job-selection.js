import $ from 'jquery'

$(() => {

  $('.job-selection').each((idx, elem) => {
    const $jobSelection = $(elem),
          $jobSelectionForm = $jobSelection.find('.job-selection__form'),
          $jobSelectionFilters = $jobSelection.find('.job-selection__filters'),
          $jobSelectionJobs = $jobSelection.find('.job-selection__jobs');

    const fnFilter = (event, data) => {
      const query = $jobSelectionForm.find('input').val(),
            categoryId = data;
      $jobSelectionJobs.trigger('filter',[query,categoryId]);
    };
    $jobSelectionForm.on('keyup','input',fnFilter);
    $jobSelectionFilters.on('filtered',fnFilter);

    $jobSelectionJobs.on('filter',(event, query = '', categoryId = '*') => {
      const $items = $jobSelectionJobs.find('.job-list__item');
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
