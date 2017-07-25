import $ from './jquery';

$(() => {

  $('body').on('click', '.block-subscription .btn', (event) => {
    event.preventDefault();

    const $parent = $(event.target).parent();
    $('.block-subscription').removeClass('is-selected');
    $parent.addClass('is-selected');

    if($parent.hasClass('block-subscription--secondary')) {
      $('#selected-subscription').attr('checked', true);
        $checkbox.trigger('change');
    } else {
      $('#selected-subscription').attr('checked', false);
        $checkbox.trigger('change');

    }
  });


    let $checkbox = $('#selected-subscription');
    $checkbox.on('change', () => {
      $('.form__group-toggle').toggleClass('is-visible', $checkbox.is(':checked'));
    }).trigger('change');


});

