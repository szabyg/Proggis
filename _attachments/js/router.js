// Generated by CoffeeScript 1.3.1
(function() {
  var Proggis, _ref;

  Proggis = (_ref = window.Proggis) != null ? _ref : window.Proggis = {};

  Proggis.RouterClass = Backbone.Router.extend({
    routes: {
      "": "home",
      "planning/": "planning",
      "planning/partner/": "planningPartner",
      "planning/wbs/:wbs/": "planningWbs",
      "planning/wbs/:wbs/partner/": "planningWbsPartner",
      "monitoring/": "monitoring",
      "monitoring/partner/": "monitoringPartner",
      "monitoring/wbs/:wbs/": "monitoringWbs",
      "monitoring/wbs/:wbs/partner/": "monitoringWbsPartner",
      "execution/:execId/": "execution"
    },
    home: function() {
      Proggis.viewName.html("IKS Project controlling Dashboard");
      Proggis.graph.show();
      Proggis.Chart.legendClear($(".legend"));
      return Proggis.Chart.loadFlotChart("ProjectOverTime", 3);
    },
    planning: function() {
      Proggis.viewName.html("Project plan over time");
      Proggis.graph.show();
      this._setPartnerOption("Time");
      return this._planning();
    },
    planningPartner: function() {
      Proggis.viewName.html("Project plan over partners");
      Proggis.graph.show();
      this._setPartnerOption("Partner");
      return this._planning();
    },
    planningWbs: function(wbs) {
      Proggis.viewName.html("Project plan over time for WP " + wbs);
      Proggis.graph.show();
      this._setPartnerOption("Time");
      return this._planningWbs(wbs);
    },
    planningWbsPartner: function(wbs) {
      Proggis.viewName.html("Project plan over partners for WP " + wbs);
      Proggis.graph.show();
      this._setPartnerOption("Partner");
      return this._planningWbs(wbs);
    },
    _planning: function() {
      var chartSelected;
      console.log("planning");
      chartSelected = this._getPartnerOption();
      switch (chartSelected) {
        case "byTime":
          Proggis.Chart.init("AreaChart", function(node) {
            var key;
            if (!node) {
              return;
            }
            key = node.name.match(/([0-9]+)/g)[0];
            console.log("planning change to", key);
            return Proggis.router.navigate("planning/wbs/" + key + "/", true);
          });
          return Proggis.Chart.loadChart("EffortAllocTime", 3);
        case "byPartner":
          Proggis.Chart.init("BarChart", function(node) {
            var key;
            if (!node) {
              return;
            }
            key = node.name.match(/([0-9]+)/g)[0];
            console.log("planning change to", key);
            return Proggis.router.navigate("planning/wbs/" + key + "/partner/", true);
          });
          return Proggis.Chart.loadChart("EffortAllocPartner", 2);
      }
    },
    _planningWbs: function(wbs) {
      var chartSelected;
      console.log("planningWbs", wbs);
      chartSelected = this._getPartnerOption();
      switch (chartSelected) {
        case "byTime":
          Proggis.Chart.init("AreaChart", function(node) {
            var key, route;
            if (!node) {
              return;
            }
            key = node.name.match(/([0-9]+)/g)[0];
            console.log("planning change to", key);
            route = "planning/wbs/" + key + "/";
            if (chartSelected === "isPartner") {
              route += "partner";
            }
            return Proggis.router.navigate(route, true);
          });
          Proggis.Chart.loadChart("EffortAllocTime", 4, wbs);
          break;
        case "byPartner":
          Proggis.Chart.init("BarChart", function(node) {
            var key, route;
            if (!node) {
              return;
            }
            key = node.name.match(/([0-9]+)/g)[0];
            console.log("planning change to", key);
            route = "planning/wbs/" + key + "/";
            if (chartSelected === "isPartner") {
              route += "partner";
            }
            return Proggis.router.navigate(route, true);
          });
          Proggis.Chart.loadChart("EffortAllocPartner", 3, wbs);
      }
      return console.log("wbs " + wbs);
    },
    _setPartnerOption: function(byWhat) {
      jQuery("[name=chartSelector][value=by" + byWhat + "]").each(function() {
        return this.checked = true;
      });
      return jQuery("[name=chartSelector][value!=by" + byWhat + "]").each(function() {
        return this.checked = false;
      });
    },
    _getPartnerOption: function() {
      return jQuery('[name=chartSelector]').filter(function() {
        return jQuery(this).is(":checked");
      }).val();
    },
    monitoring: function() {
      Proggis.viewName.html("Project monitoring over time");
      Proggis.graph.show();
      this._setPartnerOption("Time");
      return this._monitoring();
    },
    monitoringPartner: function() {
      Proggis.viewName.html("Project monitoring over partners");
      Proggis.graph.show();
      this._setPartnerOption("Partner");
      return this._monitoring();
    },
    monitoringWbs: function(wbs) {
      Proggis.viewName.html("Project monitoring over time for WP " + wbs);
      Proggis.graph.show();
      this._setPartnerOption("Time");
      return this._monitoringWbs(wbs);
    },
    monitoringWbsPartner: function(wbs) {
      Proggis.viewName.html("Project monitoring over partners for WP " + wbs);
      Proggis.graph.show();
      this._setPartnerOption("Partner");
      return this._monitoringWbs(wbs);
    },
    _monitoring: function() {
      var chartSelected;
      console.log("monitoring");
      chartSelected = this._getPartnerOption();
      switch (chartSelected) {
        case "byTime":
          Proggis.Chart.init("BarChart", function(node) {
            var key;
            if (!node) {
              return;
            }
            key = node.name.match(/([0-9]+)/g)[0];
            console.log("monitoring change to", key);
            return Proggis.router.navigate("monitoring/wbs/" + key + "/", true);
          });
          return Proggis.Chart.loadChart("EffortTime", 3);
        case "byPartner":
          Proggis.Chart.init("BarChart", function(node) {
            var key;
            if (!node) {
              return;
            }
            key = node.name.match(/([0-9]+)/g)[0];
            console.log("monitoring change to", key);
            return Proggis.router.navigate("monitoring/wbs/" + key + "/partner/", true);
          });
          return Proggis.Chart.loadChart("EffortPartner", 2);
      }
    },
    _monitoringWbs: function(wbs) {
      var chartSelected;
      console.log("monitoringWbs", wbs);
      chartSelected = this._getPartnerOption();
      switch (chartSelected) {
        case "byTime":
          Proggis.Chart.init("BarChart", function(node) {
            var key, route;
            if (!node) {
              return;
            }
            key = node.name.match(/([0-9]+)/g)[0];
            console.log("monitoring change to", key);
            route = "monitoring/wbs/" + key + "/";
            if (chartSelected === "isPartner") {
              route += "partner";
            }
            return Proggis.router.navigate(route, true);
          });
          Proggis.Chart.loadChart("EffortTime", 4, wbs);
          break;
        case "byPartner":
          Proggis.Chart.init("BarChart", function(node) {
            var key, route;
            if (!node) {
              return;
            }
            key = node.name.match(/([0-9]+)/g)[0];
            console.log("monitoring change to", key);
            route = "monitoring/wbs/" + key + "/";
            if (chartSelected === "isPartner") {
              route += "partner";
            }
            return Proggis.router.navigate(route, true);
          });
          Proggis.Chart.loadChart("EffortPartner", 3, wbs);
      }
      return console.log("wbs " + wbs);
    },
    execution: function(execId) {
      return Proggis.Info.showDocsByExecId(execId);
    }
  });

  jQuery(document).ready(function() {
    Proggis.router = new Proggis.RouterClass;
    Proggis.router.bind("all", Proggis.Navigation.handleRouteChange);
    Proggis.router.bind("all", Proggis.Info.show);
    Proggis.router.bind("all", Proggis.showEditableDescription);
    Backbone.history.start();
    return jQuery('[name=chartSelector]').change(function() {
      var selected;
      selected = jQuery('[name=chartSelector]').filter(function() {
        return jQuery(this).is(":checked");
      }).val();
      console.log("changed to " + selected);
      switch (selected) {
        case "byTime":
          return Proggis.router.navigate(window.location.hash.replace("partner/", ""), true);
        case "byPartner":
          return Proggis.router.navigate("" + window.location.hash + "partner/", true);
      }
    });
  });

}).call(this);
