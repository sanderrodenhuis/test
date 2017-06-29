import $ from './jquery'
import 'jquery-ui'
import 'jquery-datepicker'


/*
 todo: clean up later
 */
const $datepicker = $( "#datepicker" );
$datepicker.datepicker({
  closeText: "Sluiten",
  prevText: "<",
  nextText: ">",
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
  const selectedDate = $(this).val();
  const $datepickerContainer = $(this).closest('.datepicker__container');

  $datepickerContainer.find('.datepicker-info__date').html(selectedDate);


});
$('body').on('click','.time-list__link',(event) => {
  event.preventDefault();
  const $target = $(event.target),
    $datepickerContainer = $target.closest('.datepicker__container'),
    $targetValue = $(event.target).text();
  if($target.hasClass('is-active')) {
    $datepickerContainer.find('.datepicker-info__time').html($targetValue);
  }
});

