import $ from './jquery';

$(() => {
  
  $('.form--account-create, .form--account-edit').each((idx, elem) => {
    const $form = $(elem),
          $blocks = $form.find('.block-subscription'),
          $checkbox = $('#selected-subscription'),
          $formGroup = $checkbox.parent();
    
    $form.on('click', '.block-subscription .btn', (event) => {
      event.preventDefault();
  
      const $block = $(event.target).closest('.block-subscription');
      $blocks.removeClass('is-selected');
      $block.addClass('is-selected');
  
      $checkbox
        .attr('checked', $block.hasClass('block-subscription--secondary'))
        .trigger('change');
  
    });
  
    $checkbox.on('change', () => {
      $formGroup.toggleClass('is-hidden', $checkbox.is(':checked'));
    }).trigger('change');
    
  });
  
});


