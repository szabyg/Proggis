// Generated by CoffeeScript 1.3.1
(function() {

  jQuery(document).ready(function() {
    return jQuery('#importSpreadsheetButton').click(function() {
      return jQuery.get("dialogs/uploadSpreadsheet.html", function(importForm) {
        var dialogEl, form, submitCallback;
        dialogEl = jQuery(document.createElement("div"));
        dialogEl.addClass("uploadSpreadsheet");
        dialogEl.attr("title", "Upload data");
        jQuery('body').append(dialogEl);
        jQuery(dialogEl).html(importForm);
        form = jQuery("#upload", dialogEl);
        jQuery('.uploadSpreadsheet').dialog({
          width: 550,
          close: function() {
            jQuery('.uploadSpreadsheet').dialog("destroy");
            return jQuery('.uploadSpreadsheet').remove();
          }
        });
        submitCallback = function(form) {
          var doc;
          doc = {
            "@type": "execution",
            start: (new Date()).toJSON(),
            state: "data_received"
          };
          return Proggis.db.saveDoc(doc, {
            success: function(newDoc) {
              $("input[name='_rev']", form).val(doc._rev);
              return form.ajaxSubmit({
                url: Proggis.db.uri + $.couch.encodeDocId(doc._id),
                success: function(resp) {
                  return Proggis.db.openDoc(doc._id, {
                    success: function(newDoc) {
                      newDoc.workflow = $('#workflowSelector').val();
                      return Proggis.db.saveDoc(newDoc, {
                        success: function(res) {
                          console.log("Execution document saved:", newDoc);
                          return jQuery(dialogEl).dialog("close");
                        }
                      });
                    }
                  });
                }
              });
            },
            error: function(err) {
              console.error(err);
              return callback(err);
            },
            beforeSend: function() {
              return this.data;
            }
          });
        };
        return $(form).submit(function(e) {
          var data;
          e.preventDefault();
          form.find("div.error").remove().end().find(".error").removeClass("error");
          data = {};
          $.each($("form :input", form).serializeArray(), function(i, field) {
            return data[field.name] = field.value;
          });
          $("form :file", form).each(function() {
            return data[this.name] = this.value;
          });
          submitCallback(form);
          return false;
        });
      });
    });
  });

}).call(this);
