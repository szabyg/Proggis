// Generated by CoffeeScript 1.3.1
(function() {
  var renderDetails,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Backbone.couch_connector.config.db_name = "proggis20";

  Backbone.couch_connector.config.ddoc_name = "Proggis2";

  Proggis.Deliverable = Backbone.Model.extend({
    initialize: function() {
      console.info("New Delverable initialized", this.toJSON());
      return this.set;
    },
    url: function() {
      return "http://iks-project.eu/deliverable/" + (this.get('id'));
    },
    getStatusDocs: function(cb) {
      var _this = this;
      return jQuery.couch.db(Backbone.couch_connector.config.db_name).view("" + Backbone.couch_connector.config.ddoc_name + "/deliverableStatus", {
        key: this.get('id'),
        success: function(res) {
          var hash;
          console.info('statusDocs', res);
          return cb((function() {
            var _i, _len, _ref, _results;
            _ref = res.rows;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              hash = _ref[_i];
              _results.push(new Proggis.DeliverableStatus(hash.value));
            }
            return _results;
          })());
        }
      });
    },
    getTitle: function() {
      var deliverableRegex, properties, shortName, _ref;
      deliverableRegex = new RegExp(/([.|\d]*).$/);
      properties = this.toJSON();
      shortName = (_ref = deliverableRegex.exec(properties.id)) != null ? _ref[1] : void 0;
      return "D " + shortName + " " + properties.name;
    }
  });

  Proggis.DeliverableView = Backbone.View.extend({
    initialize: function() {
      console.info("DeliverableView initialized");
      return this.render();
    },
    template: "<h1 class=\"title\"><%= title %></h1>\n<div class=\"description\"><%= description %></div>\n<div class=\"details\">\n</div>\n<h2>Status</h2>\n<div class='status'/>\n<div class='newStatus'/>",
    render: function() {
      var deliverableHash, newStatusEl, statusEl, tmpl,
        _this = this;
      deliverableHash = this.model.toJSON();
      deliverableHash.title = this.model.getTitle();
      console.info("deliverable hash", deliverableHash);
      tmpl = _.template(this.template, deliverableHash);
      this.$el.html(tmpl);
      jQuery('.details', this.$el).append(renderDetails(deliverableHash, [["Assignee", "assignee"], ['Due', 'milestone']], [['Dissemination', 'dissem'], ['Nature', 'nature'], ['RDIVM', 'rdivm']]));
      statusEl = jQuery('.status', this.$el);
      this.model.getStatusDocs(function(statusModels) {
        var status, statusHash, statusModelTemplate, _i, _len;
        console.info("Status models", statusModels);
        statusModels = _(statusModels).sortBy(function(model) {
          return model.get('timestamp');
        });
        statusModels = statusModels.reverse();
        if (statusModels[0]) {
          _this.newStatusView.load(statusModels[0]);
        }
        statusModelTemplate = _.template("<p>The Status of <strong><%= title %> is <strong><%= statusLabel %></strong> since <span class=\"date\" title=\"<%= statusAwarded %>\"><%= statusAwarded %></span>. See the <a href=\"<%= location %>\" target=\"_blank\">repository</a>.</p>");
        deliverableHash = _this.model.toJSON();
        for (_i = 0, _len = statusModels.length; _i < _len; _i++) {
          status = statusModels[_i];
          statusHash = status.toJSON();
          statusHash.statusLabel = _.detect(Proggis.deliveryStatusValues, function(stat) {
            return stat.value === statusHash.status;
          }).label;
          statusHash.title = _this.model.getTitle();
          statusEl.append(statusModelTemplate(statusHash));
        }
        return jQuery('.date', statusEl).each(function() {
          return jQuery(this).prettyDate();
        });
      });
      newStatusEl = jQuery('.newStatus', this.$el);
      this.newStatusView = new Proggis.DeliverableStatusEditorView({
        el: newStatusEl
      });
      return this.newStatusView.deliverableView = this;
    }
  });

  Proggis.DeliverableStatus = Backbone.Model.extend({
    initialize: function() {
      var _this = this;
      console.info("DeliverableStatus created");
      return this.bind("error", function(model, error) {
        return console.error("DeliverableStatus error", model, error);
      });
    },
    url: function() {
      return "http://iks-project.eu/deliverablestatus/" + this.id;
    },
    defaults: {
      '@type': 'deliverableStatus',
      timestamp: new Date()
    },
    validate: function(attributes) {
      var _ref;
      if (_ref = attributes.status, __indexOf.call(this._getAcceptedStatuses(), _ref) < 0) {
        return "'" + attributes.status + "' isn not an allowed value for delivery status";
      }
    },
    _getAcceptedStatuses: function() {
      return _.pluck(Proggis.deliveryStatusValues, 'value');
    }
  });

  Proggis.deliveryStatusValues = [
    {
      value: "wip",
      label: "Work in Progress"
    }, {
      value: "due",
      label: "Delivery Due"
    }, {
      value: "overdue",
      label: "Delivery Overdue"
    }, {
      value: "submitted",
      label: "Submitted for Review"
    }, {
      value: "accepted",
      label: "Reviewed and Signed Off"
    }, {
      value: "accepttedsubjectto",
      label: "Reviewed and Accepted Subject to Modifications"
    }, {
      value: "rejected",
      label: "Reviewed and Rejected"
    }
  ];

  Proggis.DeliverableStatusEditorView = Backbone.View.extend({
    initialize: function() {
      return this.render();
    },
    render: function() {
      var compiled, template;
      console.info('render in', this.$el);
      template = "<table>\n  <tr>\n    <td>\n      <span><strong>Status *</strong></span>\n    </td><td>\n      <select class='status'>\n        <option value=''/>\n        <% _.each(Proggis.deliveryStatusValues, function(statusValue){ %> <option value=\"<%= statusValue.value %>\"><%= statusValue.label %> </option> <% }); %>\n      </select>\n    </td>\n  </tr>\n    <tr>\n      <td>\n        Deliverable location\n      </td><td>\n        <input class='location'/>\n      </td>\n    </tr>\n    <tr>\n      <td>\n        Status awarded\n      </td><td>\n        <input class='status-date' type='date'/>\n      </td>\n    </tr>\n  <tr>\n    <td>\n      Further Information\n    </td><td>\n      <div class='further-information'/>\n    </td>\n  </tr>\n  <tr>\n    <td></td>\n    <td class=\"save\">\n      <button class='save'>Save</button>\n    </td>\n  </tr>\n</table>";
      compiled = _.template(template);
      this.$el.html(compiled());
      jQuery('.further-information', this.$el).hallo({
        'halloformat': {},
        'hallolink': {}
      });
      return jQuery('button', this.$el).button();
    },
    events: {
      "click button.save": 'save'
    },
    save: function(e) {
      var model, obj,
        _this = this;
      obj = {
        status: jQuery('.status option:selected', this.$el).val(),
        location: jQuery('.location', this.$el).val(),
        furtherInformation: jQuery('.further-information').hallo('getContents'),
        deliverable: this.deliverableView.model.id,
        timestamp: new Date(),
        statusAwarded: new Date(jQuery('.status-date', this.$el).val())
      };
      this.deliverableView.model.set();
      console.info("Save", obj);
      model = new Proggis.DeliverableStatus(obj);
      return model.save({}, {
        success: function(e) {
          console.info("status saved!", e, model);
          return _this.deliverableView.render();
        },
        error: function(e) {
          return console.error("Save error", e);
        }
      });
    },
    load: function(statusModel) {
      jQuery(".status option:[value=" + (statusModel.get("status")) + "]", this.$el).attr("selected", "selected");
      jQuery('.location', this.$el).val(statusModel.get("location"));
      return jQuery('.further-information').hallo('setContents', statusModel.get("furtherInformation"));
    }
  });

  renderDetails = function(hash, fields, moreFields) {
    var field, more, res, table, _i, _j, _len, _len1,
      _this = this;
    res = jQuery("<table class='details'></table><div class='more'/>");
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      field = fields[_i];
      res.append("<tr><td>" + field[0] + "</td><td class='assignee'>" + hash[field[1]] + "</td></tr>");
    }
    more = res.filter('.more');
    if (moreFields) {
      more.append("<p><a class='more'>more</a></p><table class='details more' style='display:none;'></table>");
      jQuery('a.more', more).data('more', more).click(function(e) {
        more = jQuery(e.target).data('more');
        return jQuery('.details.more', more).toggle();
      });
      for (_j = 0, _len1 = moreFields.length; _j < _len1; _j++) {
        field = moreFields[_j];
        table = jQuery('table.details.more', more);
        table.append("<tr><td>" + field[0] + "</td><td class='assignee'>" + hash[field[1]] + "</td></tr>");
        jQuery('.details.more', more);
      }
    }
    return res;
  };

}).call(this);
