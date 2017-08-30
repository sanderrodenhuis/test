import $ from './jquery';

$(() => {
  const days = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'],
      months = [ "Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December" ];
  
  $('.datepicker-info').each((idx,elem) => {
    let $info = $(elem),
        date,
        times;
    $info.on('dateinfo.setDate', (event,_date) => {
      if (typeof(_date) === 'string')
        _date = _date.length ? new Date(_date + 'T12:00:00') : undefined;
      date = _date;
      $info.trigger('dateinfo.refresh');
    });
    $info.on('dateinfo.setTimes', (event, _times) => {
      if (typeof(_times) === 'string')
        _times = _times.length ? _times.split('|') : undefined;
      times = _times
      $info.trigger('dateinfo.refresh');
  
    });
    
    $info.on('dateinfo.refresh',(event) => {
      if ((! date) && (! times))
        return $info.addClass('is-hidden');
      let html = ['Geselecteerd:'];
      if (date)
        html.push( '<span class="datepicker-info__date">' + [days[date.getDay()], date.getDate(), months[date.getMonth()]].join(' ') + '</span>');

      if (times)
        html.push( 'tussen <span class="datepicker-info__time">' + times.join(' en ') + '</span> uur');
      
      $info.removeClass('is-hidden').html(html.join(' '));
    });
    $info.addClass('is-hidden').html('');
  });
});
