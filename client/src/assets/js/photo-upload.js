import $ from './jquery';

$(() => {
  const $body = $('body'),
        $counter = $('.photo-upload__counter'),
        maxPhotos = 4;
  
  $('.photo-upload').each((idx, elem) => {
    const $photoUpload = $(elem),
          $container = $photoUpload.find('.photo-upload__container'),
          $dropzone = $photoUpload.find('.photo-upload__dropzone'),
          $input = $photoUpload.find('.photo-upload__input'),
          $progressBarInner = $photoUpload.find('.photo-upload__progress-bar-inner');
    
    $body.on('dragover dragenter', () => {
      $photoUpload.addClass('is-highlighted')
    });
    $body.on('dragleave dragend drop', () => {
      $photoUpload.removeClass('is-highlighted');
    });
    
    $photoUpload.on('click','.photo-upload__thumbnail-remove', (event) => {
      event.preventDefault();
      let $this = $(event.target),
          $thumbnail = $this.closest('.photo-upload__thumbnail');
      $thumbnail.remove();
      updateCounter();
    });
    
    
    $dropzone.on('drop', (event) => {
      event.preventDefault();
      const files = Array.from(event.originalEvent.dataTransfer.files);
      uploadFiles(files);
    });
    $input.on('change', (event) => {
      const files = Array.from(event.target.files);
      uploadFiles(files);
      $input.val('');
    });
    
    const updateCounter = () => {
      const count = $container.children('.photo-upload__thumbnail').length;
      $counter.text(count);
      $dropzone.show();
      if (count >= maxPhotos)
      {
        $dropzone.hide();
      }
    };
    
    const uploadFiles = (files) => {
      if ($container.children('.photo-upload__thumbnail').length + files.length > maxPhotos)
      {
        $body.trigger('show.modal',['upload-error',{message: 'Er mogen maximaal '+maxPhotos+' fotos worden bijgevoegd'}]);
        return;
      }
      let formData = new FormData();
      files.forEach(file => {
        formData.append('file', file);
      });
      let $prmsUpload = $.ajax({
        url: '/api/file/upload',
        data: formData,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        xhr: function () {
          let xhr = new XMLHttpRequest();
          
          this.progress && xhr.upload && xhr.upload.addEventListener('progress', this.progress);
          return xhr;
        },
        progress: (event) => {
          const p = 100 * (event.loaded / event.total);
          $progressBarInner.css({
            width: p + '%'
          });
        }
      });
      
      $photoUpload.addClass('is-uploading');
      $progressBarInner.css({width: 0});
      
      
      $prmsUpload.then(({files}) => {
        $photoUpload.removeClass('is-uploading');
          files.forEach(({path, filename}) => {
          $container.append(`<div class="photo-upload__thumbnail" style="background-image: url('${path + filename}')">
                            <a href="#" class="photo-upload__thumbnail-remove"></a>
                            <input type="hidden" name="Photos" value="${filename}" />
                          </div>`)
        });
        updateCounter();
      }).catch((res) => {
        $photoUpload.removeClass('is-uploading');
        let error = {error: 'Error', 'message': 'Er is iets misgegaan bij het uploaden'};
        try {
          error = res.responseJSON;
        } catch (e) {};
        $body.trigger('show.modal',['error',error])
      });
    }
  });
  
  $body.on('dragover', (event) => {
    event.preventDefault();
  })
});
