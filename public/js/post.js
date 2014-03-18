var editor = new wysihtml5.Editor("wysihtml5-editor", {
  toolbar:     "wysihtml5-editor-toolbar",
  stylesheets: ["http://yui.yahooapis.com/2.9.0/build/reset/reset-min.css", "vendor/wysihtml5/css/editor.css"],
  parserRules: wysihtml5ParserRules
});

editor.on("load", function() {
  var composer = editor.composer,
    h1 = editor.composer.element.querySelector("h1");
  if (h1) {
    composer.selection.selectNode(h1);
  }
});

$('#upload-image').change(function() {
  $('#post-form').ajaxSubmit({
    url: '/uploadImage',
    type: 'POST',
    dataType: 'json',
    success: function(result) {
      if(result) {
        var imagePath200 = 'http://' + location.host + '/' + result.base_path + '580_' + result.image;
        $('#image_path').val(imagePath200);
      }
    }
  });
});