import $ from './jquery';

$(() => {
  const $body = $('body');
  
  $body.on('errors.show','form',(event, errors) => {
    const $form = $(event.target);
    $form.find('.form__error').remove();
    Object.keys(errors).forEach(key => {
      let messages = errors[key],
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
  });
  $body.on('errors.reset','form',(event) => {
    const $form = $(event.target);
    $form.find('.form__error').remove();
    });
});
