import $ from 'jquery'

$('.open-modal').on('click', function (e) {
  e.preventDefault();
  $('body').addClass('modal-open');
  $('.modal').css('display', 'flex');
})

$('.modal__close').on('click', function () {
  $('body').removeClass('modal-open');
  $('.modal').toggle();
})


$(window).on('click', function(e){
  if(e.target == modal) {
    $('.modal').toggle();
  }
})
