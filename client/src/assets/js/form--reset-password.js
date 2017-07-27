import $ from './jquery';
import Cookies from 'js-cookie';
///TODO check it !!!!!!!
$(() => {
  const $body = $('body');

  $body.on('submit','.js-form--login',(event) => {
    event.preventDefault();
    const $form = $(event.target),
          $frmNewPassword = $form.find('[name=password]'),
          $frmConfirmPassword = $form.find('[name=confirm]'),
          $frmError = $form.find('.form__error');

    $frmError.removeClass('is-visible');
    $frmPassword.removeClass('has-error');

    $.post('/api/user/login',{
      username: $frmUsername.val(),
      password: $frmPassword.val()
    }).then(response => {
      if (response.error)
      {
        $frmError.addClass('is-visible').text('Combinatie werd niet herkend.  Probeer opnieuw.');
        $frmPassword.addClass('has-error');
      }
      else
      {
        Cookies.set('authorization', response.jwt);
        location.reload();
      }
    });
  });
})
