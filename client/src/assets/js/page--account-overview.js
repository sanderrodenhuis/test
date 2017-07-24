import $ from './jquery';

$(() => {

  $('.order-overview').each((idx, elem) => {
    const $overview = $(elem),
          $results = $overview.find('.order-overview__orders'),
          template = $overview.find('.order-overview__template').html();
  
    $overview.on('filtered', (event, status = '*') => {
      const $items = $results.children();
      status = String(status);
      if (status === '*')
        $items.removeClass('is-hidden');
      else
        $items.addClass('is-hidden').filter(`[data-order-status=${status}]`).removeClass('is-hidden');
    });

    $overview.on('click','.js-appointment-cancel',(event) => {
      event.preventDefault();
      const $target = $(event.target),
            $parent = $target.closest('.order-overview__order-item'),
            $notification = $(template);

      $parent.append($notification);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          $notification.addClass('is-active');
        });
      });
    });
  });
});
