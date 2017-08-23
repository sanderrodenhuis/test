import $ from './jquery';
import Cookies from 'js-cookie';

$(() => {
  const $body = $('body');
  
  $body.on('submit','.js-form--login',(event) => {
    event.preventDefault();
    const $form = $(event.target),
          $frmUsername = $form.find('[name=username]'),
          $frmPassword = $form.find('[name=password]'),
          $frmError = $form.find('.form__error');
    
    $frmError.removeClass('is-visible');
    $frmPassword.removeClass('has-error');
    
    $.post('/api/user/login',{
      username: $frmUsername.val(),
      password: $frmPassword.val()
    }).then(response => {
      Cookies.set('authorization', response.jwt);
      location.reload();
    }).catch(({responseJSON: response}) => {
      $frmError.addClass('is-visible').text('Combinatie werd niet herkend. Probeer opnieuw.');
      $frmPassword.addClass('has-error');
    });
  });
})
