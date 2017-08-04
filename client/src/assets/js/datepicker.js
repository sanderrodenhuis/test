import $ from './jquery';

$(() => {
  $.datepicker.setDefaults({
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
    dateFormat: 'dd/mm/yy',
    firstDay: 0,
    minDate: 0,
    isRTL: false,
    showOtherMonths: true,
    showMonthAfterYear: false,
    yearSuffix: ""
  });
});
