import $ from './jquery';

$(() => {

  let queryValue = '',
      categoryId = '';
  
  $('.job-selection').each((idx, elem) => {
    const $jobSelection = $(elem),
          $jobSelectionForm = $jobSelection.find('.job-selection__form'),
          $jobSelectionFilters = $jobSelection.find('.job-selection__filters'),
          $jobSelectionJobs = $jobSelection.find('.job-selection__jobs');

    const fnFilter = () => {
      $jobSelectionJobs.trigger('filter',[
        queryValue,
        categoryId || undefined // a hack way to enforce default property of *
      ]);
    };
    
    $jobSelectionForm.on('keyup','input',(event) => {
      const $target = $(event.target);
      queryValue = $target.val();
      fnFilter();
    });
    $jobSelectionFilters.on('filtered',(event,data) => {
      categoryId = data;
      fnFilter();
    });

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
