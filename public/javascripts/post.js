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
  $('#upload-image-form').ajaxSubmit({
    url: '/uploadImage',
    type: 'POST',
    dataType: 'json',
    success: function(result) {
      console.log(result);
    }
  });
})