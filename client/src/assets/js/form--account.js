import $ from './jquery';

$(() => {
  const $body = $('body');

  $('.form--account-create, .form--account-edit').each((idx, elem) => {
    const $form = $(elem),
          $blocks = $form.find('.block-subscription'),
          $checkbox = $('#HasSubscription'),
          $formGroup = $checkbox.parent();

    $form.on('click', '.block-subscription .btn', (event) => {
      event.preventDefault();

      const $block = $(event.target).closest('.block-subscription');
      $blocks.removeClass('is-selected');
      $block.addClass('is-selected');

      $checkbox
        .attr('checked', $blocks.index($block) == 1)
        .trigger('change');
    });

    $checkbox.on('change', () => {
      $formGroup.toggleClass('is-hidden', $checkbox.is(':checked'));
    }).trigger('change');

  }).on('submit', (event) => {
    event.preventDefault();
    const form = event.target,
          $form = $(form),
          href = $form.attr('action');

    $.post(location.href, $form.serializeArray())
      .then(response => {
        $form.trigger('errors.reset');
        location.href = href;
      })
      .catch(({responseJSON}) => {
        
        if (! responseJSON.fields)
        {
          $body.trigger('show.modal',['error',{message: responseJSON.message}]);
        }
        else
        {
          $form.trigger('errors.show',responseJSON.fields);
          $('html,body').animate({
            scrollTop: $form.find('.form__error').first().closest('.form__group').offset().top
          });
        }
      });
  });
});


