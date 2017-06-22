import $ from 'jquery'

$(() => {
  const $body = $('body');

  $body.on('click', '[data-modal]', (event) => {
    event.preventDefault();
    let $this = $(event.target),
      modalUrl = $this.data('modal');

    let $modal = $('modal');
    if (! $modal.length)
      $modal = $('<div class="modal"></div>');
    $body.append($modal);

    $.get(modalUrl).then(html => {
      const $html = $(html);
      if ($html.hasClass('modal'))
        html = $html.html();
      $modal.html(html);
      $modal.addClass('is-visible');
      $body.addClass('has-modal');
    });
  });

  $body.on('click','.modal, .modal .modal__btn-close', (event) => {
    const $target = $(event.target),
      $currentTarget = $(event.currentTarget);
    if (!($target.hasClass('modal') || $currentTarget.hasClass('modal__btn-close')))
      return;
    event.preventDefault();

    let $modal = $('.modal');
    $modal.removeClass('is-visible');
    $body.removeClass('has-modal');
  });


});
