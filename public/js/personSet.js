var PersonSet = (function() {

  var _initUploadImg = function() {
    $('.edit-user-img .btn').click(function() {
      $(this).parent().find('input').trigger('click');
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