// Generated by CoffeeScript 1.3.1
(function() {

  (function(jQuery) {
    return jQuery.widget("IKS.halloheadings", {
      options: {
        editable: null,
        toolbar: null,
        uuid: "",
        headers: [1, 2, 3]
      },
      _create: function() {
        var button, buttonize, buttonset, header, id, label, widget, _i, _len, _ref,
          _this = this;
        widget = this;
        buttonset = jQuery("<span></span>");
        id = "" + this.options.uuid + "-#paragraph";
        label = "P";
        buttonset.append(jQuery("<input id=\"" + id + "\" type=\"radio\" /><label for=\"" + id + "\">" + label + "</label>").button());
        button = jQuery("#" + id, buttonset);
        button.attr("hallo-command", "removeFormat");
        button.bind("change", function(event) {
          var cmd;
          cmd = jQuery(this).attr("hallo-command");
          alert(cmd);
          return widget.options.editable.execute(cmd);
        });
        buttonize = function(headerSize) {
          label = "H" + headerSize;
          id = "" + _this.options.uuid + "-" + headerSize;
          buttonset.append(jQuery("<input id=\"" + id + "\" type=\"radio\" /><label for=\"" + id + "\">" + label + "</label>").button());
          button = jQuery("#" + id, buttonset);
          button.attr("hallo-size", "H" + headerSize);
          return button.bind("change", function(event) {
            var size;
            size = jQuery(this).attr("hallo-size");
            return widget.options.editable.execute("formatBlock", size);
          });
        };
        _ref = this.options.headers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          header = _ref[_i];
          buttonize(header);
        }
        buttonset.buttonset();
        return this.options.toolbar.append(buttonset);
      },
      _init: function() {}
    });
  })(jQuery);

}).call(this);