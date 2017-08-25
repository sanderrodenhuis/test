import $ from './jquery';
import Cookies from 'js-cookie';

$(() => {
  const $body = $('body');

  $body.on('submit','.js-form--reset-password',(event) => {
    event.preventDefault();
    const $form = $(event.target),
          $frmToken = $form.find('[name=token]'),
          $frmNewPassword = $form.find('[name=NewPassword]'),
          $frmConfirmPassword = $form.find('[name=ConfirmPassword]');
          
    
    $.post('/api/user/reset-password',{
      NewPassword: $frmNewPassword.val(),
      ConfirmPassword: $frmConfirmPassword.val(),
      token: $frmToken.val()
    }).then(response => {
      $form.trigger('errors.reset');
      $body.trigger('show.modal',['reset-password/complete']);
    }).catch(({responseJSON: response}) => {
      $form.trigger('errors.show',[response.fields]);
    })
  });
})
