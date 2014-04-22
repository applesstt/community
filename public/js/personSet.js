var PersonSet = (function() {

  var _initUploadImg = function() {
    $('.edit-user-img-btn .btn').click(function() {
      $(this).parent().find('input').trigger('click');
    });
    $('.edit-user-img-btn input').change(function() {
      $('#upload-form').ajaxSubmit({
        url: '/uploadImage',
        type: 'POST',
        dataType: 'json',
        success: function(result) {
          if(result) {
            var imagePath200 = 'http://' + location.host + result.base_path + '200_' + result.image;
            $('#image-200').attr('src', imagePath200);
            $('#resize-user-img-btn').trigger('click');
          }
        }
      })
    })
  };

  var init = function() {
    _initUploadImg();
  };

  return {
    init: init
  }
}).call(this);

$(function() {
  PersonSet.init();
})