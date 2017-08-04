import $ from './jquery';

$(() => {
  const $body = $('body');
  
  $('.form--select-appointment').each((idx,elem) => {
    const $form = $(elem),
          $datepicker = $form.find('#datepicker'),
          $timepicker = $form.find('.timepicker'),
          $datepickerInfo = $form.find('.datepicker-info'),
          $frmDate = $form.find('[name=Date]'),
          $frmTimes = $form.find('[name=Times]'),
          $frmPostCode = $form.find('[name=PostCode]'),
          $frmHouseNumber = $form.find('[name=HouseNumber]'),
          $frmAddition = $form.find('[name=Addition]'),
          $inputs = [$frmHouseNumber, $frmPostCode, $frmAddition].reduce((output, val) => output.add(val), $());

    let dateVal = $frmDate.val();
    $datepicker.datepicker({
      altField: $frmDate,
      altFormat: 'yy-mm-dd',
      dateFormat: 'DD dd MM yy',
      minDate: 1,
    });
    $datepicker.on("change",function(){
    
    });
    if (dateVal)
    {
      let dateFormat = $datepicker.datepicker('option','dateFormat');
      $datepicker.datepicker('option','dateFormat','yy-mm-dd');
      $datepicker.datepicker('setDate',dateVal);
      $datepicker.datepicker('option','dateFormat',dateFormat);
      $datepickerInfo.trigger('dateinfo.setDate',dateVal);
    }
    
    $inputs.on('change', (event) => {
      $datepicker.datepicker('option','disabled',!($frmPostCode.val() && $frmHouseNumber.val()));
      $datepicker.toggleClass('is-disabled',!($frmPostCode.val() && $frmHouseNumber.val()));
      if (! $datepicker.hasClass('is-disabled'))
        $frmDate.trigger('change');
    });
  
    $datepicker.on('change', (event) => {
      $datepickerInfo.trigger('dateinfo.setDate', $frmDate.val());
      $frmTimes.val('').trigger('change',['']);
      $.get('/api/availability', {
        Date: $frmDate.val(),
        PostCode: $frmPostCode.val(),
        HouseNumber: $frmHouseNumber.val(),
        Addition: $frmAddition.val()
      }).then(timeSlots => {
        $timepicker.trigger('timepicker.setTimes',[timeSlots]);
      }).catch(error => {
        console.log('error',error);
      });
    });
  
    $frmTimes.on('change',(event, times) => {
      $datepickerInfo.trigger('dateinfo.setTimes',[times && times.split('|')]);
    });
  
    $datepickerInfo
      .trigger('dateinfo.setTimes',$frmTimes.val())
      .trigger('dateinfo.setDate',$frmDate.val());
    $frmPostCode.trigger('change');
    
    $form.on('submit', (event) => {
      event.preventDefault();
      $.post(location.href, $form.serializeArray())
        .then(response => {
          if (response.success)
            location.href = $form.attr('action');
        })
        .catch(error => $body.trigger('show.modal',['error',error.responseJSON]));
    })
    
    
  });
  
  
  
});
