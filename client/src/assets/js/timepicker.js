import $ from './jquery';

$(() => {
  $('.timepicker').each((idx, elem) => {
    const $timepicker = $(elem),
          $frmTimes = $($timepicker.attr('data-target-times')),
          $frmTimeSlotId = $($timepicker.attr('data-target-id'));
    
    $timepicker.on('click','.time-list__link',(event) => {
      event.preventDefault();
      const $link = $(event.target),
            times = $link.attr('data-times'),
            id = $link.attr('data-id'),
            $list = $link.closest('.time-list');
      
      if ($link.hasClass('is-selected'))
        return;
      
      $list.find('.is-selected').removeClass('is-selected');
      $link.addClass('is-selected');
      $frmTimeSlotId.val(id);
      $frmTimes.val(times).trigger('change',[times]);
    });
    $timepicker.on('timepicker.setTimes',(event, timeSlots) => {
      if (! timeSlots.length)
        return $timepicker.html('<p>Er is geen beschikbaar tijdstip op deze datum</p>');
      
      $timepicker.html(`<ul class="time-list">
         ${timeSlots.map(row => `<li class="time-list__item">
                <a href="" class="time-list__link" data-times="${row.from}|${row.until}" data-id="${row.id}">${row.from} - ${row.until}</a>
              </li>`).join('')}
        </ul>`);
    });
  })
});
