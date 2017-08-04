import $ from './jquery';

$(() => {
  $('.timepicker').each((idx, elem) => {
    const $timepicker = $(elem),
          $target = $($timepicker.attr('data-target'));
    
    if ($target.val())
      $timepicker.find('.time-list__link').removeClass('is-selected').filter(`[data-time="${$target.val()}"]`).addClass('is-selected');
    
    $timepicker.on('click','.time-list__link',(event) => {
      event.preventDefault();
      const $link = $(event.target),
            times = $link.attr('data-times'),
            $list = $link.closest('.time-list');
    
      if ($target.hasClass('is-selected'))
        return;
    
      $list.find('.is-selected').removeClass('is-selected');
      $link.addClass('is-selected');
      $target.val(times).trigger('change',[times]);
    });
    $timepicker.on('timepicker.setTimes',(event, timeSlots) => {
      if (! timeSlots.length)
        return $timepicker.html('<p>Er is geen beschikbaar tijdstip op deze datum</p>');
  
      $timepicker.html(
        `<ul class="time-list">
            ${timeSlots.map(row =>
          `<li class="time-list__item">
                <a href="" class="time-list__link" data-times="${row.from}|${row.until}">${row.from} - ${row.until}</a>
              </li>`
        ).join('')}
          </ul>`
      );
    });
  })
});
