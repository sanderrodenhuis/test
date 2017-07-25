import $ from './jquery';

$(() => {

  const $form = $('.form--account-edit');

  $form.on('click', '.block-subscription .btn', (event) => {
    event.preventDefault();

    const $block = $(event.target).parent();
    $form.find('.block-subscription').removeClass('is-selected');
    $block.addClass('is-selected');


    $('#selected-subscription').attr('checked', $block.hasClass('block-subscription--secondary')).trigger('change');

  });


    let $checkbox = $('#selected-subscription'),
      $formGroup = $checkbox.parent();
      $checkbox.on('change', () => {

        if($checkbox.attr('checked')) {
          $formGroup.removeClass('is-hidden')
        } else (
          $formGroup.addClass('is-hidden')
        )

      }).trigger('change');

    });

