// Generated by CoffeeScript 1.3.3
var ChartLine;

ChartLine = (function() {

  function ChartLine(options) {
    var _ref, _ref1, _ref2, _ref3, _ref4;
    this.title = options.title;
    this.id = options.id;
    this.W = (_ref = options.width) != null ? _ref : 1000;
    this.H = (_ref1 = options.height) != null ? _ref1 : 400;
    this.ll = options.label_left;
    this.lb = options.label_bottom;
    this.data = options.data;
    this.average = options.average;
    this.R = (_ref2 = options.ratio) != null ? _ref2 : 0.618;
    this.digit = (_ref3 = options.digit) != null ? _ref3 : 6;
    this.Z = (_ref4 = options.zoom) != null ? _ref4 : this.W / 1000;
  }

  ChartLine.prototype.draw = function() {
    var F, avg, cali, fonts, gpath, h, height, i, lb_y, line, lr_x, lr_y, paper, path, txt, v, w, x, x0, y, y0, _base, _base1, _base2, _fn, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _n, _o, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results,
      _this = this;
    F = Math.pow(10, this.digit);
    w = this.R * this.W;
    h = this.R * this.H;
    x0 = (1 - this.R) / 2 * this.W;
    y0 = (1 - this.R) / 2 * this.H;
    height = this.ll.max - this.ll.min;
    cali = w / this.data.length;
    paper = Raphael(this.id, this.W, this.H);
    fonts = {
      'font-weight': 'bold',
      'font-family': "'MS Gothic','sans-serif'"
    };
    this.ll.max = Number(this.ll.max);
    this.ll.min = Number(this.ll.min);
    if ((_ref = (_base = this.ll).cali) == null) {
      _base.cali = 5;
    }
    if ((_ref1 = (_base1 = this.average[0]).color) == null) {
      _base1.color = '#0099cc';
    }
    if ((_ref2 = (_base2 = this.average[1]).color) == null) {
      _base2.color = '#ff9900';
    }
    paper.text(this.W / 2, y0 / 2, this.title.string).attr(fonts).attr({
      fill: '#3366CC',
      'font-size': 16 * this.Z,
      'font-weight': 'bold'
    }).attr(this.title.option);
    for (i = _i = 0, _ref3 = this.ll.cali; 0 <= _ref3 ? _i <= _ref3 : _i >= _ref3; i = 0 <= _ref3 ? ++_i : --_i) {
      y = y0 + h * (this.ll.cali - i) / this.ll.cali;
      txt = (this.ll.min + (this.ll.max - this.ll.min) / this.ll.cali * i).toFixed(this.digit);
      paper.text(x0 * 3 / 4, y, txt).attr(fonts).attr({
        'font-size': 14 * this.Z,
        'text-anchor': "end"
      });
    }
    lr_x = (x0 + w) * 1.01;
    lr_y = y0;
    _ref4 = this.average;
    for (_j = 0, _len = _ref4.length; _j < _len; _j++) {
      v = _ref4[_j];
      paper.rect(lr_x, lr_y, 12 * this.Z, 12 * this.Z).attr({
        fill: v.color,
        stroke: ''
      });
      paper.text(lr_x + 16 * this.Z, lr_y + 6 * this.Z, v.string).attr(fonts).attr({
        fill: v.color,
        'font-size': 14 * this.Z,
        'text-anchor': "start"
      });
      lr_y += 16 * this.Z;
    }
    lb_y = 1.5 * y0 + h;
    for (i = _k = 0, _ref5 = this.lb.length - 1; 0 <= _ref5 ? _k <= _ref5 : _k >= _ref5; i = 0 <= _ref5 ? ++_k : --_k) {
      x = x0 + w / (this.lb.length - 1) * i;
      paper.text(x, lb_y, this.lb[i]).attr(fonts).attr({
        'font-size': 12 * this.Z
      });
    }
    gpath = "";
    _ref6 = this.data;
    _fn = function() {
      var cv_avg0, cv_avg1, cx, cy, cy_avg0, cy_avg1, date, show, value;
      date = line[0];
      value = line[1];
      cx = x0 + cali * i + cali / 2;
      cy = y0 + (_this.ll.max - value) / height * h;
      cy_avg0 = y0 + (_this.ll.max - _this.average[0].values[i]) / height * h;
      cy_avg1 = y0 + (_this.ll.max - _this.average[1].values[i]) / height * h;
      cv_avg0 = _this.average[0].string + ':' + _this.average[0].values[i];
      cv_avg1 = _this.average[1].string + ':' + _this.average[1].values[i];
      if (gpath) {
        gpath += "L " + cx + " " + cy + " ";
      } else {
        gpath = "M " + cx + " " + cy + " ";
      }
      show = "";
      return paper.rect(x0 + cali * i, y0, cali, h).attr({
        fill: "#FFF",
        'fill-opacity': 0,
        stroke: ''
      }).mouseover(function() {
        txt = '日付:' + date + '\n' + '現在値:' + value + '\n' + cv_avg0 + '\n' + cv_avg1;
        return show = paper.set(paper.circle(cx, cy, 4 * _this.Z).attr({
          fill: '#3366CC',
          stroke: ''
        }).toBack(), paper.circle(cx, cy_avg0, 4 * _this.Z).attr({
          fill: _this.average[0].color,
          stroke: ''
        }).toBack(), paper.circle(cx, cy_avg1, 4 * _this.Z).attr({
          fill: _this.average[1].color,
          stroke: ''
        }).toBack(), paper.path("M " + cx + " " + y0 + "L " + cx + " " + (y0 + h)).attr({
          fill: '#CC0000',
          stroke: '#CC0000'
        }).toBack(), paper.rect(cx - 40 * _this.Z, y0 + h, 80 * _this.Z, 20 * _this.Z).attr({
          fill: "#CC0000",
          stroke: ''
        }), paper.text(cx, y0 + h + 10 * _this.Z, date).attr(fonts).attr({
          fill: '#FFF',
          'font-size': 12 * _this.Z
        }), paper.rect(cx + 15 * _this.Z, cy - 40 * _this.Z, 120 * _this.Z, 80 * _this.Z, 5 * _this.Z).attr({
          fill: '#CC0000',
          stroke: "#FFF",
          'stroke-width': 2,
          'fill-opacity': 0.8
        }), paper.text(cx + 20 * _this.Z, cy, txt).attr(fonts).attr({
          'font-size': 12 * _this.Z,
          'fill': "#FFF",
          'font-weight': 'bold',
          'text-anchor': "start"
        }));
      }).mouseout(function() {
        return show.remove();
      });
    };
    for (i = _l = 0, _len1 = _ref6.length; _l < _len1; i = ++_l) {
      line = _ref6[i];
      if (!line[1]) {
        continue;
      }
      _fn();
    }
    paper.path(gpath).attr({
      'stroke': '#3366CC',
      'stroke-width': 2
    }).toBack();
    _ref7 = this.average;
    for (_m = 0, _len2 = _ref7.length; _m < _len2; _m++) {
      avg = _ref7[_m];
      path = "";
      _ref8 = avg.values;
      for (i = _n = 0, _len3 = _ref8.length; _n < _len3; i = ++_n) {
        v = _ref8[i];
        if (!v) {
          continue;
        }
        x = x0 + cali * i + cali / 2;
        y = y0 + (this.ll.max - v) / height * h;
        if (path) {
          path += "L " + x + " " + y + " ";
        } else {
          path = "M " + x + " " + y + " ";
        }
      }
      paper.path(path).attr({
        "stroke": avg.color,
        "stroke-width": 1,
        'stroke-dasharray': '- '
      }).toBack();
    }
    _results = [];
    for (i = _o = 0, _ref9 = this.ll.cali; 0 <= _ref9 ? _o <= _ref9 : _o >= _ref9; i = 0 <= _ref9 ? ++_o : --_o) {
      x = x0 + w;
      y = y0 + h * i / this.ll.cali;
      _results.push(paper.path("M " + x0 + " " + y + " " + "L " + x + " " + y).attr("stroke", "#ccc").toBack());
    }
    return _results;
  };

  return ChartLine;

})();
