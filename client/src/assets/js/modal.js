import $ from './jquery';

$(() => {
  const $body = $('body');

  $body.on('show.modal', (event, modalUrl, replacements = {}) => {
    if (modalUrl[0] === '/')
      modalUrl = modalUrl.substr(1);
    
    modalUrl = modalUrl.split('/');
    if (modalUrl[0] === 'overlays')
      modalUrl = modalUrl.slice(1);
    modalUrl = '/overlays/' + modalUrl.join('/');
    
    let $modal = $('.modal');
    if (! $modal.length)
      $modal = $('<div class="modal"></div>');
    $body.append($modal);
  
    $.get(modalUrl).then(html => {
      Object.keys(replacements).forEach(key => {
        const val = replacements[key];
        html = html.replace(new RegExp('{{'+key+'}}','gi'), val);
      });
      const $html = $(html);
      if ($html.hasClass('modal'))
        html = $html.html();
      
      $modal.html(html);
      $modal.addClass('is-visible');
      $body.addClass('has-modal');
      $modal.find('[autofocus]').focus();
    });
  });
  
  $body.on('click', '[data-modal]', (event) => {
    event.preventDefault();
    let $this = $(event.target),
      modalUrl = $this.data('modal');

    $body.trigger('show.modal',[modalUrl]);
  });

  $body.on('click','.modal, .modal .modal__btn-close, .js-modal-close', (event) => {
    const $target = $(event.target),
      $currentTarget = $(event.currentTarget);
    if (!($target.hasClass('modal') || $currentTarget.hasClass('modal__btn-close') || $target.hasClass('js-modal-close')))
      return;
    event.preventDefault();

    let $modal = $('.modal');
    $modal.removeClass('is-visible');
    $body.removeClass('has-modal');
  });

  if (location.hash.length > 0)
  {
    location.hash.substr(1).split('&').filter(Boolean).map(param => param.split('=')).find(([key,value]) => {
      if (key === 'modal')
        $body.trigger('show.modal',[value]);
    });
    
    
  }
});
