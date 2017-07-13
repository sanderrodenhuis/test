import $ from './jquery'


$(() => {
  $('.booking-step').each((idx, elem) => {
    const $bookingStep = $(elem),
      $items = $bookingStep.find('.booking-step__list').children('.booking-step__item');
    let index = 0;

    $bookingStep.on('click', '.booking-step__button--prev', (event) => {
      event.preventDefault();

      fnSetActive(index - 1);
    });
    $bookingStep.on('click', '.booking-step__button--next', (event) => {
      event.preventDefault();

      fnSetActive(index + 1);
    });

    const fnSetActive = (idx) => {
      index = Math.max(0, Math.min(idx, $items.length - 1));
      $items.removeClass('is-active').eq(index).addClass('is-active');
      $items.each((idx, elem) => {
        let $item = $(elem);
        $item.css({
          left: (50 * (idx + 1 - index)) + '%'
        });
      });
    };
    fnSetActive(0);
  });
});
