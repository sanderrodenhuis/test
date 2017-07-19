import $ from './jquery';

$(() => {
  $('.order-overview').each((idx, elem) => {
    const $overview = $(elem),
          $filter = $overview.find('.order-overview__filters'),
          $results = $overview.find('.order-overview__orders');
  
    $filter.on('filtered', (event, status = '*') => {
      const $items = $results.children();
      status = String(status);
      if (status === '*')
        $items.removeClass('is-hidden');
      else
        $items.addClass('is-hidden').filter(`[data-order-status=${status}]`).removeClass('is-hidden');
    });
  });
});
