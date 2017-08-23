import $ from './jquery';

$(() => {
  const $body = $('body');

  $body.on('submit','.js-form--forgot-password',(event) => {
    event.preventDefault();
    const $form = $(event.target),
          $frmEmail = $form.find('[name=email]'),
          $frmError = $form.find('.form__error'),
          email = $frmEmail.val();

    $frmError.removeClass('is-visible');
    $frmEmail.removeClass('has-error');

    $.post('/api/user/forgot-password',{
      email,
    }).then(response => {
      if (response.error)
        throw response.error;
      $body.trigger('show.modal',['forgot-password/complete', {email}]);
    }).catch(({responseJSON: response}) => {
      $body.trigger('show.modal',['error', response]);
    });
  });
})
