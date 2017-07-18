import $ from './jquery'
import './modal';
import './job-selection';
import './datepicker';
import './photo-upload';
import './form-validation';
import './booking-step';
import './filter-list';

$(() => {
  $('.site-nav__item--toggle').on('click', (event) => {
    event.preventDefault();
    $('.site-menu--mobile').addClass('is-visible')
  });

  $('.site-menu__btn-close').on('click', () => {
    $('.site-menu--mobile').removeClass('is-visible')
  });


  $('.site-footer__icon').on('click', () => {
    $('html,body').animate({scrollTop: 0}, 800);
    return false;
  });


  $('.selection').each((idx, elem) => {
    const $jobSelection = $(elem),
      $jobSelectionFilters = $jobSelection.find('.selection__filters'),
      $jobSelectionJobs = $jobSelection.find('.selection__results');


    const filter = (event, categoryId = '*') => {
      const $items = $jobSelectionJobs.find('.result-list__item');
      categoryId = categoryId.toString();
      $items.removeClass('is-hidden');

      if (categoryId !== '*')
        $items.filter((idx, elem) => $(elem).data('category-id').toString() !== categoryId).addClass('is-hidden');
    }

    $jobSelectionFilters.on('filtered', filter);


  });
});
