import $ from './jquery';

$(() => {
  
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
        .attr('checked', $blocks.index($block) == 0)
        .trigger('change');
    });
  
    $checkbox.on('change', () => {
      $formGroup.toggleClass('is-hidden', $checkbox.is(':checked'));
    }).trigger('change');
    
  });
  
  $('.form--account-create').on('submit', (event) => {
    event.preventDefault();
    const form = event.target,
          $form = $(form),
          href = $form.attr('action');
    
    $.post(location.href, $form.serializeArray())
      .then(response => {
        $form.find('.form__error').remove();
        location.href = href;
      })
      .catch(error => {
        $form.find('.form__error').remove();
          let response = error.responseJSON;
        Object.keys(response.error).forEach(key => {
          let messages = response.error[key],
              $input = $form.find(`[name="${key}"]`),
              $group = $input.closest('.form__group');
          if (! $group.length)
            return;
          messages.forEach(message => {
            $group.append(`<div class="form__error">${message}</div>`);
          });
        });
        let $errors = $form.find('.form__error');
        $errors.addClass('is-visible');
        $('html,body').animate({
          scrollTop: $errors.first().closest('.form__group').offset().top
        });
      });
  });
});


