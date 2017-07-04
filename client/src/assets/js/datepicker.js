import $ from './jquery'
import 'jquery-ui'
import 'jquery-datepicker'

$(() => {
  const $body = $('body');
  
  const $datepicker = $( "#datepicker" );
  $datepicker.datepicker({
    closeText: "Sluiten",
    prevText: "",
    nextText: "",
    currentText: "Vandaag",
    monthNames: [ "Januari", "Februari", "Maart", "April", "Mei", "Juni",
      "Juli", "Augustus", "September", "Oktober", "November", "December" ],
    monthNamesShort: [ "jan", "feb", "mrt", "apr", "mei", "jun",
      "jul", "aug", "sep", "okt", "nov", "dec" ],
    dayNames: [ "zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag" ],
    dayNamesShort: [ "zon", "maa", "din", "woe", "don", "vri", "zat" ],
    dayNamesMin: [ "Z", "M", "D", "W", "D", "V", "Z" ],
    weekHeader: "Wk",
    dateFormat: "DD dd MM yy",
    firstDay: 0,
    minDate: 0,
    isRTL: false,
    showOtherMonths: true,
    showMonthAfterYear: false,
    yearSuffix: ""
  });
  
  
  $datepicker.on("change",function(){
    $('.datepicker-info__date').html($(this).val());
  });
  $body.on('click','.time-list__link',(event) => {
    event.preventDefault();
    const $target = $(event.target),
          time = $target.text(),
          $list = $target.closest('.time-list');
          
    if (! $target.hasClass('is-active'))
      return;
    
    $('.datepicker-info__time').html(time);
    
    $list.find('.is-selected').removeClass('is-selected');
    $target.addClass('is-selected');
  });
  
});
