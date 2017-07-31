import $ from './jquery';

$(() => {
  const $body = $('body');
  
  $('[data-if-checked]').each((idx, elem) => {
    const $this = $(elem),
          $target = $($this.attr('data-if-checked'));
    if ($target.length === 0 || $target.attr('type') !== 'checkbox')
      return;
    
    $target.on('change', () => {
      $this.toggle( $target.is(':checked') )
    });
    $this.toggle( $target.is(':checked') )
  });
});
