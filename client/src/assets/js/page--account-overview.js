import $ from './jquery';

$(() => {
  const $body = $('body');
  
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
    
    $body.on('submit','.form--order-cancel',(event) => {
      event.preventDefault();
      const $form = $(event.target),
            action = $form.attr('action');
      $.post(action,$form.serialize())
        .then(result => {
          window.location.replace(window.location.pathname);
        })
        .catch(({responseJSON}) => {
          $body.trigger('show.modal',['error',responseJSON]);
        })
    });
  });
});
