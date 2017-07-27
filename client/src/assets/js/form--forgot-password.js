import $ from './jquery';
import Cookies from 'js-cookie';

$(() => {
  const $body = $('body');

  $body.on('submit','.js-form--forgot-password',(event) => {
    event.preventDefault();
    const $form = $(event.target),
          $frmEmail = $form.find('[name=email]'),
          $frmError = $form.find('.form__error');

    $frmError.removeClass('is-visible');
    $frmEmail.removeClass('has-error');

    $.post('/api/user/forgot-password',{
      email: $frmEmail.val(),
    }).then(response => {
      if (!response.success)
      {
        $('body').trigger('show.modal',['forgot-password-confirmation']);
      }
    });
  });
})
