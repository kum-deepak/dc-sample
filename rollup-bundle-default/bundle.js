(function () {
  'use strict';

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function bisector(compare) {
    if (compare.length === 1) compare = ascendingComparator(compare);
    return {
      left: function(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }
    };
  }

  function ascendingComparator(f) {
    return function(d, x) {
      return ascending(f(d), x);
    };
  }

  var ascendingBisect = bisector(ascending);
  var bisectRight = ascendingBisect.right;

  function descending(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }

  function extent(values, valueof) {
    var n = values.length,
        i = -1,
        value,
        min,
        max;

    if (valueof == null) {
      while (++i < n) { // Find the first comparable value.
        if ((value = values[i]) != null && value >= value) {
          min = max = value;
          while (++i < n) { // Compare the remaining values.
            if ((value = values[i]) != null) {
              if (min > value) min = value;
              if (max < value) max = value;
            }
          }
        }
      }
    }

    else {
      while (++i < n) { // Find the first comparable value.
        if ((value = valueof(values[i], i, values)) != null && value >= value) {
          min = max = value;
          while (++i < n) { // Compare the remaining values.
            if ((value = valueof(values[i], i, values)) != null) {
              if (min > value) min = value;
              if (max < value) max = value;
            }
          }
        }
      }
    }

    return [min, max];
  }

  function range(start, stop, step) {
    start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

    var i = -1,
        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
        range = new Array(n);

    while (++i < n) {
      range[i] = start + i * step;
    }

    return range;
  }

  var e10 = Math.sqrt(50),
      e5 = Math.sqrt(10),
      e2 = Math.sqrt(2);

  function ticks(start, stop, count) {
    var reverse,
        i = -1,
        n,
        ticks,
        step;

    stop = +stop, start = +start, count = +count;
    if (start === stop && count > 0) return [start];
    if (reverse = stop < start) n = start, start = stop, stop = n;
    if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

    if (step > 0) {
      start = Math.ceil(start / step);
      stop = Math.floor(stop / step);
      ticks = new Array(n = Math.ceil(stop - start + 1));
      while (++i < n) ticks[i] = (start + i) * step;
    } else {
      start = Math.floor(start * step);
      stop = Math.ceil(stop * step);
      ticks = new Array(n = Math.ceil(start - stop + 1));
      while (++i < n) ticks[i] = (start - i) / step;
    }

    if (reverse) ticks.reverse();

    return ticks;
  }

  function tickIncrement(start, stop, count) {
    var step = (stop - start) / Math.max(0, count),
        power = Math.floor(Math.log(step) / Math.LN10),
        error = step / Math.pow(10, power);
    return power >= 0
        ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
        : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
  }

  function tickStep(start, stop, count) {
    var step0 = Math.abs(stop - start) / Math.max(0, count),
        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
        error = step0 / step1;
    if (error >= e10) step1 *= 10;
    else if (error >= e5) step1 *= 5;
    else if (error >= e2) step1 *= 2;
    return stop < start ? -step1 : step1;
  }

  function max(values, valueof) {
    var n = values.length,
        i = -1,
        value,
        max;

    if (valueof == null) {
      while (++i < n) { // Find the first comparable value.
        if ((value = values[i]) != null && value >= value) {
          max = value;
          while (++i < n) { // Compare the remaining values.
            if ((value = values[i]) != null && value > max) {
              max = value;
            }
          }
        }
      }
    }

    else {
      while (++i < n) { // Find the first comparable value.
        if ((value = valueof(values[i], i, values)) != null && value >= value) {
          max = value;
          while (++i < n) { // Compare the remaining values.
            if ((value = valueof(values[i], i, values)) != null && value > max) {
              max = value;
            }
          }
        }
      }
    }

    return max;
  }

  function min(values, valueof) {
    var n = values.length,
        i = -1,
        value,
        min;

    if (valueof == null) {
      while (++i < n) { // Find the first comparable value.
        if ((value = values[i]) != null && value >= value) {
          min = value;
          while (++i < n) { // Compare the remaining values.
            if ((value = values[i]) != null && min > value) {
              min = value;
            }
          }
        }
      }
    }

    else {
      while (++i < n) { // Find the first comparable value.
        if ((value = valueof(values[i], i, values)) != null && value >= value) {
          min = value;
          while (++i < n) { // Compare the remaining values.
            if ((value = valueof(values[i], i, values)) != null && min > value) {
              min = value;
            }
          }
        }
      }
    }

    return min;
  }

  function sum(values, valueof) {
    var n = values.length,
        i = -1,
        value,
        sum = 0;

    if (valueof == null) {
      while (++i < n) {
        if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
      }
    }

    else {
      while (++i < n) {
        if (value = +valueof(values[i], i, values)) sum += value;
      }
    }

    return sum;
  }

  var slice = Array.prototype.slice;

  function identity(x) {
    return x;
  }

  var top = 1,
      right = 2,
      bottom = 3,
      left = 4,
      epsilon = 1e-6;

  function translateX(x) {
    return "translate(" + (x + 0.5) + ",0)";
  }

  function translateY(y) {
    return "translate(0," + (y + 0.5) + ")";
  }

  function number(scale) {
    return function(d) {
      return +scale(d);
    };
  }

  function center(scale) {
    var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
    if (scale.round()) offset = Math.round(offset);
    return function(d) {
      return +scale(d) + offset;
    };
  }

  function entering() {
    return !this.__axis;
  }

  function axis(orient, scale) {
    var tickArguments = [],
        tickValues = null,
        tickFormat = null,
        tickSizeInner = 6,
        tickSizeOuter = 6,
        tickPadding = 3,
        k = orient === top || orient === left ? -1 : 1,
        x = orient === left || orient === right ? "x" : "y",
        transform = orient === top || orient === bottom ? translateX : translateY;

    function axis(context) {
      var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
          format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity) : tickFormat,
          spacing = Math.max(tickSizeInner, 0) + tickPadding,
          range = scale.range(),
          range0 = +range[0] + 0.5,
          range1 = +range[range.length - 1] + 0.5,
          position = (scale.bandwidth ? center : number)(scale.copy()),
          selection = context.selection ? context.selection() : context,
          path = selection.selectAll(".domain").data([null]),
          tick = selection.selectAll(".tick").data(values, scale).order(),
          tickExit = tick.exit(),
          tickEnter = tick.enter().append("g").attr("class", "tick"),
          line = tick.select("line"),
          text = tick.select("text");

      path = path.merge(path.enter().insert("path", ".tick")
          .attr("class", "domain")
          .attr("stroke", "currentColor"));

      tick = tick.merge(tickEnter);

      line = line.merge(tickEnter.append("line")
          .attr("stroke", "currentColor")
          .attr(x + "2", k * tickSizeInner));

      text = text.merge(tickEnter.append("text")
          .attr("fill", "currentColor")
          .attr(x, k * spacing)
          .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

      if (context !== selection) {
        path = path.transition(context);
        tick = tick.transition(context);
        line = line.transition(context);
        text = text.transition(context);

        tickExit = tickExit.transition(context)
            .attr("opacity", epsilon)
            .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d) : this.getAttribute("transform"); });

        tickEnter
            .attr("opacity", epsilon)
            .attr("transform", function(d) { var p = this.parentNode.__axis; return transform(p && isFinite(p = p(d)) ? p : position(d)); });
      }

      tickExit.remove();

      path
          .attr("d", orient === left || orient == right
              ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter : "M0.5," + range0 + "V" + range1)
              : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + ",0.5H" + range1));

      tick
          .attr("opacity", 1)
          .attr("transform", function(d) { return transform(position(d)); });

      line
          .attr(x + "2", k * tickSizeInner);

      text
          .attr(x, k * spacing)
          .text(format);

      selection.filter(entering)
          .attr("fill", "none")
          .attr("font-size", 10)
          .attr("font-family", "sans-serif")
          .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

      selection
          .each(function() { this.__axis = position; });
    }

    axis.scale = function(_) {
      return arguments.length ? (scale = _, axis) : scale;
    };

    axis.ticks = function() {
      return tickArguments = slice.call(arguments), axis;
    };

    axis.tickArguments = function(_) {
      return arguments.length ? (tickArguments = _ == null ? [] : slice.call(_), axis) : tickArguments.slice();
    };

    axis.tickValues = function(_) {
      return arguments.length ? (tickValues = _ == null ? null : slice.call(_), axis) : tickValues && tickValues.slice();
    };

    axis.tickFormat = function(_) {
      return arguments.length ? (tickFormat = _, axis) : tickFormat;
    };

    axis.tickSize = function(_) {
      return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
    };

    axis.tickSizeInner = function(_) {
      return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
    };

    axis.tickSizeOuter = function(_) {
      return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
    };

    axis.tickPadding = function(_) {
      return arguments.length ? (tickPadding = +_, axis) : tickPadding;
    };

    return axis;
  }

  function axisRight(scale) {
    return axis(right, scale);
  }

  function axisBottom(scale) {
    return axis(bottom, scale);
  }

  function axisLeft(scale) {
    return axis(left, scale);
  }

  var noop = {value: function() {}};

  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }

  function Dispatch(_) {
    this._ = _;
  }

  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }

  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
        return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
      }

      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };

  function get(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }

  var xhtml = "http://www.w3.org/1999/xhtml";

  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  function namespace(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
  }

  function creatorInherit(name) {
    return function() {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml
          ? document.createElement(name)
          : document.createElementNS(uri, name);
    };
  }

  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }

  function creator(name) {
    var fullname = namespace(name);
    return (fullname.local
        ? creatorFixed
        : creatorInherit)(fullname);
  }

  function none() {}

  function selector(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }

  function selection_select(select) {
    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function empty() {
    return [];
  }

  function selectorAll(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }

  function selection_selectAll(select) {
    if (typeof select !== "function") select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }

    return new Selection(subgroups, parents);
  }

  function matcher(selector) {
    return function() {
      return this.matches(selector);
    };
  }

  function selection_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function sparse(update) {
    return new Array(update.length);
  }

  function selection_enter() {
    return new Selection(this._enter || this._groups.map(sparse), this._parents);
  }

  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }

  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
    querySelector: function(selector) { return this._parent.querySelector(selector); },
    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
  };

  function constant(x) {
    return function() {
      return x;
    };
  }

  var keyPrefix = "$"; // Protect against keys like “__proto__”.

  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;

    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }

  function bindKey(parent, group, enter, update, exit, data, key) {
    var i,
        node,
        nodeByKeyValue = {},
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;

    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
        if (keyValue in nodeByKeyValue) {
          exit[i] = node;
        } else {
          nodeByKeyValue[keyValue] = node;
        }
      }
    }

    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) {
      keyValue = keyPrefix + key.call(parent, data[i], i, data);
      if (node = nodeByKeyValue[keyValue]) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue[keyValue] = null;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
        exit[i] = node;
      }
    }
  }

  function selection_data(value, key) {
    if (!value) {
      data = new Array(this.size()), j = -1;
      this.each(function(d) { data[++j] = d; });
      return data;
    }

    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;

    if (typeof value !== "function") value = constant(value);

    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = value.call(parent, parent && parent.__data__, j, parents),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);

      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
          previous._next = next || null;
        }
      }
    }

    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }

  function selection_exit() {
    return new Selection(this._exit || this._groups.map(sparse), this._parents);
  }

  function selection_join(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
    if (onupdate != null) update = onupdate(update);
    if (onexit == null) exit.remove(); else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
  }

  function selection_merge(selection) {

    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Selection(merges, this._parents);
  }

  function selection_order() {

    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }

    return this;
  }

  function selection_sort(compare) {
    if (!compare) compare = ascending$1;

    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }

    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }

    return new Selection(sortgroups, this._parents).order();
  }

  function ascending$1(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  function selection_nodes() {
    var nodes = new Array(this.size()), i = -1;
    this.each(function() { nodes[++i] = this; });
    return nodes;
  }

  function selection_node() {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }

    return null;
  }

  function selection_size() {
    var size = 0;
    this.each(function() { ++size; });
    return size;
  }

  function selection_empty() {
    return !this.node();
  }

  function selection_each(callback) {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }

    return this;
  }

  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }

  function attrConstantNS(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }

  function attrFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }

  function attrFunctionNS(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }

  function selection_attr(name, value) {
    var fullname = namespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local
          ? node.getAttributeNS(fullname.space, fullname.local)
          : node.getAttribute(fullname);
    }

    return this.each((value == null
        ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)
        : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
  }

  function defaultView(node) {
    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView; // node is a Document
  }

  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }

  function styleFunction(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }

  function selection_style(name, value, priority) {
    return arguments.length > 1
        ? this.each((value == null
              ? styleRemove : typeof value === "function"
              ? styleFunction
              : styleConstant)(name, value, priority == null ? "" : priority))
        : styleValue(this.node(), name);
  }

  function styleValue(node, name) {
    return node.style.getPropertyValue(name)
        || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
  }

  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }

  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }

  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }

  function selection_property(name, value) {
    return arguments.length > 1
        ? this.each((value == null
            ? propertyRemove : typeof value === "function"
            ? propertyFunction
            : propertyConstant)(name, value))
        : this.node()[name];
  }

  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }

  function classList(node) {
    return node.classList || new ClassList(node);
  }

  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }

  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };

  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }

  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }

  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }

  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }

  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }

  function selection_classed(name, value) {
    var names = classArray(name + "");

    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }

    return this.each((typeof value === "function"
        ? classedFunction : value
        ? classedTrue
        : classedFalse)(names, value));
  }

  function textRemove() {
    this.textContent = "";
  }

  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }

  function selection_text(value) {
    return arguments.length
        ? this.each(value == null
            ? textRemove : (typeof value === "function"
            ? textFunction
            : textConstant)(value))
        : this.node().textContent;
  }

  function htmlRemove() {
    this.innerHTML = "";
  }

  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }

  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }

  function selection_html(value) {
    return arguments.length
        ? this.each(value == null
            ? htmlRemove : (typeof value === "function"
            ? htmlFunction
            : htmlConstant)(value))
        : this.node().innerHTML;
  }

  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }

  function selection_raise() {
    return this.each(raise);
  }

  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }

  function selection_lower() {
    return this.each(lower);
  }

  function selection_append(name) {
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function() {
      return this.appendChild(create.apply(this, arguments));
    });
  }

  function constantNull() {
    return null;
  }

  function selection_insert(name, before) {
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }

  function selection_remove() {
    return this.each(remove);
  }

  function selection_cloneShallow() {
    return this.parentNode.insertBefore(this.cloneNode(false), this.nextSibling);
  }

  function selection_cloneDeep() {
    return this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
  }

  function selection_clone(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }

  function selection_datum(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  }

  var filterEvents = {};

  var event = null;

  if (typeof document !== "undefined") {
    var element = document.documentElement;
    if (!("onmouseenter" in element)) {
      filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
    }
  }

  function filterContextListener(listener, index, group) {
    listener = contextListener(listener, index, group);
    return function(event) {
      var related = event.relatedTarget;
      if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
        listener.call(this, event);
      }
    };
  }

  function contextListener(listener, index, group) {
    return function(event1) {
      var event0 = event; // Events can be reentrant (e.g., focus).
      event = event1;
      try {
        listener.call(this, this.__data__, index, group);
      } finally {
        event = event0;
      }
    };
  }

  function parseTypenames$1(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return {type: t, name: name};
    });
  }

  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.capture);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }

  function onAdd(typename, value, capture) {
    var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
    return function(d, i, group) {
      var on = this.__on, o, listener = wrap(value, i, group);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.capture);
          this.addEventListener(o.type, o.listener = listener, o.capture = capture);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, capture);
      o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }

  function selection_on(typename, value, capture) {
    var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }

    on = value ? onAdd : onRemove;
    if (capture == null) capture = false;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
    return this;
  }

  function customEvent(event1, listener, that, args) {
    var event0 = event;
    event1.sourceEvent = event;
    event = event1;
    try {
      return listener.apply(that, args);
    } finally {
      event = event0;
    }
  }

  function dispatchEvent(node, type, params) {
    var window = defaultView(node),
        event = window.CustomEvent;

    if (typeof event === "function") {
      event = new event(type, params);
    } else {
      event = window.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    }

    node.dispatchEvent(event);
  }

  function dispatchConstant(type, params) {
    return function() {
      return dispatchEvent(this, type, params);
    };
  }

  function dispatchFunction(type, params) {
    return function() {
      return dispatchEvent(this, type, params.apply(this, arguments));
    };
  }

  function selection_dispatch(type, params) {
    return this.each((typeof params === "function"
        ? dispatchFunction
        : dispatchConstant)(type, params));
  }

  var root = [null];

  function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }

  function selection() {
    return new Selection([[document.documentElement]], root);
  }

  Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: selection_select,
    selectAll: selection_selectAll,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    join: selection_join,
    merge: selection_merge,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    clone: selection_clone,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch
  };

  function select(selector) {
    return typeof selector === "string"
        ? new Selection([[document.querySelector(selector)]], [document.documentElement])
        : new Selection([[selector]], root);
  }

  function sourceEvent() {
    var current = event, source;
    while (source = current.sourceEvent) current = source;
    return current;
  }

  function point(node, event) {
    var svg = node.ownerSVGElement || node;

    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }

    var rect = node.getBoundingClientRect();
    return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
  }

  function mouse(node) {
    var event = sourceEvent();
    if (event.changedTouches) event = event.changedTouches[0];
    return point(node, event);
  }

  function selectAll(selector) {
    return typeof selector === "string"
        ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
        : new Selection([selector == null ? [] : selector], root);
  }

  function touch(node, touches, identifier) {
    if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

    for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
      if ((touch = touches[i]).identifier === identifier) {
        return point(node, touch);
      }
    }

    return null;
  }

  function noevent() {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function dragDisable(view) {
    var root = view.document.documentElement,
        selection = select(view).on("dragstart.drag", noevent, true);
    if ("onselectstart" in root) {
      selection.on("selectstart.drag", noevent, true);
    } else {
      root.__noselect = root.style.MozUserSelect;
      root.style.MozUserSelect = "none";
    }
  }

  function yesdrag(view, noclick) {
    var root = view.document.documentElement,
        selection = select(view).on("dragstart.drag", null);
    if (noclick) {
      selection.on("click.drag", noevent, true);
      setTimeout(function() { selection.on("click.drag", null); }, 0);
    }
    if ("onselectstart" in root) {
      selection.on("selectstart.drag", null);
    } else {
      root.style.MozUserSelect = root.__noselect;
      delete root.__noselect;
    }
  }

  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color() {}

  var darker = 0.7;
  var brighter = 1 / darker;

  var reI = "\\s*([+-]?\\d+)\\s*",
      reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
      reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
      reHex = /^#([0-9a-f]{3,8})$/,
      reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
      reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
      reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
      reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
      reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
      reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    copy: function(channels) {
      return Object.assign(new this.constructor, this, channels);
    },
    displayable: function() {
      return this.rgb().displayable();
    },
    hex: color_formatHex, // Deprecated! Use color.formatHex.
    formatHex: color_formatHex,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
  });

  function color_formatHex() {
    return this.rgb().formatHex();
  }

  function color_formatHsl() {
    return hslConvert(this).formatHsl();
  }

  function color_formatRgb() {
    return this.rgb().formatRgb();
  }

  function color(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
        : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
        : l === 8 ? new Rgb(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
        : l === 4 ? new Rgb((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
        : null) // invalid hex
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, rgb, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return (-0.5 <= this.r && this.r < 255.5)
          && (-0.5 <= this.g && this.g < 255.5)
          && (-0.5 <= this.b && this.b < 255.5)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: rgb_formatHex, // Deprecated! Use color.formatHex.
    formatHex: rgb_formatHex,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
  }));

  function rgb_formatHex() {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
  }

  function rgb_formatRgb() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(")
        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
        + (a === 1 ? ")" : ", " + a + ")");
  }

  function hex(value) {
    value = Math.max(0, Math.min(255, Math.round(value) || 0));
    return (value < 16 ? "0" : "") + value.toString(16);
  }

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, hsl, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    formatHsl: function() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "hsl(" : "hsla(")
          + (this.h || 0) + ", "
          + (this.s || 0) * 100 + "%, "
          + (this.l || 0) * 100 + "%"
          + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var deg2rad = Math.PI / 180;
  var rad2deg = 180 / Math.PI;

  // https://observablehq.com/@mbostock/lab-and-rgb
  var K = 18,
      Xn = 0.96422,
      Yn = 1,
      Zn = 0.82521,
      t0 = 4 / 29,
      t1 = 6 / 29,
      t2 = 3 * t1 * t1,
      t3 = t1 * t1 * t1;

  function labConvert(o) {
    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl) return hcl2lab(o);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = rgb2lrgb(o.r),
        g = rgb2lrgb(o.g),
        b = rgb2lrgb(o.b),
        y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
    if (r === g && g === b) x = z = y; else {
      x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
      z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
    }
    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
  }

  function lab(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
  }

  function Lab(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Lab, lab, extend(Color, {
    brighter: function(k) {
      return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function(k) {
      return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function() {
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      x = Xn * lab2xyz(x);
      y = Yn * lab2xyz(y);
      z = Zn * lab2xyz(z);
      return new Rgb(
        lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
        lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
        lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
        this.opacity
      );
    }
  }));

  function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
  }

  function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
  }

  function lrgb2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2lrgb(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function hclConvert(o) {
    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab)) o = labConvert(o);
    if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);
    var h = Math.atan2(o.b, o.a) * rad2deg;
    return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
  }

  function hcl(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
  }

  function Hcl(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  }

  function hcl2lab(o) {
    if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
    var h = o.h * deg2rad;
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
  }

  define(Hcl, hcl, extend(Color, {
    brighter: function(k) {
      return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
    },
    darker: function(k) {
      return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
    },
    rgb: function() {
      return hcl2lab(this).rgb();
    }
  }));

  function basis(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0
        + (4 - 6 * t2 + 3 * t3) * v1
        + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
        + t3 * v3) / 6;
  }

  function basis$1(values) {
    var n = values.length - 1;
    return function(t) {
      var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
          v1 = values[i],
          v2 = values[i + 1],
          v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
          v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  function constant$1(x) {
    return function() {
      return x;
    };
  }

  function linear(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function hue(a, b) {
    var d = b - a;
    return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$1(isNaN(a) ? b : a);
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
  }

  var interpolateRgb = (function rgbGamma(y) {
    var color = gamma(y);

    function rgb$1(start, end) {
      var r = color((start = rgb(start)).r, (end = rgb(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb$1.gamma = rgbGamma;

    return rgb$1;
  })(1);

  function rgbSpline(spline) {
    return function(colors) {
      var n = colors.length,
          r = new Array(n),
          g = new Array(n),
          b = new Array(n),
          i, color;
      for (i = 0; i < n; ++i) {
        color = rgb(colors[i]);
        r[i] = color.r || 0;
        g[i] = color.g || 0;
        b[i] = color.b || 0;
      }
      r = spline(r);
      g = spline(g);
      b = spline(b);
      color.opacity = 1;
      return function(t) {
        color.r = r(t);
        color.g = g(t);
        color.b = b(t);
        return color + "";
      };
    };
  }

  var rgbBasis = rgbSpline(basis$1);

  function array(a, b) {
    var nb = b ? b.length : 0,
        na = a ? Math.min(nb, a.length) : 0,
        x = new Array(na),
        c = new Array(nb),
        i;

    for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
    for (; i < nb; ++i) c[i] = b[i];

    return function(t) {
      for (i = 0; i < na; ++i) c[i] = x[i](t);
      return c;
    };
  }

  function date(a, b) {
    var d = new Date;
    return a = +a, b -= a, function(t) {
      return d.setTime(a + b * t), d;
    };
  }

  function interpolateNumber(a, b) {
    return a = +a, b -= a, function(t) {
      return a + b * t;
    };
  }

  function object(a, b) {
    var i = {},
        c = {},
        k;

    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};

    for (k in b) {
      if (k in a) {
        i[k] = interpolate(a[k], b[k]);
      } else {
        c[k] = b[k];
      }
    }

    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
      reB = new RegExp(reA.source, "g");

  function zero(b) {
    return function() {
      return b;
    };
  }

  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function interpolateString(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: interpolateNumber(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  function interpolate(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant$1(b)
        : (t === "number" ? interpolateNumber
        : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
        : b instanceof color ? interpolateRgb
        : b instanceof Date ? date
        : Array.isArray(b) ? array
        : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
        : interpolateNumber)(a, b);
  }

  function interpolateRound(a, b) {
    return a = +a, b -= a, function(t) {
      return Math.round(a + b * t);
    };
  }

  var degrees = 180 / Math.PI;

  var identity$1 = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };

  function decompose(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var cssNode,
      cssRoot,
      cssView,
      svgNode;

  function parseCss(value) {
    if (value === "none") return identity$1;
    if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
    cssNode.style.transform = value;
    value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
    cssRoot.removeChild(cssNode);
    value = value.slice(7, -1).split(",");
    return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
  }

  function parseSvg(value) {
    if (value == null) return identity$1;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
    value = value.matrix;
    return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  function interpolateTransform(parse, pxComma, pxParen, degParen) {

    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }

    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }

    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
        q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }

    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }

    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }

    return function(a, b) {
      var s = [], // string constants and placeholders
          q = []; // number interpolators
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null; // gc
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }

  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

  var rho = Math.SQRT2,
      rho2 = 2,
      rho4 = 4,
      epsilon2 = 1e-12;

  function cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
  }

  function sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
  }

  function tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
  }

  // p0 = [ux0, uy0, w0]
  // p1 = [ux1, uy1, w1]
  function interpolateZoom(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
        ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
        dx = ux1 - ux0,
        dy = uy1 - uy0,
        d2 = dx * dx + dy * dy,
        i,
        S;

    // Special case for u0 ≅ u1.
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      };
    }

    // General case.
    else {
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      };
    }

    i.duration = S * 1000;

    return i;
  }

  function hcl$1(hue) {
    return function(start, end) {
      var h = hue((start = hcl(start)).h, (end = hcl(end)).h),
          c = nogamma(start.c, end.c),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.c = c(t);
        start.l = l(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }
  }

  var interpolateHcl = hcl$1(hue);

  var frame = 0, // is an animation frame pending?
      timeout = 0, // is a timeout pending?
      interval = 0, // are any timers active?
      pokeDelay = 1000, // how frequently we check for clock skew
      taskHead,
      taskTail,
      clockLast = 0,
      clockNow = 0,
      clockSkew = 0,
      clock = typeof performance === "object" && performance.now ? performance : Date,
      setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }

  function clearNow() {
    clockNow = 0;
  }

  function Timer() {
    this._call =
    this._time =
    this._next = null;
  }

  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };

  function timer(callback, delay, time) {
    var t = new Timer;
    t.restart(callback, delay, time);
    return t;
  }

  function timerFlush() {
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
      t = t._next;
    }
    --frame;
  }

  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }

  function poke() {
    var now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
  }

  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }

  function sleep(time) {
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
      if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }

  function timeout$1(callback, delay, time) {
    var t = new Timer;
    delay = delay == null ? 0 : +delay;
    t.restart(function(elapsed) {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }

  var emptyOn = dispatch("start", "end", "cancel", "interrupt");
  var emptyTween = [];

  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;

  function schedule(node, name, id, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id in schedules) return;
    create(node, id, {
      name: name,
      index: index, // For context during callback.
      group: group, // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }

  function init(node, id) {
    var schedule = get$1(node, id);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
  }

  function set$1(node, id) {
    var schedule = get$1(node, id);
    if (schedule.state > STARTED) throw new Error("too late; already running");
    return schedule;
  }

  function get$1(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
    return schedule;
  }

  function create(node, id, self) {
    var schedules = node.__transition,
        tween;

    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = timer(schedule, 0, self.time);

    function schedule(elapsed) {
      self.state = SCHEDULED;
      self.timer.restart(start, self.delay, self.time);

      // If the elapsed delay is less than our first sleep, start immediately.
      if (self.delay <= elapsed) start(elapsed - self.delay);
    }

    function start(elapsed) {
      var i, j, n, o;

      // If the state is not SCHEDULED, then we previously errored on start.
      if (self.state !== SCHEDULED) return stop();

      for (i in schedules) {
        o = schedules[i];
        if (o.name !== self.name) continue;

        // While this element already has a starting transition during this frame,
        // defer starting an interrupting transition until that transition has a
        // chance to tick (and possibly end); see d3/d3-transition#54!
        if (o.state === STARTED) return timeout$1(start);

        // Interrupt the active transition, if any.
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }

        // Cancel any pre-empted transitions.
        else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
      }

      // Defer the first tick to end of the current frame; see d3/d3#1576.
      // Note the transition may be canceled after start and before the first tick!
      // Note this must be scheduled before the start event; see d3/d3-transition#16!
      // Assuming this is successful, subsequent callbacks go straight to tick.
      timeout$1(function() {
        if (self.state === STARTED) {
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        }
      });

      // Dispatch the start event.
      // Note this must be done before the tween are initialized.
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING) return; // interrupted
      self.state = STARTED;

      // Initialize the tween, deleting null tween.
      tween = new Array(n = self.tween.length);
      for (i = 0, j = -1; i < n; ++i) {
        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
          tween[++j] = o;
        }
      }
      tween.length = j + 1;
    }

    function tick(elapsed) {
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
          i = -1,
          n = tween.length;

      while (++i < n) {
        tween[i].call(node, t);
      }

      // Dispatch the end event.
      if (self.state === ENDING) {
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      }
    }

    function stop() {
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id];
      for (var i in schedules) return; // eslint-disable-line no-unused-vars
      delete node.__transition;
    }
  }

  function interrupt(node, name) {
    var schedules = node.__transition,
        schedule,
        active,
        empty = true,
        i;

    if (!schedules) return;

    name = name == null ? null : name + "";

    for (i in schedules) {
      if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
      active = schedule.state > STARTING && schedule.state < ENDING;
      schedule.state = ENDED;
      schedule.timer.stop();
      schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i];
    }

    if (empty) delete node.__transition;
  }

  function selection_interrupt(name) {
    return this.each(function() {
      interrupt(this, name);
    });
  }

  function tweenRemove(id, name) {
    var tween0, tween1;
    return function() {
      var schedule = set$1(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          }
        }
      }

      schedule.tween = tween1;
    };
  }

  function tweenFunction(id, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error;
    return function() {
      var schedule = set$1(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1[i] = t;
            break;
          }
        }
        if (i === n) tween1.push(t);
      }

      schedule.tween = tween1;
    };
  }

  function transition_tween(name, value) {
    var id = this._id;

    name += "";

    if (arguments.length < 2) {
      var tween = get$1(this.node(), id).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) {
        if ((t = tween[i]).name === name) {
          return t.value;
        }
      }
      return null;
    }

    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
  }

  function tweenValue(transition, name, value) {
    var id = transition._id;

    transition.each(function() {
      var schedule = set$1(this, id);
      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });

    return function(node) {
      return get$1(node, id).value[name];
    };
  }

  function interpolate$1(a, b) {
    var c;
    return (typeof b === "number" ? interpolateNumber
        : b instanceof color ? interpolateRgb
        : (c = color(b)) ? (b = c, interpolateRgb)
        : interpolateString)(a, b);
  }

  function attrRemove$1(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS$1(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant$1(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttribute(name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrConstantNS$1(fullname, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttributeNS(fullname.space, fullname.local);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrFunction$1(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttribute(name);
      string0 = this.getAttribute(name);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function attrFunctionNS$1(fullname, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      string0 = this.getAttributeNS(fullname.space, fullname.local);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function transition_attr(name, value) {
    var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate$1;
    return this.attrTween(name, typeof value === "function"
        ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
        : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
        : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
  }

  function attrInterpolate(name, i) {
    return function(t) {
      this.setAttribute(name, i(t));
    };
  }

  function attrInterpolateNS(fullname, i) {
    return function(t) {
      this.setAttributeNS(fullname.space, fullname.local, i(t));
    };
  }

  function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function attrTween(name, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function transition_attrTween(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    var fullname = namespace(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }

  function delayFunction(id, value) {
    return function() {
      init(this, id).delay = +value.apply(this, arguments);
    };
  }

  function delayConstant(id, value) {
    return value = +value, function() {
      init(this, id).delay = value;
    };
  }

  function transition_delay(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? delayFunction
            : delayConstant)(id, value))
        : get$1(this.node(), id).delay;
  }

  function durationFunction(id, value) {
    return function() {
      set$1(this, id).duration = +value.apply(this, arguments);
    };
  }

  function durationConstant(id, value) {
    return value = +value, function() {
      set$1(this, id).duration = value;
    };
  }

  function transition_duration(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? durationFunction
            : durationConstant)(id, value))
        : get$1(this.node(), id).duration;
  }

  function easeConstant(id, value) {
    if (typeof value !== "function") throw new Error;
    return function() {
      set$1(this, id).ease = value;
    };
  }

  function transition_ease(value) {
    var id = this._id;

    return arguments.length
        ? this.each(easeConstant(id, value))
        : get$1(this.node(), id).ease;
  }

  function transition_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Transition(subgroups, this._parents, this._name, this._id);
  }

  function transition_merge(transition) {
    if (transition._id !== this._id) throw new Error;

    for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Transition(merges, this._parents, this._name, this._id);
  }

  function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    });
  }

  function onFunction(id, name, listener) {
    var on0, on1, sit = start(name) ? init : set$1;
    return function() {
      var schedule = sit(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

      schedule.on = on1;
    };
  }

  function transition_on(name, listener) {
    var id = this._id;

    return arguments.length < 2
        ? get$1(this.node(), id).on.on(name)
        : this.each(onFunction(id, name, listener));
  }

  function removeFunction(id) {
    return function() {
      var parent = this.parentNode;
      for (var i in this.__transition) if (+i !== id) return;
      if (parent) parent.removeChild(this);
    };
  }

  function transition_remove() {
    return this.on("end.remove", removeFunction(this._id));
  }

  function transition_select(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule(subgroup[i], name, id, i, subgroup, get$1(node, id));
        }
      }
    }

    return new Transition(subgroups, this._parents, name, id);
  }

  function transition_selectAll(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          for (var children = select.call(node, node.__data__, i, group), child, inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k) {
            if (child = children[k]) {
              schedule(child, name, id, k, children, inherit);
            }
          }
          subgroups.push(children);
          parents.push(node);
        }
      }
    }

    return new Transition(subgroups, parents, name, id);
  }

  var Selection$1 = selection.prototype.constructor;

  function transition_selection() {
    return new Selection$1(this._groups, this._parents);
  }

  function styleNull(name, interpolate) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          string1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
  }

  function styleRemove$1(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant$1(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = styleValue(this, name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function styleFunction$1(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          value1 = value(this),
          string1 = value1 + "";
      if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function styleMaybeRemove(id, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
    return function() {
      var schedule = set$1(this, id),
          on = schedule.on,
          listener = schedule.value[key] == null ? remove || (remove = styleRemove$1(name)) : undefined;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

      schedule.on = on1;
    };
  }

  function transition_style(name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate$1;
    return value == null ? this
        .styleTween(name, styleNull(name, i))
        .on("end.style." + name, styleRemove$1(name))
      : typeof value === "function" ? this
        .styleTween(name, styleFunction$1(name, i, tweenValue(this, "style." + name, value)))
        .each(styleMaybeRemove(this._id, name))
      : this
        .styleTween(name, styleConstant$1(name, i, value), priority)
        .on("end.style." + name, null);
  }

  function styleInterpolate(name, i, priority) {
    return function(t) {
      this.style.setProperty(name, i(t), priority);
    };
  }

  function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
      return t;
    }
    tween._value = value;
    return tween;
  }

  function transition_styleTween(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }

  function textConstant$1(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction$1(value) {
    return function() {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }

  function transition_text(value) {
    return this.tween("text", typeof value === "function"
        ? textFunction$1(tweenValue(this, "text", value))
        : textConstant$1(value == null ? "" : value + ""));
  }

  function transition_transition() {
    var name = this._name,
        id0 = this._id,
        id1 = newId();

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          var inherit = get$1(node, id0);
          schedule(node, name, id1, i, group, {
            time: inherit.time + inherit.delay + inherit.duration,
            delay: 0,
            duration: inherit.duration,
            ease: inherit.ease
          });
        }
      }
    }

    return new Transition(groups, this._parents, name, id1);
  }

  function transition_end() {
    var on0, on1, that = this, id = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
      var cancel = {value: reject},
          end = {value: function() { if (--size === 0) resolve(); }};

      that.each(function() {
        var schedule = set$1(this, id),
            on = schedule.on;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) {
          on1 = (on0 = on).copy();
          on1._.cancel.push(cancel);
          on1._.interrupt.push(cancel);
          on1._.end.push(end);
        }

        schedule.on = on1;
      });
    });
  }

  var id = 0;

  function Transition(groups, parents, name, id) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
  }

  function transition(name) {
    return selection().transition(name);
  }

  function newId() {
    return ++id;
  }

  var selection_prototype = selection.prototype;

  Transition.prototype = transition.prototype = {
    constructor: Transition,
    select: transition_select,
    selectAll: transition_selectAll,
    filter: transition_filter,
    merge: transition_merge,
    selection: transition_selection,
    transition: transition_transition,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: transition_on,
    attr: transition_attr,
    attrTween: transition_attrTween,
    style: transition_style,
    styleTween: transition_styleTween,
    text: transition_text,
    remove: transition_remove,
    tween: transition_tween,
    delay: transition_delay,
    duration: transition_duration,
    ease: transition_ease,
    end: transition_end
  };

  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  var defaultTiming = {
    time: null, // Set on use.
    delay: 0,
    duration: 250,
    ease: cubicInOut
  };

  function inherit(node, id) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id])) {
      if (!(node = node.parentNode)) {
        return defaultTiming.time = now(), defaultTiming;
      }
    }
    return timing;
  }

  function selection_transition(name) {
    var id,
        timing;

    if (name instanceof Transition) {
      id = name._id, name = name._name;
    } else {
      id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          schedule(node, name, id, i, group, timing || inherit(node, id));
        }
      }
    }

    return new Transition(groups, this._parents, name, id);
  }

  selection.prototype.interrupt = selection_interrupt;
  selection.prototype.transition = selection_transition;

  function constant$2(x) {
    return function() {
      return x;
    };
  }

  function BrushEvent(target, type, selection) {
    this.target = target;
    this.type = type;
    this.selection = selection;
  }

  function nopropagation() {
    event.stopImmediatePropagation();
  }

  function noevent$1() {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  var MODE_DRAG = {name: "drag"},
      MODE_SPACE = {name: "space"},
      MODE_HANDLE = {name: "handle"},
      MODE_CENTER = {name: "center"};

  function number1(e) {
    return [+e[0], +e[1]];
  }

  function number2(e) {
    return [number1(e[0]), number1(e[1])];
  }

  function toucher(identifier) {
    return function(target) {
      return touch(target, event.touches, identifier);
    };
  }

  var X = {
    name: "x",
    handles: ["w", "e"].map(type),
    input: function(x, e) { return x == null ? null : [[+x[0], e[0][1]], [+x[1], e[1][1]]]; },
    output: function(xy) { return xy && [xy[0][0], xy[1][0]]; }
  };

  var Y = {
    name: "y",
    handles: ["n", "s"].map(type),
    input: function(y, e) { return y == null ? null : [[e[0][0], +y[0]], [e[1][0], +y[1]]]; },
    output: function(xy) { return xy && [xy[0][1], xy[1][1]]; }
  };

  var cursors = {
    overlay: "crosshair",
    selection: "move",
    n: "ns-resize",
    e: "ew-resize",
    s: "ns-resize",
    w: "ew-resize",
    nw: "nwse-resize",
    ne: "nesw-resize",
    se: "nwse-resize",
    sw: "nesw-resize"
  };

  var flipX = {
    e: "w",
    w: "e",
    nw: "ne",
    ne: "nw",
    se: "sw",
    sw: "se"
  };

  var flipY = {
    n: "s",
    s: "n",
    nw: "sw",
    ne: "se",
    se: "ne",
    sw: "nw"
  };

  var signsX = {
    overlay: +1,
    selection: +1,
    n: null,
    e: +1,
    s: null,
    w: -1,
    nw: -1,
    ne: +1,
    se: +1,
    sw: -1
  };

  var signsY = {
    overlay: +1,
    selection: +1,
    n: -1,
    e: null,
    s: +1,
    w: null,
    nw: -1,
    ne: -1,
    se: +1,
    sw: +1
  };

  function type(t) {
    return {type: t};
  }

  // Ignore right-click, since that should open the context menu.
  function defaultFilter() {
    return !event.ctrlKey && !event.button;
  }

  function defaultExtent() {
    var svg = this.ownerSVGElement || this;
    if (svg.hasAttribute("viewBox")) {
      svg = svg.viewBox.baseVal;
      return [[svg.x, svg.y], [svg.x + svg.width, svg.y + svg.height]];
    }
    return [[0, 0], [svg.width.baseVal.value, svg.height.baseVal.value]];
  }

  function defaultTouchable() {
    return navigator.maxTouchPoints || ("ontouchstart" in this);
  }

  // Like d3.local, but with the name “__brush” rather than auto-generated.
  function local(node) {
    while (!node.__brush) if (!(node = node.parentNode)) return;
    return node.__brush;
  }

  function empty$1(extent) {
    return extent[0][0] === extent[1][0]
        || extent[0][1] === extent[1][1];
  }

  function brushX() {
    return brush(X);
  }

  function brush(dim) {
    var extent = defaultExtent,
        filter = defaultFilter,
        touchable = defaultTouchable,
        keys = true,
        listeners = dispatch(brush, "start", "brush", "end"),
        handleSize = 6,
        touchending;

    function brush(group) {
      var overlay = group
          .property("__brush", initialize)
        .selectAll(".overlay")
        .data([type("overlay")]);

      overlay.enter().append("rect")
          .attr("class", "overlay")
          .attr("pointer-events", "all")
          .attr("cursor", cursors.overlay)
        .merge(overlay)
          .each(function() {
            var extent = local(this).extent;
            select(this)
                .attr("x", extent[0][0])
                .attr("y", extent[0][1])
                .attr("width", extent[1][0] - extent[0][0])
                .attr("height", extent[1][1] - extent[0][1]);
          });

      group.selectAll(".selection")
        .data([type("selection")])
        .enter().append("rect")
          .attr("class", "selection")
          .attr("cursor", cursors.selection)
          .attr("fill", "#777")
          .attr("fill-opacity", 0.3)
          .attr("stroke", "#fff")
          .attr("shape-rendering", "crispEdges");

      var handle = group.selectAll(".handle")
        .data(dim.handles, function(d) { return d.type; });

      handle.exit().remove();

      handle.enter().append("rect")
          .attr("class", function(d) { return "handle handle--" + d.type; })
          .attr("cursor", function(d) { return cursors[d.type]; });

      group
          .each(redraw)
          .attr("fill", "none")
          .attr("pointer-events", "all")
          .on("mousedown.brush", started)
        .filter(touchable)
          .on("touchstart.brush", started)
          .on("touchmove.brush", touchmoved)
          .on("touchend.brush touchcancel.brush", touchended)
          .style("touch-action", "none")
          .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }

    brush.move = function(group, selection) {
      if (group.selection) {
        group
            .on("start.brush", function() { emitter(this, arguments).beforestart().start(); })
            .on("interrupt.brush end.brush", function() { emitter(this, arguments).end(); })
            .tween("brush", function() {
              var that = this,
                  state = that.__brush,
                  emit = emitter(that, arguments),
                  selection0 = state.selection,
                  selection1 = dim.input(typeof selection === "function" ? selection.apply(this, arguments) : selection, state.extent),
                  i = interpolate(selection0, selection1);

              function tween(t) {
                state.selection = t === 1 && selection1 === null ? null : i(t);
                redraw.call(that);
                emit.brush();
              }

              return selection0 !== null && selection1 !== null ? tween : tween(1);
            });
      } else {
        group
            .each(function() {
              var that = this,
                  args = arguments,
                  state = that.__brush,
                  selection1 = dim.input(typeof selection === "function" ? selection.apply(that, args) : selection, state.extent),
                  emit = emitter(that, args).beforestart();

              interrupt(that);
              state.selection = selection1 === null ? null : selection1;
              redraw.call(that);
              emit.start().brush().end();
            });
      }
    };

    brush.clear = function(group) {
      brush.move(group, null);
    };

    function redraw() {
      var group = select(this),
          selection = local(this).selection;

      if (selection) {
        group.selectAll(".selection")
            .style("display", null)
            .attr("x", selection[0][0])
            .attr("y", selection[0][1])
            .attr("width", selection[1][0] - selection[0][0])
            .attr("height", selection[1][1] - selection[0][1]);

        group.selectAll(".handle")
            .style("display", null)
            .attr("x", function(d) { return d.type[d.type.length - 1] === "e" ? selection[1][0] - handleSize / 2 : selection[0][0] - handleSize / 2; })
            .attr("y", function(d) { return d.type[0] === "s" ? selection[1][1] - handleSize / 2 : selection[0][1] - handleSize / 2; })
            .attr("width", function(d) { return d.type === "n" || d.type === "s" ? selection[1][0] - selection[0][0] + handleSize : handleSize; })
            .attr("height", function(d) { return d.type === "e" || d.type === "w" ? selection[1][1] - selection[0][1] + handleSize : handleSize; });
      }

      else {
        group.selectAll(".selection,.handle")
            .style("display", "none")
            .attr("x", null)
            .attr("y", null)
            .attr("width", null)
            .attr("height", null);
      }
    }

    function emitter(that, args, clean) {
      return (!clean && that.__brush.emitter) || new Emitter(that, args);
    }

    function Emitter(that, args) {
      this.that = that;
      this.args = args;
      this.state = that.__brush;
      this.active = 0;
    }

    Emitter.prototype = {
      beforestart: function() {
        if (++this.active === 1) this.state.emitter = this, this.starting = true;
        return this;
      },
      start: function() {
        if (this.starting) this.starting = false, this.emit("start");
        else this.emit("brush");
        return this;
      },
      brush: function() {
        this.emit("brush");
        return this;
      },
      end: function() {
        if (--this.active === 0) delete this.state.emitter, this.emit("end");
        return this;
      },
      emit: function(type) {
        customEvent(new BrushEvent(brush, type, dim.output(this.state.selection)), listeners.apply, listeners, [type, this.that, this.args]);
      }
    };

    function started() {
      if (touchending && !event.touches) return;
      if (!filter.apply(this, arguments)) return;

      var that = this,
          type = event.target.__data__.type,
          mode = (keys && event.metaKey ? type = "overlay" : type) === "selection" ? MODE_DRAG : (keys && event.altKey ? MODE_CENTER : MODE_HANDLE),
          signX = dim === Y ? null : signsX[type],
          signY = dim === X ? null : signsY[type],
          state = local(that),
          extent = state.extent,
          selection = state.selection,
          W = extent[0][0], w0, w1,
          N = extent[0][1], n0, n1,
          E = extent[1][0], e0, e1,
          S = extent[1][1], s0, s1,
          dx = 0,
          dy = 0,
          moving,
          shifting = signX && signY && keys && event.shiftKey,
          lockX,
          lockY,
          pointer = event.touches ? toucher(event.changedTouches[0].identifier) : mouse,
          point0 = pointer(that),
          point = point0,
          emit = emitter(that, arguments, true).beforestart();

      if (type === "overlay") {
        if (selection) moving = true;
        state.selection = selection = [
          [w0 = dim === Y ? W : point0[0], n0 = dim === X ? N : point0[1]],
          [e0 = dim === Y ? E : w0, s0 = dim === X ? S : n0]
        ];
      } else {
        w0 = selection[0][0];
        n0 = selection[0][1];
        e0 = selection[1][0];
        s0 = selection[1][1];
      }

      w1 = w0;
      n1 = n0;
      e1 = e0;
      s1 = s0;

      var group = select(that)
          .attr("pointer-events", "none");

      var overlay = group.selectAll(".overlay")
          .attr("cursor", cursors[type]);

      if (event.touches) {
        emit.moved = moved;
        emit.ended = ended;
      } else {
        var view = select(event.view)
            .on("mousemove.brush", moved, true)
            .on("mouseup.brush", ended, true);
        if (keys) view
            .on("keydown.brush", keydowned, true)
            .on("keyup.brush", keyupped, true);

        dragDisable(event.view);
      }

      nopropagation();
      interrupt(that);
      redraw.call(that);
      emit.start();

      function moved() {
        var point1 = pointer(that);
        if (shifting && !lockX && !lockY) {
          if (Math.abs(point1[0] - point[0]) > Math.abs(point1[1] - point[1])) lockY = true;
          else lockX = true;
        }
        point = point1;
        moving = true;
        noevent$1();
        move();
      }

      function move() {
        var t;

        dx = point[0] - point0[0];
        dy = point[1] - point0[1];

        switch (mode) {
          case MODE_SPACE:
          case MODE_DRAG: {
            if (signX) dx = Math.max(W - w0, Math.min(E - e0, dx)), w1 = w0 + dx, e1 = e0 + dx;
            if (signY) dy = Math.max(N - n0, Math.min(S - s0, dy)), n1 = n0 + dy, s1 = s0 + dy;
            break;
          }
          case MODE_HANDLE: {
            if (signX < 0) dx = Math.max(W - w0, Math.min(E - w0, dx)), w1 = w0 + dx, e1 = e0;
            else if (signX > 0) dx = Math.max(W - e0, Math.min(E - e0, dx)), w1 = w0, e1 = e0 + dx;
            if (signY < 0) dy = Math.max(N - n0, Math.min(S - n0, dy)), n1 = n0 + dy, s1 = s0;
            else if (signY > 0) dy = Math.max(N - s0, Math.min(S - s0, dy)), n1 = n0, s1 = s0 + dy;
            break;
          }
          case MODE_CENTER: {
            if (signX) w1 = Math.max(W, Math.min(E, w0 - dx * signX)), e1 = Math.max(W, Math.min(E, e0 + dx * signX));
            if (signY) n1 = Math.max(N, Math.min(S, n0 - dy * signY)), s1 = Math.max(N, Math.min(S, s0 + dy * signY));
            break;
          }
        }

        if (e1 < w1) {
          signX *= -1;
          t = w0, w0 = e0, e0 = t;
          t = w1, w1 = e1, e1 = t;
          if (type in flipX) overlay.attr("cursor", cursors[type = flipX[type]]);
        }

        if (s1 < n1) {
          signY *= -1;
          t = n0, n0 = s0, s0 = t;
          t = n1, n1 = s1, s1 = t;
          if (type in flipY) overlay.attr("cursor", cursors[type = flipY[type]]);
        }

        if (state.selection) selection = state.selection; // May be set by brush.move!
        if (lockX) w1 = selection[0][0], e1 = selection[1][0];
        if (lockY) n1 = selection[0][1], s1 = selection[1][1];

        if (selection[0][0] !== w1
            || selection[0][1] !== n1
            || selection[1][0] !== e1
            || selection[1][1] !== s1) {
          state.selection = [[w1, n1], [e1, s1]];
          redraw.call(that);
          emit.brush();
        }
      }

      function ended() {
        nopropagation();
        if (event.touches) {
          if (event.touches.length) return;
          if (touchending) clearTimeout(touchending);
          touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
        } else {
          yesdrag(event.view, moving);
          view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
        }
        group.attr("pointer-events", "all");
        overlay.attr("cursor", cursors.overlay);
        if (state.selection) selection = state.selection; // May be set by brush.move (on start)!
        if (empty$1(selection)) state.selection = null, redraw.call(that);
        emit.end();
      }

      function keydowned() {
        switch (event.keyCode) {
          case 16: { // SHIFT
            shifting = signX && signY;
            break;
          }
          case 18: { // ALT
            if (mode === MODE_HANDLE) {
              if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
              if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
              mode = MODE_CENTER;
              move();
            }
            break;
          }
          case 32: { // SPACE; takes priority over ALT
            if (mode === MODE_HANDLE || mode === MODE_CENTER) {
              if (signX < 0) e0 = e1 - dx; else if (signX > 0) w0 = w1 - dx;
              if (signY < 0) s0 = s1 - dy; else if (signY > 0) n0 = n1 - dy;
              mode = MODE_SPACE;
              overlay.attr("cursor", cursors.selection);
              move();
            }
            break;
          }
          default: return;
        }
        noevent$1();
      }

      function keyupped() {
        switch (event.keyCode) {
          case 16: { // SHIFT
            if (shifting) {
              lockX = lockY = shifting = false;
              move();
            }
            break;
          }
          case 18: { // ALT
            if (mode === MODE_CENTER) {
              if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
              if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
              mode = MODE_HANDLE;
              move();
            }
            break;
          }
          case 32: { // SPACE
            if (mode === MODE_SPACE) {
              if (event.altKey) {
                if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
                if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
                mode = MODE_CENTER;
              } else {
                if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
                if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
                mode = MODE_HANDLE;
              }
              overlay.attr("cursor", cursors[type]);
              move();
            }
            break;
          }
          default: return;
        }
        noevent$1();
      }
    }

    function touchmoved() {
      emitter(this, arguments).moved();
    }

    function touchended() {
      emitter(this, arguments).ended();
    }

    function initialize() {
      var state = this.__brush || {selection: null};
      state.extent = number2(extent.apply(this, arguments));
      state.dim = dim;
      return state;
    }

    brush.extent = function(_) {
      return arguments.length ? (extent = typeof _ === "function" ? _ : constant$2(number2(_)), brush) : extent;
    };

    brush.filter = function(_) {
      return arguments.length ? (filter = typeof _ === "function" ? _ : constant$2(!!_), brush) : filter;
    };

    brush.handleSize = function(_) {
      return arguments.length ? (handleSize = +_, brush) : handleSize;
    };

    brush.keyModifiers = function(_) {
      return arguments.length ? (keys = !!_, brush) : keys;
    };

    brush.on = function() {
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? brush : value;
    };

    return brush;
  }

  var pi = Math.PI,
      tau = 2 * pi,
      epsilon$1 = 1e-6,
      tauEpsilon = tau - epsilon$1;

  function Path() {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null; // end of current subpath
    this._ = "";
  }

  function path() {
    return new Path;
  }

  Path.prototype = path.prototype = {
    constructor: Path,
    moveTo: function(x, y) {
      this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
    },
    closePath: function() {
      if (this._x1 !== null) {
        this._x1 = this._x0, this._y1 = this._y0;
        this._ += "Z";
      }
    },
    lineTo: function(x, y) {
      this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    quadraticCurveTo: function(x1, y1, x, y) {
      this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    bezierCurveTo: function(x1, y1, x2, y2, x, y) {
      this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    arcTo: function(x1, y1, x2, y2, r) {
      x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
      var x0 = this._x1,
          y0 = this._y1,
          x21 = x2 - x1,
          y21 = y2 - y1,
          x01 = x0 - x1,
          y01 = y0 - y1,
          l01_2 = x01 * x01 + y01 * y01;

      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);

      // Is this path empty? Move to (x1,y1).
      if (this._x1 === null) {
        this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
      }

      // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
      else if (!(l01_2 > epsilon$1));

      // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
      // Equivalently, is (x1,y1) coincident with (x2,y2)?
      // Or, is the radius zero? Line to (x1,y1).
      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon$1) || !r) {
        this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
      }

      // Otherwise, draw an arc!
      else {
        var x20 = x2 - x0,
            y20 = y2 - y0,
            l21_2 = x21 * x21 + y21 * y21,
            l20_2 = x20 * x20 + y20 * y20,
            l21 = Math.sqrt(l21_2),
            l01 = Math.sqrt(l01_2),
            l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
            t01 = l / l01,
            t21 = l / l21;

        // If the start tangent is not coincident with (x0,y0), line to.
        if (Math.abs(t01 - 1) > epsilon$1) {
          this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
        }

        this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
      }
    },
    arc: function(x, y, r, a0, a1, ccw) {
      x = +x, y = +y, r = +r, ccw = !!ccw;
      var dx = r * Math.cos(a0),
          dy = r * Math.sin(a0),
          x0 = x + dx,
          y0 = y + dy,
          cw = 1 ^ ccw,
          da = ccw ? a0 - a1 : a1 - a0;

      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);

      // Is this path empty? Move to (x0,y0).
      if (this._x1 === null) {
        this._ += "M" + x0 + "," + y0;
      }

      // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
      else if (Math.abs(this._x1 - x0) > epsilon$1 || Math.abs(this._y1 - y0) > epsilon$1) {
        this._ += "L" + x0 + "," + y0;
      }

      // Is this arc empty? We’re done.
      if (!r) return;

      // Does the angle go the wrong way? Flip the direction.
      if (da < 0) da = da % tau + tau;

      // Is this a complete circle? Draw two arcs to complete the circle.
      if (da > tauEpsilon) {
        this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
      }

      // Is this arc non-empty? Draw an arc!
      else if (da > epsilon$1) {
        this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
      }
    },
    rect: function(x, y, w, h) {
      this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
    },
    toString: function() {
      return this._;
    }
  };

  var prefix = "$";

  function Map() {}

  Map.prototype = map.prototype = {
    constructor: Map,
    has: function(key) {
      return (prefix + key) in this;
    },
    get: function(key) {
      return this[prefix + key];
    },
    set: function(key, value) {
      this[prefix + key] = value;
      return this;
    },
    remove: function(key) {
      var property = prefix + key;
      return property in this && delete this[property];
    },
    clear: function() {
      for (var property in this) if (property[0] === prefix) delete this[property];
    },
    keys: function() {
      var keys = [];
      for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
      return keys;
    },
    values: function() {
      var values = [];
      for (var property in this) if (property[0] === prefix) values.push(this[property]);
      return values;
    },
    entries: function() {
      var entries = [];
      for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
      return entries;
    },
    size: function() {
      var size = 0;
      for (var property in this) if (property[0] === prefix) ++size;
      return size;
    },
    empty: function() {
      for (var property in this) if (property[0] === prefix) return false;
      return true;
    },
    each: function(f) {
      for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
    }
  };

  function map(object, f) {
    var map = new Map;

    // Copy constructor.
    if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

    // Index array by numeric index or specified key function.
    else if (Array.isArray(object)) {
      var i = -1,
          n = object.length,
          o;

      if (f == null) while (++i < n) map.set(i, object[i]);
      else while (++i < n) map.set(f(o = object[i], i, object), o);
    }

    // Convert object to map.
    else if (object) for (var key in object) map.set(key, object[key]);

    return map;
  }

  function nest() {
    var keys = [],
        sortKeys = [],
        sortValues,
        rollup,
        nest;

    function apply(array, depth, createResult, setResult) {
      if (depth >= keys.length) {
        if (sortValues != null) array.sort(sortValues);
        return rollup != null ? rollup(array) : array;
      }

      var i = -1,
          n = array.length,
          key = keys[depth++],
          keyValue,
          value,
          valuesByKey = map(),
          values,
          result = createResult();

      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
          values.push(value);
        } else {
          valuesByKey.set(keyValue, [value]);
        }
      }

      valuesByKey.each(function(values, key) {
        setResult(result, key, apply(values, depth, createResult, setResult));
      });

      return result;
    }

    function entries(map, depth) {
      if (++depth > keys.length) return map;
      var array, sortKey = sortKeys[depth - 1];
      if (rollup != null && depth >= keys.length) array = map.entries();
      else array = [], map.each(function(v, k) { array.push({key: k, values: entries(v, depth)}); });
      return sortKey != null ? array.sort(function(a, b) { return sortKey(a.key, b.key); }) : array;
    }

    return nest = {
      object: function(array) { return apply(array, 0, createObject, setObject); },
      map: function(array) { return apply(array, 0, createMap, setMap); },
      entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
      key: function(d) { keys.push(d); return nest; },
      sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
      sortValues: function(order) { sortValues = order; return nest; },
      rollup: function(f) { rollup = f; return nest; }
    };
  }

  function createObject() {
    return {};
  }

  function setObject(object, key, value) {
    object[key] = value;
  }

  function createMap() {
    return map();
  }

  function setMap(map, key, value) {
    map.set(key, value);
  }

  function Set() {}

  var proto = map.prototype;

  Set.prototype = set$2.prototype = {
    constructor: Set,
    has: proto.has,
    add: function(value) {
      value += "";
      this[prefix + value] = value;
      return this;
    },
    remove: proto.remove,
    clear: proto.clear,
    values: proto.keys,
    size: proto.size,
    empty: proto.empty,
    each: proto.each
  };

  function set$2(object, f) {
    var set = new Set;

    // Copy constructor.
    if (object instanceof Set) object.each(function(value) { set.add(value); });

    // Otherwise, assume it’s an array.
    else if (object) {
      var i = -1, n = object.length;
      if (f == null) while (++i < n) set.add(object[i]);
      else while (++i < n) set.add(f(object[i], i, object));
    }

    return set;
  }

  var EOL = {},
      EOF = {},
      QUOTE = 34,
      NEWLINE = 10,
      RETURN = 13;

  function objectConverter(columns) {
    return new Function("d", "return {" + columns.map(function(name, i) {
      return JSON.stringify(name) + ": d[" + i + "]";
    }).join(",") + "}");
  }

  function customConverter(columns, f) {
    var object = objectConverter(columns);
    return function(row, i) {
      return f(object(row), i, columns);
    };
  }

  // Compute unique columns in order of discovery.
  function inferColumns(rows) {
    var columnSet = Object.create(null),
        columns = [];

    rows.forEach(function(row) {
      for (var column in row) {
        if (!(column in columnSet)) {
          columns.push(columnSet[column] = column);
        }
      }
    });

    return columns;
  }

  function pad(value, width) {
    var s = value + "", length = s.length;
    return length < width ? new Array(width - length + 1).join(0) + s : s;
  }

  function formatYear(year) {
    return year < 0 ? "-" + pad(-year, 6)
      : year > 9999 ? "+" + pad(year, 6)
      : pad(year, 4);
  }

  function formatDate(date) {
    var hours = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds(),
        milliseconds = date.getUTCMilliseconds();
    return isNaN(date) ? "Invalid Date"
        : formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
        + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
        : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
        : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
        : "");
  }

  function dsvFormat(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
        DELIMITER = delimiter.charCodeAt(0);

    function parse(text, f) {
      var convert, columns, rows = parseRows(text, function(row, i) {
        if (convert) return convert(row, i - 1);
        columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
      });
      rows.columns = columns || [];
      return rows;
    }

    function parseRows(text, f) {
      var rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // current line number
          t, // current token
          eof = N <= 0, // current token followed by EOF?
          eol = false; // current token followed by EOL?

      // Strip the trailing newline.
      if (text.charCodeAt(N - 1) === NEWLINE) --N;
      if (text.charCodeAt(N - 1) === RETURN) --N;

      function token() {
        if (eof) return EOF;
        if (eol) return eol = false, EOL;

        // Unescape quotes.
        var i, j = I, c;
        if (text.charCodeAt(j) === QUOTE) {
          while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
          if ((i = I) >= N) eof = true;
          else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
          else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
          return text.slice(j + 1, i - 1).replace(/""/g, "\"");
        }

        // Find next delimiter or newline.
        while (I < N) {
          if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
          else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
          else if (c !== DELIMITER) continue;
          return text.slice(j, i);
        }

        // Return last token before EOF.
        return eof = true, text.slice(j, N);
      }

      while ((t = token()) !== EOF) {
        var row = [];
        while (t !== EOL && t !== EOF) row.push(t), t = token();
        if (f && (row = f(row, n++)) == null) continue;
        rows.push(row);
      }

      return rows;
    }

    function preformatBody(rows, columns) {
      return rows.map(function(row) {
        return columns.map(function(column) {
          return formatValue(row[column]);
        }).join(delimiter);
      });
    }

    function format(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
    }

    function formatBody(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return preformatBody(rows, columns).join("\n");
    }

    function formatRows(rows) {
      return rows.map(formatRow).join("\n");
    }

    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }

    function formatValue(value) {
      return value == null ? ""
          : value instanceof Date ? formatDate(value)
          : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
          : value;
    }

    return {
      parse: parse,
      parseRows: parseRows,
      format: format,
      formatBody: formatBody,
      formatRows: formatRows
    };
  }

  var csv = dsvFormat(",");

  var csvParse = csv.parse;

  var tsv = dsvFormat("\t");

  function responseText(response) {
    if (!response.ok) throw new Error(response.status + " " + response.statusText);
    return response.text();
  }

  function text(input, init) {
    return fetch(input, init).then(responseText);
  }

  function dsvParse(parse) {
    return function(input, init, row) {
      if (arguments.length === 2 && typeof init === "function") row = init, init = undefined;
      return text(input, init).then(function(response) {
        return parse(response, row);
      });
    };
  }

  var csv$1 = dsvParse(csvParse);

  function responseJson(response) {
    if (!response.ok) throw new Error(response.status + " " + response.statusText);
    return response.json();
  }

  function json(input, init) {
    return fetch(input, init).then(responseJson);
  }

  function tree_add(d) {
    var x = +this._x.call(null, d),
        y = +this._y.call(null, d);
    return add(this.cover(x, y), x, y, d);
  }

  function add(tree, x, y, d) {
    if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

    var parent,
        node = tree._root,
        leaf = {data: d},
        x0 = tree._x0,
        y0 = tree._y0,
        x1 = tree._x1,
        y1 = tree._y1,
        xm,
        ym,
        xp,
        yp,
        right,
        bottom,
        i,
        j;

    // If the tree is empty, initialize the root as a leaf.
    if (!node) return tree._root = leaf, tree;

    // Find the existing leaf for the new point, or add it.
    while (node.length) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
    }

    // Is the new point is exactly coincident with the existing point?
    xp = +tree._x.call(null, node.data);
    yp = +tree._y.call(null, node.data);
    if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

    // Otherwise, split the leaf node until the old and new point are separated.
    do {
      parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
    } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
    return parent[j] = node, parent[i] = leaf, tree;
  }

  function addAll(data) {
    var d, i, n = data.length,
        x,
        y,
        xz = new Array(n),
        yz = new Array(n),
        x0 = Infinity,
        y0 = Infinity,
        x1 = -Infinity,
        y1 = -Infinity;

    // Compute the points and their extent.
    for (i = 0; i < n; ++i) {
      if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
      xz[i] = x;
      yz[i] = y;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }

    // If there were no (valid) points, abort.
    if (x0 > x1 || y0 > y1) return this;

    // Expand the tree to cover the new points.
    this.cover(x0, y0).cover(x1, y1);

    // Add the new points.
    for (i = 0; i < n; ++i) {
      add(this, xz[i], yz[i], data[i]);
    }

    return this;
  }

  function tree_cover(x, y) {
    if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

    var x0 = this._x0,
        y0 = this._y0,
        x1 = this._x1,
        y1 = this._y1;

    // If the quadtree has no extent, initialize them.
    // Integer extent are necessary so that if we later double the extent,
    // the existing quadrant boundaries don’t change due to floating point error!
    if (isNaN(x0)) {
      x1 = (x0 = Math.floor(x)) + 1;
      y1 = (y0 = Math.floor(y)) + 1;
    }

    // Otherwise, double repeatedly to cover.
    else {
      var z = x1 - x0,
          node = this._root,
          parent,
          i;

      while (x0 > x || x >= x1 || y0 > y || y >= y1) {
        i = (y < y0) << 1 | (x < x0);
        parent = new Array(4), parent[i] = node, node = parent, z *= 2;
        switch (i) {
          case 0: x1 = x0 + z, y1 = y0 + z; break;
          case 1: x0 = x1 - z, y1 = y0 + z; break;
          case 2: x1 = x0 + z, y0 = y1 - z; break;
          case 3: x0 = x1 - z, y0 = y1 - z; break;
        }
      }

      if (this._root && this._root.length) this._root = node;
    }

    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    return this;
  }

  function tree_data() {
    var data = [];
    this.visit(function(node) {
      if (!node.length) do data.push(node.data); while (node = node.next)
    });
    return data;
  }

  function tree_extent(_) {
    return arguments.length
        ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
        : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
  }

  function Quad(node, x0, y0, x1, y1) {
    this.node = node;
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  }

  function tree_find(x, y, radius) {
    var data,
        x0 = this._x0,
        y0 = this._y0,
        x1,
        y1,
        x2,
        y2,
        x3 = this._x1,
        y3 = this._y1,
        quads = [],
        node = this._root,
        q,
        i;

    if (node) quads.push(new Quad(node, x0, y0, x3, y3));
    if (radius == null) radius = Infinity;
    else {
      x0 = x - radius, y0 = y - radius;
      x3 = x + radius, y3 = y + radius;
      radius *= radius;
    }

    while (q = quads.pop()) {

      // Stop searching if this quadrant can’t contain a closer node.
      if (!(node = q.node)
          || (x1 = q.x0) > x3
          || (y1 = q.y0) > y3
          || (x2 = q.x1) < x0
          || (y2 = q.y1) < y0) continue;

      // Bisect the current quadrant.
      if (node.length) {
        var xm = (x1 + x2) / 2,
            ym = (y1 + y2) / 2;

        quads.push(
          new Quad(node[3], xm, ym, x2, y2),
          new Quad(node[2], x1, ym, xm, y2),
          new Quad(node[1], xm, y1, x2, ym),
          new Quad(node[0], x1, y1, xm, ym)
        );

        // Visit the closest quadrant first.
        if (i = (y >= ym) << 1 | (x >= xm)) {
          q = quads[quads.length - 1];
          quads[quads.length - 1] = quads[quads.length - 1 - i];
          quads[quads.length - 1 - i] = q;
        }
      }

      // Visit this point. (Visiting coincident points isn’t necessary!)
      else {
        var dx = x - +this._x.call(null, node.data),
            dy = y - +this._y.call(null, node.data),
            d2 = dx * dx + dy * dy;
        if (d2 < radius) {
          var d = Math.sqrt(radius = d2);
          x0 = x - d, y0 = y - d;
          x3 = x + d, y3 = y + d;
          data = node.data;
        }
      }
    }

    return data;
  }

  function tree_remove(d) {
    if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

    var parent,
        node = this._root,
        retainer,
        previous,
        next,
        x0 = this._x0,
        y0 = this._y0,
        x1 = this._x1,
        y1 = this._y1,
        x,
        y,
        xm,
        ym,
        right,
        bottom,
        i,
        j;

    // If the tree is empty, initialize the root as a leaf.
    if (!node) return this;

    // Find the leaf node for the point.
    // While descending, also retain the deepest parent with a non-removed sibling.
    if (node.length) while (true) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
      if (!node.length) break;
      if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
    }

    // Find the point to remove.
    while (node.data !== d) if (!(previous = node, node = node.next)) return this;
    if (next = node.next) delete node.next;

    // If there are multiple coincident points, remove just the point.
    if (previous) return (next ? previous.next = next : delete previous.next), this;

    // If this is the root point, remove it.
    if (!parent) return this._root = next, this;

    // Remove this leaf.
    next ? parent[i] = next : delete parent[i];

    // If the parent now contains exactly one leaf, collapse superfluous parents.
    if ((node = parent[0] || parent[1] || parent[2] || parent[3])
        && node === (parent[3] || parent[2] || parent[1] || parent[0])
        && !node.length) {
      if (retainer) retainer[j] = node;
      else this._root = node;
    }

    return this;
  }

  function removeAll(data) {
    for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
    return this;
  }

  function tree_root() {
    return this._root;
  }

  function tree_size() {
    var size = 0;
    this.visit(function(node) {
      if (!node.length) do ++size; while (node = node.next)
    });
    return size;
  }

  function tree_visit(callback) {
    var quads = [], q, node = this._root, child, x0, y0, x1, y1;
    if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) {
      if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
        var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
        if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
        if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
        if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
        if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
      }
    }
    return this;
  }

  function tree_visitAfter(callback) {
    var quads = [], next = [], q;
    if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) {
      var node = q.node;
      if (node.length) {
        var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
        if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
        if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
        if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
        if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
      }
      next.push(q);
    }
    while (q = next.pop()) {
      callback(q.node, q.x0, q.y0, q.x1, q.y1);
    }
    return this;
  }

  function defaultX(d) {
    return d[0];
  }

  function tree_x(_) {
    return arguments.length ? (this._x = _, this) : this._x;
  }

  function defaultY(d) {
    return d[1];
  }

  function tree_y(_) {
    return arguments.length ? (this._y = _, this) : this._y;
  }

  function quadtree(nodes, x, y) {
    var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
    return nodes == null ? tree : tree.addAll(nodes);
  }

  function Quadtree(x, y, x0, y0, x1, y1) {
    this._x = x;
    this._y = y;
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    this._root = undefined;
  }

  function leaf_copy(leaf) {
    var copy = {data: leaf.data}, next = copy;
    while (leaf = leaf.next) next = next.next = {data: leaf.data};
    return copy;
  }

  var treeProto = quadtree.prototype = Quadtree.prototype;

  treeProto.copy = function() {
    var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
        node = this._root,
        nodes,
        child;

    if (!node) return copy;

    if (!node.length) return copy._root = leaf_copy(node), copy;

    nodes = [{source: node, target: copy._root = new Array(4)}];
    while (node = nodes.pop()) {
      for (var i = 0; i < 4; ++i) {
        if (child = node.source[i]) {
          if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
          else node.target[i] = leaf_copy(child);
        }
      }
    }

    return copy;
  };

  treeProto.add = tree_add;
  treeProto.addAll = addAll;
  treeProto.cover = tree_cover;
  treeProto.data = tree_data;
  treeProto.extent = tree_extent;
  treeProto.find = tree_find;
  treeProto.remove = tree_remove;
  treeProto.removeAll = removeAll;
  treeProto.root = tree_root;
  treeProto.size = tree_size;
  treeProto.visit = tree_visit;
  treeProto.visitAfter = tree_visitAfter;
  treeProto.x = tree_x;
  treeProto.y = tree_y;

  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimal(1.23) returns ["123", 0].
  function formatDecimal(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i, coefficient = x.slice(0, i);

    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  }

  function exponent(x) {
    return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
  }

  function formatGroup(grouping, thousands) {
    return function(value, width) {
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;

      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }

      return t.reverse().join(thousands);
    };
  }

  function formatNumerals(numerals) {
    return function(value) {
      return value.replace(/[0-9]/g, function(i) {
        return numerals[+i];
      });
    };
  }

  // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
  var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

  function formatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
    var match;
    return new FormatSpecifier({
      fill: match[1],
      align: match[2],
      sign: match[3],
      symbol: match[4],
      zero: match[5],
      width: match[6],
      comma: match[7],
      precision: match[8] && match[8].slice(1),
      trim: match[9],
      type: match[10]
    });
  }

  formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

  function FormatSpecifier(specifier) {
    this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
    this.align = specifier.align === undefined ? ">" : specifier.align + "";
    this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
    this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
    this.zero = !!specifier.zero;
    this.width = specifier.width === undefined ? undefined : +specifier.width;
    this.comma = !!specifier.comma;
    this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
    this.trim = !!specifier.trim;
    this.type = specifier.type === undefined ? "" : specifier.type + "";
  }

  FormatSpecifier.prototype.toString = function() {
    return this.fill
        + this.align
        + this.sign
        + this.symbol
        + (this.zero ? "0" : "")
        + (this.width === undefined ? "" : Math.max(1, this.width | 0))
        + (this.comma ? "," : "")
        + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
        + (this.trim ? "~" : "")
        + this.type;
  };

  // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
  function formatTrim(s) {
    out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (s[i]) {
        case ".": i0 = i1 = i; break;
        case "0": if (i0 === 0) i0 = i; i1 = i; break;
        default: if (i0 > 0) { if (!+s[i]) break out; i0 = 0; } break;
      }
    }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
  }

  var prefixExponent;

  function formatPrefixAuto(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient
        : i > n ? coefficient + new Array(i - n + 1).join("0")
        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
        : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
  }

  function formatRounded(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  var formatTypes = {
    "%": function(x, p) { return (x * 100).toFixed(p); },
    "b": function(x) { return Math.round(x).toString(2); },
    "c": function(x) { return x + ""; },
    "d": function(x) { return Math.round(x).toString(10); },
    "e": function(x, p) { return x.toExponential(p); },
    "f": function(x, p) { return x.toFixed(p); },
    "g": function(x, p) { return x.toPrecision(p); },
    "o": function(x) { return Math.round(x).toString(8); },
    "p": function(x, p) { return formatRounded(x * 100, p); },
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
    "x": function(x) { return Math.round(x).toString(16); }
  };

  function identity$2(x) {
    return x;
  }

  var map$1 = Array.prototype.map,
      prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

  function formatLocale(locale) {
    var group = locale.grouping === undefined || locale.thousands === undefined ? identity$2 : formatGroup(map$1.call(locale.grouping, Number), locale.thousands + ""),
        currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
        currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
        decimal = locale.decimal === undefined ? "." : locale.decimal + "",
        numerals = locale.numerals === undefined ? identity$2 : formatNumerals(map$1.call(locale.numerals, String)),
        percent = locale.percent === undefined ? "%" : locale.percent + "",
        minus = locale.minus === undefined ? "-" : locale.minus + "",
        nan = locale.nan === undefined ? "NaN" : locale.nan + "";

    function newFormat(specifier) {
      specifier = formatSpecifier(specifier);

      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          trim = specifier.trim,
          type = specifier.type;

      // The "n" type is an alias for ",g".
      if (type === "n") comma = true, type = "g";

      // The "" type, and any invalid type, is an alias for ".12~g".
      else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

      // If zero fill is specified, padding goes after sign and before digits.
      if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = /[defgprs%]/.test(type);

      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision === undefined ? 6
          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
          : Math.max(0, Math.min(20, precision));

      function format(value) {
        var valuePrefix = prefix,
            valueSuffix = suffix,
            i, n, c;

        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;

          // Perform the initial formatting.
          var valueNegative = value < 0;
          value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

          // Trim insignificant zeros.
          if (trim) value = formatTrim(value);

          // If a negative value rounds to zero during formatting, treat as positive.
          if (valueNegative && +value === 0) valueNegative = false;

          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;

          valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) {
            i = -1, n = value.length;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }

        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);

        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";

        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

        // Reconstruct the final output based on the desired alignment.
        switch (align) {
          case "<": value = valuePrefix + value + valueSuffix + padding; break;
          case "=": value = valuePrefix + padding + value + valueSuffix; break;
          case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
          default: value = padding + valuePrefix + value + valueSuffix; break;
        }

        return numerals(value);
      }

      format.toString = function() {
        return specifier + "";
      };

      return format;
    }

    function formatPrefix(specifier, value) {
      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function(value) {
        return f(k * value) + prefix;
      };
    }

    return {
      format: newFormat,
      formatPrefix: formatPrefix
    };
  }

  var locale;
  var format;
  var formatPrefix;

  defaultLocale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""],
    minus: "-"
  });

  function defaultLocale(definition) {
    locale = formatLocale(definition);
    format = locale.format;
    formatPrefix = locale.formatPrefix;
    return locale;
  }

  function precisionFixed(step) {
    return Math.max(0, -exponent(Math.abs(step)));
  }

  function precisionPrefix(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
  }

  function precisionRound(step, max) {
    step = Math.abs(step), max = Math.abs(max) - step;
    return Math.max(0, exponent(max) - exponent(step)) + 1;
  }

  // Adds floating point numbers with twice the normal precision.
  // Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
  // Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
  // 305–363 (1997).
  // Code adapted from GeographicLib by Charles F. F. Karney,
  // http://geographiclib.sourceforge.net/

  function adder() {
    return new Adder;
  }

  function Adder() {
    this.reset();
  }

  Adder.prototype = {
    constructor: Adder,
    reset: function() {
      this.s = // rounded value
      this.t = 0; // exact error
    },
    add: function(y) {
      add$1(temp, y, this.t);
      add$1(this, temp.s, this.s);
      if (this.s) this.t += temp.t;
      else this.s = temp.t;
    },
    valueOf: function() {
      return this.s;
    }
  };

  var temp = new Adder;

  function add$1(adder, a, b) {
    var x = adder.s = a + b,
        bv = x - a,
        av = x - bv;
    adder.t = (a - av) + (b - bv);
  }

  var areaRingSum = adder();

  var areaSum = adder();

  var deltaSum = adder();

  var sum$1 = adder();

  var lengthSum = adder();

  var areaSum$1 = adder(),
      areaRingSum$1 = adder();

  var lengthSum$1 = adder();

  function initRange(domain, range) {
    switch (arguments.length) {
      case 0: break;
      case 1: this.range(domain); break;
      default: this.range(range).domain(domain); break;
    }
    return this;
  }

  var array$1 = Array.prototype;

  var map$2 = array$1.map;
  var slice$1 = array$1.slice;

  var implicit = {name: "implicit"};

  function ordinal() {
    var index = map(),
        domain = [],
        range = [],
        unknown = implicit;

    function scale(d) {
      var key = d + "", i = index.get(key);
      if (!i) {
        if (unknown !== implicit) return unknown;
        index.set(key, i = domain.push(d));
      }
      return range[(i - 1) % range.length];
    }

    scale.domain = function(_) {
      if (!arguments.length) return domain.slice();
      domain = [], index = map();
      var i = -1, n = _.length, d, key;
      while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
      return scale;
    };

    scale.range = function(_) {
      return arguments.length ? (range = slice$1.call(_), scale) : range.slice();
    };

    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };

    scale.copy = function() {
      return ordinal(domain, range).unknown(unknown);
    };

    initRange.apply(scale, arguments);

    return scale;
  }

  function band() {
    var scale = ordinal().unknown(undefined),
        domain = scale.domain,
        ordinalRange = scale.range,
        range$1 = [0, 1],
        step,
        bandwidth,
        round = false,
        paddingInner = 0,
        paddingOuter = 0,
        align = 0.5;

    delete scale.unknown;

    function rescale() {
      var n = domain().length,
          reverse = range$1[1] < range$1[0],
          start = range$1[reverse - 0],
          stop = range$1[1 - reverse];
      step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
      if (round) step = Math.floor(step);
      start += (stop - start - step * (n - paddingInner)) * align;
      bandwidth = step * (1 - paddingInner);
      if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
      var values = range(n).map(function(i) { return start + step * i; });
      return ordinalRange(reverse ? values.reverse() : values);
    }

    scale.domain = function(_) {
      return arguments.length ? (domain(_), rescale()) : domain();
    };

    scale.range = function(_) {
      return arguments.length ? (range$1 = [+_[0], +_[1]], rescale()) : range$1.slice();
    };

    scale.rangeRound = function(_) {
      return range$1 = [+_[0], +_[1]], round = true, rescale();
    };

    scale.bandwidth = function() {
      return bandwidth;
    };

    scale.step = function() {
      return step;
    };

    scale.round = function(_) {
      return arguments.length ? (round = !!_, rescale()) : round;
    };

    scale.padding = function(_) {
      return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
    };

    scale.paddingInner = function(_) {
      return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
    };

    scale.paddingOuter = function(_) {
      return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
    };

    scale.align = function(_) {
      return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
    };

    scale.copy = function() {
      return band(domain(), range$1)
          .round(round)
          .paddingInner(paddingInner)
          .paddingOuter(paddingOuter)
          .align(align);
    };

    return initRange.apply(rescale(), arguments);
  }

  function constant$3(x) {
    return function() {
      return x;
    };
  }

  function number$1(x) {
    return +x;
  }

  var unit = [0, 1];

  function identity$3(x) {
    return x;
  }

  function normalize(a, b) {
    return (b -= (a = +a))
        ? function(x) { return (x - a) / b; }
        : constant$3(isNaN(b) ? NaN : 0.5);
  }

  function clamper(domain) {
    var a = domain[0], b = domain[domain.length - 1], t;
    if (a > b) t = a, a = b, b = t;
    return function(x) { return Math.max(a, Math.min(b, x)); };
  }

  // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
  // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
  function bimap(domain, range, interpolate) {
    var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
    if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
    else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
    return function(x) { return r0(d0(x)); };
  }

  function polymap(domain, range, interpolate) {
    var j = Math.min(domain.length, range.length) - 1,
        d = new Array(j),
        r = new Array(j),
        i = -1;

    // Reverse descending domains.
    if (domain[j] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }

    while (++i < j) {
      d[i] = normalize(domain[i], domain[i + 1]);
      r[i] = interpolate(range[i], range[i + 1]);
    }

    return function(x) {
      var i = bisectRight(domain, x, 1, j) - 1;
      return r[i](d[i](x));
    };
  }

  function copy(source, target) {
    return target
        .domain(source.domain())
        .range(source.range())
        .interpolate(source.interpolate())
        .clamp(source.clamp())
        .unknown(source.unknown());
  }

  function transformer() {
    var domain = unit,
        range = unit,
        interpolate$1 = interpolate,
        transform,
        untransform,
        unknown,
        clamp = identity$3,
        piecewise,
        output,
        input;

    function rescale() {
      piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
      output = input = null;
      return scale;
    }

    function scale(x) {
      return isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
    }

    scale.invert = function(y) {
      return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
    };

    scale.domain = function(_) {
      return arguments.length ? (domain = map$2.call(_, number$1), clamp === identity$3 || (clamp = clamper(domain)), rescale()) : domain.slice();
    };

    scale.range = function(_) {
      return arguments.length ? (range = slice$1.call(_), rescale()) : range.slice();
    };

    scale.rangeRound = function(_) {
      return range = slice$1.call(_), interpolate$1 = interpolateRound, rescale();
    };

    scale.clamp = function(_) {
      return arguments.length ? (clamp = _ ? clamper(domain) : identity$3, scale) : clamp !== identity$3;
    };

    scale.interpolate = function(_) {
      return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
    };

    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };

    return function(t, u) {
      transform = t, untransform = u;
      return rescale();
    };
  }

  function continuous(transform, untransform) {
    return transformer()(transform, untransform);
  }

  function tickFormat(start, stop, count, specifier) {
    var step = tickStep(start, stop, count),
        precision;
    specifier = formatSpecifier(specifier == null ? ",f" : specifier);
    switch (specifier.type) {
      case "s": {
        var value = Math.max(Math.abs(start), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
        return formatPrefix(specifier, value);
      }
      case "":
      case "e":
      case "g":
      case "p":
      case "r": {
        if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
        break;
      }
      case "f":
      case "%": {
        if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      }
    }
    return format(specifier);
  }

  function linearish(scale) {
    var domain = scale.domain;

    scale.ticks = function(count) {
      var d = domain();
      return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
    };

    scale.tickFormat = function(count, specifier) {
      var d = domain();
      return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
    };

    scale.nice = function(count) {
      if (count == null) count = 10;

      var d = domain(),
          i0 = 0,
          i1 = d.length - 1,
          start = d[i0],
          stop = d[i1],
          step;

      if (stop < start) {
        step = start, start = stop, stop = step;
        step = i0, i0 = i1, i1 = step;
      }

      step = tickIncrement(start, stop, count);

      if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
        step = tickIncrement(start, stop, count);
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
        step = tickIncrement(start, stop, count);
      }

      if (step > 0) {
        d[i0] = Math.floor(start / step) * step;
        d[i1] = Math.ceil(stop / step) * step;
        domain(d);
      } else if (step < 0) {
        d[i0] = Math.ceil(start * step) / step;
        d[i1] = Math.floor(stop * step) / step;
        domain(d);
      }

      return scale;
    };

    return scale;
  }

  function linear$1() {
    var scale = continuous(identity$3, identity$3);

    scale.copy = function() {
      return copy(scale, linear$1());
    };

    initRange.apply(scale, arguments);

    return linearish(scale);
  }

  function nice(domain, interval) {
    domain = domain.slice();

    var i0 = 0,
        i1 = domain.length - 1,
        x0 = domain[i0],
        x1 = domain[i1],
        t;

    if (x1 < x0) {
      t = i0, i0 = i1, i1 = t;
      t = x0, x0 = x1, x1 = t;
    }

    domain[i0] = interval.floor(x0);
    domain[i1] = interval.ceil(x1);
    return domain;
  }

  function quantize() {
    var x0 = 0,
        x1 = 1,
        n = 1,
        domain = [0.5],
        range = [0, 1],
        unknown;

    function scale(x) {
      return x <= x ? range[bisectRight(domain, x, 0, n)] : unknown;
    }

    function rescale() {
      var i = -1;
      domain = new Array(n);
      while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);
      return scale;
    }

    scale.domain = function(_) {
      return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
    };

    scale.range = function(_) {
      return arguments.length ? (n = (range = slice$1.call(_)).length - 1, rescale()) : range.slice();
    };

    scale.invertExtent = function(y) {
      var i = range.indexOf(y);
      return i < 0 ? [NaN, NaN]
          : i < 1 ? [x0, domain[0]]
          : i >= n ? [domain[n - 1], x1]
          : [domain[i - 1], domain[i]];
    };

    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : scale;
    };

    scale.thresholds = function() {
      return domain.slice();
    };

    scale.copy = function() {
      return quantize()
          .domain([x0, x1])
          .range(range)
          .unknown(unknown);
    };

    return initRange.apply(linearish(scale), arguments);
  }

  var t0$1 = new Date,
      t1$1 = new Date;

  function newInterval(floori, offseti, count, field) {

    function interval(date) {
      return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
    }

    interval.floor = function(date) {
      return floori(date = new Date(+date)), date;
    };

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
    };

    interval.round = function(date) {
      var d0 = interval(date),
          d1 = interval.ceil(date);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [], previous;
      start = interval.ceil(start);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
      while (previous < start && start < stop);
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        if (date >= date) {
          if (step < 0) while (++step <= 0) {
            while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
          } else while (--step >= 0) {
            while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
          }
        }
      });
    };

    if (count) {
      interval.count = function(start, end) {
        t0$1.setTime(+start), t1$1.setTime(+end);
        floori(t0$1), floori(t1$1);
        return Math.floor(count(t0$1, t1$1));
      };

      interval.every = function(step) {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null
            : !(step > 1) ? interval
            : interval.filter(field
                ? function(d) { return field(d) % step === 0; }
                : function(d) { return interval.count(0, d) % step === 0; });
      };
    }

    return interval;
  }

  var millisecond = newInterval(function() {
    // noop
  }, function(date, step) {
    date.setTime(+date + step);
  }, function(start, end) {
    return end - start;
  });

  // An optimized implementation for this simple case.
  millisecond.every = function(k) {
    k = Math.floor(k);
    if (!isFinite(k) || !(k > 0)) return null;
    if (!(k > 1)) return millisecond;
    return newInterval(function(date) {
      date.setTime(Math.floor(date / k) * k);
    }, function(date, step) {
      date.setTime(+date + step * k);
    }, function(start, end) {
      return (end - start) / k;
    });
  };

  var durationSecond = 1e3;
  var durationMinute = 6e4;
  var durationHour = 36e5;
  var durationDay = 864e5;
  var durationWeek = 6048e5;

  var second = newInterval(function(date) {
    date.setTime(date - date.getMilliseconds());
  }, function(date, step) {
    date.setTime(+date + step * durationSecond);
  }, function(start, end) {
    return (end - start) / durationSecond;
  }, function(date) {
    return date.getUTCSeconds();
  });

  var minute = newInterval(function(date) {
    date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
  }, function(date, step) {
    date.setTime(+date + step * durationMinute);
  }, function(start, end) {
    return (end - start) / durationMinute;
  }, function(date) {
    return date.getMinutes();
  });

  var hour = newInterval(function(date) {
    date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
  }, function(date, step) {
    date.setTime(+date + step * durationHour);
  }, function(start, end) {
    return (end - start) / durationHour;
  }, function(date) {
    return date.getHours();
  });

  var day = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
  }, function(date) {
    return date.getDate() - 1;
  });

  function weekday(i) {
    return newInterval(function(date) {
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
    });
  }

  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);

  var month = newInterval(function(date) {
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setMonth(date.getMonth() + step);
  }, function(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  }, function(date) {
    return date.getMonth();
  });
  var months = month.range;

  var year = newInterval(function(date) {
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  }, function(date) {
    return date.getFullYear();
  });

  // An optimized implementation for this simple case.
  year.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setFullYear(Math.floor(date.getFullYear() / k) * k);
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step * k);
    });
  };

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / durationDay;
  }, function(date) {
    return date.getUTCDate() - 1;
  });

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / durationWeek;
    });
  }

  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);

  var utcYear = newInterval(function(date) {
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  }, function(date) {
    return date.getUTCFullYear();
  });

  // An optimized implementation for this simple case.
  utcYear.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step * k);
    });
  };

  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function newDate(y, m, d) {
    return {y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0};
  }

  function formatLocale$1(locale) {
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;

    var periodRe = formatRe(locale_periods),
        periodLookup = formatLookup(locale_periods),
        weekdayRe = formatRe(locale_weekdays),
        weekdayLookup = formatLookup(locale_weekdays),
        shortWeekdayRe = formatRe(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
        monthRe = formatRe(locale_months),
        monthLookup = formatLookup(locale_months),
        shortMonthRe = formatRe(locale_shortMonths),
        shortMonthLookup = formatLookup(locale_shortMonths);

    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "f": formatMicroseconds,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "q": formatQuarter,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatSeconds,
      "u": formatWeekdayNumberMonday,
      "U": formatWeekNumberSunday,
      "V": formatWeekNumberISO,
      "w": formatWeekdayNumberSunday,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatYear$1,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    };

    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "f": formatUTCMicroseconds,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "q": formatUTCQuarter,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatUTCSeconds,
      "u": formatUTCWeekdayNumberMonday,
      "U": formatUTCWeekNumberSunday,
      "V": formatUTCWeekNumberISO,
      "w": formatUTCWeekdayNumberSunday,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    };

    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "f": parseMicroseconds,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "q": parseQuarter,
      "Q": parseUnixTimestamp,
      "s": parseUnixTimestampSeconds,
      "S": parseSeconds,
      "u": parseWeekdayNumberMonday,
      "U": parseWeekNumberSunday,
      "V": parseWeekNumberISO,
      "w": parseWeekdayNumberSunday,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    };

    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);

    function newFormat(specifier, formats) {
      return function(date) {
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;

        if (!(date instanceof Date)) date = new Date(+date);

        while (++i < n) {
          if (specifier.charCodeAt(i) === 37) {
            string.push(specifier.slice(j, i));
            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
            else pad = c === "e" ? " " : "0";
            if (format = formats[c]) c = format(date, pad);
            string.push(c);
            j = i + 1;
          }
        }

        string.push(specifier.slice(j, i));
        return string.join("");
      };
    }

    function newParse(specifier, Z) {
      return function(string) {
        var d = newDate(1900, undefined, 1),
            i = parseSpecifier(d, specifier, string += "", 0),
            week, day$1;
        if (i != string.length) return null;

        // If a UNIX timestamp is specified, return it.
        if ("Q" in d) return new Date(d.Q);
        if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));

        // If this is utcParse, never use the local timezone.
        if (Z && !("Z" in d)) d.Z = 0;

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // If the month was not specified, inherit from the quarter.
        if (d.m === undefined) d.m = "q" in d ? d.q : 0;

        // Convert day-of-week and week-of-year to day-of-year.
        if ("V" in d) {
          if (d.V < 1 || d.V > 53) return null;
          if (!("w" in d)) d.w = 1;
          if ("Z" in d) {
            week = utcDate(newDate(d.y, 0, 1)), day$1 = week.getUTCDay();
            week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
            week = utcDay.offset(week, (d.V - 1) * 7);
            d.y = week.getUTCFullYear();
            d.m = week.getUTCMonth();
            d.d = week.getUTCDate() + (d.w + 6) % 7;
          } else {
            week = localDate(newDate(d.y, 0, 1)), day$1 = week.getDay();
            week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday(week);
            week = day.offset(week, (d.V - 1) * 7);
            d.y = week.getFullYear();
            d.m = week.getMonth();
            d.d = week.getDate() + (d.w + 6) % 7;
          }
        } else if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
          day$1 = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
          d.m = 0;
          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
        }

        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) {
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        }

        // Otherwise, all fields are in local time.
        return localDate(d);
      };
    }

    function parseSpecifier(d, specifier, string, j) {
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;

      while (i < n) {
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) {
          c = specifier.charAt(i++);
          parse = parses[c in pads ? specifier.charAt(i++) : c];
          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }

      return j;
    }

    function parsePeriod(d, string, i) {
      var n = periodRe.exec(string.slice(i));
      return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortWeekday(d, string, i) {
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseWeekday(d, string, i) {
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortMonth(d, string, i) {
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseMonth(d, string, i) {
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseLocaleDateTime(d, string, i) {
      return parseSpecifier(d, locale_dateTime, string, i);
    }

    function parseLocaleDate(d, string, i) {
      return parseSpecifier(d, locale_date, string, i);
    }

    function parseLocaleTime(d, string, i) {
      return parseSpecifier(d, locale_time, string, i);
    }

    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }

    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }

    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }

    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }

    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }

    function formatQuarter(d) {
      return 1 + ~~(d.getMonth() / 3);
    }

    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }

    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }

    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }

    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }

    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }

    function formatUTCQuarter(d) {
      return 1 + ~~(d.getUTCMonth() / 3);
    }

    return {
      format: function(specifier) {
        var f = newFormat(specifier += "", formats);
        f.toString = function() { return specifier; };
        return f;
      },
      parse: function(specifier) {
        var p = newParse(specifier += "", false);
        p.toString = function() { return specifier; };
        return p;
      },
      utcFormat: function(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.toString = function() { return specifier; };
        return f;
      },
      utcParse: function(specifier) {
        var p = newParse(specifier += "", true);
        p.toString = function() { return specifier; };
        return p;
      }
    };
  }

  var pads = {"-": "", "_": " ", "0": "0"},
      numberRe = /^\s*\d+/, // note: ignores next directive
      percentRe = /^%/,
      requoteRe = /[\\^$*+?|[\]().{}]/g;

  function pad$1(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }

  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }

  function formatLookup(names) {
    var map = {}, i = -1, n = names.length;
    while (++i < n) map[names[i].toLowerCase()] = i;
    return map;
  }

  function parseWeekdayNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekdayNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.u = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberISO(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.V = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  }

  function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }

  function parseZone(d, string, i) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
  }

  function parseQuarter(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
  }

  function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }

  function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  }

  function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }

  function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  }

  function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  }

  function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  }

  function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  }

  function parseMicroseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 6));
    return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
  }

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function parseUnixTimestamp(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.Q = +n[0], i + n[0].length) : -1;
  }

  function parseUnixTimestampSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.s = +n[0], i + n[0].length) : -1;
  }

  function formatDayOfMonth(d, p) {
    return pad$1(d.getDate(), p, 2);
  }

  function formatHour24(d, p) {
    return pad$1(d.getHours(), p, 2);
  }

  function formatHour12(d, p) {
    return pad$1(d.getHours() % 12 || 12, p, 2);
  }

  function formatDayOfYear(d, p) {
    return pad$1(1 + day.count(year(d), d), p, 3);
  }

  function formatMilliseconds(d, p) {
    return pad$1(d.getMilliseconds(), p, 3);
  }

  function formatMicroseconds(d, p) {
    return formatMilliseconds(d, p) + "000";
  }

  function formatMonthNumber(d, p) {
    return pad$1(d.getMonth() + 1, p, 2);
  }

  function formatMinutes(d, p) {
    return pad$1(d.getMinutes(), p, 2);
  }

  function formatSeconds(d, p) {
    return pad$1(d.getSeconds(), p, 2);
  }

  function formatWeekdayNumberMonday(d) {
    var day = d.getDay();
    return day === 0 ? 7 : day;
  }

  function formatWeekNumberSunday(d, p) {
    return pad$1(sunday.count(year(d) - 1, d), p, 2);
  }

  function formatWeekNumberISO(d, p) {
    var day = d.getDay();
    d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
    return pad$1(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
  }

  function formatWeekdayNumberSunday(d) {
    return d.getDay();
  }

  function formatWeekNumberMonday(d, p) {
    return pad$1(monday.count(year(d) - 1, d), p, 2);
  }

  function formatYear$1(d, p) {
    return pad$1(d.getFullYear() % 100, p, 2);
  }

  function formatFullYear(d, p) {
    return pad$1(d.getFullYear() % 10000, p, 4);
  }

  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad$1(z / 60 | 0, "0", 2)
        + pad$1(z % 60, "0", 2);
  }

  function formatUTCDayOfMonth(d, p) {
    return pad$1(d.getUTCDate(), p, 2);
  }

  function formatUTCHour24(d, p) {
    return pad$1(d.getUTCHours(), p, 2);
  }

  function formatUTCHour12(d, p) {
    return pad$1(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCDayOfYear(d, p) {
    return pad$1(1 + utcDay.count(utcYear(d), d), p, 3);
  }

  function formatUTCMilliseconds(d, p) {
    return pad$1(d.getUTCMilliseconds(), p, 3);
  }

  function formatUTCMicroseconds(d, p) {
    return formatUTCMilliseconds(d, p) + "000";
  }

  function formatUTCMonthNumber(d, p) {
    return pad$1(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMinutes(d, p) {
    return pad$1(d.getUTCMinutes(), p, 2);
  }

  function formatUTCSeconds(d, p) {
    return pad$1(d.getUTCSeconds(), p, 2);
  }

  function formatUTCWeekdayNumberMonday(d) {
    var dow = d.getUTCDay();
    return dow === 0 ? 7 : dow;
  }

  function formatUTCWeekNumberSunday(d, p) {
    return pad$1(utcSunday.count(utcYear(d) - 1, d), p, 2);
  }

  function formatUTCWeekNumberISO(d, p) {
    var day = d.getUTCDay();
    d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
    return pad$1(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
  }

  function formatUTCWeekdayNumberSunday(d) {
    return d.getUTCDay();
  }

  function formatUTCWeekNumberMonday(d, p) {
    return pad$1(utcMonday.count(utcYear(d) - 1, d), p, 2);
  }

  function formatUTCYear(d, p) {
    return pad$1(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCFullYear(d, p) {
    return pad$1(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCZone() {
    return "+0000";
  }

  function formatLiteralPercent() {
    return "%";
  }

  function formatUnixTimestamp(d) {
    return +d;
  }

  function formatUnixTimestampSeconds(d) {
    return Math.floor(+d / 1000);
  }

  var locale$1;
  var timeFormat;
  var timeParse;
  var utcFormat;
  var utcParse;

  defaultLocale$1({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  function defaultLocale$1(definition) {
    locale$1 = formatLocale$1(definition);
    timeFormat = locale$1.format;
    timeParse = locale$1.parse;
    utcFormat = locale$1.utcFormat;
    utcParse = locale$1.utcParse;
    return locale$1;
  }

  var durationSecond$1 = 1000,
      durationMinute$1 = durationSecond$1 * 60,
      durationHour$1 = durationMinute$1 * 60,
      durationDay$1 = durationHour$1 * 24,
      durationWeek$1 = durationDay$1 * 7,
      durationMonth = durationDay$1 * 30,
      durationYear = durationDay$1 * 365;

  function date$1(t) {
    return new Date(t);
  }

  function number$2(t) {
    return t instanceof Date ? +t : +new Date(+t);
  }

  function calendar(year, month, week, day, hour, minute, second, millisecond, format) {
    var scale = continuous(identity$3, identity$3),
        invert = scale.invert,
        domain = scale.domain;

    var formatMillisecond = format(".%L"),
        formatSecond = format(":%S"),
        formatMinute = format("%I:%M"),
        formatHour = format("%I %p"),
        formatDay = format("%a %d"),
        formatWeek = format("%b %d"),
        formatMonth = format("%B"),
        formatYear = format("%Y");

    var tickIntervals = [
      [second,  1,      durationSecond$1],
      [second,  5,  5 * durationSecond$1],
      [second, 15, 15 * durationSecond$1],
      [second, 30, 30 * durationSecond$1],
      [minute,  1,      durationMinute$1],
      [minute,  5,  5 * durationMinute$1],
      [minute, 15, 15 * durationMinute$1],
      [minute, 30, 30 * durationMinute$1],
      [  hour,  1,      durationHour$1  ],
      [  hour,  3,  3 * durationHour$1  ],
      [  hour,  6,  6 * durationHour$1  ],
      [  hour, 12, 12 * durationHour$1  ],
      [   day,  1,      durationDay$1   ],
      [   day,  2,  2 * durationDay$1   ],
      [  week,  1,      durationWeek$1  ],
      [ month,  1,      durationMonth ],
      [ month,  3,  3 * durationMonth ],
      [  year,  1,      durationYear  ]
    ];

    function tickFormat(date) {
      return (second(date) < date ? formatMillisecond
          : minute(date) < date ? formatSecond
          : hour(date) < date ? formatMinute
          : day(date) < date ? formatHour
          : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
          : year(date) < date ? formatMonth
          : formatYear)(date);
    }

    function tickInterval(interval, start, stop, step) {
      if (interval == null) interval = 10;

      // If a desired tick count is specified, pick a reasonable tick interval
      // based on the extent of the domain and a rough estimate of tick size.
      // Otherwise, assume interval is already a time interval and use it.
      if (typeof interval === "number") {
        var target = Math.abs(stop - start) / interval,
            i = bisector(function(i) { return i[2]; }).right(tickIntervals, target);
        if (i === tickIntervals.length) {
          step = tickStep(start / durationYear, stop / durationYear, interval);
          interval = year;
        } else if (i) {
          i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
          step = i[1];
          interval = i[0];
        } else {
          step = Math.max(tickStep(start, stop, interval), 1);
          interval = millisecond;
        }
      }

      return step == null ? interval : interval.every(step);
    }

    scale.invert = function(y) {
      return new Date(invert(y));
    };

    scale.domain = function(_) {
      return arguments.length ? domain(map$2.call(_, number$2)) : domain().map(date$1);
    };

    scale.ticks = function(interval, step) {
      var d = domain(),
          t0 = d[0],
          t1 = d[d.length - 1],
          r = t1 < t0,
          t;
      if (r) t = t0, t0 = t1, t1 = t;
      t = tickInterval(interval, t0, t1, step);
      t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
      return r ? t.reverse() : t;
    };

    scale.tickFormat = function(count, specifier) {
      return specifier == null ? tickFormat : format(specifier);
    };

    scale.nice = function(interval, step) {
      var d = domain();
      return (interval = tickInterval(interval, d[0], d[d.length - 1], step))
          ? domain(nice(d, interval))
          : scale;
    };

    scale.copy = function() {
      return copy(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format));
    };

    return scale;
  }

  function time() {
    return initRange.apply(calendar(year, month, sunday, day, hour, minute, second, millisecond, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]), arguments);
  }

  function colors(specifier) {
    var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
    while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors;
  }

  var schemeCategory10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

  function ramp(scheme) {
    return rgbBasis(scheme[scheme.length - 1]);
  }

  var scheme = new Array(3).concat(
    "fc8d59ffffbf91cf60",
    "d7191cfdae61a6d96a1a9641",
    "d7191cfdae61ffffbfa6d96a1a9641",
    "d73027fc8d59fee08bd9ef8b91cf601a9850",
    "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850",
    "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850",
    "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850",
    "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837",
    "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837"
  ).map(colors);

  ramp(scheme);

  function constant$4(x) {
    return function constant() {
      return x;
    };
  }

  var abs = Math.abs;
  var atan2 = Math.atan2;
  var cos = Math.cos;
  var max$1 = Math.max;
  var min$1 = Math.min;
  var sin = Math.sin;
  var sqrt = Math.sqrt;

  var epsilon$2 = 1e-12;
  var pi$1 = Math.PI;
  var halfPi = pi$1 / 2;
  var tau$1 = 2 * pi$1;

  function acos(x) {
    return x > 1 ? 0 : x < -1 ? pi$1 : Math.acos(x);
  }

  function asin(x) {
    return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
  }

  function arcInnerRadius(d) {
    return d.innerRadius;
  }

  function arcOuterRadius(d) {
    return d.outerRadius;
  }

  function arcStartAngle(d) {
    return d.startAngle;
  }

  function arcEndAngle(d) {
    return d.endAngle;
  }

  function arcPadAngle(d) {
    return d && d.padAngle; // Note: optional!
  }

  function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
    var x10 = x1 - x0, y10 = y1 - y0,
        x32 = x3 - x2, y32 = y3 - y2,
        t = y32 * x10 - x32 * y10;
    if (t * t < epsilon$2) return;
    t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t;
    return [x0 + t * x10, y0 + t * y10];
  }

  // Compute perpendicular offset line of length rc.
  // http://mathworld.wolfram.com/Circle-LineIntersection.html
  function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
    var x01 = x0 - x1,
        y01 = y0 - y1,
        lo = (cw ? rc : -rc) / sqrt(x01 * x01 + y01 * y01),
        ox = lo * y01,
        oy = -lo * x01,
        x11 = x0 + ox,
        y11 = y0 + oy,
        x10 = x1 + ox,
        y10 = y1 + oy,
        x00 = (x11 + x10) / 2,
        y00 = (y11 + y10) / 2,
        dx = x10 - x11,
        dy = y10 - y11,
        d2 = dx * dx + dy * dy,
        r = r1 - rc,
        D = x11 * y10 - x10 * y11,
        d = (dy < 0 ? -1 : 1) * sqrt(max$1(0, r * r * d2 - D * D)),
        cx0 = (D * dy - dx * d) / d2,
        cy0 = (-D * dx - dy * d) / d2,
        cx1 = (D * dy + dx * d) / d2,
        cy1 = (-D * dx + dy * d) / d2,
        dx0 = cx0 - x00,
        dy0 = cy0 - y00,
        dx1 = cx1 - x00,
        dy1 = cy1 - y00;

    // Pick the closer of the two intersection points.
    // TODO Is there a faster way to determine which intersection to use?
    if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

    return {
      cx: cx0,
      cy: cy0,
      x01: -ox,
      y01: -oy,
      x11: cx0 * (r1 / r - 1),
      y11: cy0 * (r1 / r - 1)
    };
  }

  function arc() {
    var innerRadius = arcInnerRadius,
        outerRadius = arcOuterRadius,
        cornerRadius = constant$4(0),
        padRadius = null,
        startAngle = arcStartAngle,
        endAngle = arcEndAngle,
        padAngle = arcPadAngle,
        context = null;

    function arc() {
      var buffer,
          r,
          r0 = +innerRadius.apply(this, arguments),
          r1 = +outerRadius.apply(this, arguments),
          a0 = startAngle.apply(this, arguments) - halfPi,
          a1 = endAngle.apply(this, arguments) - halfPi,
          da = abs(a1 - a0),
          cw = a1 > a0;

      if (!context) context = buffer = path();

      // Ensure that the outer radius is always larger than the inner radius.
      if (r1 < r0) r = r1, r1 = r0, r0 = r;

      // Is it a point?
      if (!(r1 > epsilon$2)) context.moveTo(0, 0);

      // Or is it a circle or annulus?
      else if (da > tau$1 - epsilon$2) {
        context.moveTo(r1 * cos(a0), r1 * sin(a0));
        context.arc(0, 0, r1, a0, a1, !cw);
        if (r0 > epsilon$2) {
          context.moveTo(r0 * cos(a1), r0 * sin(a1));
          context.arc(0, 0, r0, a1, a0, cw);
        }
      }

      // Or is it a circular or annular sector?
      else {
        var a01 = a0,
            a11 = a1,
            a00 = a0,
            a10 = a1,
            da0 = da,
            da1 = da,
            ap = padAngle.apply(this, arguments) / 2,
            rp = (ap > epsilon$2) && (padRadius ? +padRadius.apply(this, arguments) : sqrt(r0 * r0 + r1 * r1)),
            rc = min$1(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
            rc0 = rc,
            rc1 = rc,
            t0,
            t1;

        // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
        if (rp > epsilon$2) {
          var p0 = asin(rp / r0 * sin(ap)),
              p1 = asin(rp / r1 * sin(ap));
          if ((da0 -= p0 * 2) > epsilon$2) p0 *= (cw ? 1 : -1), a00 += p0, a10 -= p0;
          else da0 = 0, a00 = a10 = (a0 + a1) / 2;
          if ((da1 -= p1 * 2) > epsilon$2) p1 *= (cw ? 1 : -1), a01 += p1, a11 -= p1;
          else da1 = 0, a01 = a11 = (a0 + a1) / 2;
        }

        var x01 = r1 * cos(a01),
            y01 = r1 * sin(a01),
            x10 = r0 * cos(a10),
            y10 = r0 * sin(a10);

        // Apply rounded corners?
        if (rc > epsilon$2) {
          var x11 = r1 * cos(a11),
              y11 = r1 * sin(a11),
              x00 = r0 * cos(a00),
              y00 = r0 * sin(a00),
              oc;

          // Restrict the corner radius according to the sector angle.
          if (da < pi$1 && (oc = intersect(x01, y01, x00, y00, x11, y11, x10, y10))) {
            var ax = x01 - oc[0],
                ay = y01 - oc[1],
                bx = x11 - oc[0],
                by = y11 - oc[1],
                kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2),
                lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
            rc0 = min$1(rc, (r0 - lc) / (kc - 1));
            rc1 = min$1(rc, (r1 - lc) / (kc + 1));
          }
        }

        // Is the sector collapsed to a line?
        if (!(da1 > epsilon$2)) context.moveTo(x01, y01);

        // Does the sector’s outer ring have rounded corners?
        else if (rc1 > epsilon$2) {
          t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
          t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

          context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

          // Have the corners merged?
          if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

          // Otherwise, draw the two corners and the ring.
          else {
            context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
            context.arc(0, 0, r1, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
            context.arc(t1.cx, t1.cy, rc1, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
          }
        }

        // Or is the outer ring just a circular arc?
        else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

        // Is there no inner ring, and it’s a circular sector?
        // Or perhaps it’s an annular sector collapsed due to padding?
        if (!(r0 > epsilon$2) || !(da0 > epsilon$2)) context.lineTo(x10, y10);

        // Does the sector’s inner ring (or point) have rounded corners?
        else if (rc0 > epsilon$2) {
          t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
          t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

          context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

          // Have the corners merged?
          if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

          // Otherwise, draw the two corners and the ring.
          else {
            context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
            context.arc(0, 0, r0, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
            context.arc(t1.cx, t1.cy, rc0, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
          }
        }

        // Or is the inner ring just a circular arc?
        else context.arc(0, 0, r0, a10, a00, cw);
      }

      context.closePath();

      if (buffer) return context = null, buffer + "" || null;
    }

    arc.centroid = function() {
      var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
          a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$1 / 2;
      return [cos(a) * r, sin(a) * r];
    };

    arc.innerRadius = function(_) {
      return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$4(+_), arc) : innerRadius;
    };

    arc.outerRadius = function(_) {
      return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$4(+_), arc) : outerRadius;
    };

    arc.cornerRadius = function(_) {
      return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$4(+_), arc) : cornerRadius;
    };

    arc.padRadius = function(_) {
      return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$4(+_), arc) : padRadius;
    };

    arc.startAngle = function(_) {
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$4(+_), arc) : startAngle;
    };

    arc.endAngle = function(_) {
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$4(+_), arc) : endAngle;
    };

    arc.padAngle = function(_) {
      return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$4(+_), arc) : padAngle;
    };

    arc.context = function(_) {
      return arguments.length ? ((context = _ == null ? null : _), arc) : context;
    };

    return arc;
  }

  function Linear(context) {
    this._context = context;
  }

  Linear.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; // proceed
        default: this._context.lineTo(x, y); break;
      }
    }
  };

  function curveLinear(context) {
    return new Linear(context);
  }

  function x(p) {
    return p[0];
  }

  function y(p) {
    return p[1];
  }

  function line() {
    var x$1 = x,
        y$1 = y,
        defined = constant$4(true),
        context = null,
        curve = curveLinear,
        output = null;

    function line(data) {
      var i,
          n = data.length,
          d,
          defined0 = false,
          buffer;

      if (context == null) output = curve(buffer = path());

      for (i = 0; i <= n; ++i) {
        if (!(i < n && defined(d = data[i], i, data)) === defined0) {
          if (defined0 = !defined0) output.lineStart();
          else output.lineEnd();
        }
        if (defined0) output.point(+x$1(d, i, data), +y$1(d, i, data));
      }

      if (buffer) return output = null, buffer + "" || null;
    }

    line.x = function(_) {
      return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant$4(+_), line) : x$1;
    };

    line.y = function(_) {
      return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant$4(+_), line) : y$1;
    };

    line.defined = function(_) {
      return arguments.length ? (defined = typeof _ === "function" ? _ : constant$4(!!_), line) : defined;
    };

    line.curve = function(_) {
      return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
    };

    line.context = function(_) {
      return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
    };

    return line;
  }

  function area() {
    var x0 = x,
        x1 = null,
        y0 = constant$4(0),
        y1 = y,
        defined = constant$4(true),
        context = null,
        curve = curveLinear,
        output = null;

    function area(data) {
      var i,
          j,
          k,
          n = data.length,
          d,
          defined0 = false,
          buffer,
          x0z = new Array(n),
          y0z = new Array(n);

      if (context == null) output = curve(buffer = path());

      for (i = 0; i <= n; ++i) {
        if (!(i < n && defined(d = data[i], i, data)) === defined0) {
          if (defined0 = !defined0) {
            j = i;
            output.areaStart();
            output.lineStart();
          } else {
            output.lineEnd();
            output.lineStart();
            for (k = i - 1; k >= j; --k) {
              output.point(x0z[k], y0z[k]);
            }
            output.lineEnd();
            output.areaEnd();
          }
        }
        if (defined0) {
          x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
          output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
        }
      }

      if (buffer) return output = null, buffer + "" || null;
    }

    function arealine() {
      return line().defined(defined).curve(curve).context(context);
    }

    area.x = function(_) {
      return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$4(+_), x1 = null, area) : x0;
    };

    area.x0 = function(_) {
      return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$4(+_), area) : x0;
    };

    area.x1 = function(_) {
      return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant$4(+_), area) : x1;
    };

    area.y = function(_) {
      return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$4(+_), y1 = null, area) : y0;
    };

    area.y0 = function(_) {
      return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$4(+_), area) : y0;
    };

    area.y1 = function(_) {
      return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant$4(+_), area) : y1;
    };

    area.lineX0 =
    area.lineY0 = function() {
      return arealine().x(x0).y(y0);
    };

    area.lineY1 = function() {
      return arealine().x(x0).y(y1);
    };

    area.lineX1 = function() {
      return arealine().x(x1).y(y0);
    };

    area.defined = function(_) {
      return arguments.length ? (defined = typeof _ === "function" ? _ : constant$4(!!_), area) : defined;
    };

    area.curve = function(_) {
      return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
    };

    area.context = function(_) {
      return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
    };

    return area;
  }

  function descending$1(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }

  function identity$4(d) {
    return d;
  }

  function pie() {
    var value = identity$4,
        sortValues = descending$1,
        sort = null,
        startAngle = constant$4(0),
        endAngle = constant$4(tau$1),
        padAngle = constant$4(0);

    function pie(data) {
      var i,
          n = data.length,
          j,
          k,
          sum = 0,
          index = new Array(n),
          arcs = new Array(n),
          a0 = +startAngle.apply(this, arguments),
          da = Math.min(tau$1, Math.max(-tau$1, endAngle.apply(this, arguments) - a0)),
          a1,
          p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
          pa = p * (da < 0 ? -1 : 1),
          v;

      for (i = 0; i < n; ++i) {
        if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
          sum += v;
        }
      }

      // Optionally sort the arcs by previously-computed values or by data.
      if (sortValues != null) index.sort(function(i, j) { return sortValues(arcs[i], arcs[j]); });
      else if (sort != null) index.sort(function(i, j) { return sort(data[i], data[j]); });

      // Compute the arcs! They are stored in the original data's order.
      for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
        j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
          data: data[j],
          index: i,
          value: v,
          startAngle: a0,
          endAngle: a1,
          padAngle: p
        };
      }

      return arcs;
    }

    pie.value = function(_) {
      return arguments.length ? (value = typeof _ === "function" ? _ : constant$4(+_), pie) : value;
    };

    pie.sortValues = function(_) {
      return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
    };

    pie.sort = function(_) {
      return arguments.length ? (sort = _, sortValues = null, pie) : sort;
    };

    pie.startAngle = function(_) {
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$4(+_), pie) : startAngle;
    };

    pie.endAngle = function(_) {
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$4(+_), pie) : endAngle;
    };

    pie.padAngle = function(_) {
      return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$4(+_), pie) : padAngle;
    };

    return pie;
  }

  var slice$2 = Array.prototype.slice;

  function noop$1() {}

  function point$1(that, x, y) {
    that._context.bezierCurveTo(
      (2 * that._x0 + that._x1) / 3,
      (2 * that._y0 + that._y1) / 3,
      (that._x0 + 2 * that._x1) / 3,
      (that._y0 + 2 * that._y1) / 3,
      (that._x0 + 4 * that._x1 + x) / 6,
      (that._y0 + 4 * that._y1 + y) / 6
    );
  }

  function Basis(context) {
    this._context = context;
  }

  Basis.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 =
      this._y0 = this._y1 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 3: point$1(this, this._x1, this._y1); // proceed
        case 2: this._context.lineTo(this._x1, this._y1); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
        default: point$1(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
    }
  };

  function curveBasis(context) {
    return new Basis(context);
  }

  function BasisClosed(context) {
    this._context = context;
  }

  BasisClosed.prototype = {
    areaStart: noop$1,
    areaEnd: noop$1,
    lineStart: function() {
      this._x0 = this._x1 = this._x2 = this._x3 = this._x4 =
      this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 1: {
          this._context.moveTo(this._x2, this._y2);
          this._context.closePath();
          break;
        }
        case 2: {
          this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
          this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
          this._context.closePath();
          break;
        }
        case 3: {
          this.point(this._x2, this._y2);
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          break;
        }
      }
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._x2 = x, this._y2 = y; break;
        case 1: this._point = 2; this._x3 = x, this._y3 = y; break;
        case 2: this._point = 3; this._x4 = x, this._y4 = y; this._context.moveTo((this._x0 + 4 * this._x1 + x) / 6, (this._y0 + 4 * this._y1 + y) / 6); break;
        default: point$1(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
    }
  };

  function curveBasisClosed(context) {
    return new BasisClosed(context);
  }

  function BasisOpen(context) {
    this._context = context;
  }

  BasisOpen.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 =
      this._y0 = this._y1 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; var x0 = (this._x0 + 4 * this._x1 + x) / 6, y0 = (this._y0 + 4 * this._y1 + y) / 6; this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0); break;
        case 3: this._point = 4; // proceed
        default: point$1(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
    }
  };

  function curveBasisOpen(context) {
    return new BasisOpen(context);
  }

  function Bundle(context, beta) {
    this._basis = new Basis(context);
    this._beta = beta;
  }

  Bundle.prototype = {
    lineStart: function() {
      this._x = [];
      this._y = [];
      this._basis.lineStart();
    },
    lineEnd: function() {
      var x = this._x,
          y = this._y,
          j = x.length - 1;

      if (j > 0) {
        var x0 = x[0],
            y0 = y[0],
            dx = x[j] - x0,
            dy = y[j] - y0,
            i = -1,
            t;

        while (++i <= j) {
          t = i / j;
          this._basis.point(
            this._beta * x[i] + (1 - this._beta) * (x0 + t * dx),
            this._beta * y[i] + (1 - this._beta) * (y0 + t * dy)
          );
        }
      }

      this._x = this._y = null;
      this._basis.lineEnd();
    },
    point: function(x, y) {
      this._x.push(+x);
      this._y.push(+y);
    }
  };

  var curveBundle = (function custom(beta) {

    function bundle(context) {
      return beta === 1 ? new Basis(context) : new Bundle(context, beta);
    }

    bundle.beta = function(beta) {
      return custom(+beta);
    };

    return bundle;
  })(0.85);

  function point$2(that, x, y) {
    that._context.bezierCurveTo(
      that._x1 + that._k * (that._x2 - that._x0),
      that._y1 + that._k * (that._y2 - that._y0),
      that._x2 + that._k * (that._x1 - x),
      that._y2 + that._k * (that._y1 - y),
      that._x2,
      that._y2
    );
  }

  function Cardinal(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
  }

  Cardinal.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 2: this._context.lineTo(this._x2, this._y2); break;
        case 3: point$2(this, this._x1, this._y1); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; this._x1 = x, this._y1 = y; break;
        case 2: this._point = 3; // proceed
        default: point$2(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  var curveCardinal = (function custom(tension) {

    function cardinal(context) {
      return new Cardinal(context, tension);
    }

    cardinal.tension = function(tension) {
      return custom(+tension);
    };

    return cardinal;
  })(0);

  function CardinalClosed(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
  }

  CardinalClosed.prototype = {
    areaStart: noop$1,
    areaEnd: noop$1,
    lineStart: function() {
      this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
      this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 1: {
          this._context.moveTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
        case 2: {
          this._context.lineTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
        case 3: {
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          this.point(this._x5, this._y5);
          break;
        }
      }
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
        case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
        case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
        default: point$2(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  var curveCardinalClosed = (function custom(tension) {

    function cardinal(context) {
      return new CardinalClosed(context, tension);
    }

    cardinal.tension = function(tension) {
      return custom(+tension);
    };

    return cardinal;
  })(0);

  function CardinalOpen(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
  }

  CardinalOpen.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
        case 3: this._point = 4; // proceed
        default: point$2(this, x, y); break;
      }
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    }
  };

  var curveCardinalOpen = (function custom(tension) {

    function cardinal(context) {
      return new CardinalOpen(context, tension);
    }

    cardinal.tension = function(tension) {
      return custom(+tension);
    };

    return cardinal;
  })(0);

  function LinearClosed(context) {
    this._context = context;
  }

  LinearClosed.prototype = {
    areaStart: noop$1,
    areaEnd: noop$1,
    lineStart: function() {
      this._point = 0;
    },
    lineEnd: function() {
      if (this._point) this._context.closePath();
    },
    point: function(x, y) {
      x = +x, y = +y;
      if (this._point) this._context.lineTo(x, y);
      else this._point = 1, this._context.moveTo(x, y);
    }
  };

  function curveLinearClosed(context) {
    return new LinearClosed(context);
  }

  function sign(x) {
    return x < 0 ? -1 : 1;
  }

  // Calculate the slopes of the tangents (Hermite-type interpolation) based on
  // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
  // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
  // NOV(II), P. 443, 1990.
  function slope3(that, x2, y2) {
    var h0 = that._x1 - that._x0,
        h1 = x2 - that._x1,
        s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
        s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
        p = (s0 * h1 + s1 * h0) / (h0 + h1);
    return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  }

  // Calculate a one-sided slope.
  function slope2(that, t) {
    var h = that._x1 - that._x0;
    return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
  }

  // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
  // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
  // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
  function point$3(that, t0, t1) {
    var x0 = that._x0,
        y0 = that._y0,
        x1 = that._x1,
        y1 = that._y1,
        dx = (x1 - x0) / 3;
    that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
  }

  function MonotoneX(context) {
    this._context = context;
  }

  MonotoneX.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x0 = this._x1 =
      this._y0 = this._y1 =
      this._t0 = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      switch (this._point) {
        case 2: this._context.lineTo(this._x1, this._y1); break;
        case 3: point$3(this, this._t0, slope2(this, this._t0)); break;
      }
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function(x, y) {
      var t1 = NaN;

      x = +x, y = +y;
      if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; point$3(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
        default: point$3(this, this._t0, t1 = slope3(this, x, y)); break;
      }

      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
      this._t0 = t1;
    }
  };

  function MonotoneY(context) {
    this._context = new ReflectContext(context);
  }

  (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
    MonotoneX.prototype.point.call(this, y, x);
  };

  function ReflectContext(context) {
    this._context = context;
  }

  ReflectContext.prototype = {
    moveTo: function(x, y) { this._context.moveTo(y, x); },
    closePath: function() { this._context.closePath(); },
    lineTo: function(x, y) { this._context.lineTo(y, x); },
    bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
  };

  function monotoneX(context) {
    return new MonotoneX(context);
  }

  function Step(context, t) {
    this._context = context;
    this._t = t;
  }

  Step.prototype = {
    areaStart: function() {
      this._line = 0;
    },
    areaEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._x = this._y = NaN;
      this._point = 0;
    },
    lineEnd: function() {
      if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
    },
    point: function(x, y) {
      x = +x, y = +y;
      switch (this._point) {
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; // proceed
        default: {
          if (this._t <= 0) {
            this._context.lineTo(this._x, y);
            this._context.lineTo(x, y);
          } else {
            var x1 = this._x * (1 - this._t) + x * this._t;
            this._context.lineTo(x1, this._y);
            this._context.lineTo(x1, y);
          }
          break;
        }
      }
      this._x = x, this._y = y;
    }
  };

  function curveStep(context) {
    return new Step(context, 0.5);
  }

  function stepBefore(context) {
    return new Step(context, 0);
  }

  function stepAfter(context) {
    return new Step(context, 1);
  }

  function none$1(series, order) {
    if (!((n = series.length) > 1)) return;
    for (var i = 1, j, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
      s0 = s1, s1 = series[order[i]];
      for (j = 0; j < m; ++j) {
        s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
      }
    }
  }

  function none$2(series) {
    var n = series.length, o = new Array(n);
    while (--n >= 0) o[n] = n;
    return o;
  }

  function stackValue(d, key) {
    return d[key];
  }

  function stack() {
    var keys = constant$4([]),
        order = none$2,
        offset = none$1,
        value = stackValue;

    function stack(data) {
      var kz = keys.apply(this, arguments),
          i,
          m = data.length,
          n = kz.length,
          sz = new Array(n),
          oz;

      for (i = 0; i < n; ++i) {
        for (var ki = kz[i], si = sz[i] = new Array(m), j = 0, sij; j < m; ++j) {
          si[j] = sij = [0, +value(data[j], ki, j, data)];
          sij.data = data[j];
        }
        si.key = ki;
      }

      for (i = 0, oz = order(sz); i < n; ++i) {
        sz[oz[i]].index = i;
      }

      offset(sz, oz);
      return sz;
    }

    stack.keys = function(_) {
      return arguments.length ? (keys = typeof _ === "function" ? _ : constant$4(slice$2.call(_)), stack) : keys;
    };

    stack.value = function(_) {
      return arguments.length ? (value = typeof _ === "function" ? _ : constant$4(+_), stack) : value;
    };

    stack.order = function(_) {
      return arguments.length ? (order = _ == null ? none$2 : typeof _ === "function" ? _ : constant$4(slice$2.call(_)), stack) : order;
    };

    stack.offset = function(_) {
      return arguments.length ? (offset = _ == null ? none$1 : _, stack) : offset;
    };

    return stack;
  }

  function constant$5(x) {
    return function() {
      return x;
    };
  }

  function ZoomEvent(target, type, transform) {
    this.target = target;
    this.type = type;
    this.transform = transform;
  }

  function Transform(k, x, y) {
    this.k = k;
    this.x = x;
    this.y = y;
  }

  Transform.prototype = {
    constructor: Transform,
    scale: function(k) {
      return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
    },
    translate: function(x, y) {
      return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
    },
    apply: function(point) {
      return [point[0] * this.k + this.x, point[1] * this.k + this.y];
    },
    applyX: function(x) {
      return x * this.k + this.x;
    },
    applyY: function(y) {
      return y * this.k + this.y;
    },
    invert: function(location) {
      return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
    },
    invertX: function(x) {
      return (x - this.x) / this.k;
    },
    invertY: function(y) {
      return (y - this.y) / this.k;
    },
    rescaleX: function(x) {
      return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
    },
    rescaleY: function(y) {
      return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
    },
    toString: function() {
      return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
    }
  };

  var identity$5 = new Transform(1, 0, 0);

  function nopropagation$1() {
    event.stopImmediatePropagation();
  }

  function noevent$2() {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  // Ignore right-click, since that should open the context menu.
  function defaultFilter$1() {
    return !event.ctrlKey && !event.button;
  }

  function defaultExtent$1() {
    var e = this;
    if (e instanceof SVGElement) {
      e = e.ownerSVGElement || e;
      if (e.hasAttribute("viewBox")) {
        e = e.viewBox.baseVal;
        return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
      }
      return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
    }
    return [[0, 0], [e.clientWidth, e.clientHeight]];
  }

  function defaultTransform() {
    return this.__zoom || identity$5;
  }

  function defaultWheelDelta() {
    return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002);
  }

  function defaultTouchable$1() {
    return navigator.maxTouchPoints || ("ontouchstart" in this);
  }

  function defaultConstrain(transform, extent, translateExtent) {
    var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
        dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
        dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
        dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
    return transform.translate(
      dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
      dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
    );
  }

  function zoom() {
    var filter = defaultFilter$1,
        extent = defaultExtent$1,
        constrain = defaultConstrain,
        wheelDelta = defaultWheelDelta,
        touchable = defaultTouchable$1,
        scaleExtent = [0, Infinity],
        translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
        duration = 250,
        interpolate = interpolateZoom,
        listeners = dispatch("start", "zoom", "end"),
        touchstarting,
        touchending,
        touchDelay = 500,
        wheelDelay = 150,
        clickDistance2 = 0;

    function zoom(selection) {
      selection
          .property("__zoom", defaultTransform)
          .on("wheel.zoom", wheeled)
          .on("mousedown.zoom", mousedowned)
          .on("dblclick.zoom", dblclicked)
        .filter(touchable)
          .on("touchstart.zoom", touchstarted)
          .on("touchmove.zoom", touchmoved)
          .on("touchend.zoom touchcancel.zoom", touchended)
          .style("touch-action", "none")
          .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }

    zoom.transform = function(collection, transform, point) {
      var selection = collection.selection ? collection.selection() : collection;
      selection.property("__zoom", defaultTransform);
      if (collection !== selection) {
        schedule(collection, transform, point);
      } else {
        selection.interrupt().each(function() {
          gesture(this, arguments)
              .start()
              .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
              .end();
        });
      }
    };

    zoom.scaleBy = function(selection, k, p) {
      zoom.scaleTo(selection, function() {
        var k0 = this.__zoom.k,
            k1 = typeof k === "function" ? k.apply(this, arguments) : k;
        return k0 * k1;
      }, p);
    };

    zoom.scaleTo = function(selection, k, p) {
      zoom.transform(selection, function() {
        var e = extent.apply(this, arguments),
            t0 = this.__zoom,
            p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
            p1 = t0.invert(p0),
            k1 = typeof k === "function" ? k.apply(this, arguments) : k;
        return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
      }, p);
    };

    zoom.translateBy = function(selection, x, y) {
      zoom.transform(selection, function() {
        return constrain(this.__zoom.translate(
          typeof x === "function" ? x.apply(this, arguments) : x,
          typeof y === "function" ? y.apply(this, arguments) : y
        ), extent.apply(this, arguments), translateExtent);
      });
    };

    zoom.translateTo = function(selection, x, y, p) {
      zoom.transform(selection, function() {
        var e = extent.apply(this, arguments),
            t = this.__zoom,
            p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
        return constrain(identity$5.translate(p0[0], p0[1]).scale(t.k).translate(
          typeof x === "function" ? -x.apply(this, arguments) : -x,
          typeof y === "function" ? -y.apply(this, arguments) : -y
        ), e, translateExtent);
      }, p);
    };

    function scale(transform, k) {
      k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
      return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
    }

    function translate(transform, p0, p1) {
      var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
      return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
    }

    function centroid(extent) {
      return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
    }

    function schedule(transition, transform, point) {
      transition
          .on("start.zoom", function() { gesture(this, arguments).start(); })
          .on("interrupt.zoom end.zoom", function() { gesture(this, arguments).end(); })
          .tween("zoom", function() {
            var that = this,
                args = arguments,
                g = gesture(that, args),
                e = extent.apply(that, args),
                p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
                w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
                a = that.__zoom,
                b = typeof transform === "function" ? transform.apply(that, args) : transform,
                i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
            return function(t) {
              if (t === 1) t = b; // Avoid rounding error on end.
              else { var l = i(t), k = w / l[2]; t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); }
              g.zoom(null, t);
            };
          });
    }

    function gesture(that, args, clean) {
      return (!clean && that.__zooming) || new Gesture(that, args);
    }

    function Gesture(that, args) {
      this.that = that;
      this.args = args;
      this.active = 0;
      this.extent = extent.apply(that, args);
      this.taps = 0;
    }

    Gesture.prototype = {
      start: function() {
        if (++this.active === 1) {
          this.that.__zooming = this;
          this.emit("start");
        }
        return this;
      },
      zoom: function(key, transform) {
        if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
        if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
        if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
        this.that.__zoom = transform;
        this.emit("zoom");
        return this;
      },
      end: function() {
        if (--this.active === 0) {
          delete this.that.__zooming;
          this.emit("end");
        }
        return this;
      },
      emit: function(type) {
        customEvent(new ZoomEvent(zoom, type, this.that.__zoom), listeners.apply, listeners, [type, this.that, this.args]);
      }
    };

    function wheeled() {
      if (!filter.apply(this, arguments)) return;
      var g = gesture(this, arguments),
          t = this.__zoom,
          k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
          p = mouse(this);

      // If the mouse is in the same location as before, reuse it.
      // If there were recent wheel events, reset the wheel idle timeout.
      if (g.wheel) {
        if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
          g.mouse[1] = t.invert(g.mouse[0] = p);
        }
        clearTimeout(g.wheel);
      }

      // If this wheel event won’t trigger a transform change, ignore it.
      else if (t.k === k) return;

      // Otherwise, capture the mouse point and location at the start.
      else {
        g.mouse = [p, t.invert(p)];
        interrupt(this);
        g.start();
      }

      noevent$2();
      g.wheel = setTimeout(wheelidled, wheelDelay);
      g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

      function wheelidled() {
        g.wheel = null;
        g.end();
      }
    }

    function mousedowned() {
      if (touchending || !filter.apply(this, arguments)) return;
      var g = gesture(this, arguments, true),
          v = select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
          p = mouse(this),
          x0 = event.clientX,
          y0 = event.clientY;

      dragDisable(event.view);
      nopropagation$1();
      g.mouse = [p, this.__zoom.invert(p)];
      interrupt(this);
      g.start();

      function mousemoved() {
        noevent$2();
        if (!g.moved) {
          var dx = event.clientX - x0, dy = event.clientY - y0;
          g.moved = dx * dx + dy * dy > clickDistance2;
        }
        g.zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = mouse(g.that), g.mouse[1]), g.extent, translateExtent));
      }

      function mouseupped() {
        v.on("mousemove.zoom mouseup.zoom", null);
        yesdrag(event.view, g.moved);
        noevent$2();
        g.end();
      }
    }

    function dblclicked() {
      if (!filter.apply(this, arguments)) return;
      var t0 = this.__zoom,
          p0 = mouse(this),
          p1 = t0.invert(p0),
          k1 = t0.k * (event.shiftKey ? 0.5 : 2),
          t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, arguments), translateExtent);

      noevent$2();
      if (duration > 0) select(this).transition().duration(duration).call(schedule, t1, p0);
      else select(this).call(zoom.transform, t1);
    }

    function touchstarted() {
      if (!filter.apply(this, arguments)) return;
      var touches = event.touches,
          n = touches.length,
          g = gesture(this, arguments, event.changedTouches.length === n),
          started, i, t, p;

      nopropagation$1();
      for (i = 0; i < n; ++i) {
        t = touches[i], p = touch(this, touches, t.identifier);
        p = [p, this.__zoom.invert(p), t.identifier];
        if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
        else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
      }

      if (touchstarting) touchstarting = clearTimeout(touchstarting);

      if (started) {
        if (g.taps < 2) touchstarting = setTimeout(function() { touchstarting = null; }, touchDelay);
        interrupt(this);
        g.start();
      }
    }

    function touchmoved() {
      if (!this.__zooming) return;
      var g = gesture(this, arguments),
          touches = event.changedTouches,
          n = touches.length, i, t, p, l;

      noevent$2();
      if (touchstarting) touchstarting = clearTimeout(touchstarting);
      g.taps = 0;
      for (i = 0; i < n; ++i) {
        t = touches[i], p = touch(this, touches, t.identifier);
        if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
        else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
      }
      t = g.that.__zoom;
      if (g.touch1) {
        var p0 = g.touch0[0], l0 = g.touch0[1],
            p1 = g.touch1[0], l1 = g.touch1[1],
            dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
            dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
        t = scale(t, Math.sqrt(dp / dl));
        p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
        l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
      }
      else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
      else return;
      g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
    }

    function touchended() {
      if (!this.__zooming) return;
      var g = gesture(this, arguments),
          touches = event.changedTouches,
          n = touches.length, i, t;

      nopropagation$1();
      if (touchending) clearTimeout(touchending);
      touchending = setTimeout(function() { touchending = null; }, touchDelay);
      for (i = 0; i < n; ++i) {
        t = touches[i];
        if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
        else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
      }
      if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
      if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
      else {
        g.end();
        // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
        if (g.taps === 2) {
          var p = select(this).on("dblclick.zoom");
          if (p) p.apply(this, arguments);
        }
      }
    }

    zoom.wheelDelta = function(_) {
      return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant$5(+_), zoom) : wheelDelta;
    };

    zoom.filter = function(_) {
      return arguments.length ? (filter = typeof _ === "function" ? _ : constant$5(!!_), zoom) : filter;
    };

    zoom.touchable = function(_) {
      return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$5(!!_), zoom) : touchable;
    };

    zoom.extent = function(_) {
      return arguments.length ? (extent = typeof _ === "function" ? _ : constant$5([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
    };

    zoom.scaleExtent = function(_) {
      return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
    };

    zoom.translateExtent = function(_) {
      return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
    };

    zoom.constrain = function(_) {
      return arguments.length ? (constrain = _, zoom) : constrain;
    };

    zoom.duration = function(_) {
      return arguments.length ? (duration = +_, zoom) : duration;
    };

    zoom.interpolate = function(_) {
      return arguments.length ? (interpolate = _, zoom) : interpolate;
    };

    zoom.on = function() {
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? zoom : value;
    };

    zoom.clickDistance = function(_) {
      return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
    };

    return zoom;
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var crossfilter = createCommonjsModule(function (module, exports) {
  (function(f){{module.exports=f();}})(function(){return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof commonjsRequire&&commonjsRequire;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t);}return n[i].exports}for(var u="function"==typeof commonjsRequire&&commonjsRequire,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  module.exports = require("./src/crossfilter").crossfilter;

  },{"./src/crossfilter":6}],2:[function(require,module,exports){
  (function (global){
  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** `Object#toString` result references. */
  var funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      symbolTag = '[object Symbol]';

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      reLeadingDot = /^\./,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }
    return result;
  }

  /** Used for built-in method references. */
  var arrayProto = Array.prototype,
      funcProto = Function.prototype,
      objectProto = Object.prototype;

  /** Used to detect overreaching core-js shims. */
  var coreJsData = root['__core-js_shared__'];

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto.toString;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /** Built-in value references. */
  var Symbol = root.Symbol,
      splice = arrayProto.splice;

  /* Built-in method references that are verified to be native. */
  var Map = getNative(root, 'Map'),
      nativeCreate = getNative(Object, 'create');

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
  }

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
  }

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
    return this;
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
  }

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map || ListCache),
      'string': new Hash
    };
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    return getMapData(this, key)['delete'](key);
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath(value) {
    return isArray(value) ? value : stringToPath(value);
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == 'number' || type == 'symbol' || type == 'boolean' ||
        value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
      (object != null && value in Object(object));
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath = memoize(function(string) {
    string = toString(string);

    var result = [];
    if (reLeadingDot.test(string)) {
      result.push('');
    }
    string.replace(rePropName, function(match, number, quote, string) {
      result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  });

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey(value) {
    if (typeof value == 'string' || isSymbol(value)) {
      return value;
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to process.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result);
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache);
    return memoized;
  }

  // Assign cache to `_.memoize`.
  memoize.Cache = MapCache;

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && objectToString.call(value) == symbolTag);
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }

  /**
   * This method is like `_.get` except that if the resolved value is a
   * function it's invoked with the `this` binding of its parent object and
   * its result is returned.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to resolve.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
   *
   * _.result(object, 'a[0].b.c1');
   * // => 3
   *
   * _.result(object, 'a[0].b.c2');
   * // => 4
   *
   * _.result(object, 'a[0].b.c3', 'default');
   * // => 'default'
   *
   * _.result(object, 'a[0].b.c3', _.constant('default'));
   * // => 'default'
   */
  function result(object, path, defaultValue) {
    path = isKey(path, object) ? [path] : castPath(path);

    var index = -1,
        length = path.length;

    // Ensure the loop is entered when path is empty.
    if (!length) {
      object = undefined;
      length = 1;
    }
    while (++index < length) {
      var value = object == null ? undefined : object[toKey(path[index])];
      if (value === undefined) {
        index = length;
        value = defaultValue;
      }
      object = isFunction(value) ? value.call(object) : value;
    }
    return object;
  }

  module.exports = result;

  }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  },{}],3:[function(require,module,exports){
  module.exports={"version":"1.4.7"};
  },{}],4:[function(require,module,exports){
  if (typeof Uint8Array !== "undefined") {
    var crossfilter_array8 = function(n) { return new Uint8Array(n); };
    var crossfilter_array16 = function(n) { return new Uint16Array(n); };
    var crossfilter_array32 = function(n) { return new Uint32Array(n); };

    var crossfilter_arrayLengthen = function(array, length) {
      if (array.length >= length) return array;
      var copy = new array.constructor(length);
      copy.set(array);
      return copy;
    };

    var crossfilter_arrayWiden = function(array, width) {
      var copy;
      switch (width) {
        case 16: copy = crossfilter_array16(array.length); break;
        case 32: copy = crossfilter_array32(array.length); break;
        default: throw new Error("invalid array width!");
      }
      copy.set(array);
      return copy;
    };
  }

  function crossfilter_arrayUntyped(n) {
    var array = new Array(n), i = -1;
    while (++i < n) array[i] = 0;
    return array;
  }

  function crossfilter_arrayLengthenUntyped(array, length) {
    var n = array.length;
    while (n < length) array[n++] = 0;
    return array;
  }

  function crossfilter_arrayWidenUntyped(array, width) {
    if (width > 32) throw new Error("invalid array width!");
    return array;
  }

  // An arbitrarily-wide array of bitmasks
  function crossfilter_bitarray(n) {
    this.length = n;
    this.subarrays = 1;
    this.width = 8;
    this.masks = {
      0: 0
    };

    this[0] = crossfilter_array8(n);
  }

  crossfilter_bitarray.prototype.lengthen = function(n) {
    var i, len;
    for (i = 0, len = this.subarrays; i < len; ++i) {
      this[i] = crossfilter_arrayLengthen(this[i], n);
    }
    this.length = n;
  };

  // Reserve a new bit index in the array, returns {offset, one}
  crossfilter_bitarray.prototype.add = function() {
    var m, w, one, i, len;

    for (i = 0, len = this.subarrays; i < len; ++i) {
      m = this.masks[i];
      w = this.width - (32 * i);
      one = ~m & -~m;

      if (w >= 32 && !one) {
        continue;
      }

      if (w < 32 && (one & (1 << w))) {
        // widen this subarray
        this[i] = crossfilter_arrayWiden(this[i], w <<= 1);
        this.width = 32 * i + w;
      }

      this.masks[i] |= one;

      return {
        offset: i,
        one: one
      };
    }

    // add a new subarray
    this[this.subarrays] = crossfilter_array8(this.length);
    this.masks[this.subarrays] = 1;
    this.width += 8;
    return {
      offset: this.subarrays++,
      one: 1
    };
  };

  // Copy record from index src to index dest
  crossfilter_bitarray.prototype.copy = function(dest, src) {
    var i, len;
    for (i = 0, len = this.subarrays; i < len; ++i) {
      this[i][dest] = this[i][src];
    }
  };

  // Truncate the array to the given length
  crossfilter_bitarray.prototype.truncate = function(n) {
    var i, len;
    for (i = 0, len = this.subarrays; i < len; ++i) {
      for (var j = this.length - 1; j >= n; j--) {
        this[i][j] = 0;
      }
      this[i].length = n;
    }
    this.length = n;
  };

  // Checks that all bits for the given index are 0
  crossfilter_bitarray.prototype.zero = function(n) {
    var i, len;
    for (i = 0, len = this.subarrays; i < len; ++i) {
      if (this[i][n]) {
        return false;
      }
    }
    return true;
  };

  // Checks that all bits for the given index are 0 except for possibly one
  crossfilter_bitarray.prototype.zeroExcept = function(n, offset, zero) {
    var i, len;
    for (i = 0, len = this.subarrays; i < len; ++i) {
      if (i === offset ? this[i][n] & zero : this[i][n]) {
        return false;
      }
    }
    return true;
  };

  // Checks that all bits for the given indez are 0 except for the specified mask.
  // The mask should be an array of the same size as the filter subarrays width.
  crossfilter_bitarray.prototype.zeroExceptMask = function(n, mask) {
    var i, len;
    for (i = 0, len = this.subarrays; i < len; ++i) {
      if (this[i][n] & mask[i]) {
        return false;
      }
    }
    return true;
  };

  // Checks that only the specified bit is set for the given index
  crossfilter_bitarray.prototype.only = function(n, offset, one) {
    var i, len;
    for (i = 0, len = this.subarrays; i < len; ++i) {
      if (this[i][n] != (i === offset ? one : 0)) {
        return false;
      }
    }
    return true;
  };

  // Checks that only the specified bit is set for the given index except for possibly one other
  crossfilter_bitarray.prototype.onlyExcept = function(n, offset, zero, onlyOffset, onlyOne) {
    var mask;
    var i, len;
    for (i = 0, len = this.subarrays; i < len; ++i) {
      mask = this[i][n];
      if (i === offset)
        mask &= zero;
      if (mask != (i === onlyOffset ? onlyOne : 0)) {
        return false;
      }
    }
    return true;
  };

  module.exports = {
    array8: crossfilter_arrayUntyped,
    array16: crossfilter_arrayUntyped,
    array32: crossfilter_arrayUntyped,
    arrayLengthen: crossfilter_arrayLengthenUntyped,
    arrayWiden: crossfilter_arrayWidenUntyped,
    bitarray: crossfilter_bitarray
  };

  },{}],5:[function(require,module,exports){

  var crossfilter_identity = require('./identity');

  function bisect_by(f) {

    // Locate the insertion point for x in a to maintain sorted order. The
    // arguments lo and hi may be used to specify a subset of the array which
    // should be considered; by default the entire array is used. If x is already
    // present in a, the insertion point will be before (to the left of) any
    // existing entries. The return value is suitable for use as the first
    // argument to `array.splice` assuming that a is already sorted.
    //
    // The returned insertion point i partitions the array a into two halves so
    // that all v < x for v in a[lo:i] for the left side and all v >= x for v in
    // a[i:hi] for the right side.
    function bisectLeft(a, x, lo, hi) {
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (f(a[mid]) < x) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    }

    // Similar to bisectLeft, but returns an insertion point which comes after (to
    // the right of) any existing entries of x in a.
    //
    // The returned insertion point i partitions the array into two halves so that
    // all v <= x for v in a[lo:i] for the left side and all v > x for v in
    // a[i:hi] for the right side.
    function bisectRight(a, x, lo, hi) {
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (x < f(a[mid])) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }

    bisectRight.right = bisectRight;
    bisectRight.left = bisectLeft;
    return bisectRight;
  }

  module.exports = bisect_by(crossfilter_identity);
  module.exports.by = bisect_by; // assign the raw function to the export as well

  },{"./identity":10}],6:[function(require,module,exports){

  var xfilterArray = require('./array');
  var xfilterFilter = require('./filter');
  var crossfilter_identity = require('./identity');
  var crossfilter_null = require('./null');
  var crossfilter_zero = require('./zero');
  var xfilterHeapselect = require('./heapselect');
  var xfilterHeap = require('./heap');
  var bisect = require('./bisect');
  var insertionsort = require('./insertionsort');
  var permute = require('./permute');
  var quicksort = require('./quicksort');
  var xfilterReduce = require('./reduce');
  var packageJson = require('./../package.json'); // require own package.json for the version field
  var result = require('lodash.result');

  // constants
  var REMOVED_INDEX = -1;

  // expose API exports
  exports.crossfilter = crossfilter;
  exports.crossfilter.heap = xfilterHeap;
  exports.crossfilter.heapselect = xfilterHeapselect;
  exports.crossfilter.bisect = bisect;
  exports.crossfilter.insertionsort = insertionsort;
  exports.crossfilter.permute = permute;
  exports.crossfilter.quicksort = quicksort;
  exports.crossfilter.version = packageJson.version; // please note use of "package-json-versionify" transform

  function crossfilter() {
    var crossfilter = {
      add: add,
      remove: removeData,
      dimension: dimension,
      groupAll: groupAll,
      size: size,
      all: all,
      allFiltered: allFiltered,
      onChange: onChange,
      isElementFiltered: isElementFiltered
    };

    var data = [], // the records
        n = 0, // the number of records; data.length
        filters, // 1 is filtered out
        filterListeners = [], // when the filters change
        dataListeners = [], // when data is added
        removeDataListeners = [], // when data is removed
        callbacks = [];

    filters = new xfilterArray.bitarray(0);

    // Adds the specified new records to this crossfilter.
    function add(newData) {
      var n0 = n,
          n1 = newData.length;

      // If there's actually new data to add…
      // Merge the new data into the existing data.
      // Lengthen the filter bitset to handle the new records.
      // Notify listeners (dimensions and groups) that new data is available.
      if (n1) {
        data = data.concat(newData);
        filters.lengthen(n += n1);
        dataListeners.forEach(function(l) { l(newData, n0, n1); });
        triggerOnChange('dataAdded');
      }

      return crossfilter;
    }

    // Removes all records that match the current filters, or if a predicate function is passed,
    // removes all records matching the predicate (ignoring filters).
    function removeData(predicate) {
      var // Mapping from old record indexes to new indexes (after records removed)
          newIndex = crossfilter_index(n, n),
          removed = [],
          usePred = typeof predicate === 'function',
          shouldRemove = function (i) {
            return usePred ? predicate(data[i], i) : filters.zero(i)
          };

      for (var index1 = 0, index2 = 0; index1 < n; ++index1) {
        if ( shouldRemove(index1) ) {
          removed.push(index1);
          newIndex[index1] = REMOVED_INDEX;
        } else {
          newIndex[index1] = index2++;
        }
      }

      // Remove all matching records from groups.
      filterListeners.forEach(function(l) { l(-1, -1, [], removed, true); });

      // Update indexes.
      removeDataListeners.forEach(function(l) { l(newIndex); });

      // Remove old filters and data by overwriting.
      for (var index3 = 0, index4 = 0; index3 < n; ++index3) {
        if ( newIndex[index3] !== REMOVED_INDEX ) {
          if (index3 !== index4) filters.copy(index4, index3), data[index4] = data[index3];
          ++index4;
        }
      }

      data.length = n = index4;
      filters.truncate(index4);
      triggerOnChange('dataRemoved');
    }

    function maskForDimensions(dimensions) {
      var n,
          d,
          len,
          id,
          mask = Array(filters.subarrays);
      for (n = 0; n < filters.subarrays; n++) { mask[n] = ~0; }
      for (d = 0, len = dimensions.length; d < len; d++) {
        // The top bits of the ID are the subarray offset and the lower bits are the bit
        // offset of the "one" mask.
        id = dimensions[d].id();
        mask[id >> 7] &= ~(0x1 << (id & 0x3f));
      }
      return mask;
    }

    // Return true if the data element at index i is filtered IN.
    // Optionally, ignore the filters of any dimensions in the ignore_dimensions list.
    function isElementFiltered(i, ignore_dimensions) {
      var mask = maskForDimensions(ignore_dimensions || []);
      return filters.zeroExceptMask(i,mask);
    }

    // Adds a new dimension with the specified value accessor function.
    function dimension(value, iterable) {

      if (typeof value === 'string') {
        var accessorPath = value;
        value = function(d) { return result(d, accessorPath); };
      }

      var dimension = {
        filter: filter,
        filterExact: filterExact,
        filterRange: filterRange,
        filterFunction: filterFunction,
        filterAll: filterAll,
        currentFilter: currentFilter,
        hasCurrentFilter: hasCurrentFilter,
        top: top,
        bottom: bottom,
        group: group,
        groupAll: groupAll,
        dispose: dispose,
        remove: dispose, // for backwards-compatibility
        accessor: value,
        id: function() { return id; }
      };

      var one, // lowest unset bit as mask, e.g., 00001000
          zero, // inverted one, e.g., 11110111
          offset, // offset into the filters arrays
          id, // unique ID for this dimension (reused when dimensions are disposed)
          values, // sorted, cached array
          index, // maps sorted value index -> record index (in data)
          newValues, // temporary array storing newly-added values
          newIndex, // temporary array storing newly-added index
          iterablesIndexCount,
          newIterablesIndexCount,
          iterablesIndexFilterStatus,
          newIterablesIndexFilterStatus,
          iterablesEmptyRows = [],
          sort = quicksort.by(function(i) { return newValues[i]; }),
          refilter = xfilterFilter.filterAll, // for recomputing filter
          refilterFunction, // the custom filter function in use
          filterValue, // the value used for filtering (value, array, function or undefined)
          filterValuePresent, // true if filterValue contains something
          indexListeners = [], // when data is added
          dimensionGroups = [],
          lo0 = 0,
          hi0 = 0,
          t = 0,
          k;

      // Updating a dimension is a two-stage process. First, we must update the
      // associated filters for the newly-added records. Once all dimensions have
      // updated their filters, the groups are notified to update.
      dataListeners.unshift(preAdd);
      dataListeners.push(postAdd);

      removeDataListeners.push(removeData);

      // Add a new dimension in the filter bitmap and store the offset and bitmask.
      var tmp = filters.add();
      offset = tmp.offset;
      one = tmp.one;
      zero = ~one;

      // Create a unique ID for the dimension
      // IDs will be re-used if dimensions are disposed.
      // For internal use the ID is the subarray offset shifted left 7 bits or'd with the
      // bit offset of the set bit in the dimension's "one" mask.
      id = (offset << 7) | (Math.log(one) / Math.log(2));

      preAdd(data, 0, n);
      postAdd(data, 0, n);

      // Incorporates the specified new records into this dimension.
      // This function is responsible for updating filters, values, and index.
      function preAdd(newData, n0, n1) {

        if (iterable){
          // Count all the values
          t = 0;
          j = 0;
          k = [];

          for (var i0 = 0; i0 < newData.length; i0++) {
            for(j = 0, k = value(newData[i0]); j < k.length; j++) {
              t++;
            }
          }

          newValues = [];
          newIterablesIndexCount = crossfilter_range(newData.length);
          newIterablesIndexFilterStatus = crossfilter_index(t,1);
          var unsortedIndex = crossfilter_range(t);

          for (var l = 0, index1 = 0; index1 < newData.length; index1++) {
            k = value(newData[index1]);
            //
            if(!k.length){
              newIterablesIndexCount[index1] = 0;
              iterablesEmptyRows.push(index1 + n0);
              continue;
            }
            newIterablesIndexCount[index1] = k.length;
            for (j = 0; j < k.length; j++) {
              newValues.push(k[j]);
              unsortedIndex[l] = index1;
              l++;
            }
          }

          // Create the Sort map used to sort both the values and the valueToData indices
          var sortMap = sort(crossfilter_range(t), 0, t);

          // Use the sortMap to sort the newValues
          newValues = permute(newValues, sortMap);


          // Use the sortMap to sort the unsortedIndex map
          // newIndex should be a map of sortedValue -> crossfilterData
          newIndex = permute(unsortedIndex, sortMap);

        } else{
          // Permute new values into natural order using a standard sorted index.
          newValues = newData.map(value);
          newIndex = sort(crossfilter_range(n1), 0, n1);
          newValues = permute(newValues, newIndex);
        }

        if(iterable) {
          n1 = t;
        }

        // Bisect newValues to determine which new records are selected.
        var bounds = refilter(newValues), lo1 = bounds[0], hi1 = bounds[1];
        if (refilterFunction) {
          for (var index2 = 0; index2 < n1; ++index2) {
            if (!refilterFunction(newValues[index2], index2)) {
              filters[offset][newIndex[index2] + n0] |= one;
              if(iterable) newIterablesIndexFilterStatus[index2] = 1;
            }
          }
        } else {
          for (var index3 = 0; index3 < lo1; ++index3) {
            filters[offset][newIndex[index3] + n0] |= one;
            if(iterable) newIterablesIndexFilterStatus[index3] = 1;
          }
          for (var index4 = hi1; index4 < n1; ++index4) {
            filters[offset][newIndex[index4] + n0] |= one;
            if(iterable) newIterablesIndexFilterStatus[index4] = 1;
          }
        }

        // If this dimension previously had no data, then we don't need to do the
        // more expensive merge operation; use the new values and index as-is.
        if (!n0) {
          values = newValues;
          index = newIndex;
          iterablesIndexCount = newIterablesIndexCount;
          iterablesIndexFilterStatus = newIterablesIndexFilterStatus;
          lo0 = lo1;
          hi0 = hi1;
          return;
        }



        var oldValues = values,
          oldIndex = index,
          oldIterablesIndexFilterStatus = iterablesIndexFilterStatus,
          old_n0,
          i1 = 0;

        i0 = 0;

        if(iterable){
          old_n0 = n0;
          n0 = oldValues.length;
          n1 = t;
        }

        // Otherwise, create new arrays into which to merge new and old.
        values = iterable ? new Array(n0 + n1) : new Array(n);
        index = iterable ? new Array(n0 + n1) : crossfilter_index(n, n);
        if(iterable) iterablesIndexFilterStatus = crossfilter_index(n0 + n1, 1);

        // Concatenate the newIterablesIndexCount onto the old one.
        if(iterable) {
          var oldiiclength = iterablesIndexCount.length;
          iterablesIndexCount = xfilterArray.arrayLengthen(iterablesIndexCount, n);
          for(var j=0; j+oldiiclength < n; j++) {
            iterablesIndexCount[j+oldiiclength] = newIterablesIndexCount[j];
          }
        }

        // Merge the old and new sorted values, and old and new index.
        var index5 = 0;
        for (; i0 < n0 && i1 < n1; ++index5) {
          if (oldValues[i0] < newValues[i1]) {
            values[index5] = oldValues[i0];
            if(iterable) iterablesIndexFilterStatus[index5] = oldIterablesIndexFilterStatus[i0];
            index[index5] = oldIndex[i0++];
          } else {
            values[index5] = newValues[i1];
            if(iterable) iterablesIndexFilterStatus[index5] = newIterablesIndexFilterStatus[i1];
            index[index5] = newIndex[i1++] + (iterable ? old_n0 : n0);
          }
        }

        // Add any remaining old values.
        for (; i0 < n0; ++i0, ++index5) {
          values[index5] = oldValues[i0];
          if(iterable) iterablesIndexFilterStatus[index5] = oldIterablesIndexFilterStatus[i0];
          index[index5] = oldIndex[i0];
        }

        // Add any remaining new values.
        for (; i1 < n1; ++i1, ++index5) {
          values[index5] = newValues[i1];
          if(iterable) iterablesIndexFilterStatus[index5] = newIterablesIndexFilterStatus[i1];
          index[index5] = newIndex[i1] + (iterable ? old_n0 : n0);
        }

        // Bisect again to recompute lo0 and hi0.
        bounds = refilter(values), lo0 = bounds[0], hi0 = bounds[1];
      }

      // When all filters have updated, notify index listeners of the new values.
      function postAdd(newData, n0, n1) {
        indexListeners.forEach(function(l) { l(newValues, newIndex, n0, n1); });
        newValues = newIndex = null;
      }

      function removeData(reIndex) {
        if (iterable) {
          for (var i0 = 0, i1 = 0; i0 < iterablesEmptyRows.length; i0++) {
            if (reIndex[iterablesEmptyRows[i0]] !== REMOVED_INDEX) {
              iterablesEmptyRows[i1] = reIndex[iterablesEmptyRows[i0]];
              i1++;
            }
          }
          iterablesEmptyRows.length = i1;
          for (i0 = 0, i1 = 0; i0 < n; i0++) {
            if (reIndex[i0] !== REMOVED_INDEX) {
              if (i1 !== i0) iterablesIndexCount[i1] = iterablesIndexCount[i0];
              i1++;
            }
          }
          iterablesIndexCount.length = i1;
        }
        // Rewrite our index, overwriting removed values
        var n0 = values.length;
        for (var i = 0, j = 0, oldDataIndex; i < n0; ++i) {
          oldDataIndex = index[i];
          if (reIndex[oldDataIndex] !== REMOVED_INDEX) {
            if (i !== j) values[j] = values[i];
            index[j] = reIndex[oldDataIndex];
            if (iterable) {
              iterablesIndexFilterStatus[j] = iterablesIndexFilterStatus[i];
            }
            ++j;
          }
        }
        values.length = j;
        if (iterable) iterablesIndexFilterStatus.length = j;
        while (j < n0) index[j++] = 0;

        // Bisect again to recompute lo0 and hi0.
        var bounds = refilter(values);
        lo0 = bounds[0], hi0 = bounds[1];
      }

      // Updates the selected values based on the specified bounds [lo, hi].
      // This implementation is used by all the public filter methods.
      function filterIndexBounds(bounds) {

        var lo1 = bounds[0],
            hi1 = bounds[1];

        if (refilterFunction) {
          refilterFunction = null;
          filterIndexFunction(function(d, i) { return lo1 <= i && i < hi1; }, bounds[0] === 0 && bounds[1] === values.length);
          lo0 = lo1;
          hi0 = hi1;
          return dimension;
        }

        var i,
            j,
            k,
            added = [],
            removed = [],
            valueIndexAdded = [],
            valueIndexRemoved = [];


        // Fast incremental update based on previous lo index.
        if (lo1 < lo0) {
          for (i = lo1, j = Math.min(lo0, hi1); i < j; ++i) {
            added.push(index[i]);
            valueIndexAdded.push(i);
          }
        } else if (lo1 > lo0) {
          for (i = lo0, j = Math.min(lo1, hi0); i < j; ++i) {
            removed.push(index[i]);
            valueIndexRemoved.push(i);
          }
        }

        // Fast incremental update based on previous hi index.
        if (hi1 > hi0) {
          for (i = Math.max(lo1, hi0), j = hi1; i < j; ++i) {
            added.push(index[i]);
            valueIndexAdded.push(i);
          }
        } else if (hi1 < hi0) {
          for (i = Math.max(lo0, hi1), j = hi0; i < j; ++i) {
            removed.push(index[i]);
            valueIndexRemoved.push(i);
          }
        }

        if(!iterable) {
          // Flip filters normally.

          for(i=0; i<added.length; i++) {
            filters[offset][added[i]] ^= one;
          }

          for(i=0; i<removed.length; i++) {
            filters[offset][removed[i]] ^= one;
          }

        } else {
          // For iterables, we need to figure out if the row has been completely removed vs partially included
          // Only count a row as added if it is not already being aggregated. Only count a row
          // as removed if the last element being aggregated is removed.

          var newAdded = [];
          var newRemoved = [];
          for (i = 0; i < added.length; i++) {
            iterablesIndexCount[added[i]]++;
            iterablesIndexFilterStatus[valueIndexAdded[i]] = 0;
            if(iterablesIndexCount[added[i]] === 1) {
              filters[offset][added[i]] ^= one;
              newAdded.push(added[i]);
            }
          }
          for (i = 0; i < removed.length; i++) {
            iterablesIndexCount[removed[i]]--;
            iterablesIndexFilterStatus[valueIndexRemoved[i]] = 1;
            if(iterablesIndexCount[removed[i]] === 0) {
              filters[offset][removed[i]] ^= one;
              newRemoved.push(removed[i]);
            }
          }

          added = newAdded;
          removed = newRemoved;

          // Now handle empty rows.
          if(bounds[0] === 0 && bounds[1] === values.length) {
            for(i = 0; i < iterablesEmptyRows.length; i++) {
              if((filters[offset][k = iterablesEmptyRows[i]] & one)) {
                // Was not in the filter, so set the filter and add
                filters[offset][k] ^= one;
                added.push(k);
              }
            }
          } else {
            // filter in place - remove empty rows if necessary
            for(i = 0; i < iterablesEmptyRows.length; i++) {
              if(!(filters[offset][k = iterablesEmptyRows[i]] & one)) {
                // Was in the filter, so set the filter and remove
                filters[offset][k] ^= one;
                removed.push(k);
              }
            }
          }
        }

        lo0 = lo1;
        hi0 = hi1;
        filterListeners.forEach(function(l) { l(one, offset, added, removed); });
        triggerOnChange('filtered');
        return dimension;
      }

      // Filters this dimension using the specified range, value, or null.
      // If the range is null, this is equivalent to filterAll.
      // If the range is an array, this is equivalent to filterRange.
      // Otherwise, this is equivalent to filterExact.
      function filter(range) {
        return range == null
            ? filterAll() : Array.isArray(range)
            ? filterRange(range) : typeof range === "function"
            ? filterFunction(range)
            : filterExact(range);
      }

      // Filters this dimension to select the exact value.
      function filterExact(value) {
        filterValue = value;
        filterValuePresent = true;
        return filterIndexBounds((refilter = xfilterFilter.filterExact(bisect, value))(values));
      }

      // Filters this dimension to select the specified range [lo, hi].
      // The lower bound is inclusive, and the upper bound is exclusive.
      function filterRange(range) {
        filterValue = range;
        filterValuePresent = true;
        return filterIndexBounds((refilter = xfilterFilter.filterRange(bisect, range))(values));
      }

      // Clears any filters on this dimension.
      function filterAll() {
        filterValue = undefined;
        filterValuePresent = false;
        return filterIndexBounds((refilter = xfilterFilter.filterAll)(values));
      }

      // Filters this dimension using an arbitrary function.
      function filterFunction(f) {
        filterValue = f;
        filterValuePresent = true;
        
        refilterFunction = f;
        refilter = xfilterFilter.filterAll;

        filterIndexFunction(f, false);

        var bounds = refilter(values);
        lo0 = bounds[0], hi0 = bounds[1];

        return dimension;
      }

      function filterIndexFunction(f, filterAll) {
        var i,
            k,
            x,
            added = [],
            removed = [],
            valueIndexAdded = [],
            valueIndexRemoved = [],
            indexLength = values.length;

        if(!iterable) {
          for (i = 0; i < indexLength; ++i) {
            if (!(filters[offset][k = index[i]] & one) ^ !!(x = f(values[i], i))) {
              if (x) added.push(k);
              else removed.push(k);
            }
          }
        }

        if(iterable) {
          for(i=0; i < indexLength; ++i) {
            if(f(values[i], i)) {
              added.push(index[i]);
              valueIndexAdded.push(i);
            } else {
              removed.push(index[i]);
              valueIndexRemoved.push(i);
            }
          }
        }

        if(!iterable) {
          for(i=0; i<added.length; i++) {
            if(filters[offset][added[i]] & one) filters[offset][added[i]] &= zero;
          }

          for(i=0; i<removed.length; i++) {
            if(!(filters[offset][removed[i]] & one)) filters[offset][removed[i]] |= one;
          }
        } else {

          var newAdded = [];
          var newRemoved = [];
          for (i = 0; i < added.length; i++) {
            // First check this particular value needs to be added
            if(iterablesIndexFilterStatus[valueIndexAdded[i]] === 1) {
              iterablesIndexCount[added[i]]++;
              iterablesIndexFilterStatus[valueIndexAdded[i]] = 0;
              if(iterablesIndexCount[added[i]] === 1) {
                filters[offset][added[i]] ^= one;
                newAdded.push(added[i]);
              }
            }
          }
          for (i = 0; i < removed.length; i++) {
            // First check this particular value needs to be removed
            if(iterablesIndexFilterStatus[valueIndexRemoved[i]] === 0) {
              iterablesIndexCount[removed[i]]--;
              iterablesIndexFilterStatus[valueIndexRemoved[i]] = 1;
              if(iterablesIndexCount[removed[i]] === 0) {
                filters[offset][removed[i]] ^= one;
                newRemoved.push(removed[i]);
              }
            }
          }

          added = newAdded;
          removed = newRemoved;

          // Now handle empty rows.
          if(filterAll) {
            for(i = 0; i < iterablesEmptyRows.length; i++) {
              if((filters[offset][k = iterablesEmptyRows[i]] & one)) {
                // Was not in the filter, so set the filter and add
                filters[offset][k] ^= one;
                added.push(k);
              }
            }
          } else {
            // filter in place - remove empty rows if necessary
            for(i = 0; i < iterablesEmptyRows.length; i++) {
              if(!(filters[offset][k = iterablesEmptyRows[i]] & one)) {
                // Was in the filter, so set the filter and remove
                filters[offset][k] ^= one;
                removed.push(k);
              }
            }
          }
        }

        filterListeners.forEach(function(l) { l(one, offset, added, removed); });
        triggerOnChange('filtered');
      }
      
      function currentFilter() {
        return filterValue;
      }
      
      function hasCurrentFilter() {
        return filterValuePresent;
      }

      // Returns the top K selected records based on this dimension's order.
      // Note: observes this dimension's filter, unlike group and groupAll.
      function top(k, top_offset) {
        var array = [],
            i = hi0,
            j,
            toSkip = 0;

        if(top_offset && top_offset > 0) toSkip = top_offset;

        while (--i >= lo0 && k > 0) {
          if (filters.zero(j = index[i])) {
            if(toSkip > 0) {
              //skip matching row
              --toSkip;
            } else {
              array.push(data[j]);
              --k;
            }
          }
        }

        if(iterable){
          for(i = 0; i < iterablesEmptyRows.length && k > 0; i++) {
            // Add row with empty iterable column at the end
            if(filters.zero(j = iterablesEmptyRows[i])) {
              if(toSkip > 0) {
                //skip matching row
                --toSkip;
              } else {
                array.push(data[j]);
                --k;
              }
            }
          }
        }

        return array;
      }

      // Returns the bottom K selected records based on this dimension's order.
      // Note: observes this dimension's filter, unlike group and groupAll.
      function bottom(k, bottom_offset) {
        var array = [],
            i,
            j,
            toSkip = 0;

        if(bottom_offset && bottom_offset > 0) toSkip = bottom_offset;

        if(iterable) {
          // Add row with empty iterable column at the top
          for(i = 0; i < iterablesEmptyRows.length && k > 0; i++) {
            if(filters.zero(j = iterablesEmptyRows[i])) {
              if(toSkip > 0) {
                //skip matching row
                --toSkip;
              } else {
                array.push(data[j]);
                --k;
              }
            }
          }
        }

        i = lo0;

        while (i < hi0 && k > 0) {
          if (filters.zero(j = index[i])) {
            if(toSkip > 0) {
              //skip matching row
              --toSkip;
            } else {
              array.push(data[j]);
              --k;
            }
          }
          i++;
        }

        return array;
      }

      // Adds a new group to this dimension, using the specified key function.
      function group(key) {
        var group = {
          top: top,
          all: all,
          reduce: reduce,
          reduceCount: reduceCount,
          reduceSum: reduceSum,
          order: order,
          orderNatural: orderNatural,
          size: size,
          dispose: dispose,
          remove: dispose // for backwards-compatibility
        };

        // Ensure that this group will be removed when the dimension is removed.
        dimensionGroups.push(group);

        var groups, // array of {key, value}
            groupIndex, // object id ↦ group id
            groupWidth = 8,
            groupCapacity = crossfilter_capacity(groupWidth),
            k = 0, // cardinality
            select,
            heap,
            reduceAdd,
            reduceRemove,
            reduceInitial,
            update = crossfilter_null,
            reset = crossfilter_null,
            resetNeeded = true,
            groupAll = key === crossfilter_null,
            n0old;

        if (arguments.length < 1) key = crossfilter_identity;

        // The group listens to the crossfilter for when any dimension changes, so
        // that it can update the associated reduce values. It must also listen to
        // the parent dimension for when data is added, and compute new keys.
        filterListeners.push(update);
        indexListeners.push(add);
        removeDataListeners.push(removeData);

        // Incorporate any existing data into the grouping.
        add(values, index, 0, n);

        // Incorporates the specified new values into this group.
        // This function is responsible for updating groups and groupIndex.
        function add(newValues, newIndex, n0, n1) {

          if(iterable) {
            n0old = n0;
            n0 = values.length - newValues.length;
            n1 = newValues.length;
          }

          var oldGroups = groups,
              reIndex = iterable ? [] : crossfilter_index(k, groupCapacity),
              add = reduceAdd,
              remove = reduceRemove,
              initial = reduceInitial,
              k0 = k, // old cardinality
              i0 = 0, // index of old group
              i1 = 0, // index of new record
              j, // object id
              g0, // old group
              x0, // old key
              x1, // new key
              g, // group to add
              x; // key of group to add

          // If a reset is needed, we don't need to update the reduce values.
          if (resetNeeded) add = initial = crossfilter_null;
          if (resetNeeded) remove = initial = crossfilter_null;

          // Reset the new groups (k is a lower bound).
          // Also, make sure that groupIndex exists and is long enough.
          groups = new Array(k), k = 0;
          if(iterable){
            groupIndex = k0 ? groupIndex : [];
          }
          else{
            groupIndex = k0 > 1 ? xfilterArray.arrayLengthen(groupIndex, n) : crossfilter_index(n, groupCapacity);
          }


          // Get the first old key (x0 of g0), if it exists.
          if (k0) x0 = (g0 = oldGroups[0]).key;

          // Find the first new key (x1), skipping NaN keys.
          while (i1 < n1 && !((x1 = key(newValues[i1])) >= x1)) ++i1;

          // While new keys remain…
          while (i1 < n1) {

            // Determine the lesser of the two current keys; new and old.
            // If there are no old keys remaining, then always add the new key.
            if (g0 && x0 <= x1) {
              g = g0, x = x0;

              // Record the new index of the old group.
              reIndex[i0] = k;

              // Retrieve the next old key.
              g0 = oldGroups[++i0];
              if (g0) x0 = g0.key;
            } else {
              g = {key: x1, value: initial()}, x = x1;
            }

            // Add the lesser group.
            groups[k] = g;

            // Add any selected records belonging to the added group, while
            // advancing the new key and populating the associated group index.

            while (x1 <= x) {
              j = newIndex[i1] + (iterable ? n0old : n0);


              if(iterable){
                if(groupIndex[j]){
                  groupIndex[j].push(k);
                }
                else{
                  groupIndex[j] = [k];
                }
              }
              else{
                groupIndex[j] = k;
              }

              // Always add new values to groups. Only remove when not in filter.
              // This gives groups full information on data life-cycle.
              g.value = add(g.value, data[j], true);
              if (!filters.zeroExcept(j, offset, zero)) g.value = remove(g.value, data[j], false);
              if (++i1 >= n1) break;
              x1 = key(newValues[i1]);
            }

            groupIncrement();
          }

          // Add any remaining old groups that were greater th1an all new keys.
          // No incremental reduce is needed; these groups have no new records.
          // Also record the new index of the old group.
          while (i0 < k0) {
            groups[reIndex[i0] = k] = oldGroups[i0++];
            groupIncrement();
          }


          // Fill in gaps with empty arrays where there may have been rows with empty iterables
          if(iterable){
            for (var index1 = 0; index1 < n; index1++) {
              if(!groupIndex[index1]){
                groupIndex[index1] = [];
              }
            }
          }

          // If we added any new groups before any old groups,
          // update the group index of all the old records.
          if(k > i0){
            if(iterable){
              for (i0 = 0; i0 < n0old; ++i0) {
                for (index1 = 0; index1 < groupIndex[i0].length; index1++) {
                  groupIndex[i0][index1] = reIndex[groupIndex[i0][index1]];
                }
              }
            }
            else{
              for (i0 = 0; i0 < n0; ++i0) {
                groupIndex[i0] = reIndex[groupIndex[i0]];
              }
            }
          }

          // Modify the update and reset behavior based on the cardinality.
          // If the cardinality is less than or equal to one, then the groupIndex
          // is not needed. If the cardinality is zero, then there are no records
          // and therefore no groups to update or reset. Note that we also must
          // change the registered listener to point to the new method.
          j = filterListeners.indexOf(update);
          if (k > 1 || iterable) {
            update = updateMany;
            reset = resetMany;
          } else {
            if (!k && groupAll) {
              k = 1;
              groups = [{key: null, value: initial()}];
            }
            if (k === 1) {
              update = updateOne;
              reset = resetOne;
            } else {
              update = crossfilter_null;
              reset = crossfilter_null;
            }
            groupIndex = null;
          }
          filterListeners[j] = update;

          // Count the number of added groups,
          // and widen the group index as needed.
          function groupIncrement() {
            if(iterable){
              k++;
              return
            }
            if (++k === groupCapacity) {
              reIndex = xfilterArray.arrayWiden(reIndex, groupWidth <<= 1);
              groupIndex = xfilterArray.arrayWiden(groupIndex, groupWidth);
              groupCapacity = crossfilter_capacity(groupWidth);
            }
          }
        }

        function removeData(reIndex) {
          if (k > 1 || iterable) {
            var oldK = k,
                oldGroups = groups,
                seenGroups = crossfilter_index(oldK, oldK),
                i,
                i0,
                j;

            // Filter out non-matches by copying matching group index entries to
            // the beginning of the array.
            if (!iterable) {
              for (i = 0, j = 0; i < n; ++i) {
                if (reIndex[i] !== REMOVED_INDEX) {
                  seenGroups[groupIndex[j] = groupIndex[i]] = 1;
                  ++j;
                }
              }
            } else {
              for (i = 0, j = 0; i < n; ++i) {
                if (reIndex[i] !== REMOVED_INDEX) {
                  groupIndex[j] = groupIndex[i];
                  for (i0 = 0; i0 < groupIndex[j].length; i0++) {
                    seenGroups[groupIndex[j][i0]] = 1;
                  }
                  ++j;
                }
              }
            }

            // Reassemble groups including only those groups that were referred
            // to by matching group index entries.  Note the new group index in
            // seenGroups.
            groups = [], k = 0;
            for (i = 0; i < oldK; ++i) {
              if (seenGroups[i]) {
                seenGroups[i] = k++;
                groups.push(oldGroups[i]);
              }
            }

            if (k > 1 || iterable) {
              // Reindex the group index using seenGroups to find the new index.
              if (!iterable) {
                for (i = 0; i < j; ++i) groupIndex[i] = seenGroups[groupIndex[i]];
              } else {
                for (i = 0; i < j; ++i) {
                  for (i0 = 0; i0 < groupIndex[i].length; ++i0) {
                    groupIndex[i][i0] = seenGroups[groupIndex[i][i0]];
                  }
                }
              }
            } else {
              groupIndex = null;
            }
            filterListeners[filterListeners.indexOf(update)] = k > 1 || iterable
                ? (reset = resetMany, update = updateMany)
                : k === 1 ? (reset = resetOne, update = updateOne)
                : reset = update = crossfilter_null;
          } else if (k === 1) {
            if (groupAll) return;
            for (var index3 = 0; index3 < n; ++index3) if (reIndex[index3] !== REMOVED_INDEX) return;
            groups = [], k = 0;
            filterListeners[filterListeners.indexOf(update)] =
            update = reset = crossfilter_null;
          }
        }

        // Reduces the specified selected or deselected records.
        // This function is only used when the cardinality is greater than 1.
        // notFilter indicates a crossfilter.add/remove operation.
        function updateMany(filterOne, filterOffset, added, removed, notFilter) {

          if ((filterOne === one && filterOffset === offset) || resetNeeded) return;

          var i,
              j,
              k,
              n,
              g;

          if(iterable){
            // Add the added values.
            for (i = 0, n = added.length; i < n; ++i) {
              if (filters.zeroExcept(k = added[i], offset, zero)) {
                for (j = 0; j < groupIndex[k].length; j++) {
                  g = groups[groupIndex[k][j]];
                  g.value = reduceAdd(g.value, data[k], false, j);
                }
              }
            }

            // Remove the removed values.
            for (i = 0, n = removed.length; i < n; ++i) {
              if (filters.onlyExcept(k = removed[i], offset, zero, filterOffset, filterOne)) {
                for (j = 0; j < groupIndex[k].length; j++) {
                  g = groups[groupIndex[k][j]];
                  g.value = reduceRemove(g.value, data[k], notFilter, j);
                }
              }
            }
            return;
          }

          // Add the added values.
          for (i = 0, n = added.length; i < n; ++i) {
            if (filters.zeroExcept(k = added[i], offset, zero)) {
              g = groups[groupIndex[k]];
              g.value = reduceAdd(g.value, data[k], false);
            }
          }

          // Remove the removed values.
          for (i = 0, n = removed.length; i < n; ++i) {
            if (filters.onlyExcept(k = removed[i], offset, zero, filterOffset, filterOne)) {
              g = groups[groupIndex[k]];
              g.value = reduceRemove(g.value, data[k], notFilter);
            }
          }
        }

        // Reduces the specified selected or deselected records.
        // This function is only used when the cardinality is 1.
        // notFilter indicates a crossfilter.add/remove operation.
        function updateOne(filterOne, filterOffset, added, removed, notFilter) {
          if ((filterOne === one && filterOffset === offset) || resetNeeded) return;

          var i,
              k,
              n,
              g = groups[0];

          // Add the added values.
          for (i = 0, n = added.length; i < n; ++i) {
            if (filters.zeroExcept(k = added[i], offset, zero)) {
              g.value = reduceAdd(g.value, data[k], false);
            }
          }

          // Remove the removed values.
          for (i = 0, n = removed.length; i < n; ++i) {
            if (filters.onlyExcept(k = removed[i], offset, zero, filterOffset, filterOne)) {
              g.value = reduceRemove(g.value, data[k], notFilter);
            }
          }
        }

        // Recomputes the group reduce values from scratch.
        // This function is only used when the cardinality is greater than 1.
        function resetMany() {
          var i,
              j,
              g;

          // Reset all group values.
          for (i = 0; i < k; ++i) {
            groups[i].value = reduceInitial();
          }

          // We add all records and then remove filtered records so that reducers
          // can build an 'unfiltered' view even if there are already filters in
          // place on other dimensions.
          if(iterable){
            for (i = 0; i < n; ++i) {
              for (j = 0; j < groupIndex[i].length; j++) {
                g = groups[groupIndex[i][j]];
                g.value = reduceAdd(g.value, data[i], true, j);
              }
            }
            for (i = 0; i < n; ++i) {
              if (!filters.zeroExcept(i, offset, zero)) {
                for (j = 0; j < groupIndex[i].length; j++) {
                  g = groups[groupIndex[i][j]];
                  g.value = reduceRemove(g.value, data[i], false, j);
                }
              }
            }
            return;
          }

          for (i = 0; i < n; ++i) {
            g = groups[groupIndex[i]];
            g.value = reduceAdd(g.value, data[i], true);
          }
          for (i = 0; i < n; ++i) {
            if (!filters.zeroExcept(i, offset, zero)) {
              g = groups[groupIndex[i]];
              g.value = reduceRemove(g.value, data[i], false);
            }
          }
        }

        // Recomputes the group reduce values from scratch.
        // This function is only used when the cardinality is 1.
        function resetOne() {
          var i,
              g = groups[0];

          // Reset the singleton group values.
          g.value = reduceInitial();

          // We add all records and then remove filtered records so that reducers
          // can build an 'unfiltered' view even if there are already filters in
          // place on other dimensions.
          for (i = 0; i < n; ++i) {
            g.value = reduceAdd(g.value, data[i], true);
          }

          for (i = 0; i < n; ++i) {
            if (!filters.zeroExcept(i, offset, zero)) {
              g.value = reduceRemove(g.value, data[i], false);
            }
          }
        }

        // Returns the array of group values, in the dimension's natural order.
        function all() {
          if (resetNeeded) reset(), resetNeeded = false;
          return groups;
        }

        // Returns a new array containing the top K group values, in reduce order.
        function top(k) {
          var top = select(all(), 0, groups.length, k);
          return heap.sort(top, 0, top.length);
        }

        // Sets the reduce behavior for this group to use the specified functions.
        // This method lazily recomputes the reduce values, waiting until needed.
        function reduce(add, remove, initial) {
          reduceAdd = add;
          reduceRemove = remove;
          reduceInitial = initial;
          resetNeeded = true;
          return group;
        }

        // A convenience method for reducing by count.
        function reduceCount() {
          return reduce(xfilterReduce.reduceIncrement, xfilterReduce.reduceDecrement, crossfilter_zero);
        }

        // A convenience method for reducing by sum(value).
        function reduceSum(value) {
          return reduce(xfilterReduce.reduceAdd(value), xfilterReduce.reduceSubtract(value), crossfilter_zero);
        }

        // Sets the reduce order, using the specified accessor.
        function order(value) {
          select = xfilterHeapselect.by(valueOf);
          heap = xfilterHeap.by(valueOf);
          function valueOf(d) { return value(d.value); }
          return group;
        }

        // A convenience method for natural ordering by reduce value.
        function orderNatural() {
          return order(crossfilter_identity);
        }

        // Returns the cardinality of this group, irrespective of any filters.
        function size() {
          return k;
        }

        // Removes this group and associated event listeners.
        function dispose() {
          var i = filterListeners.indexOf(update);
          if (i >= 0) filterListeners.splice(i, 1);
          i = indexListeners.indexOf(add);
          if (i >= 0) indexListeners.splice(i, 1);
          i = removeDataListeners.indexOf(removeData);
          if (i >= 0) removeDataListeners.splice(i, 1);
          i = dimensionGroups.indexOf(group);
          if (i >= 0) dimensionGroups.splice(i, 1);
          return group;
        }

        return reduceCount().orderNatural();
      }

      // A convenience function for generating a singleton group.
      function groupAll() {
        var g = group(crossfilter_null), all = g.all;
        delete g.all;
        delete g.top;
        delete g.order;
        delete g.orderNatural;
        delete g.size;
        g.value = function() { return all()[0].value; };
        return g;
      }

      // Removes this dimension and associated groups and event listeners.
      function dispose() {
        dimensionGroups.forEach(function(group) { group.dispose(); });
        var i = dataListeners.indexOf(preAdd);
        if (i >= 0) dataListeners.splice(i, 1);
        i = dataListeners.indexOf(postAdd);
        if (i >= 0) dataListeners.splice(i, 1);
        i = removeDataListeners.indexOf(removeData);
        if (i >= 0) removeDataListeners.splice(i, 1);
        filters.masks[offset] &= zero;
        return filterAll();
      }

      return dimension;
    }

    // A convenience method for groupAll on a dummy dimension.
    // This implementation can be optimized since it always has cardinality 1.
    function groupAll() {
      var group = {
        reduce: reduce,
        reduceCount: reduceCount,
        reduceSum: reduceSum,
        value: value,
        dispose: dispose,
        remove: dispose // for backwards-compatibility
      };

      var reduceValue,
          reduceAdd,
          reduceRemove,
          reduceInitial,
          resetNeeded = true;

      // The group listens to the crossfilter for when any dimension changes, so
      // that it can update the reduce value. It must also listen to the parent
      // dimension for when data is added.
      filterListeners.push(update);
      dataListeners.push(add);

      // For consistency; actually a no-op since resetNeeded is true.
      add(data, 0);

      // Incorporates the specified new values into this group.
      function add(newData, n0) {
        var i;

        if (resetNeeded) return;

        // Cycle through all the values.
        for (i = n0; i < n; ++i) {

          // Add all values all the time.
          reduceValue = reduceAdd(reduceValue, data[i], true);

          // Remove the value if filtered.
          if (!filters.zero(i)) {
            reduceValue = reduceRemove(reduceValue, data[i], false);
          }
        }
      }

      // Reduces the specified selected or deselected records.
      function update(filterOne, filterOffset, added, removed, notFilter) {
        var i,
            k,
            n;

        if (resetNeeded) return;

        // Add the added values.
        for (i = 0, n = added.length; i < n; ++i) {
          if (filters.zero(k = added[i])) {
            reduceValue = reduceAdd(reduceValue, data[k], notFilter);
          }
        }

        // Remove the removed values.
        for (i = 0, n = removed.length; i < n; ++i) {
          if (filters.only(k = removed[i], filterOffset, filterOne)) {
            reduceValue = reduceRemove(reduceValue, data[k], notFilter);
          }
        }
      }

      // Recomputes the group reduce value from scratch.
      function reset() {
        var i;

        reduceValue = reduceInitial();

        // Cycle through all the values.
        for (i = 0; i < n; ++i) {

          // Add all values all the time.
          reduceValue = reduceAdd(reduceValue, data[i], true);

          // Remove the value if it is filtered.
          if (!filters.zero(i)) {
            reduceValue = reduceRemove(reduceValue, data[i], false);
          }
        }
      }

      // Sets the reduce behavior for this group to use the specified functions.
      // This method lazily recomputes the reduce value, waiting until needed.
      function reduce(add, remove, initial) {
        reduceAdd = add;
        reduceRemove = remove;
        reduceInitial = initial;
        resetNeeded = true;
        return group;
      }

      // A convenience method for reducing by count.
      function reduceCount() {
        return reduce(xfilterReduce.reduceIncrement, xfilterReduce.reduceDecrement, crossfilter_zero);
      }

      // A convenience method for reducing by sum(value).
      function reduceSum(value) {
        return reduce(xfilterReduce.reduceAdd(value), xfilterReduce.reduceSubtract(value), crossfilter_zero);
      }

      // Returns the computed reduce value.
      function value() {
        if (resetNeeded) reset(), resetNeeded = false;
        return reduceValue;
      }

      // Removes this group and associated event listeners.
      function dispose() {
        var i = filterListeners.indexOf(update);
        if (i >= 0) filterListeners.splice(i, 1);
        i = dataListeners.indexOf(add);
        if (i >= 0) dataListeners.splice(i, 1);
        return group;
      }

      return reduceCount();
    }

    // Returns the number of records in this crossfilter, irrespective of any filters.
    function size() {
      return n;
    }

    // Returns the raw row data contained in this crossfilter
    function all(){
      return data;
    }

    // Returns row data with all dimension filters applied, except for filters in ignore_dimensions
    function allFiltered(ignore_dimensions) {
      var array = [],
          i = 0,
          mask = maskForDimensions(ignore_dimensions || []);

        for (i = 0; i < n; i++) {
          if (filters.zeroExceptMask(i, mask)) {
            array.push(data[i]);
          }
        }

        return array;
    }

    function onChange(cb){
      if(typeof cb !== 'function'){
        /* eslint no-console: 0 */
        console.warn('onChange callback parameter must be a function!');
        return;
      }
      callbacks.push(cb);
      return function(){
        callbacks.splice(callbacks.indexOf(cb), 1);
      };
    }

    function triggerOnChange(eventName){
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i](eventName);
      }
    }

    return arguments.length
        ? add(arguments[0])
        : crossfilter;
  }

  // Returns an array of size n, big enough to store ids up to m.
  function crossfilter_index(n, m) {
    return (m < 0x101
        ? xfilterArray.array8 : m < 0x10001
        ? xfilterArray.array16
        : xfilterArray.array32)(n);
  }

  // Constructs a new array of size n, with sequential values from 0 to n - 1.
  function crossfilter_range(n) {
    var range = crossfilter_index(n, n);
    for (var i = -1; ++i < n;) range[i] = i;
    return range;
  }

  function crossfilter_capacity(w) {
    return w === 8
        ? 0x100 : w === 16
        ? 0x10000
        : 0x100000000;
  }

  },{"./../package.json":3,"./array":4,"./bisect":5,"./filter":7,"./heap":8,"./heapselect":9,"./identity":10,"./insertionsort":11,"./null":12,"./permute":13,"./quicksort":14,"./reduce":15,"./zero":16,"lodash.result":2}],7:[function(require,module,exports){

  function crossfilter_filterExact(bisect, value) {
    return function(values) {
      var n = values.length;
      return [bisect.left(values, value, 0, n), bisect.right(values, value, 0, n)];
    };
  }

  function crossfilter_filterRange(bisect, range) {
    var min = range[0],
        max = range[1];
    return function(values) {
      var n = values.length;
      return [bisect.left(values, min, 0, n), bisect.left(values, max, 0, n)];
    };
  }

  function crossfilter_filterAll(values) {
    return [0, values.length];
  }

  module.exports = {
    filterExact: crossfilter_filterExact,
    filterRange: crossfilter_filterRange,
    filterAll: crossfilter_filterAll
  };

  },{}],8:[function(require,module,exports){

  var crossfilter_identity = require('./identity');

  function heap_by(f) {

    // Builds a binary heap within the specified array a[lo:hi]. The heap has the
    // property such that the parent a[lo+i] is always less than or equal to its
    // two children: a[lo+2*i+1] and a[lo+2*i+2].
    function heap(a, lo, hi) {
      var n = hi - lo,
          i = (n >>> 1) + 1;
      while (--i > 0) sift(a, i, n, lo);
      return a;
    }

    // Sorts the specified array a[lo:hi] in descending order, assuming it is
    // already a heap.
    function sort(a, lo, hi) {
      var n = hi - lo,
          t;
      while (--n > 0) t = a[lo], a[lo] = a[lo + n], a[lo + n] = t, sift(a, 1, n, lo);
      return a;
    }

    // Sifts the element a[lo+i-1] down the heap, where the heap is the contiguous
    // slice of array a[lo:lo+n]. This method can also be used to update the heap
    // incrementally, without incurring the full cost of reconstructing the heap.
    function sift(a, i, n, lo) {
      var d = a[--lo + i],
          x = f(d),
          child;
      while ((child = i << 1) <= n) {
        if (child < n && f(a[lo + child]) > f(a[lo + child + 1])) child++;
        if (x <= f(a[lo + child])) break;
        a[lo + i] = a[lo + child];
        i = child;
      }
      a[lo + i] = d;
    }

    heap.sort = sort;
    return heap;
  }

  module.exports = heap_by(crossfilter_identity);
  module.exports.by = heap_by;

  },{"./identity":10}],9:[function(require,module,exports){

  var crossfilter_identity = require('./identity');
  var xFilterHeap = require('./heap');

  function heapselect_by(f) {
    var heap = xFilterHeap.by(f);

    // Returns a new array containing the top k elements in the array a[lo:hi].
    // The returned array is not sorted, but maintains the heap property. If k is
    // greater than hi - lo, then fewer than k elements will be returned. The
    // order of elements in a is unchanged by this operation.
    function heapselect(a, lo, hi, k) {
      var queue = new Array(k = Math.min(hi - lo, k)),
          min,
          i,
          d;

      for (i = 0; i < k; ++i) queue[i] = a[lo++];
      heap(queue, 0, k);

      if (lo < hi) {
        min = f(queue[0]);
        do {
          if (f(d = a[lo]) > min) {
            queue[0] = d;
            min = f(heap(queue, 0, k)[0]);
          }
        } while (++lo < hi);
      }

      return queue;
    }

    return heapselect;
  }

  module.exports = heapselect_by(crossfilter_identity);
  module.exports.by = heapselect_by; // assign the raw function to the export as well

  },{"./heap":8,"./identity":10}],10:[function(require,module,exports){

  function crossfilter_identity(d) {
    return d;
  }

  module.exports = crossfilter_identity;

  },{}],11:[function(require,module,exports){

  var crossfilter_identity = require('./identity');

  function insertionsort_by(f) {

    function insertionsort(a, lo, hi) {
      for (var i = lo + 1; i < hi; ++i) {
        for (var j = i, t = a[i], x = f(t); j > lo && f(a[j - 1]) > x; --j) {
          a[j] = a[j - 1];
        }
        a[j] = t;
      }
      return a;
    }

    return insertionsort;
  }

  module.exports = insertionsort_by(crossfilter_identity);
  module.exports.by = insertionsort_by;

  },{"./identity":10}],12:[function(require,module,exports){

  function crossfilter_null() {
    return null;
  }

  module.exports = crossfilter_null;

  },{}],13:[function(require,module,exports){

  function permute(array, index, deep) {
    for (var i = 0, n = index.length, copy = deep ? JSON.parse(JSON.stringify(array)) : new Array(n); i < n; ++i) {
      copy[i] = array[index[i]];
    }
    return copy;
  }

  module.exports = permute;

  },{}],14:[function(require,module,exports){
  var crossfilter_identity = require('./identity');
  var xFilterInsertionsort = require('./insertionsort');

  // Algorithm designed by Vladimir Yaroslavskiy.
  // Implementation based on the Dart project; see NOTICE and AUTHORS for details.

  function quicksort_by(f) {
    var insertionsort = xFilterInsertionsort.by(f);

    function sort(a, lo, hi) {
      return (hi - lo < quicksort_sizeThreshold
          ? insertionsort
          : quicksort)(a, lo, hi);
    }

    function quicksort(a, lo, hi) {
      // Compute the two pivots by looking at 5 elements.
      var sixth = (hi - lo) / 6 | 0,
          i1 = lo + sixth,
          i5 = hi - 1 - sixth,
          i3 = lo + hi - 1 >> 1,  // The midpoint.
          i2 = i3 - sixth,
          i4 = i3 + sixth;

      var e1 = a[i1], x1 = f(e1),
          e2 = a[i2], x2 = f(e2),
          e3 = a[i3], x3 = f(e3),
          e4 = a[i4], x4 = f(e4),
          e5 = a[i5], x5 = f(e5);

      var t;

      // Sort the selected 5 elements using a sorting network.
      if (x1 > x2) t = e1, e1 = e2, e2 = t, t = x1, x1 = x2, x2 = t;
      if (x4 > x5) t = e4, e4 = e5, e5 = t, t = x4, x4 = x5, x5 = t;
      if (x1 > x3) t = e1, e1 = e3, e3 = t, t = x1, x1 = x3, x3 = t;
      if (x2 > x3) t = e2, e2 = e3, e3 = t, t = x2, x2 = x3, x3 = t;
      if (x1 > x4) t = e1, e1 = e4, e4 = t, t = x1, x1 = x4, x4 = t;
      if (x3 > x4) t = e3, e3 = e4, e4 = t, t = x3, x3 = x4, x4 = t;
      if (x2 > x5) t = e2, e2 = e5, e5 = t, t = x2, x2 = x5, x5 = t;
      if (x2 > x3) t = e2, e2 = e3, e3 = t, t = x2, x2 = x3, x3 = t;
      if (x4 > x5) t = e4, e4 = e5, e5 = t, t = x4, x4 = x5, x5 = t;

      var pivot1 = e2, pivotValue1 = x2,
          pivot2 = e4, pivotValue2 = x4;

      // e2 and e4 have been saved in the pivot variables. They will be written
      // back, once the partitioning is finished.
      a[i1] = e1;
      a[i2] = a[lo];
      a[i3] = e3;
      a[i4] = a[hi - 1];
      a[i5] = e5;

      var less = lo + 1,   // First element in the middle partition.
          great = hi - 2;  // Last element in the middle partition.

      // Note that for value comparison, <, <=, >= and > coerce to a primitive via
      // Object.prototype.valueOf; == and === do not, so in order to be consistent
      // with natural order (such as for Date objects), we must do two compares.
      var pivotsEqual = pivotValue1 <= pivotValue2 && pivotValue1 >= pivotValue2;
      if (pivotsEqual) {

        // Degenerated case where the partitioning becomes a dutch national flag
        // problem.
        //
        // [ |  < pivot  | == pivot | unpartitioned | > pivot  | ]
        //  ^             ^          ^             ^            ^
        // left         less         k           great         right
        //
        // a[left] and a[right] are undefined and are filled after the
        // partitioning.
        //
        // Invariants:
        //   1) for x in ]left, less[ : x < pivot.
        //   2) for x in [less, k[ : x == pivot.
        //   3) for x in ]great, right[ : x > pivot.
        for (var k = less; k <= great; ++k) {
          var ek = a[k], xk = f(ek);
          if (xk < pivotValue1) {
            if (k !== less) {
              a[k] = a[less];
              a[less] = ek;
            }
            ++less;
          } else if (xk > pivotValue1) {

            // Find the first element <= pivot in the range [k - 1, great] and
            // put [:ek:] there. We know that such an element must exist:
            // When k == less, then el3 (which is equal to pivot) lies in the
            // interval. Otherwise a[k - 1] == pivot and the search stops at k-1.
            // Note that in the latter case invariant 2 will be violated for a
            // short amount of time. The invariant will be restored when the
            // pivots are put into their final positions.
            /* eslint no-constant-condition: 0 */
            while (true) {
              var greatValue = f(a[great]);
              if (greatValue > pivotValue1) {
                great--;
                // This is the only location in the while-loop where a new
                // iteration is started.
                continue;
              } else if (greatValue < pivotValue1) {
                // Triple exchange.
                a[k] = a[less];
                a[less++] = a[great];
                a[great--] = ek;
                break;
              } else {
                a[k] = a[great];
                a[great--] = ek;
                // Note: if great < k then we will exit the outer loop and fix
                // invariant 2 (which we just violated).
                break;
              }
            }
          }
        }
      } else {

        // We partition the list into three parts:
        //  1. < pivot1
        //  2. >= pivot1 && <= pivot2
        //  3. > pivot2
        //
        // During the loop we have:
        // [ | < pivot1 | >= pivot1 && <= pivot2 | unpartitioned  | > pivot2  | ]
        //  ^            ^                        ^              ^             ^
        // left         less                     k              great        right
        //
        // a[left] and a[right] are undefined and are filled after the
        // partitioning.
        //
        // Invariants:
        //   1. for x in ]left, less[ : x < pivot1
        //   2. for x in [less, k[ : pivot1 <= x && x <= pivot2
        //   3. for x in ]great, right[ : x > pivot2
        (function () { // isolate scope
        for (var k = less; k <= great; k++) {
          var ek = a[k], xk = f(ek);
          if (xk < pivotValue1) {
            if (k !== less) {
              a[k] = a[less];
              a[less] = ek;
            }
            ++less;
          } else {
            if (xk > pivotValue2) {
              while (true) {
                var greatValue = f(a[great]);
                if (greatValue > pivotValue2) {
                  great--;
                  if (great < k) break;
                  // This is the only location inside the loop where a new
                  // iteration is started.
                  continue;
                } else {
                  // a[great] <= pivot2.
                  if (greatValue < pivotValue1) {
                    // Triple exchange.
                    a[k] = a[less];
                    a[less++] = a[great];
                    a[great--] = ek;
                  } else {
                    // a[great] >= pivot1.
                    a[k] = a[great];
                    a[great--] = ek;
                  }
                  break;
                }
              }
            }
          }
        }
        })(); // isolate scope
      }

      // Move pivots into their final positions.
      // We shrunk the list from both sides (a[left] and a[right] have
      // meaningless values in them) and now we move elements from the first
      // and third partition into these locations so that we can store the
      // pivots.
      a[lo] = a[less - 1];
      a[less - 1] = pivot1;
      a[hi - 1] = a[great + 1];
      a[great + 1] = pivot2;

      // The list is now partitioned into three partitions:
      // [ < pivot1   | >= pivot1 && <= pivot2   |  > pivot2   ]
      //  ^            ^                        ^             ^
      // left         less                     great        right

      // Recursive descent. (Don't include the pivot values.)
      sort(a, lo, less - 1);
      sort(a, great + 2, hi);

      if (pivotsEqual) {
        // All elements in the second partition are equal to the pivot. No
        // need to sort them.
        return a;
      }

      // In theory it should be enough to call _doSort recursively on the second
      // partition.
      // The Android source however removes the pivot elements from the recursive
      // call if the second partition is too large (more than 2/3 of the list).
      if (less < i1 && great > i5) {

        (function () { // isolate scope
        var lessValue, greatValue;
        while ((lessValue = f(a[less])) <= pivotValue1 && lessValue >= pivotValue1) ++less;
        while ((greatValue = f(a[great])) <= pivotValue2 && greatValue >= pivotValue2) --great;

        // Copy paste of the previous 3-way partitioning with adaptions.
        //
        // We partition the list into three parts:
        //  1. == pivot1
        //  2. > pivot1 && < pivot2
        //  3. == pivot2
        //
        // During the loop we have:
        // [ == pivot1 | > pivot1 && < pivot2 | unpartitioned  | == pivot2 ]
        //              ^                      ^              ^
        //            less                     k              great
        //
        // Invariants:
        //   1. for x in [ *, less[ : x == pivot1
        //   2. for x in [less, k[ : pivot1 < x && x < pivot2
        //   3. for x in ]great, * ] : x == pivot2
        for (var k = less; k <= great; k++) {
          var ek = a[k], xk = f(ek);
          if (xk <= pivotValue1 && xk >= pivotValue1) {
            if (k !== less) {
              a[k] = a[less];
              a[less] = ek;
            }
            less++;
          } else {
            if (xk <= pivotValue2 && xk >= pivotValue2) {
              /* eslint no-constant-condition: 0 */
              while (true) {
                greatValue = f(a[great]);
                if (greatValue <= pivotValue2 && greatValue >= pivotValue2) {
                  great--;
                  if (great < k) break;
                  // This is the only location inside the loop where a new
                  // iteration is started.
                  continue;
                } else {
                  // a[great] < pivot2.
                  if (greatValue < pivotValue1) {
                    // Triple exchange.
                    a[k] = a[less];
                    a[less++] = a[great];
                    a[great--] = ek;
                  } else {
                    // a[great] == pivot1.
                    a[k] = a[great];
                    a[great--] = ek;
                  }
                  break;
                }
              }
            }
          }
        }
        })(); // isolate scope

      }

      // The second partition has now been cleared of pivot elements and looks
      // as follows:
      // [  *  |  > pivot1 && < pivot2  | * ]
      //        ^                      ^
      //       less                  great
      // Sort the second partition using recursive descent.

      // The second partition looks as follows:
      // [  *  |  >= pivot1 && <= pivot2  | * ]
      //        ^                        ^
      //       less                    great
      // Simply sort it by recursive descent.

      return sort(a, less, great + 1);
    }

    return sort;
  }

  var quicksort_sizeThreshold = 32;

  module.exports = quicksort_by(crossfilter_identity);
  module.exports.by = quicksort_by;

  },{"./identity":10,"./insertionsort":11}],15:[function(require,module,exports){

  function crossfilter_reduceIncrement(p) {
    return p + 1;
  }

  function crossfilter_reduceDecrement(p) {
    return p - 1;
  }

  function crossfilter_reduceAdd(f) {
    return function(p, v) {
      return p + +f(v);
    };
  }

  function crossfilter_reduceSubtract(f) {
    return function(p, v) {
      return p - f(v);
    };
  }

  module.exports = {
    reduceIncrement: crossfilter_reduceIncrement,
    reduceDecrement: crossfilter_reduceDecrement,
    reduceAdd: crossfilter_reduceAdd,
    reduceSubtract: crossfilter_reduceSubtract
  };

  },{}],16:[function(require,module,exports){

  function crossfilter_zero() {
    return 0;
  }

  module.exports = crossfilter_zero;

  },{}]},{},[1])(1)
  });
  });

  const constants = {
      CHART_CLASS: 'dc-chart',
      DEBUG_GROUP_CLASS: 'debug',
      STACK_CLASS: 'stack',
      DESELECTED_CLASS: 'deselected',
      SELECTED_CLASS: 'selected',
      NODE_INDEX_NAME: '__index__',
      GROUP_INDEX_NAME: '__group_index__',
      DEFAULT_CHART_GROUP: '__default_chart_group__',
      EVENT_DELAY: 40,
      NEGLIGIBLE_NUMBER: 1e-10
  };

  /**
   * Provides basis logging and deprecation utilities
   * @class logger
   * @returns {logger}
   */
  const logger = (function () {

      const _logger = {};

      /**
       * Enable debug level logging. Set to `false` by default.
       * @name enableDebugLog
       * @memberof logger
       * @instance
       */
      _logger.enableDebugLog = false;

      /**
       * Put a warning message to console
       * @method warn
       * @memberof logger
       * @instance
       * @example
       * logger.warn('Invalid use of .tension on CurveLinear');
       * @param {String} [msg]
       * @returns {logger}
       */
      _logger.warn = function (msg) {
          if (console) {
              if (console.warn) {
                  console.warn(msg);
              } else if (console.log) {
                  console.log(msg);
              }
          }

          return _logger;
      };

      const _alreadyWarned = {};

      /**
       * Put a warning message to console. It will warn only on unique messages.
       * @method warnOnce
       * @memberof logger
       * @instance
       * @example
       * logger.warnOnce('Invalid use of .tension on CurveLinear');
       * @param {String} [msg]
       * @returns {logger}
       */
      _logger.warnOnce = function (msg) {
          if (!_alreadyWarned[msg]) {
              _alreadyWarned[msg] = true;

              logger.warn(msg);
          }

          return _logger;
      };

      /**
       * Put a debug message to console. It is controlled by `logger.enableDebugLog`
       * @method debug
       * @memberof logger
       * @instance
       * @example
       * logger.debug('Total number of slices: ' + numSlices);
       * @param {String} [msg]
       * @returns {logger}
       */
      _logger.debug = function (msg) {
          if (_logger.enableDebugLog && console) {
              if (console.debug) {
                  console.debug(msg);
              } else if (console.log) {
                  console.log(msg);
              }
          }

          return _logger;
      };

      /**
       * Used to deprecate a function. It will return a wrapped version of the function, which will
       * will issue a warning when invoked. The warning will be issued only once.
       *
       * @method deprecate
       * @memberof logger
       * @instance
       * @example
       * _chart.interpolate = logger.deprecate(function (interpolate) {
       *    if (!arguments.length) {
       *        return _interpolate;
       *    }
       *    _interpolate = interpolate;
       *    return _chart;
       * }, 'lineChart.interpolate has been deprecated since version 3.0 use lineChart.curve instead');
       * @param {Function} [fn]
       * @param {String} [msg]
       * @returns {Function}
       */
      _logger.deprecate = function (fn, msg) {
          // Allow logging of deprecation
          let warned = false;

          function deprecated () {
              if (!warned) {
                  _logger.warn(msg);
                  warned = true;
              }
              return fn.apply(this, arguments);
          }
          return deprecated;
      };

      /**
       * Used to provide an informational message for a function. It will return a wrapped version of
       * the function, which will will issue a messsage with stack when invoked. The message will be
       * issued only once.
       *
       * @method annotate
       * @memberof logger
       * @instance
       * @example
       * _chart.interpolate = logger.annotate(function (interpolate) {
       *    if (!arguments.length) {
       *        return _interpolate;
       *    }
       *    _interpolate = interpolate;
       *    return _chart;
       * }, 'lineChart.interpolate has been annotated since version 3.0 use lineChart.curve instead');
       * @param {Function} [fn]
       * @param {String} [msg]
       * @returns {Function}
       */
      _logger.annotate = function (fn, msg) {
          // Allow logging of deprecation
          let warned = false;

          function annotated () {
              if (!warned) {
                  console.groupCollapsed(msg);
                  console.trace();
                  console.groupEnd();
                  warned = true;
              }
              return fn.apply(this, arguments);
          }
          return annotated;
      };

      return _logger;
  })();

  /**
   * General configuration
   */
  class Config {
      constructor () {
          this._defaultColors = Config._schemeCategory20c;

          /**
           * The default date format for dc.js
           * @type {Function}
           * @default d3.timeFormat('%m/%d/%Y')
           */
          this.dateFormat = timeFormat('%m/%d/%Y');

          this._renderlet = null;

          /**
           * If this boolean is set truthy, all transitions will be disabled, and changes to the charts will happen
           * immediately.
           * @memberof dc
           * @member disableTransitions
           * @type {Boolean}
           * @default false
           */
          this.disableTransitions = false;
      }

      /**
       * Set the default color scheme for ordinal charts. Changing it will impact all ordinal charts.
       *
       * By default it is set to a copy of
       * `d3.schemeCategory20c` for backward compatibility. This color scheme has been
       * [removed from D3v5](https://github.com/d3/d3/blob/master/CHANGES.md#changes-in-d3-50).
       * In DC 3.1 release it will change to a more appropriate default.
       *
       * @example
       * config.defaultColors(d3.schemeSet1)
       * @param {Array} [colors]
       * @returns {Array|config}
       */
      defaultColors (colors) {
          if (!arguments.length) {
              // Issue warning if it uses _schemeCategory20c
              if (this._defaultColors === Config._schemeCategory20c) {
                  logger.warnOnce('You are using d3.schemeCategory20c, which has been removed in D3v5. ' +
                      'See the explanation at https://github.com/d3/d3/blob/master/CHANGES.md#changes-in-d3-50. ' +
                      'DC is using it for backward compatibility, however it will be changed in DCv3.1. ' +
                      'You can change it by calling dc.config.defaultColors(newScheme). ' +
                      'See https://github.com/d3/d3-scale-chromatic for some alternatives.');
              }
              return this._defaultColors;
          }
          this._defaultColors = colors;
          return this;
      }

  }

  // D3v5 has removed schemeCategory20c, copied here for backward compatibility
  Config._schemeCategory20c = [
      '#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d',
      '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476',
      '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc',
      '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9'];

  /**
   * General configuration
   *
   * @class config
   * @returns {Config}
   */
  const config = new Config();

  /**
   * The chartRegistry object maintains sets of all instantiated dc.js charts under named groups
   * and the default group.
   *
   * A chart group often corresponds to a crossfilter instance. It specifies
   * the set of charts which should be updated when a filter changes on one of the charts or when the
   * global functions {@link filterAll filterAll}, {@link refocusAll refocusAll},
   * {@link renderAll renderAll}, {@link redrawAll redrawAll}, or chart functions
   * {@link baseMixin#renderGroup baseMixin.renderGroup},
   * {@link baseMixin#redrawGroup baseMixin.redrawGroup} are called.
   *
   * @namespace chartRegistry
   * @type {{has, register, deregister, clear, list}}
   */
  const chartRegistry = (function () {
      // chartGroup:string => charts:array
      let _chartMap = {};

      function initializeChartGroup (group) {
          if (!group) {
              group = constants.DEFAULT_CHART_GROUP;
          }

          if (!_chartMap[group]) {
              _chartMap[group] = [];
          }

          return group;
      }

      return {
          /**
           * Determine if a given chart instance resides in any group in the registry.
           * @method has
           * @memberof chartRegistry
           * @param {Object} chart dc.js chart instance
           * @returns {Boolean}
           */
          has: function (chart) {
              for (let e in _chartMap) {
                  if (_chartMap[e].indexOf(chart) >= 0) {
                      return true;
                  }
              }
              return false;
          },

          /**
           * Add given chart instance to the given group, creating the group if necessary.
           * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
           * @method register
           * @memberof chartRegistry
           * @param {Object} chart dc.js chart instance
           * @param {String} [group] Group name
           * @return {undefined}
           */
          register: function (chart, group) {
              group = initializeChartGroup(group);
              _chartMap[group].push(chart);
          },

          /**
           * Remove given chart instance from the given group, creating the group if necessary.
           * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
           * @method deregister
           * @memberof chartRegistry
           * @param {Object} chart dc.js chart instance
           * @param {String} [group] Group name
           * @return {undefined}
           */
          deregister: function (chart, group) {
              group = initializeChartGroup(group);
              for (let i = 0; i < _chartMap[group].length; i++) {
                  if (_chartMap[group][i].anchorName() === chart.anchorName()) {
                      _chartMap[group].splice(i, 1);
                      break;
                  }
              }
          },

          /**
           * Clear given group if one is provided, otherwise clears all groups.
           * @method clear
           * @memberof chartRegistry
           * @param {String} group Group name
           * @return {undefined}
           */
          clear: function (group) {
              if (group) {
                  delete _chartMap[group];
              } else {
                  _chartMap = {};
              }
          },

          /**
           * Get an array of each chart instance in the given group.
           * If no group is provided, the charts in the default group are returned.
           * @method list
           * @memberof chartRegistry
           * @param {String} [group] Group name
           * @returns {Array<Object>}
           */
          list: function (group) {
              group = initializeChartGroup(group);
              return _chartMap[group];
          }
      };
  })();

  /**
   * Add given chart instance to the given group, creating the group if necessary.
   * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
   * @param {Object} chart dc.js chart instance
   * @param {String} [group] Group name
   * @return {undefined}
   */
  const registerChart = function (chart, group) {
      chartRegistry.register(chart, group);
  };

  /**
   * Remove given chart instance from the given group, creating the group if necessary.
   * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
   * @param {Object} chart dc.js chart instance
   * @param {String} [group] Group name
   * @return {undefined}
   */
  const deregisterChart = function (chart, group) {
      chartRegistry.deregister(chart, group);
  };

  /**
   * Re-render all charts belong to the given chart group. If the chart group is not given then only
   * charts that belong to the default chart group will be re-rendered.
   * @param {String} [group]
   * @return {undefined}
   */
  const renderAll = function (group) {
      const charts = chartRegistry.list(group);
      for (let i = 0; i < charts.length; ++i) {
          charts[i].render();
      }

      if (config._renderlet !== null) {
          config._renderlet(group);
      }
  };

  /**
   * Redraw all charts belong to the given chart group. If the chart group is not given then only charts
   * that belong to the default chart group will be re-drawn. Redraw is different from re-render since
   * when redrawing dc tries to update the graphic incrementally, using transitions, instead of starting
   * from scratch.
   * @param {String} [group]
   * @return {undefined}
   */
  const redrawAll = function (group) {
      const charts = chartRegistry.list(group);
      for (let i = 0; i < charts.length; ++i) {
          charts[i].redraw();
      }

      if (config._renderlet !== null) {
          config._renderlet(group);
      }
  };

  /**
   * Start a transition on a selection if transitions are globally enabled
   * ({@link disableTransitions} is false) and the duration is greater than zero; otherwise return
   * the selection. Since most operations are the same on a d3 selection and a d3 transition, this
   * allows a common code path for both cases.
   * @param {d3.selection} selection - the selection to be transitioned
   * @param {Number|Function} [duration=250] - the duration of the transition in milliseconds, a
   * function returning the duration, or 0 for no transition
   * @param {Number|Function} [delay] - the delay of the transition in milliseconds, or a function
   * returning the delay, or 0 for no delay
   * @param {String} [name] - the name of the transition (if concurrent transitions on the same
   * elements are needed)
   * @returns {d3.transition|d3.selection}
   */
  const transition$1 = function (selection, duration, delay, name) {
      if (config.disableTransitions || duration <= 0) {
          return selection;
      }

      let s = selection.transition(name);

      if (duration >= 0 || duration !== undefined) {
          s = s.duration(duration);
      }
      if (delay >= 0 || delay !== undefined) {
          s = s.delay(delay);
      }

      return s;
  };

  /* somewhat silly, but to avoid duplicating logic */
  const optionalTransition = function (enable, duration, delay, name) {
      if (enable) {
          return function (selection) {
              return transition$1(selection, duration, delay, name);
          };
      } else {
          return function (selection) {
              return selection;
          };
      }
  };

  const instanceOfChart = function (o) {
      return o instanceof Object && o.__dcFlag__ && true;
  };

  class BadArgumentException extends Error { }

  class InvalidStateException extends Error { }

  /**
   * Returns a function that given a string property name, can be used to pluck the property off an object.  A function
   * can be passed as the second argument to also alter the data being returned.
   *
   * This can be a useful shorthand method to create accessor functions.
   * @example
   * var xPluck = pluck('x');
   * var objA = {x: 1};
   * xPluck(objA) // 1
   * @example
   * var xPosition = pluck('x', function (x, i) {
   *     // `this` is the original datum,
   *     // `x` is the x property of the datum,
   *     // `i` is the position in the array
   *     return this.radius + x;
   * });
   * selectAll('.circle').data(...).x(xPosition);
   * @param {String} n
   * @param {Function} [f]
   * @returns {Function}
   */
  const pluck = function (n, f) {
      if (!f) {
          return function (d) { return d[n]; };
      }
      return function (d, i) { return f.call(d, d[n], i); };
  };

  /**
   * @namespace utils
   * @type {{}}
   */
  const utils = {};

  /**
   * Print a single value filter.
   * @method printSingleValue
   * @memberof utils
   * @param {any} filter
   * @returns {String}
   */
  utils.printSingleValue = function (filter) {
      let s = '' + filter;

      if (filter instanceof Date) {
          s = config.dateFormat(filter);
      } else if (typeof(filter) === 'string') {
          s = filter;
      } else if (utils.isFloat(filter)) {
          s = utils.printSingleValue.fformat(filter);
      } else if (utils.isInteger(filter)) {
          s = Math.round(filter);
      }

      return s;
  };
  utils.printSingleValue.fformat = format('.2f');

  // convert 'day' to d3.timeDay and similar
  utils._toTimeFunc = function (t) {
      const mappings = {
          'second': second,
          'minute': minute,
          'hour': hour,
          'day': day,
          'week': sunday,
          'month': month,
          'year': year
      };
      return mappings[t];
  };

  /**
   * Arbitrary add one value to another.
   *
   * If the value l is of type Date, adds r units to it. t becomes the unit.
   * For example utils.add(dt, 3, 'week') will add 3 (r = 3) weeks (t= 'week') to dt.
   *
   * If l is of type numeric, t is ignored. In this case if r is of type string,
   * it is assumed to be percentage (whether or not it includes %). For example
   * utils.add(30, 10) will give 40 and utils.add(30, '10') will give 33.
   *
   * They also generate strange results if l is a string.
   * @method add
   * @memberof utils
   * @param {Date|Number} l the value to modify
   * @param {String|Number} r the amount by which to modify the value
   * @param {Function|String} [t=d3.timeDay] if `l` is a `Date`, then this should be a
   * [d3 time interval](https://github.com/d3/d3-time/blob/master/README.md#_interval).
   * For backward compatibility with dc.js 2.0, it can also be the name of an interval, i.e.
   * 'millis', 'second', 'minute', 'hour', 'day', 'week', 'month', or 'year'
   * @returns {Date|Number}
   */
  utils.add = function (l, r, t) {
      if (typeof r === 'string') {
          r = r.replace('%', '');
      }

      if (l instanceof Date) {
          if (typeof r === 'string') {
              r = +r;
          }
          if (t === 'millis') {
              return new Date(l.getTime() + r);
          }
          t = t || day;
          if (typeof t !== 'function') {
              t = utils._toTimeFunc(t);
          }
          return t.offset(l, r);
      } else if (typeof r === 'string') {
          const percentage = (+r / 100);
          return l > 0 ? l * (1 + percentage) : l * (1 - percentage);
      } else {
          return l + r;
      }
  };

  /**
   * Arbitrary subtract one value from another.
   *
   * If the value l is of type Date, subtracts r units from it. t becomes the unit.
   * For example utils.subtract(dt, 3, 'week') will subtract 3 (r = 3) weeks (t= 'week') from dt.
   *
   * If l is of type numeric, t is ignored. In this case if r is of type string,
   * it is assumed to be percentage (whether or not it includes %). For example
   * utils.subtract(30, 10) will give 20 and utils.subtract(30, '10') will give 27.
   *
   * They also generate strange results if l is a string.
   * @method subtract
   * @memberof utils
   * @param {Date|Number} l the value to modify
   * @param {String|Number} r the amount by which to modify the value
   * @param {Function|String} [t=d3.timeDay] if `l` is a `Date`, then this should be a
   * [d3 time interval](https://github.com/d3/d3-time/blob/master/README.md#_interval).
   * For backward compatibility with dc.js 2.0, it can also be the name of an interval, i.e.
   * 'millis', 'second', 'minute', 'hour', 'day', 'week', 'month', or 'year'
   * @returns {Date|Number}
   */
  utils.subtract = function (l, r, t) {
      if (typeof r === 'string') {
          r = r.replace('%', '');
      }

      if (l instanceof Date) {
          if (typeof r === 'string') {
              r = +r;
          }
          if (t === 'millis') {
              return new Date(l.getTime() - r);
          }
          t = t || day;
          if (typeof t !== 'function') {
              t = utils._toTimeFunc(t);
          }
          return t.offset(l, -r);
      } else if (typeof r === 'string') {
          const percentage = (+r / 100);
          return l < 0 ? l * (1 + percentage) : l * (1 - percentage);
      } else {
          return l - r;
      }
  };

  /**
   * Is the value a number?
   * @method isNumber
   * @memberof utils
   * @param {any} n
   * @returns {Boolean}
   */
  utils.isNumber = function (n) {
      return n === +n;
  };

  /**
   * Is the value a float?
   * @method isFloat
   * @memberof utils
   * @param {any} n
   * @returns {Boolean}
   */
  utils.isFloat = function (n) {
      return n === +n && n !== (n | 0);
  };

  /**
   * Is the value an integer?
   * @method isInteger
   * @memberof utils
   * @param {any} n
   * @returns {Boolean}
   */
  utils.isInteger = function (n) {
      return n === +n && n === (n | 0);
  };

  /**
   * Is the value very close to zero?
   * @method isNegligible
   * @memberof utils
   * @param {any} n
   * @returns {Boolean}
   */
  utils.isNegligible = function (n) {
      return !utils.isNumber(n) || (n < constants.NEGLIGIBLE_NUMBER && n > -constants.NEGLIGIBLE_NUMBER);
  };

  /**
   * Ensure the value is no greater or less than the min/max values.  If it is return the boundary value.
   * @method clamp
   * @memberof utils
   * @param {any} val
   * @param {any} min
   * @param {any} max
   * @returns {any}
   */
  utils.clamp = function (val, min, max) {
      return val < min ? min : (val > max ? max : val);
  };

  /**
   * Given `x`, return a function that always returns `x`.
   *
   * {@link https://github.com/d3/d3/blob/master/CHANGES.md#internals `d3.functor` was removed in d3 version 4}.
   * This function helps to implement the replacement,
   * `typeof x === "function" ? x : utils.constant(x)`
   * @method constant
   * @memberof utils
   * @param {any} x
   * @returns {Function}
   */
  utils.constant = function (x) {
      return function () {
          return x;
      };
  };

  /**
   * Using a simple static counter, provide a unique integer id.
   * @method uniqueId
   * @memberof utils
   * @returns {Number}
   */
  let _idCounter = 0;
  utils.uniqueId = function () {
      return ++_idCounter;
  };

  /**
   * Convert a name to an ID.
   * @method nameToId
   * @memberof utils
   * @param {String} name
   * @returns {String}
   */
  utils.nameToId = function (name) {
      return name.toLowerCase().replace(/[\s]/g, '_').replace(/[\.']/g, '');
  };

  /**
   * Append or select an item on a parent element.
   * @method appendOrSelect
   * @memberof utils
   * @param {d3.selection} parent
   * @param {String} selector
   * @param {String} tag
   * @returns {d3.selection}
   */
  utils.appendOrSelect = function (parent, selector, tag) {
      tag = tag || selector;
      let element = parent.select(selector);
      if (element.empty()) {
          element = parent.append(tag);
      }
      return element;
  };

  /**
   * Return the number if the value is a number; else 0.
   * @method safeNumber
   * @memberof utils
   * @param {Number|any} n
   * @returns {Number}
   */
  utils.safeNumber = function (n) { return utils.isNumber(+n) ? +n : 0;};

  /**
   * Return true if both arrays are equal, if both array are null these are considered equal
   * @method arraysEqual
   * @memberof utils
   * @param {Array|null} a1
   * @param {Array|null} a2
   * @returns {Boolean}
   */
  utils.arraysEqual = function (a1, a2) {
      if (!a1 && !a2) {
          return true;
      }

      if (!a1 || !a2) {
          return false;
      }

      return a1.length === a2.length &&
          // If elements are not integers/strings, we hope that it will match because of toString
          // Test cases cover dates as well.
          a1.every(function (elem, i) {
              return elem.valueOf() === a2[i].valueOf();
          });
  };

  // ******** Sunburst Chart ********
  utils.allChildren = function (node) {
      let paths = [];
      paths.push(node.path);
      console.log('currentNode', node);
      if (node.children) {
          for (let i = 0; i < node.children.length; i++) {
              paths = paths.concat(utils.allChildren(node.children[i]));
          }
      }
      return paths;
  };

  // builds a d3 Hierarchy from a collection
  // TODO: turn this monster method something better.
  utils.toHierarchy = function (list, accessor) {
      const root = {'key': 'root', 'children': []};
      for (let i = 0; i < list.length; i++) {
          const data = list[i];
          const parts = data.key;
          const value = accessor(data);
          let currentNode = root;
          for (let j = 0; j < parts.length; j++) {
              const currentPath = parts.slice(0, j + 1);
              const children = currentNode.children;
              const nodeName = parts[j];
              let childNode;
              if (j + 1 < parts.length) {
                  // Not yet at the end of the sequence; move down the tree.
                  childNode = findChild(children, nodeName);

                  // If we don't already have a child node for this branch, create it.
                  if (childNode === void 0) {
                      childNode = {'key': nodeName, 'children': [], 'path': currentPath};
                      children.push(childNode);
                  }
                  currentNode = childNode;
              } else {
                  // Reached the end of the sequence; create a leaf node.
                  childNode = {'key': nodeName, 'value': value, 'data': data, 'path': currentPath};
                  children.push(childNode);
              }
          }
      }
      return root;
  };

  function findChild (children, nodeName) {
      for (let k = 0; k < children.length; k++) {
          if (children[k].key === nodeName) {
              return children[k];
          }
      }
  }

  utils.getAncestors = function (node) {
      const path = [];
      let current = node;
      while (current.parent) {
          path.unshift(current.name);
          current = current.parent;
      }
      return path;
  };

  utils.arraysIdentical = function (a, b) {
      let i = a.length;
      if (i !== b.length) {
          return false;
      }
      while (i--) {
          if (a[i] !== b[i]) {
              return false;
          }
      }
      return true;
  };

  const events = {
      current: null
  };

  /**
   * This function triggers a throttled event function with a specified delay (in milli-seconds).  Events
   * that are triggered repetitively due to user interaction such brush dragging might flood the library
   * and invoke more renders than can be executed in time. Using this function to wrap your event
   * function allows the library to smooth out the rendering by throttling events and only responding to
   * the most recent event.
   * @name events.trigger
   * @example
   * chart.on('renderlet', function(chart) {
   *     // smooth the rendering through event throttling
   *     events.trigger(function(){
   *         // focus some other chart to the range selected by user on this chart
   *         someOtherChart.focus(chart.filter());
   *     });
   * })
   * @param {Function} closure
   * @param {Number} [delay]
   * @return {undefined}
   */
  events.trigger = function (closure, delay) {
      if (!delay) {
          closure();
          return;
      }

      events.current = closure;

      setTimeout(function () {
          if (closure === events.current) {
              closure();
          }
      }, delay);
  };

  /**
   * The dc.js filters are functions which are passed into crossfilter to chose which records will be
   * accumulated to produce values for the charts.  In the crossfilter model, any filters applied on one
   * dimension will affect all the other dimensions but not that one.  dc always applies a filter
   * function to the dimension; the function combines multiple filters and if any of them accept a
   * record, it is filtered in.
   *
   * These filter constructors are used as appropriate by the various charts to implement brushing.  We
   * mention below which chart uses which filter.  In some cases, many instances of a filter will be added.
   *
   * Each of the dc.js filters is an object with the following properties:
   * * `isFiltered` - a function that returns true if a value is within the filter
   * * `filterType` - a string identifying the filter, here the name of the constructor
   *
   * Currently these filter objects are also arrays, but this is not a requirement. Custom filters
   * can be used as long as they have the properties above.
   * @namespace filters
   * @type {{}}
   */
  const filters = {};

  /**
   * RangedFilter is a filter which accepts keys between `low` and `high`.  It is used to implement X
   * axis brushing for the {@link CoordinateGridMixin coordinate grid charts}.
   *
   * Its `filterType` is 'RangedFilter'
   * @name RangedFilter
   * @memberof filters
   * @param {Number} low
   * @param {Number} high
   * @returns {Array<Number>}
   * @constructor
   */
  filters.RangedFilter = function (low, high) {
      const range = new Array(low, high);
      range.isFiltered = function (value) {
          return value >= this[0] && value < this[1];
      };
      range.filterType = 'RangedFilter';

      return range;
  };

  /**
   * TwoDimensionalFilter is a filter which accepts a single two-dimensional value.  It is used by the
   * {@link HeatMap heat map chart} to include particular cells as they are clicked.  (Rows and columns are
   * filtered by filtering all the cells in the row or column.)
   *
   * Its `filterType` is 'TwoDimensionalFilter'
   * @name TwoDimensionalFilter
   * @memberof filters
   * @param {Array<Number>} filter
   * @returns {Array<Number>}
   * @constructor
   */
  filters.TwoDimensionalFilter = function (filter) {
      if (filter === null) { return null; }

      const f = filter;
      f.isFiltered = function (value) {
          return value.length && value.length === f.length &&
                 value[0] === f[0] && value[1] === f[1];
      };
      f.filterType = 'TwoDimensionalFilter';

      return f;
  };

  /**
   * The RangedTwoDimensionalFilter allows filtering all values which fit within a rectangular
   * region. It is used by the {@link ScatterPlot scatter plot} to implement rectangular brushing.
   *
   * It takes two two-dimensional points in the form `[[x1,y1],[x2,y2]]`, and normalizes them so that
   * `x1 <= x2` and `y1 <= y2`. It then returns a filter which accepts any points which are in the
   * rectangular range including the lower values but excluding the higher values.
   *
   * If an array of two values are given to the RangedTwoDimensionalFilter, it interprets the values as
   * two x coordinates `x1` and `x2` and returns a filter which accepts any points for which `x1 <= x <
   * x2`.
   *
   * Its `filterType` is 'RangedTwoDimensionalFilter'
   * @name RangedTwoDimensionalFilter
   * @memberof filters
   * @param {Array<Array<Number>>} filter
   * @returns {Array<Array<Number>>}
   * @constructor
   */
  filters.RangedTwoDimensionalFilter = function (filter) {
      if (filter === null) { return null; }

      const f = filter;
      let fromBottomLeft;

      if (f[0] instanceof Array) {
          fromBottomLeft = [
              [Math.min(filter[0][0], filter[1][0]), Math.min(filter[0][1], filter[1][1])],
              [Math.max(filter[0][0], filter[1][0]), Math.max(filter[0][1], filter[1][1])]
          ];
      } else {
          fromBottomLeft = [[filter[0], -Infinity], [filter[1], Infinity]];
      }

      f.isFiltered = function (value) {
          let x, y;

          if (value instanceof Array) {
              x = value[0];
              y = value[1];
          } else {
              x = value;
              y = fromBottomLeft[0][1];
          }

          return x >= fromBottomLeft[0][0] && x < fromBottomLeft[1][0] &&
                 y >= fromBottomLeft[0][1] && y < fromBottomLeft[1][1];
      };
      f.filterType = 'RangedTwoDimensionalFilter';

      return f;
  };

  // ******** Sunburst Chart ********

  /**
   * HierarchyFilter is a filter which accepts a key path as an array. It matches any node at, or
   * child of, the given path. It is used by the {@link SunburstChart sunburst chart} to include particular cells and all
   * their children as they are clicked.
   *
   * @name HierarchyFilter
   * @memberof filters
   * @param {String} path
   * @returns {Array<String>}
   * @constructor
   */
  filters.HierarchyFilter = function (path) {
      if (path === null) {
          return null;
      }

      const filter = path.slice(0);
      filter.isFiltered = function (value) {
          if (!(filter.length && value && value.length && value.length >= filter.length)) {
              return false;
          }

          for (let i = 0; i < filter.length; i++) {
              if (value[i] !== filter[i]) {
                  return false;
              }
          }

          return true;
      };
      return filter;
  };

  /**
   * @namespace printers
   * @type {{}}
   */
  const printers = {};

  /**
   * Converts a list of filters into a readable string.
   * @method filters
   * @memberof printers
   * @param {Array<filters>} filters
   * @returns {String}
   */
  printers.filters = function (filters) {
      let s = '';

      for (let i = 0; i < filters.length; ++i) {
          if (i > 0) {
              s += ', ';
          }
          s += printers.filter(filters[i]);
      }

      return s;
  };

  /**
   * Converts a filter into a readable string.
   * @method filter
   * @memberof printers
   * @param {filters|any|Array<any>} filter
   * @returns {String}
   */
  printers.filter = function (filter) {
      let s = '';

      if (typeof filter !== 'undefined' && filter !== null) {
          if (filter instanceof Array) {
              if (filter.length >= 2) {
                  s = '[' + filter.map(function (e) {
                      return utils.printSingleValue(e);
                  }).join(' -> ') + ']';
              } else if (filter.length >= 1) {
                  s = utils.printSingleValue(filter[0]);
              }
          } else {
              s = utils.printSingleValue(filter);
          }
      }

      return s;
  };

  /**
   * @namespace units
   * @type {{}}
   */
  const units = {};

  /**
   * The default value for {@link CoordinateGridMixin#xUnits .xUnits} for the
   * {@link CoordinateGridMixin Coordinate Grid Chart} and should
   * be used when the x values are a sequence of integers.
   * It is a function that counts the number of integers in the range supplied in its start and end parameters.
   * @method integers
   * @memberof units
   * @see {@link CoordinateGridMixin#xUnits coordinateGridMixin.xUnits}
   * @example
   * chart.xUnits(units.integers) // already the default
   * @param {Number} start
   * @param {Number} end
   * @returns {Number}
   */
  units.integers = function (start, end) {
      return Math.abs(end - start);
  };

  /**
   * This argument can be passed to the {@link CoordinateGridMixin#xUnits .xUnits} function of a
   * coordinate grid chart to specify ordinal units for the x axis. Usually this parameter is used in
   * combination with passing
   * {@link https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales d3.scaleOrdinal}
   * to {@link CoordinateGridMixin#x .x}.
   *
   * As of dc.js 3.0, this is purely a placeholder or magic value which causes the chart to go into ordinal mode; the
   * function is not called.
   * @method ordinal
   * @memberof units
   * @return {uncallable}
   * @see {@link https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales d3.scaleOrdinal}
   * @see {@link CoordinateGridMixin#xUnits coordinateGridMixin.xUnits}
   * @see {@link CoordinateGridMixin#x coordinateGridMixin.x}
   * @example
   * chart.xUnits(units.ordinal)
   *      .x(d3.scaleOrdinal())
   */
  units.ordinal = function () {
      throw new Error('dc.units.ordinal should not be called - it is a placeholder');
  };

  /**
   * @namespace fp
   * @memberof units
   * @type {{}}
   */
  units.fp = {};
  /**
   * This function generates an argument for the {@link CoordinateGridMixin Coordinate Grid Chart}
   * {@link CoordinateGridMixin#xUnits .xUnits} function specifying that the x values are floating-point
   * numbers with the given precision.
   * The returned function determines how many values at the given precision will fit into the range
   * supplied in its start and end parameters.
   * @method precision
   * @memberof units.fp
   * @see {@link CoordinateGridMixin#xUnits coordinateGridMixin.xUnits}
   * @example
   * // specify values (and ticks) every 0.1 units
   * chart.xUnits(units.fp.precision(0.1)
   * // there are 500 units between 0.5 and 1 if the precision is 0.001
   * var thousandths = units.fp.precision(0.001);
   * thousandths(0.5, 1.0) // returns 500
   * @param {Number} precision
   * @returns {Function} start-end unit function
   */
  units.fp.precision = function (precision) {
      const _f = function (s, e) {
          const d = Math.abs((e - s) / _f.resolution);
          if (utils.isNegligible(d - Math.floor(d))) {
              return Math.floor(d);
          } else {
              return Math.ceil(d);
          }
      };
      _f.resolution = precision;
      return _f;
  };

  const _defaultFilterHandler = (dimension, filters) => {
      if (filters.length === 0) {
          dimension.filter(null);
      } else if (filters.length === 1 && !filters[0].isFiltered) {
          // single value and not a function-based filter
          dimension.filterExact(filters[0]);
      } else if (filters.length === 1 && filters[0].filterType === 'RangedFilter') {
          // single range-based filter
          dimension.filterRange(filters[0]);
      } else {
          dimension.filterFunction(d => {
              for (let i = 0; i < filters.length; i++) {
                  const filter = filters[i];
                  if (filter.isFiltered && filter.isFiltered(d)) {
                      return true;
                  } else if (filter <= d && filter >= d) {
                      return true;
                  }
              }
              return false;
          });
      }
      return filters;
  };

  const _defaultHasFilterHandler = (filters, filter) => {
      if (filter === null || typeof (filter) === 'undefined') {
          return filters.length > 0;
      }
      return filters.some(f => filter <= f && filter >= f);
  };

  const _defaultRemoveFilterHandler = (filters, filter) => {
      for (let i = 0; i < filters.length; i++) {
          if (filters[i] <= filter && filters[i] >= filter) {
              filters.splice(i, 1);
              break;
          }
      }
      return filters;
  };

  const _defaultAddFilterHandler = (filters, filter) => {
      filters.push(filter);
      return filters;
  };

  const _defaultResetFilterHandler = filters => [];

  /**
   * `BaseMixin` is an abstract functional object representing a basic `dc` chart object
   * for all chart and widget implementations. Methods from the {@link #BaseMixin BaseMixin} are inherited
   * and available on all chart implementations in the `dc` library.
   * @mixin BaseMixin
   */
  class BaseMixin {
      constructor () {
          this.__dcFlag__ = utils.uniqueId();

          this._dimension = undefined;
          this._group = undefined;

          this._anchor = undefined;
          this._root = undefined;
          this._svg = undefined;
          this._isChild = undefined;

          this._minWidth = 200;
          this._widthCalc = this._defaultWidthCalc;

          this._minHeight = 200;
          this._heightCalc = this._defaultHeightCalc;
          this._width = undefined;
          this._height = undefined;
          this._useViewBoxResizing = false;

          this._keyAccessor = pluck('key');
          this._valueAccessor = pluck('value');
          this._label = pluck('key');

          this._ordering = pluck('key');

          this._renderLabel = false;

          this._title = d => this.keyAccessor()(d) + ': ' + this.valueAccessor()(d);
          this._renderTitle = true;
          this._controlsUseVisibility = false;

          this._transitionDuration = 750;

          this._transitionDelay = 0;

          this._filterPrinter = printers.filters;

          this._mandatoryAttributesList = ['dimension', 'group'];

          this._chartGroup = constants.DEFAULT_CHART_GROUP;

          this._listeners = dispatch(
              'preRender',
              'postRender',
              'preRedraw',
              'postRedraw',
              'filtered',
              'zoomed',
              'renderlet',
              'pretransition');

          this._legend = undefined;
          this._commitHandler = undefined;

          this._data = this._defaultData;

          this._filters = [];

          this._filterHandler = _defaultFilterHandler;
          this._hasFilterHandler = _defaultHasFilterHandler;
          this._removeFilterHandler = _defaultRemoveFilterHandler;
          this._addFilterHandler = _defaultAddFilterHandler;
          this._resetFilterHandler = _defaultResetFilterHandler;
      }

      /**
       * Set or get the height attribute of a chart. The height is applied to the SVGElement generated by
       * the chart when rendered (or re-rendered). If a value is given, then it will be used to calculate
       * the new height and the chart returned for method chaining.  The value can either be a numeric, a
       * function, or falsy. If no value is specified then the value of the current height attribute will
       * be returned.
       *
       * By default, without an explicit height being given, the chart will select the width of its
       * anchor element. If that isn't possible it defaults to 200 (provided by the
       * {@link BaseMixin#minHeight minHeight} property). Setting the value falsy will return
       * the chart to the default behavior.
       * @see {@link BaseMixin#minHeight minHeight}
       * @example
       * // Default height
       * chart.height(function (element) {
       *     var height = element && element.getBoundingClientRect && element.getBoundingClientRect().height;
       *     return (height && height > chart.minHeight()) ? height : chart.minHeight();
       * });
       *
       * chart.height(250); // Set the chart's height to 250px;
       * chart.height(function(anchor) { return doSomethingWith(anchor); }); // set the chart's height with a function
       * chart.height(null); // reset the height to the default auto calculation
       * @param {Number|Function} [height]
       * @returns {Number|BaseMixin}
       */
      height (height) {
          if (!arguments.length) {
              if (!utils.isNumber(this._height)) {
                  // only calculate once
                  this._height = this._heightCalc(this._root.node());
              }
              return this._height;
          }
          this._heightCalc = height ? (typeof height === 'function' ? height : utils.constant(height)) : this._defaultHeightCalc;
          this._height = undefined;
          return this;
      }

      /**
       * Set or get the width attribute of a chart.
       * @see {@link BaseMixin#height height}
       * @see {@link BaseMixin#minWidth minWidth}
       * @example
       * // Default width
       * chart.width(function (element) {
       *     var width = element && element.getBoundingClientRect && element.getBoundingClientRect().width;
       *     return (width && width > chart.minWidth()) ? width : chart.minWidth();
       * });
       * @param {Number|Function} [width]
       * @returns {Number|BaseMixin}
       */
      width (width) {
          if (!arguments.length) {
              if (!utils.isNumber(this._width)) {
                  // only calculate once
                  this._width = this._widthCalc(this._root.node());
              }
              return this._width;
          }
          this._widthCalc = width ? (typeof width === 'function' ? width : utils.constant(width)) : this._defaultWidthCalc;
          this._width = undefined;
          return this;
      }

      /**
       * Set or get the minimum width attribute of a chart. This only has effect when used with the default
       * {@link BaseMixin#width width} function.
       * @see {@link BaseMixin#width width}
       * @param {Number} [minWidth=200]
       * @returns {Number|BaseMixin}
       */
      minWidth (minWidth) {
          if (!arguments.length) {
              return this._minWidth;
          }
          this._minWidth = minWidth;
          return this;
      }

      /**
       * Set or get the minimum height attribute of a chart. This only has effect when used with the default
       * {@link BaseMixin#height height} function.
       * @see {@link BaseMixin#height height}
       * @param {Number} [minHeight=200]
       * @returns {Number|BaseMixin}
       */
      minHeight (minHeight) {
          if (!arguments.length) {
              return this._minHeight;
          }
          this._minHeight = minHeight;
          return this;
      }

      /**
       * Turn on/off using the SVG
       * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox `viewBox` attribute}.
       * When enabled, `viewBox` will be set on the svg root element instead of `width` and `height`.
       * Requires that the chart aspect ratio be defined using chart.width(w) and chart.height(h).
       *
       * This will maintain the aspect ratio while enabling the chart to resize responsively to the
       * space given to the chart using CSS. For example, the chart can use `width: 100%; height:
       * 100%` or absolute positioning to resize to its parent div.
       *
       * Since the text will be sized as if the chart is drawn according to the width and height, and
       * will be resized if the chart is any other size, you need to set the chart width and height so
       * that the text looks good. In practice, 600x400 seems to work pretty well for most charts.
       *
       * You can see examples of this resizing strategy in the [Chart Resizing
       * Examples](http://dc-js.github.io/dc.js/resizing/); just add `?resize=viewbox` to any of the
       * one-chart examples to enable `useViewBoxResizing`.
       * @param {Boolean} [useViewBoxResizing=false]
       * @returns {Boolean|BaseMixin}
       */
      useViewBoxResizing (useViewBoxResizing) {
          if (!arguments.length) {
              return this._useViewBoxResizing;
          }
          this._useViewBoxResizing = useViewBoxResizing;
          return this;
      }

      /**
       * **mandatory**
       *
       * Set or get the dimension attribute of a chart. In `dc`, a dimension can be any valid
       * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension crossfilter dimension}
       *
       * If a value is given, then it will be used as the new dimension. If no value is specified then
       * the current dimension will be returned.
       * @see {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension crossfilter.dimension}
       * @example
       * var index = crossfilter([]);
       * var dimension = index.dimension(pluck('key'));
       * chart.dimension(dimension);
       * @param {crossfilter.dimension} [dimension]
       * @returns {crossfilter.dimension|BaseMixin}
       */
      dimension (dimension) {
          if (!arguments.length) {
              return this._dimension;
          }
          this._dimension = dimension;
          this.expireCache();
          return this;
      }

      /**
       * Set the data callback or retrieve the chart's data set. The data callback is passed the chart's
       * group and by default will return
       * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group_all group.all}.
       * This behavior may be modified to, for instance, return only the top 5 groups.
       * @example
       * // Default data function
       * chart.data(function (group) { return group.all(); });
       *
       * chart.data(function (group) { return group.top(5); });
       * @param {Function} [callback]
       * @returns {*|BaseMixin}
       */
      data (callback) {
          if (!arguments.length) {
              return this._data(this._group);
          }
          this._data = typeof callback === 'function' ? callback : utils.constant(callback);
          this.expireCache();
          return this;
      }

      /**
       * **mandatory**
       *
       * Set or get the group attribute of a chart. In `dc` a group is a
       * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group-map-reduce crossfilter group}.
       * Usually the group should be created from the particular dimension associated with the same chart. If a value is
       * given, then it will be used as the new group.
       *
       * If no value specified then the current group will be returned.
       * If `name` is specified then it will be used to generate legend label.
       * @see {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group-map-reduce crossfilter.group}
       * @example
       * var index = crossfilter([]);
       * var dimension = index.dimension(pluck('key'));
       * chart.dimension(dimension);
       * chart.group(dimension.group().reduceSum());
       * @param {crossfilter.group} [group]
       * @param {String} [name]
       * @returns {crossfilter.group|BaseMixin}
       */
      group (group, name) {
          if (!arguments.length) {
              return this._group;
          }
          this._group = group;
          this._groupName = name;
          this.expireCache();
          return this;
      }

      /**
       * Get or set an accessor to order ordinal dimensions.  The chart uses
       * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort Array.sort}
       * to sort elements; this accessor returns the value to order on.
       * @example
       * // Default ordering accessor
       * _chart.ordering(pluck('key'));
       * @param {Function} [orderFunction]
       * @returns {Function|BaseMixin}
       */
      ordering (orderFunction) {
          if (!arguments.length) {
              return this._ordering;
          }
          this._ordering = orderFunction;
          this.expireCache();
          return this;
      }

      _computeOrderedGroups (data) {
          // clone the array before sorting, otherwise Array.sort sorts in-place
          return Array.from(data).sort((a, b) => this._ordering(a) - this._ordering(b));
      }

      /**
       * Clear all filters associated with this chart. The same effect can be achieved by calling
       * {@link BaseMixin#filter chart.filter(null)}.
       * @returns {BaseMixin}
       */
      filterAll () {
          return this.filter(null);
      }

      /**
       * Execute d3 single selection in the chart's scope using the given selector and return the d3
       * selection.
       *
       * This function is **not chainable** since it does not return a chart instance; however the d3
       * selection result can be chained to d3 function calls.
       * @see {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3.select}
       * @example
       * // Has the same effect as d3.select('#chart-id').select(selector)
       * chart.select(selector)
       * @param {String} sel CSS selector string
       * @returns {d3.selection}
       */
      select (sel) {
          return this._root.select(sel);
      }

      /**
       * Execute in scope d3 selectAll using the given selector and return d3 selection result.
       *
       * This function is **not chainable** since it does not return a chart instance; however the d3
       * selection result can be chained to d3 function calls.
       * @see {@link https://github.com/d3/d3-selection/blob/master/README.md#selectAll d3.selectAll}
       * @example
       * // Has the same effect as d3.select('#chart-id').selectAll(selector)
       * chart.selectAll(selector)
       * @param {String} sel CSS selector string
       * @returns {d3.selection}
       */
      selectAll (sel) {
          return this._root ? this._root.selectAll(sel) : null;
      }

      /**
       * Set the root SVGElement to either be an existing chart's root; or any valid [d3 single
       * selector](https://github.com/d3/d3-selection/blob/master/README.md#selecting-elements) specifying a dom
       * block element such as a div; or a dom element or d3 selection. Optionally registers the chart
       * within the chartGroup. This class is called internally on chart initialization, but be called
       * again to relocate the chart. However, it will orphan any previously created SVGElements.
       * @param {anchorChart|anchorSelector|anchorNode} [parent]
       * @param {String} [chartGroup]
       * @returns {String|node|d3.selection|BaseMixin}
       */
      anchor (parent, chartGroup) {
          if (!arguments.length) {
              return this._anchor;
          }
          if (instanceOfChart(parent)) {
              this._anchor = parent.anchor();
              if (this._anchor.children) { // is _anchor a div?
                  this._anchor = '#' + parent.anchorName();
              }
              this._root = parent.root();
              this._isChild = true;
          } else if (parent) {
              if (parent.select && parent.classed) { // detect d3 selection
                  this._anchor = parent.node();
              } else {
                  this._anchor = parent;
              }
              this._root = select(this._anchor);
              this._root.classed(constants.CHART_CLASS, true);
              registerChart(this, chartGroup);
              this._isChild = false;
          } else {
              throw new BadArgumentException('parent must be defined');
          }
          this._chartGroup = chartGroup;
          return this;
      }

      /**
       * Returns the DOM id for the chart's anchored location.
       * @returns {String}
       */
      anchorName () {
          const a = this.anchor();
          if (a && a.id) {
              return a.id;
          }
          if (a && a.replace) {
              return a.replace('#', '');
          }
          return 'dc-chart' + this.chartID();
      }

      /**
       * Returns the root element where a chart resides. Usually it will be the parent div element where
       * the SVGElement was created. You can also pass in a new root element however this is usually handled by
       * dc internally. Resetting the root element on a chart outside of dc internals may have
       * unexpected consequences.
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement HTMLElement}
       * @param {HTMLElement} [rootElement]
       * @returns {HTMLElement|BaseMixin}
       */
      root (rootElement) {
          if (!arguments.length) {
              return this._root;
          }
          this._root = rootElement;
          return this;
      }

      /**
       * Returns the top SVGElement for this specific chart. You can also pass in a new SVGElement,
       * however this is usually handled by dc internally. Resetting the SVGElement on a chart outside
       * of dc internals may have unexpected consequences.
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SVGElement SVGElement}
       * @param {SVGElement|d3.selection} [svgElement]
       * @returns {SVGElement|d3.selection|BaseMixin}
       */
      svg (svgElement) {
          if (!arguments.length) {
              return this._svg;
          }
          this._svg = svgElement;
          return this;
      }

      /**
       * Remove the chart's SVGElements from the dom and recreate the container SVGElement.
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SVGElement SVGElement}
       * @returns {SVGElement}
       */
      resetSvg () {
          this.select('svg').remove();
          return this.generateSvg();
      }

      sizeSvg () {
          if (this._svg) {
              if (!this._useViewBoxResizing) {
                  this._svg
                      .attr('width', this.width())
                      .attr('height', this.height());
              } else if (!this._svg.attr('viewBox')) {
                  this._svg
                      .attr('viewBox', '0 0 ' + this.width() + ' ' + this.height());
              }
          }
      }

      generateSvg () {
          this._svg = this.root().append('svg');
          this.sizeSvg();
          return this._svg;
      }

      /**
       * Set or get the filter printer function. The filter printer function is used to generate human
       * friendly text for filter value(s) associated with the chart instance. The text will get shown
       * in the `.filter element; see {@link BaseMixin#turnOnControls turnOnControls}.
       *
       * By default dc charts use a default filter printer {@link printers.filters printers.filters}
       * that provides simple printing support for both single value and ranged filters.
       * @example
       * // for a chart with an ordinal brush, print the filters in upper case
       * chart.filterPrinter(function(filters) {
       *   return filters.map(function(f) { return f.toUpperCase(); }).join(', ');
       * });
       * // for a chart with a range brush, print the filter as start and extent
       * chart.filterPrinter(function(filters) {
       *   return 'start ' + utils.printSingleValue(filters[0][0]) +
       *     ' extent ' + utils.printSingleValue(filters[0][1] - filters[0][0]);
       * });
       * @param {Function} [filterPrinterFunction=printers.filters]
       * @returns {Function|BaseMixin}
       */
      filterPrinter (filterPrinterFunction) {
          if (!arguments.length) {
              return this._filterPrinter;
          }
          this._filterPrinter = filterPrinterFunction;
          return this;
      }

      /**
       * If set, use the `visibility` attribute instead of the `display` attribute for showing/hiding
       * chart reset and filter controls, for less disruption to the layout.
       * @param {Boolean} [controlsUseVisibility=false]
       * @returns {Boolean|BaseMixin}
       */
      controlsUseVisibility (controlsUseVisibility) {
          if (!arguments.length) {
              return this._controlsUseVisibility;
          }
          this._controlsUseVisibility = controlsUseVisibility;
          return this;
      }

      /**
       * Turn on optional control elements within the root element. dc currently supports the
       * following html control elements.
       * * root.selectAll('.reset') - elements are turned on if the chart has an active filter. This type
       * of control element is usually used to store a reset link to allow user to reset filter on a
       * certain chart. This element will be turned off automatically if the filter is cleared.
       * * root.selectAll('.filter') elements are turned on if the chart has an active filter. The text
       * content of this element is then replaced with the current filter value using the filter printer
       * function. This type of element will be turned off automatically if the filter is cleared.
       * @returns {BaseMixin}
       */
      turnOnControls () {
          if (this._root) {
              const attribute = this.controlsUseVisibility() ? 'visibility' : 'display';
              this.selectAll('.reset').style(attribute, null);
              this.selectAll('.filter').text(this._filterPrinter(this.filters())).style(attribute, null);
          }
          return this;
      }

      /**
       * Turn off optional control elements within the root element.
       * @see {@link BaseMixin#turnOnControls turnOnControls}
       * @returns {BaseMixin}
       */
      turnOffControls () {
          if (this._root) {
              const attribute = this.controlsUseVisibility() ? 'visibility' : 'display';
              const value = this.controlsUseVisibility() ? 'hidden' : 'none';
              this.selectAll('.reset').style(attribute, value);
              this.selectAll('.filter').style(attribute, value).text(this.filter());
          }
          return this;
      }

      /**
       * Set or get the animation transition duration (in milliseconds) for this chart instance.
       * @param {Number} [duration=750]
       * @returns {Number|BaseMixin}
       */
      transitionDuration (duration) {
          if (!arguments.length) {
              return this._transitionDuration;
          }
          this._transitionDuration = duration;
          return this;
      }

      /**
       * Set or get the animation transition delay (in milliseconds) for this chart instance.
       * @param {Number} [delay=0]
       * @returns {Number|BaseMixin}
       */
      transitionDelay (delay) {
          if (!arguments.length) {
              return this._transitionDelay;
          }
          this._transitionDelay = delay;
          return this;
      }

      _mandatoryAttributes (_) {
          if (!arguments.length) {
              return this._mandatoryAttributesList;
          }
          this._mandatoryAttributesList = _;
          return this;
      }

      checkForMandatoryAttributes (a) {
          if (!this[a] || !this[a]()) {
              throw new InvalidStateException('Mandatory attribute chart.' + a +
                  ' is missing on chart[#' + this.anchorName() + ']');
          }
      }

      /**
       * Invoking this method will force the chart to re-render everything from scratch. Generally it
       * should only be used to render the chart for the first time on the page or if you want to make
       * sure everything is redrawn from scratch instead of relying on the default incremental redrawing
       * behaviour.
       * @returns {BaseMixin}
       */
      render () {
          this._height = this._width = undefined; // force recalculate
          this._listeners.call('preRender', this, this);

          if (this._mandatoryAttributesList) {
              this._mandatoryAttributesList.forEach((e) => this.checkForMandatoryAttributes(e));
          }

          const result = this._doRender();

          if (this._legend) {
              this._legend.render();
          }

          this._activateRenderlets('postRender');

          return result;
      }

      _activateRenderlets (event) {
          this._listeners.call('pretransition', this, this);
          if (this.transitionDuration() > 0 && this._svg) {
              this._svg.transition().duration(this.transitionDuration()).delay(this.transitionDelay())
                  .on('end', () => {
                      this._listeners.call('renderlet', this, this);
                      if (event) {
                          this._listeners.call(event, this, this);
                      }
                  });
          } else {
              this._listeners.call('renderlet', this, this);
              if (event) {
                  this._listeners.call(event, this, this);
              }
          }
      }

      /**
       * Calling redraw will cause the chart to re-render data changes incrementally. If there is no
       * change in the underlying data dimension then calling this method will have no effect on the
       * chart. Most chart interaction in dc will automatically trigger this method through internal
       * events (in particular {@link redrawAll redrawAll}); therefore, you only need to
       * manually invoke this function if data is manipulated outside of dc's control (for example if
       * data is loaded in the background using
       * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#crossfilter_add crossfilter.add}).
       * @returns {BaseMixin}
       */
      redraw () {
          this.sizeSvg();
          this._listeners.call('preRedraw', this, this);

          const result = this._doRedraw();

          if (this._legend) {
              this._legend.render();
          }

          this._activateRenderlets('postRedraw');

          return result;
      }

      /**
       * Gets/sets the commit handler. If the chart has a commit handler, the handler will be called when
       * the chart's filters have changed, in order to send the filter data asynchronously to a server.
       *
       * Unlike other functions in dc.js, the commit handler is asynchronous. It takes two arguments:
       * a flag indicating whether this is a render (true) or a redraw (false), and a callback to be
       * triggered once the commit is done. The callback has the standard node.js continuation signature
       * with error first and result second.
       * @param {Function} commitHandler
       * @returns {BaseMixin}
       */
      commitHandler (commitHandler) {
          if (!arguments.length) {
              return this._commitHandler;
          }
          this._commitHandler = commitHandler;
          return this;
      }

      /**
       * Redraws all charts in the same group as this chart, typically in reaction to a filter
       * change. If the chart has a {@link BaseMixin.commitFilter commitHandler}, it will
       * be executed and waited for.
       * @returns {BaseMixin}
       */
      redrawGroup () {
          if (this._commitHandler) {
              this._commitHandler(false, (error, result) => {
                  if (error) {
                      console.log(error);
                  } else {
                      redrawAll(this.chartGroup());
                  }
              });
          } else {
              redrawAll(this.chartGroup());
          }
          return this;
      }

      /**
       * Renders all charts in the same group as this chart. If the chart has a
       * {@link BaseMixin.commitFilter commitHandler}, it will be executed and waited for
       * @returns {BaseMixin}
       */
      renderGroup () {
          if (this._commitHandler) {
              this._commitHandler(false, (error, result) => {
                  if (error) {
                      console.log(error);
                  } else {
                      renderAll(this.chartGroup());
                  }
              });
          } else {
              renderAll(this.chartGroup());
          }
          return this;
      }

      _invokeFilteredListener (f) {
          if (f !== undefined) {
              this._listeners.call('filtered', this, this, f);
          }
      }

      _invokeZoomedListener () {
          this._listeners.call('zoomed', this, this);
      }

      /**
       * Set or get the has-filter handler. The has-filter handler is a function that checks to see if
       * the chart's current filters (first argument) include a specific filter (second argument).  Using a custom has-filter handler allows
       * you to change the way filters are checked for and replaced.
       * @example
       * // default has-filter handler
       * chart.hasFilterHandler(function (filters, filter) {
       *     if (filter === null || typeof(filter) === 'undefined') {
       *         return filters.length > 0;
       *     }
       *     return filters.some(function (f) {
       *         return filter <= f && filter >= f;
       *     });
       * });
       *
       * // custom filter handler (no-op)
       * chart.hasFilterHandler(function(filters, filter) {
       *     return false;
       * });
       * @param {Function} [hasFilterHandler]
       * @returns {Function|BaseMixin}
       */
      hasFilterHandler (hasFilterHandler) {
          if (!arguments.length) {
              return this._hasFilterHandler;
          }
          this._hasFilterHandler = hasFilterHandler;
          return this;
      }

      /**
       * Check whether any active filter or a specific filter is associated with particular chart instance.
       * This function is **not chainable**.
       * @see {@link BaseMixin#hasFilterHandler hasFilterHandler}
       * @param {*} [filter]
       * @returns {Boolean}
       */
      hasFilter (filter) {
          return this._hasFilterHandler(this._filters, filter);
      }

      /**
       * Set or get the remove filter handler. The remove filter handler is a function that removes a
       * filter from the chart's current filters. Using a custom remove filter handler allows you to
       * change how filters are removed or perform additional work when removing a filter, e.g. when
       * using a filter server other than crossfilter.
       *
       * The handler should return a new or modified array as the result.
       * @example
       * // default remove filter handler
       * chart.removeFilterHandler(function (filters, filter) {
       *     for (var i = 0; i < filters.length; i++) {
       *         if (filters[i] <= filter && filters[i] >= filter) {
       *             filters.splice(i, 1);
       *             break;
       *         }
       *     }
       *     return filters;
       * });
       *
       * // custom filter handler (no-op)
       * chart.removeFilterHandler(function(filters, filter) {
       *     return filters;
       * });
       * @param {Function} [removeFilterHandler]
       * @returns {Function|BaseMixin}
       */
      removeFilterHandler (removeFilterHandler) {
          if (!arguments.length) {
              return this._removeFilterHandler;
          }
          this._removeFilterHandler = removeFilterHandler;
          return this;
      }

      /**
       * Set or get the add filter handler. The add filter handler is a function that adds a filter to
       * the chart's filter list. Using a custom add filter handler allows you to change the way filters
       * are added or perform additional work when adding a filter, e.g. when using a filter server other
       * than crossfilter.
       *
       * The handler should return a new or modified array as the result.
       * @example
       * // default add filter handler
       * chart.addFilterHandler(function (filters, filter) {
       *     filters.push(filter);
       *     return filters;
       * });
       *
       * // custom filter handler (no-op)
       * chart.addFilterHandler(function(filters, filter) {
       *     return filters;
       * });
       * @param {Function} [addFilterHandler]
       * @returns {Function|BaseMixin}
       */
      addFilterHandler (addFilterHandler) {
          if (!arguments.length) {
              return this._addFilterHandler;
          }
          this._addFilterHandler = addFilterHandler;
          return this;
      }

      /**
       * Set or get the reset filter handler. The reset filter handler is a function that resets the
       * chart's filter list by returning a new list. Using a custom reset filter handler allows you to
       * change the way filters are reset, or perform additional work when resetting the filters,
       * e.g. when using a filter server other than crossfilter.
       *
       * The handler should return a new or modified array as the result.
       * @example
       * // default remove filter handler
       * function (filters) {
       *     return [];
       * }
       *
       * // custom filter handler (no-op)
       * chart.resetFilterHandler(function(filters) {
       *     return filters;
       * });
       * @param {Function} [resetFilterHandler]
       * @returns {BaseMixin}
       */
      resetFilterHandler (resetFilterHandler) {
          if (!arguments.length) {
              return this._resetFilterHandler;
          }
          this._resetFilterHandler = resetFilterHandler;
          return this;
      }

      applyFilters (filters) {
          if (this.dimension() && this.dimension().filter) {
              const fs = this._filterHandler(this.dimension(), filters);
              if (fs) {
                  filters = fs;
              }
          }
          return filters;
      }

      /**
       * Replace the chart filter. This is equivalent to calling `chart.filter(null).filter(filter)`
       * but more efficient because the filter is only applied once.
       *
       * @param {*} [filter]
       * @returns {BaseMixin}
       */
      replaceFilter (filter) {
          this._filters = this._resetFilterHandler(this._filters);
          this.filter(filter);
          return this;
      }

      /**
       * Filter the chart by the given parameter, or return the current filter if no input parameter
       * is given.
       *
       * The filter parameter can take one of these forms:
       * * A single value: the value will be toggled (added if it is not present in the current
       * filters, removed if it is present)
       * * An array containing a single array of values (`[[value,value,value]]`): each value is
       * toggled
       * * When appropriate for the chart, a {@link filters dc filter object} such as
       *   * {@link filters.RangedFilter `filters.RangedFilter`} for the
       * {@link CoordinateGridMixin CoordinateGridMixin} charts
       *   * {@link filters.TwoDimensionalFilter `filters.TwoDimensionalFilter`} for the
       * {@link HeatMap heat map}
       *   * {@link filters.RangedTwoDimensionalFilter `filters.RangedTwoDimensionalFilter`}
       * for the {@link ScatterPlot scatter plot}
       * * `null`: the filter will be reset using the
       * {@link BaseMixin#resetFilterHandler resetFilterHandler}
       *
       * Note that this is always a toggle (even when it doesn't make sense for the filter type). If
       * you wish to replace the current filter, either call `chart.filter(null)` first - or it's more
       * efficient to call {@link BaseMixin#replaceFilter `chart.replaceFilter(filter)`} instead.
       *
       * Each toggle is executed by checking if the value is already present using the
       * {@link BaseMixin#hasFilterHandler hasFilterHandler}; if it is not present, it is added
       * using the {@link BaseMixin#addFilterHandler addFilterHandler}; if it is already present,
       * it is removed using the {@link BaseMixin#removeFilterHandler removeFilterHandler}.
       *
       * Once the filters array has been updated, the filters are applied to the
       * crossfilter dimension, using the {@link BaseMixin#filterHandler filterHandler}.
       *
       * Once you have set the filters, call {@link BaseMixin#redrawGroup `chart.redrawGroup()`}
       * (or {@link redrawAll `redrawAll()`}) to redraw the chart's group.
       * @see {@link BaseMixin#addFilterHandler addFilterHandler}
       * @see {@link BaseMixin#removeFilterHandler removeFilterHandler}
       * @see {@link BaseMixin#resetFilterHandler resetFilterHandler}
       * @see {@link BaseMixin#filterHandler filterHandler}
       * @example
       * // filter by a single string
       * chart.filter('Sunday');
       * // filter by a single age
       * chart.filter(18);
       * // filter by a set of states
       * chart.filter([['MA', 'TX', 'ND', 'WA']]);
       * // filter by range -- note the use of filters.RangedFilter, which is different
       * // from the syntax for filtering a crossfilter dimension directly, dimension.filter([15,20])
       * chart.filter(filters.RangedFilter(15,20));
       * @param {*} [filter]
       * @returns {BaseMixin}
       */
      filter (filter) {
          if (!arguments.length) {
              return this._filters.length > 0 ? this._filters[0] : null;
          }
          let filters = this._filters;
          if (filter instanceof Array && filter[0] instanceof Array && !filter.isFiltered) {
              // toggle each filter
              filter[0].forEach(f => {
                  if (this._hasFilterHandler(filters, f)) {
                      filters = this._removeFilterHandler(filters, f);
                  } else {
                      filters = this._addFilterHandler(filters, f);
                  }
              });
          } else if (filter === null) {
              filters = this._resetFilterHandler(filters);
          } else {
              if (this._hasFilterHandler(filters, filter)) {
                  filters = this._removeFilterHandler(filters, filter);
              } else {
                  filters = this._addFilterHandler(filters, filter);
              }
          }
          this._filters = this.applyFilters(filters);
          this._invokeFilteredListener(filter);

          if (this._root !== null && this.hasFilter()) {
              this.turnOnControls();
          } else {
              this.turnOffControls();
          }

          return this;
      }

      /**
       * Returns all current filters. This method does not perform defensive cloning of the internal
       * filter array before returning, therefore any modification of the returned array will effect the
       * chart's internal filter storage.
       * @returns {Array<*>}
       */
      filters () {
          return this._filters;
      }

      highlightSelected (e) {
          select(e).classed(constants.SELECTED_CLASS, true);
          select(e).classed(constants.DESELECTED_CLASS, false);
      }

      fadeDeselected (e) {
          select(e).classed(constants.SELECTED_CLASS, false);
          select(e).classed(constants.DESELECTED_CLASS, true);
      }

      resetHighlight (e) {
          select(e).classed(constants.SELECTED_CLASS, false);
          select(e).classed(constants.DESELECTED_CLASS, false);
      }

      /**
       * This function is passed to d3 as the onClick handler for each chart. The default behavior is to
       * filter on the clicked datum (passed to the callback) and redraw the chart group.
       *
       * This function can be replaced in order to change the click behavior (but first look at
       * @example
       * var oldHandler = chart.onClick;
       * chart.onClick = function(datum) {
       *   // use datum.
       * @param {*} datum
       * @return {undefined}
       */
      onClick (datum) {
          const filter = this.keyAccessor()(datum);
          events.trigger(() => {
              this.filter(filter);
              this.redrawGroup();
          });
      }

      /**
       * Set or get the filter handler. The filter handler is a function that performs the filter action
       * on a specific dimension. Using a custom filter handler allows you to perform additional logic
       * before or after filtering.
       * @see {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension_filter crossfilter.dimension.filter}
       * @example
       * // the default filter handler handles all possible cases for the charts in dc.js
       * // you can replace it with something more specialized for your own chart
       * chart.filterHandler(function (dimension, filters) {
       *     if (filters.length === 0) {
       *         // the empty case (no filtering)
       *         dimension.filter(null);
       *     } else if (filters.length === 1 && !filters[0].isFiltered) {
       *         // single value and not a function-based filter
       *         dimension.filterExact(filters[0]);
       *     } else if (filters.length === 1 && filters[0].filterType === 'RangedFilter') {
       *         // single range-based filter
       *         dimension.filterRange(filters[0]);
       *     } else {
       *         // an array of values, or an array of filter objects
       *         dimension.filterFunction(function (d) {
       *             for (var i = 0; i < filters.length; i++) {
       *                 var filter = filters[i];
       *                 if (filter.isFiltered && filter.isFiltered(d)) {
       *                     return true;
       *                 } else if (filter <= d && filter >= d) {
       *                     return true;
       *                 }
       *             }
       *             return false;
       *         });
       *     }
       *     return filters;
       * });
       *
       * // custom filter handler
       * chart.filterHandler(function(dimension, filter){
       *     var newFilter = filter + 10;
       *     dimension.filter(newFilter);
       *     return newFilter; // set the actual filter value to the new value
       * });
       * @param {Function} [filterHandler]
       * @returns {Function|BaseMixin}
       */
      filterHandler (filterHandler) {
          if (!arguments.length) {
              return this._filterHandler;
          }
          this._filterHandler = filterHandler;
          return this;
      }

      // abstract function stub
      _doRender () {
          // do nothing in base, should be overridden by sub-function
          return this;
      }

      _doRedraw () {
          // do nothing in base, should be overridden by sub-function
          return this;
      }

      legendables () {
          // do nothing in base, should be overridden by sub-function
          return [];
      }

      legendHighlight () {
          // do nothing in base, should be overridden by sub-function
      }

      legendReset () {
          // do nothing in base, should be overridden by sub-function
      }

      legendToggle () {
          // do nothing in base, should be overriden by sub-function
      }

      isLegendableHidden () {
          // do nothing in base, should be overridden by sub-function
          return false;
      }

      /**
       * Set or get the key accessor function. The key accessor function is used to retrieve the key
       * value from the crossfilter group. Key values are used differently in different charts, for
       * example keys correspond to slices in a pie chart and x axis positions in a grid coordinate chart.
       * @example
       * // default key accessor
       * chart.keyAccessor(function(d) { return d.key; });
       * // custom key accessor for a multi-value crossfilter reduction
       * chart.keyAccessor(function(p) { return p.value.absGain; });
       * @param {Function} [keyAccessor]
       * @returns {Function|BaseMixin}
       */
      keyAccessor (keyAccessor) {
          if (!arguments.length) {
              return this._keyAccessor;
          }
          this._keyAccessor = keyAccessor;
          return this;
      }

      /**
       * Set or get the value accessor function. The value accessor function is used to retrieve the
       * value from the crossfilter group. Group values are used differently in different charts, for
       * example values correspond to slice sizes in a pie chart and y axis positions in a grid
       * coordinate chart.
       * @example
       * // default value accessor
       * chart.valueAccessor(function(d) { return d.value; });
       * // custom value accessor for a multi-value crossfilter reduction
       * chart.valueAccessor(function(p) { return p.value.percentageGain; });
       * @param {Function} [valueAccessor]
       * @returns {Function|BaseMixin}
       */
      valueAccessor (valueAccessor) {
          if (!arguments.length) {
              return this._valueAccessor;
          }
          this._valueAccessor = valueAccessor;
          return this;
      }

      /**
       * Set or get the label function. The chart class will use this function to render labels for each
       * child element in the chart, e.g. slices in a pie chart or bubbles in a bubble chart. Not every
       * chart supports the label function, for example line chart does not use this function
       * at all. By default, enables labels; pass false for the second parameter if this is not desired.
       * @example
       * // default label function just return the key
       * chart.label(function(d) { return d.key; });
       * // label function has access to the standard d3 data binding and can get quite complicated
       * chart.label(function(d) { return d.data.key + '(' + Math.floor(d.data.value / all.value() * 100) + '%)'; });
       * @param {Function} [labelFunction]
       * @param {Boolean} [enableLabels=true]
       * @returns {Function|BaseMixin}
       */
      label (labelFunction, enableLabels) {
          if (!arguments.length) {
              return this._label;
          }
          this._label = labelFunction;
          if ((enableLabels === undefined) || enableLabels) {
              this._renderLabel = true;
          }
          return this;
      }

      /**
       * Turn on/off label rendering
       * @param {Boolean} [renderLabel=false]
       * @returns {Boolean|BaseMixin}
       */
      renderLabel (renderLabel) {
          if (!arguments.length) {
              return this._renderLabel;
          }
          this._renderLabel = renderLabel;
          return this;
      }

      /**
       * Set or get the title function. The chart class will use this function to render the SVGElement title
       * (usually interpreted by browser as tooltips) for each child element in the chart, e.g. a slice
       * in a pie chart or a bubble in a bubble chart. Almost every chart supports the title function;
       * however in grid coordinate charts you need to turn off the brush in order to see titles, because
       * otherwise the brush layer will block tooltip triggering.
       * @example
       * // default title function shows "key: value"
       * chart.title(function(d) { return d.key + ': ' + d.value; });
       * // title function has access to the standard d3 data binding and can get quite complicated
       * chart.title(function(p) {
       *    return p.key.getFullYear()
       *        + '\n'
       *        + 'Index Gain: ' + numberFormat(p.value.absGain) + '\n'
       *        + 'Index Gain in Percentage: ' + numberFormat(p.value.percentageGain) + '%\n'
       *        + 'Fluctuation / Index Ratio: ' + numberFormat(p.value.fluctuationPercentage) + '%';
       * });
       * @param {Function} [titleFunction]
       * @returns {Function|BaseMixin}
       */
      title (titleFunction) {
          if (!arguments.length) {
              return this._title;
          }
          this._title = titleFunction;
          return this;
      }

      /**
       * Turn on/off title rendering, or return the state of the render title flag if no arguments are
       * given.
       * @param {Boolean} [renderTitle=true]
       * @returns {Boolean|BaseMixin}
       */
      renderTitle (renderTitle) {
          if (!arguments.length) {
              return this._renderTitle;
          }
          this._renderTitle = renderTitle;
          return this;
      }

      /**
       * Get or set the chart group to which this chart belongs. Chart groups are rendered or redrawn
       * together since it is expected they share the same underlying crossfilter data set.
       * @param {String} [chartGroup]
       * @returns {String|BaseMixin}
       */
      chartGroup (chartGroup) {
          if (!arguments.length) {
              return this._chartGroup;
          }
          if (!this._isChild) {
              deregisterChart(this, this._chartGroup);
          }
          this._chartGroup = chartGroup;
          if (!this._isChild) {
              registerChart(this, this._chartGroup);
          }
          return this;
      }

      /**
       * Expire the internal chart cache. dc charts cache some data internally on a per chart basis to
       * speed up rendering and avoid unnecessary calculation; however it might be useful to clear the
       * cache if you have changed state which will affect rendering.  For example, if you invoke
       * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#crossfilter_add crossfilter.add}
       * function or reset group or dimension after rendering, it is a good idea to
       * clear the cache to make sure charts are rendered properly.
       * @returns {BaseMixin}
       */
      expireCache () {
          // do nothing in base, should be overridden by sub-function
          return this;
      }

      /**
       * Attach a Legend widget to this chart. The legend widget will automatically draw legend labels
       * based on the color setting and names associated with each group.
       * @example
       * chart.legend(new Legend().x(400).y(10).itemHeight(13).gap(5))
       * @param {Legend} [legend]
       * @returns {Legend|BaseMixin}
       */
      legend (legend) {
          if (!arguments.length) {
              return this._legend;
          }
          this._legend = legend;
          this._legend.parent(this);
          return this;
      }

      /**
       * Returns the internal numeric ID of the chart.
       * @returns {String}
       */
      chartID () {
          return this.__dcFlag__;
      }

      /**
       * Set chart options using a configuration object. Each key in the object will cause the method of
       * the same name to be called with the value to set that attribute for the chart.
       * @example
       * chart.options({dimension: myDimension, group: myGroup});
       * @param {{}} opts
       * @returns {BaseMixin}
       */
      options (opts) {
          const applyOptions = [
              'anchor',
              'group',
              'xAxisLabel',
              'yAxisLabel',
              'stack',
              'title',
              'point',
              'getColor',
              'overlayGeoJson'
          ];

          for (let o in opts) {
              if (typeof (this[o]) === 'function') {
                  if (opts[o] instanceof Array && applyOptions.indexOf(o) !== -1) {
                      this[o].apply(this, opts[o]);
                  } else {
                      this[o].call(this, opts[o]);
                  }
              } else {
                  logger.debug('Not a valid option setter name: ' + o);
              }
          }
          return this;
      }

      /**
       * All dc chart instance supports the following listeners.
       * Supports the following events:
       * * `renderlet` - This listener function will be invoked after transitions after redraw and render. Replaces the
       * deprecated {@link BaseMixin#renderlet renderlet} method.
       * * `pretransition` - Like `.on('renderlet', ...)` but the event is fired before transitions start.
       * * `preRender` - This listener function will be invoked before chart rendering.
       * * `postRender` - This listener function will be invoked after chart finish rendering including
       * all renderlets' logic.
       * * `preRedraw` - This listener function will be invoked before chart redrawing.
       * * `postRedraw` - This listener function will be invoked after chart finish redrawing
       * including all renderlets' logic.
       * * `filtered` - This listener function will be invoked after a filter is applied, added or removed.
       * * `zoomed` - This listener function will be invoked after a zoom is triggered.
       * @see {@link https://github.com/d3/d3-dispatch/blob/master/README.md#dispatch_on d3.dispatch.on}
       * @example
       * .on('renderlet', function(chart, filter){...})
       * .on('pretransition', function(chart, filter){...})
       * .on('preRender', function(chart){...})
       * .on('postRender', function(chart){...})
       * .on('preRedraw', function(chart){...})
       * .on('postRedraw', function(chart){...})
       * .on('filtered', function(chart, filter){...})
       * .on('zoomed', function(chart, filter){...})
       * @param {String} event
       * @param {Function} listener
       * @returns {BaseMixin}
       */
      on (event, listener) {
          this._listeners.on(event, listener);
          return this;
      }

      /**
       * A renderlet is similar to an event listener on rendering event. Multiple renderlets can be added
       * to an individual chart.  Each time a chart is rerendered or redrawn the renderlets are invoked
       * right after the chart finishes its transitions, giving you a way to modify the SVGElements.
       * Renderlet functions take the chart instance as the only input parameter and you can
       * use the dc API or use raw d3 to achieve pretty much any effect.
       *
       * Use {@link BaseMixin#on on} with a 'renderlet' prefix.
       * Generates a random key for the renderlet, which makes it hard to remove.
       * @deprecated chart.renderlet has been deprecated. Please use chart.on("renderlet.<renderletKey>", renderletFunction)
       * @example
       * // do this instead of .renderlet(function(chart) { ... })
       * chart.on("renderlet", function(chart){
       *     // mix of dc API and d3 manipulation
       *     chart.select('g.y').style('display', 'none');
       *     // its a closure so you can also access other chart variable available in the closure scope
       *     moveChart.filter(chart.filter());
       * });
       * @param {Function} renderletFunction
       * @returns {BaseMixin}
       */
      renderlet (renderletFunction) {
          logger.warnOnce('chart.renderlet has been deprecated. Please use chart.on("renderlet.<renderletKey>", renderletFunction)');
          this.on('renderlet.' + utils.uniqueId(), renderletFunction);
          return this;
      }

      _defaultWidthCalc (element) {
          const width = element && element.getBoundingClientRect && element.getBoundingClientRect().width;
          return (width && width > this._minWidth) ? width : this._minWidth;
      }

      _defaultHeightCalc (element) {
          const height = element && element.getBoundingClientRect && element.getBoundingClientRect().height;
          return (height && height > this._minHeight) ? height : this._minHeight;
      }

      _defaultData (group) {
          return group.all();
      }
  }

  /**
   * The Color Mixin is an abstract chart functional class providing universal coloring support
   * as a mix-in for any concrete chart implementation.
   * @mixin ColorMixin
   * @param {Object} Base
   * @returns {ColorMixin}
   */
  const ColorMixin = Base => {
      return class extends Base {
          constructor () {
              super();

              this._colors = ordinal(config.defaultColors());

              this._colorAccessor = (d) => {
                  return this.keyAccessor()(d);
              };
              this._colorCalculator = undefined;

              {
                  const chart = this;
                  // ES6: this method is called very differently from stack-mixin and derived charts
                  // Removing and placing it as a member method is tricky

                  /**
                   * Get the color for the datum d and counter i. This is used internally by charts to retrieve a color.
                   * @method getColor
                   * @memberof ColorMixin
                   * @instance
                   * @param {*} d
                   * @param {Number} [i]
                   * @returns {String}
                   */
                  chart.getColor = function (d, i) {
                      return chart._colorCalculator ?
                          chart._colorCalculator.call(this, d, i) :
                          chart._colors(chart._colorAccessor.call(this, d, i));
                  };
              }
          }

          /**
           * Set the domain by determining the min and max values as retrieved by
           * {@link ColorMixin#colorAccessor .colorAccessor} over the chart's dataset.
           * @memberof ColorMixin
           * @instance
           * @returns {ColorMixin}
           */
          calculateColorDomain () {
              const newDomain = [min(this.data(), this.colorAccessor()),
                                 max(this.data(), this.colorAccessor())];
              this._colors.domain(newDomain);
              return this;
          }

          /**
           * Retrieve current color scale or set a new color scale. This methods accepts any function that
           * operates like a d3 scale.
           * @memberof ColorMixin
           * @instance
           * @see {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}
           * @example
           * // alternate categorical scale
           * chart.colors(d3.scale.category20b());
           * // ordinal scale
           * chart.colors(d3.scaleOrdinal().range(['red','green','blue']));
           * // convenience method, the same as above
           * chart.ordinalColors(['red','green','blue']);
           * // set a linear scale
           * chart.linearColors(["#4575b4", "#ffffbf", "#a50026"]);
           * @param {d3.scale} [colorScale=d3.scaleOrdinal(d3.schemeCategory20c)]
           * @returns {d3.scale|ColorMixin}
           */
          colors (colorScale) {
              if (!arguments.length) {
                  return this._colors;
              }
              if (colorScale instanceof Array) {
                  this._colors = quantize().range(colorScale); // deprecated legacy support, note: this fails for ordinal domains
              } else {
                  this._colors = typeof colorScale === 'function' ? colorScale : utils.constant(colorScale);
              }
              return this;
          }

          /**
           * Convenience method to set the color scale to
           * {@link https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales d3.scaleOrdinal} with
           * range `r`.
           * @memberof ColorMixin
           * @instance
           * @param {Array<String>} r
           * @returns {ColorMixin}
           */
          ordinalColors (r) {
              return this.colors(ordinal().range(r));
          }

          /**
           * Convenience method to set the color scale to an Hcl interpolated linear scale with range `r`.
           * @memberof ColorMixin
           * @instance
           * @param {Array<Number>} r
           * @returns {ColorMixin}
           */
          linearColors (r) {
              return this.colors(linear$1()
                  .range(r)
                  .interpolate(interpolateHcl));
          }

          /**
           * Set or the get color accessor function. This function will be used to map a data point in a
           * crossfilter group to a color value on the color scale. The default function uses the key
           * accessor.
           * @memberof ColorMixin
           * @instance
           * @example
           * // default index based color accessor
           * .colorAccessor(function (d, i){return i;})
           * // color accessor for a multi-value crossfilter reduction
           * .colorAccessor(function (d){return d.value.absGain;})
           * @param {Function} [colorAccessor]
           * @returns {Function|ColorMixin}
           */
          colorAccessor (colorAccessor) {
              if (!arguments.length) {
                  return this._colorAccessor;
              }
              this._colorAccessor = colorAccessor;
              return this;
          }

          /**
           * Set or get the current domain for the color mapping function. The domain must be supplied as an
           * array.
           *
           * Note: previously this method accepted a callback function. Instead you may use a custom scale
           * set by {@link ColorMixin#colors .colors}.
           * @memberof ColorMixin
           * @instance
           * @param {Array<String>} [domain]
           * @returns {Array<String>|ColorMixin}
           */
          colorDomain (domain) {
              if (!arguments.length) {
                  return this._colors.domain();
              }
              this._colors.domain(domain);
              return this;
          }

          /**
           * Overrides the color selection algorithm, replacing it with a simple function.
           *
           * Normally colors will be determined by calling the `colorAccessor` to get a value, and then passing that
           * value through the `colorScale`.
           *
           * But sometimes it is difficult to get a color scale to produce the desired effect. The `colorCalculator`
           * takes the datum and index and returns a color directly.
           * @memberof ColorMixin
           * @instance
           * @param {*} [colorCalculator]
           * @returns {Function|ColorMixin}
           */
          colorCalculator (colorCalculator) {
              if (!arguments.length) {
                  return this._colorCalculator || this.getColor;
              }
              this._colorCalculator = colorCalculator;
              return this;
          }
      }
  };

  /**
   * This Mixin provides reusable functionalities for any chart that needs to visualize data using bubbles.
   * @mixin BubbleMixin
   * @mixes ColorMixin
   * @param {Object} Base
   * @returns {BubbleMixin}
   */
  const BubbleMixin = Base => {
      return class extends ColorMixin(Base) {
          constructor () {
              super();

              this._maxBubbleRelativeSize = 0.3;
              this._minRadiusWithLabel = 10;
              this._sortBubbleSize = false;
              this._elasticRadius = false;

              // These cane be used by derived classes as well, so member status
              this.BUBBLE_NODE_CLASS = 'node';
              this.BUBBLE_CLASS = 'bubble';
              this.MIN_RADIUS = 10;

              this.renderLabel(true);

              this.data(group => {
                  const data = group.all();
                  if (this._sortBubbleSize) {
                      // sort descending so smaller bubbles are on top
                      const radiusAccessor = this.radiusValueAccessor();
                      data.sort((a, b) => descending(radiusAccessor(a), radiusAccessor(b)));
                  }
                  return data;
              });

              this._r = linear$1().domain([0, 100]);
          }

          _rValueAccessor (d) {
              return d.r;
          }

          /**
           * Get or set the bubble radius scale. By default the bubble chart uses
           * {@link https://github.com/d3/d3-scale/blob/master/README.md#scaleLinear d3.scaleLinear().domain([0, 100])}
           * as its radius scale.
           * @memberof BubbleMixin
           * @instance
           * @see {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}
           * @param {d3.scale} [bubbleRadiusScale=d3.scaleLinear().domain([0, 100])]
           * @returns {d3.scale|BubbleMixin}
           */
          r (bubbleRadiusScale) {
              if (!arguments.length) {
                  return this._r;
              }
              this._r = bubbleRadiusScale;
              return this;
          }

          /**
           * Turn on or off the elastic bubble radius feature, or return the value of the flag. If this
           * feature is turned on, then bubble radii will be automatically rescaled to fit the chart better.
           * @param {Boolean} [elasticRadius=false]
           * @returns {Boolean|BubbleChart}
           */
          elasticRadius (elasticRadius) {
              if (!arguments.length) {
                  return this._elasticRadius;
              }
              this._elasticRadius = elasticRadius;
              return this;
          }

          calculateRadiusDomain () {
              if (this._elasticRadius) {
                  this.r().domain([this.rMin(), this.rMax()]);
              }
          }

          /**
           * Get or set the radius value accessor function. If set, the radius value accessor function will
           * be used to retrieve a data value for each bubble. The data retrieved then will be mapped using
           * the r scale to the actual bubble radius. This allows you to encode a data dimension using bubble
           * size.
           * @memberof BubbleMixin
           * @instance
           * @param {Function} [radiusValueAccessor]
           * @returns {Function|BubbleMixin}
           */
          radiusValueAccessor (radiusValueAccessor) {
              if (!arguments.length) {
                  return this._rValueAccessor;
              }
              this._rValueAccessor = radiusValueAccessor;
              return this;
          }

          rMin () {
              return min(this.data(), e => this.radiusValueAccessor()(e));
          }

          rMax () {
              return max(this.data(), e => this.radiusValueAccessor()(e));
          }

          bubbleR (d) {
              const value = this.radiusValueAccessor()(d);
              let r = this.r()(value);
              if (isNaN(r) || value <= 0) {
                  r = 0;
              }
              return r;
          }

          _labelFunction (d) {
              return this.label()(d);
          }

          _shouldLabel (d) {
              return (this.bubbleR(d) > this._minRadiusWithLabel);
          }

          _labelOpacity (d) {
              return this._shouldLabel(d) ? 1 : 0;
          }

          _labelPointerEvent (d) {
              return this._shouldLabel(d) ? 'all' : 'none';
          }

          _doRenderLabel (bubbleGEnter) {
              if (this.renderLabel()) {
                  let label = bubbleGEnter.select('text');

                  if (label.empty()) {
                      label = bubbleGEnter.append('text')
                          .attr('text-anchor', 'middle')
                          .attr('dy', '.3em')
                          .on('click', d => this.onClick(d));
                  }

                  label
                      .attr('opacity', 0)
                      .attr('pointer-events', d => this._labelPointerEvent(d))
                      .text(d => this._labelFunction(d));
                  transition$1(label, this.transitionDuration(), this.transitionDelay())
                      .attr('opacity', d => this._labelOpacity(d));
              }
          }

          doUpdateLabels (bubbleGEnter) {
              if (this.renderLabel()) {
                  const labels = bubbleGEnter.select('text')
                      .attr('pointer-events', d => this._labelPointerEvent(d))
                      .text(d => this._labelFunction(d));
                  transition$1(labels, this.transitionDuration(), this.transitionDelay())
                      .attr('opacity', d => this._labelOpacity(d));
              }
          }

          _titleFunction (d) {
              return this.title()(d);
          }

          _doRenderTitles (g) {
              if (this.renderTitle()) {
                  const title = g.select('title');

                  if (title.empty()) {
                      g.append('title').text(d => this._titleFunction(d));
                  }
              }
          }

          doUpdateTitles (g) {
              if (this.renderTitle()) {
                  g.select('title').text(d => this._titleFunction(d));
              }
          }

          /**
           * Turn on or off the bubble sorting feature, or return the value of the flag. If enabled,
           * bubbles will be sorted by their radius, with smaller bubbles in front.
           * @memberof BubbleChart
           * @instance
           * @param {Boolean} [sortBubbleSize=false]
           * @returns {Boolean|BubbleChart}
           */
          sortBubbleSize (sortBubbleSize) {
              if (!arguments.length) {
                  return this._sortBubbleSize;
              }
              this._sortBubbleSize = sortBubbleSize;
              return this;
          }

          /**
           * Get or set the minimum radius. This will be used to initialize the radius scale's range.
           * @memberof BubbleMixin
           * @instance
           * @param {Number} [radius=10]
           * @returns {Number|BubbleMixin}
           */
          minRadius (radius) {
              if (!arguments.length) {
                  return this.MIN_RADIUS;
              }
              this.MIN_RADIUS = radius;
              return this;
          }

          /**
           * Get or set the minimum radius for label rendering. If a bubble's radius is less than this value
           * then no label will be rendered.
           * @memberof BubbleMixin
           * @instance
           * @param {Number} [radius=10]
           * @returns {Number|BubbleMixin}
           */

          minRadiusWithLabel (radius) {
              if (!arguments.length) {
                  return this._minRadiusWithLabel;
              }
              this._minRadiusWithLabel = radius;
              return this;
          }

          /**
           * Get or set the maximum relative size of a bubble to the length of x axis. This value is useful
           * when the difference in radius between bubbles is too great.
           * @memberof BubbleMixin
           * @instance
           * @param {Number} [relativeSize=0.3]
           * @returns {Number|BubbleMixin}
           */
          maxBubbleRelativeSize (relativeSize) {
              if (!arguments.length) {
                  return this._maxBubbleRelativeSize;
              }
              this._maxBubbleRelativeSize = relativeSize;
              return this;
          }

          fadeDeselectedArea (selection) {
              if (this.hasFilter()) {
                  const chart = this;
                  this.selectAll('g.' + chart.BUBBLE_NODE_CLASS).each(function (d) {
                      if (chart.isSelectedNode(d)) {
                          chart.highlightSelected(this);
                      } else {
                          chart.fadeDeselected(this);
                      }
                  });
              } else {
                  const chart = this;
                  this.selectAll('g.' + chart.BUBBLE_NODE_CLASS).each(function () {
                      chart.resetHighlight(this);
                  });
              }
          }

          isSelectedNode (d) {
              return this.hasFilter(d.key);
          }

          onClick (d) {
              const filter = d.key;
              events.trigger(() => {
                  this.filter(filter);
                  this.redrawGroup();
              });
          }
      }
  };

  /**
   * Margin is a mixin that provides margin utility functions for both the Row Chart and Coordinate Grid
   * Charts.
   * @mixin MarginMixin
   * @param {Object} Base
   * @returns {MarginMixin}
   */
  class MarginMixin extends BaseMixin {
      constructor () {
          super();

          this._margin = {top: 10, right: 50, bottom: 30, left: 30};
      }

      /**
       * Get or set the margins for a particular coordinate grid chart instance. The margins is stored as
       * an associative Javascript array.
       * @memberof MarginMixin
       * @instance
       * @example
       * var leftMargin = chart.margins().left; // 30 by default
       * chart.margins().left = 50;
       * leftMargin = chart.margins().left; // now 50
       * @param {{top: Number, right: Number, left: Number, bottom: Number}} [margins={top: 10, right: 50, bottom: 30, left: 30}]
       * @returns {{top: Number, right: Number, left: Number, bottom: Number}|MarginMixin}
       */
      margins (margins) {
          if (!arguments.length) {
              return this._margin;
          }
          this._margin = margins;
          return this;
      }

      /**
       * Effective width of the chart excluding margins (in pixels).
       *
       * @returns {number}
       */
      effectiveWidth () {
          return this.width() - this.margins().left - this.margins().right;
      }

      /**
       * Effective height of the chart excluding margins (in pixels).
       *
       * @returns {number}
       */
      effectiveHeight () {
          return this.height() - this.margins().top - this.margins().bottom;
      }
  }

  const GRID_LINE_CLASS = 'grid-line';
  const HORIZONTAL_CLASS = 'horizontal';
  const VERTICAL_CLASS = 'vertical';
  const Y_AXIS_LABEL_CLASS = 'y-axis-label';
  const X_AXIS_LABEL_CLASS = 'x-axis-label';
  const CUSTOM_BRUSH_HANDLE_CLASS = 'custom-brush-handle';
  const DEFAULT_AXIS_LABEL_PADDING = 12;

  /**
   * Coordinate Grid is an abstract base chart designed to support a number of coordinate grid based
   * concrete chart types, e.g. bar chart, line chart, and bubble chart.
   * @mixin CoordinateGridMixin
   * @mixes ColorMixin
   * @mixes MarginMixin
   */
  class CoordinateGridMixin extends ColorMixin(MarginMixin) {
      constructor () {
          super();

          this.colors(ordinal(schemeCategory10));
          this._mandatoryAttributes().push('x');
          this._parent = undefined;
          this._g = undefined;
          this._chartBodyG = undefined;

          this._x = undefined;
          this._origX = undefined; // Will hold original scale in case of zoom
          this._xOriginalDomain = undefined;
          this._xAxis = axisBottom();
          this._xUnits = units.integers;
          this._xAxisPadding = 0;
          this._xAxisPaddingUnit = day;
          this._xElasticity = false;
          this._xAxisLabel = undefined;
          this._xAxisLabelPadding = 0;
          this._lastXDomain = undefined;

          this._y = undefined;
          this._yAxis = null;
          this._yAxisPadding = 0;
          this._yElasticity = false;
          this._yAxisLabel = undefined;
          this._yAxisLabelPadding = 0;

          this._brush = brushX();

          this._gBrush = undefined;
          this._brushOn = true;
          this._parentBrushOn = false;
          this._round = undefined;

          this._renderHorizontalGridLine = false;
          this._renderVerticalGridLine = false;

          this._resizing = false;
          this._unitCount = undefined;

          this._zoomScale = [1, Infinity];
          this._zoomOutRestrict = true;

          this._zoom = zoom().on('zoom', () => this._onZoom());
          this._nullZoom = zoom().on('zoom', null);
          this._hasBeenMouseZoomable = false;

          this._rangeChart = undefined;
          this._focusChart = undefined;

          this._mouseZoomable = false;
          this._clipPadding = 0;

          this._fOuterRangeBandPadding = 0.5;
          this._fRangeBandPadding = 0;

          this._useRightYAxis = false;
      }

      /**
       * When changing the domain of the x or y scale, it is necessary to tell the chart to recalculate
       * and redraw the axes. (`.rescale()` is called automatically when the x or y scale is replaced
       * with {@link CoordinateGridMixin+x .x()} or {@link CoordinateGridMixin#y .y()}, and has
       * no effect on elastic scales.)
       * @returns {CoordinateGridMixin}
       */
      rescale () {
          this._unitCount = undefined;
          this._resizing = true;
          return this;
      }

      resizing (resizing) {
          if (!arguments.length) {
              return this._resizing;
          }
          this._resizing = resizing;
          return this;
      }

      /**
       * Get or set the range selection chart associated with this instance. Setting the range selection
       * chart using this function will automatically update its selection brush when the current chart
       * zooms in. In return the given range chart will also automatically attach this chart as its focus
       * chart hence zoom in when range brush updates.
       *
       * Usually the range and focus charts will share a dimension. The range chart will set the zoom
       * boundaries for the focus chart, so its dimension values must be compatible with the domain of
       * the focus chart.
       *
       * See the [Nasdaq 100 Index](http://dc-js.github.com/dc.js/) example for this effect in action.
       * @param {CoordinateGridMixin} [rangeChart]
       * @returns {CoordinateGridMixin}
       */
      rangeChart (rangeChart) {
          if (!arguments.length) {
              return this._rangeChart;
          }
          this._rangeChart = rangeChart;
          this._rangeChart.focusChart(this);
          return this;
      }

      /**
       * Get or set the scale extent for mouse zooms.
       * @param {Array<Number|Date>} [extent=[1, Infinity]]
       * @returns {Array<Number|Date>|CoordinateGridMixin}
       */
      zoomScale (extent) {
          if (!arguments.length) {
              return this._zoomScale;
          }
          this._zoomScale = extent;
          return this;
      }

      /**
       * Get or set the zoom restriction for the chart. If true limits the zoom to origional domain of the chart.
       * @param {Boolean} [zoomOutRestrict=true]
       * @returns {Boolean|CoordinateGridMixin}
       */
      zoomOutRestrict (zoomOutRestrict) {
          if (!arguments.length) {
              return this._zoomOutRestrict;
          }
          this._zoomOutRestrict = zoomOutRestrict;
          return this;
      }

      _generateG (parent) {
          if (parent === undefined) {
              this._parent = this.svg();
          } else {
              this._parent = parent;
          }

          const href = window.location.href.split('#')[0];

          this._g = this._parent.append('g');

          this._chartBodyG = this._g.append('g').attr('class', 'chart-body')
              .attr('transform', 'translate(' + this.margins().left + ', ' + this.margins().top + ')')
              .attr('clip-path', 'url(' + href + '#' + this._getClipPathId() + ')');

          return this._g;
      }

      /**
       * Get or set the root g element. This method is usually used to retrieve the g element in order to
       * overlay custom svg drawing programatically. **Caution**: The root g element is usually generated
       * by dc.js internals, and resetting it might produce unpredictable result.
       * @param {SVGElement} [gElement]
       * @returns {SVGElement|CoordinateGridMixin}
       */
      g (gElement) {
          if (!arguments.length) {
              return this._g;
          }
          this._g = gElement;
          return this;
      }

      /**
       * Set or get mouse zoom capability flag (default: false). When turned on the chart will be
       * zoomable using the mouse wheel. If the range selector chart is attached zooming will also update
       * the range selection brush on the associated range selector chart.
       * @param {Boolean} [mouseZoomable=false]
       * @returns {Boolean|CoordinateGridMixin}
       */
      mouseZoomable (mouseZoomable) {
          if (!arguments.length) {
              return this._mouseZoomable;
          }
          this._mouseZoomable = mouseZoomable;
          return this;
      }

      /**
       * Retrieve the svg group for the chart body.
       * @param {SVGElement} [chartBodyG]
       * @returns {SVGElement}
       */
      chartBodyG (chartBodyG) {
          if (!arguments.length) {
              return this._chartBodyG;
          }
          this._chartBodyG = chartBodyG;
          return this;
      }

      /**
       * **mandatory**
       *
       * Get or set the x scale. The x scale can be any d3
       * {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale} or
       * {@link https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales ordinal scale}
       * @see {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}
       * @example
       * // set x to a linear scale
       * chart.x(d3.scaleLinear().domain([-2500, 2500]))
       * // set x to a time scale to generate histogram
       * chart.x(d3.scaleTime().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
       * @param {d3.scale} [xScale]
       * @returns {d3.scale|CoordinateGridMixin}
       */
      x (xScale) {
          if (!arguments.length) {
              return this._x;
          }
          this._x = xScale;
          this._xOriginalDomain = this._x.domain();
          this.rescale();
          return this;
      }

      xOriginalDomain () {
          return this._xOriginalDomain;
      }

      /**
       * Set or get the xUnits function. The coordinate grid chart uses the xUnits function to calculate
       * the number of data projections on the x axis such as the number of bars for a bar chart or the
       * number of dots for a line chart.
       *
       * This function is expected to return a Javascript array of all data points on the x axis, or
       * the number of points on the axis. d3 time range functions [d3.timeDays, d3.timeMonths, and
       * d3.timeYears](https://github.com/d3/d3-time/blob/master/README.md#intervals) are all valid
       * xUnits functions.
       *
       * dc.js also provides a few units function, see the {@link units Units Namespace} for
       * a list of built-in units functions.
       *
       * Note that as of dc.js 3.0, `units.ordinal` is not a real function, because it is not
       * possible to define this function compliant with the d3 range functions. It was already a
       * magic value which caused charts to behave differently, and now it is completely so.
       * @example
       * // set x units to count days
       * chart.xUnits(d3.timeDays);
       * // set x units to count months
       * chart.xUnits(d3.timeMonths);
       *
       * // A custom xUnits function can be used as long as it follows the following interface:
       * // units in integer
       * function(start, end) {
       *      // simply calculates how many integers in the domain
       *      return Math.abs(end - start);
       * }
       *
       * // fixed units
       * function(start, end) {
       *      // be aware using fixed units will disable the focus/zoom ability on the chart
       *      return 1000;
       * }
       * @param {Function} [xUnits=units.integers]
       * @returns {Function|CoordinateGridMixin}
       */
      xUnits (xUnits) {
          if (!arguments.length) {
              return this._xUnits;
          }
          this._xUnits = xUnits;
          return this;
      }

      /**
       * Set or get the x axis used by a particular coordinate grid chart instance. This function is most
       * useful when x axis customization is required. The x axis in dc.js is an instance of a
       * {@link https://github.com/d3/d3-axis/blob/master/README.md#axisBottom d3 bottom axis object};
       * therefore it supports any valid d3 axisBottom manipulation.
       *
       * **Caution**: The x axis is usually generated internally by dc; resetting it may cause
       * unexpected results. Note also that when used as a getter, this function is not chainable:
       * it returns the axis, not the chart,
       * {@link https://github.com/dc-js/dc.js/wiki/FAQ#why-does-everything-break-after-a-call-to-xaxis-or-yaxis
           * so attempting to call chart functions after calling `.xAxis()` will fail}.
       * @see {@link https://github.com/d3/d3-axis/blob/master/README.md#axisBottom d3.axisBottom}
       * @example
       * // customize x axis tick format
       * chart.xAxis().tickFormat(function(v) {return v + '%';});
       * // customize x axis tick values
       * chart.xAxis().tickValues([0, 100, 200, 300]);
       * @param {d3.axis} [xAxis=d3.axisBottom()]
       * @returns {d3.axis|CoordinateGridMixin}
       */
      xAxis (xAxis) {
          if (!arguments.length) {
              return this._xAxis;
          }
          this._xAxis = xAxis;
          return this;
      }

      /**
       * Turn on/off elastic x axis behavior. If x axis elasticity is turned on, then the grid chart will
       * attempt to recalculate the x axis range whenever a redraw event is triggered.
       * @param {Boolean} [elasticX=false]
       * @returns {Boolean|CoordinateGridMixin}
       */
      elasticX (elasticX) {
          if (!arguments.length) {
              return this._xElasticity;
          }
          this._xElasticity = elasticX;
          return this;
      }

      /**
       * Set or get x axis padding for the elastic x axis. The padding will be added to both end of the x
       * axis if elasticX is turned on; otherwise it is ignored.
       *
       * Padding can be an integer or percentage in string (e.g. '10%'). Padding can be applied to
       * number or date x axes.  When padding a date axis, an integer represents number of units being padded
       * and a percentage string will be treated the same as an integer. The unit will be determined by the
       * xAxisPaddingUnit variable.
       * @param {Number|String} [padding=0]
       * @returns {Number|String|CoordinateGridMixin}
       */
      xAxisPadding (padding) {
          if (!arguments.length) {
              return this._xAxisPadding;
          }
          this._xAxisPadding = padding;
          return this;
      }

      /**
       * Set or get x axis padding unit for the elastic x axis. The padding unit will determine which unit to
       * use when applying xAxis padding if elasticX is turned on and if x-axis uses a time dimension;
       * otherwise it is ignored.
       *
       * The padding unit should be a
       * [d3 time interval](https://github.com/d3/d3-time/blob/master/README.md#self._interval).
       * For backward compatibility with dc.js 2.0, it can also be the name of a d3 time interval
       * ('day', 'hour', etc). Available arguments are the
       * [d3 time intervals](https://github.com/d3/d3-time/blob/master/README.md#intervals d3.timeInterval).
       * @param {String} [unit=d3.timeDay]
       * @returns {String|CoordinateGridMixin}
       */
      xAxisPaddingUnit (unit) {
          if (!arguments.length) {
              return this._xAxisPaddingUnit;
          }
          this._xAxisPaddingUnit = unit;
          return this;
      }

      /**
       * Returns the number of units displayed on the x axis. If the x axis is ordinal (`xUnits` is
       * `units.ordinal`), this is the number of items in the domain of the x scale. Otherwise, the
       * x unit count is calculated using the {@link CoordinateGridMixin#xUnits xUnits} function.
       * @returns {Number}
       */
      xUnitCount () {
          if (this._unitCount === undefined) {
              if (this.isOrdinal()) {
                  // In this case it number of items in domain
                  this._unitCount = this.x().domain().length;
              } else {
                  this._unitCount = this.xUnits()(this.x().domain()[0], this.x().domain()[1]);

                  // Sometimes xUnits() may return an array while sometimes directly the count
                  if (this._unitCount instanceof Array) {
                      this._unitCount = this._unitCount.length;
                  }
              }
          }

          return this._unitCount;
      }

      /**
       * Gets or sets whether the chart should be drawn with a right axis instead of a left axis. When
       * used with a chart in a composite chart, allows both left and right Y axes to be shown on a
       * chart.
       * @param {Boolean} [useRightYAxis=false]
       * @returns {Boolean|CoordinateGridMixin}
       */
      useRightYAxis (useRightYAxis) {
          if (!arguments.length) {
              return this._useRightYAxis;
          }

          // We need to warn if value is changing after self._yAxis was created
          if (this._useRightYAxis !== useRightYAxis && this._yAxis) {
              logger.warn('Value of useRightYAxis has been altered, after yAxis was created. ' +
                  'You might get unexpected yAxis behavior. ' +
                  'Make calls to useRightYAxis sooner in your chart creation process.');
          }

          this._useRightYAxis = useRightYAxis;
          return this;
      }

      /**
       * Returns true if the chart is using ordinal xUnits ({@link units.ordinal units.ordinal}, or false
       * otherwise. Most charts behave differently with ordinal data and use the result of this method to
       * trigger the appropriate logic.
       * @returns {Boolean}
       */
      isOrdinal () {
          return this.xUnits() === units.ordinal;
      }

      _useOuterPadding () {
          return true;
      }

      _ordinalXDomain () {
          const groups = this._computeOrderedGroups(this.data());
          return groups.map(this.keyAccessor());
      }

      _prepareXAxis (g, render) {
          if (!this.isOrdinal()) {
              if (this.elasticX()) {
                  this._x.domain([this.xAxisMin(), this.xAxisMax()]);
              }
          } else { // self._chart.isOrdinal()
              // D3v4 - Ordinal charts would need scaleBand
              // bandwidth is a method in scaleBand
              // (https://github.com/d3/d3-scale/blob/master/README.md#scaleBand)
              if (!this._x.bandwidth) {
                  // If self._x is not a scaleBand create a new scale and
                  // copy the original domain to the new scale
                  logger.warn('For compatibility with d3v4+, dc.js d3.0 ordinal bar/line/bubble charts need ' +
                      'd3.scaleBand() for the x scale, instead of d3.scaleOrdinal(). ' +
                      'Replacing .x() with a d3.scaleBand with the same domain - ' +
                      'make the same change in your code to avoid this warning!');
                  this._x = band().domain(this._x.domain());
              }

              if (this.elasticX() || this._x.domain().length === 0) {
                  this._x.domain(this._ordinalXDomain());
              }
          }

          // has the domain changed?
          const xdom = this._x.domain();
          if (render || !utils.arraysEqual(this._lastXDomain, xdom)) {
              this.rescale();
          }
          this._lastXDomain = xdom;

          // please can't we always use rangeBands for bar charts?
          if (this.isOrdinal()) {
              this._x.range([0, this.xAxisLength()])
                  .paddingInner(this._fRangeBandPadding)
                  .paddingOuter(this._useOuterPadding() ? this._fOuterRangeBandPadding : 0);
          } else {
              this._x.range([0, this.xAxisLength()]);
          }

          this._xAxis = this._xAxis.scale(this.x());

          this._renderVerticalGridLines(g);
      }

      renderXAxis (g) {
          let axisXG = g.select('g.x');

          if (axisXG.empty()) {
              axisXG = g.append('g')
                  .attr('class', 'axis x')
                  .attr('transform', 'translate(' + this.margins().left + ',' + this._xAxisY() + ')');
          }

          let axisXLab = g.select('text.' + X_AXIS_LABEL_CLASS);
          if (axisXLab.empty() && this.xAxisLabel()) {
              axisXLab = g.append('text')
                  .attr('class', X_AXIS_LABEL_CLASS)
                  .attr('transform', 'translate(' + (this.margins().left + this.xAxisLength() / 2) + ',' +
                      (this.height() - this._xAxisLabelPadding) + ')')
                  .attr('text-anchor', 'middle');
          }
          if (this.xAxisLabel() && axisXLab.text() !== this.xAxisLabel()) {
              axisXLab.text(this.xAxisLabel());
          }

          transition$1(axisXG, this.transitionDuration(), this.transitionDelay())
              .attr('transform', 'translate(' + this.margins().left + ',' + this._xAxisY() + ')')
              .call(this._xAxis);
          transition$1(axisXLab, this.transitionDuration(), this.transitionDelay())
              .attr('transform', 'translate(' + (this.margins().left + this.xAxisLength() / 2) + ',' +
                  (this.height() - this._xAxisLabelPadding) + ')');
      }

      _renderVerticalGridLines (g) {
          let gridLineG = g.select('g.' + VERTICAL_CLASS);

          if (this._renderVerticalGridLine) {
              if (gridLineG.empty()) {
                  gridLineG = g.insert('g', ':first-child')
                      .attr('class', GRID_LINE_CLASS + ' ' + VERTICAL_CLASS)
                      .attr('transform', 'translate(' + this.margins().left + ',' + this.margins().top + ')');
              }

              const ticks = this._xAxis.tickValues() ? this._xAxis.tickValues() :
                  (typeof this._x.ticks === 'function' ? this._x.ticks.apply(this._x, this._xAxis.tickArguments()) : this._x.domain());

              const lines = gridLineG.selectAll('line')
                  .data(ticks);

              // enter
              const linesGEnter = lines.enter()
                  .append('line')
                  .attr('x1', d => this._x(d))
                  .attr('y1', this._xAxisY() - this.margins().top)
                  .attr('x2', d => this._x(d))
                  .attr('y2', 0)
                  .attr('opacity', 0);
              transition$1(linesGEnter, this.transitionDuration(), this.transitionDelay())
                  .attr('opacity', 0.5);

              // update
              transition$1(lines, this.transitionDuration(), this.transitionDelay())
                  .attr('x1', d => this._x(d))
                  .attr('y1', this._xAxisY() - this.margins().top)
                  .attr('x2', d => this._x(d))
                  .attr('y2', 0);

              // exit
              lines.exit().remove();
          } else {
              gridLineG.selectAll('line').remove();
          }
      }

      _xAxisY () {
          return (this.height() - this.margins().bottom);
      }

      xAxisLength () {
          return this.effectiveWidth();
      }

      /**
       * Set or get the x axis label. If setting the label, you may optionally include additional padding to
       * the margin to make room for the label. By default the padded is set to 12 to accomodate the text height.
       * @param {String} [labelText]
       * @param {Number} [padding=12]
       * @returns {String}
       */
      xAxisLabel (labelText, padding) {
          if (!arguments.length) {
              return this._xAxisLabel;
          }
          this._xAxisLabel = labelText;
          this.margins().bottom -= this._xAxisLabelPadding;
          this._xAxisLabelPadding = (padding === undefined) ? DEFAULT_AXIS_LABEL_PADDING : padding;
          this.margins().bottom += this._xAxisLabelPadding;
          return this;
      }

      _createYAxis () {
          return this._useRightYAxis ? axisRight() : axisLeft();
      }

      _prepareYAxis (g) {
          if (this._y === undefined || this.elasticY()) {
              if (this._y === undefined) {
                  this._y = linear$1();
              }
              const min = this.yAxisMin() || 0,
                  max = this.yAxisMax() || 0;
              this._y.domain([min, max]).rangeRound([this.yAxisHeight(), 0]);
          }

          this._y.range([this.yAxisHeight(), 0]);

          if (!this._yAxis) {
              this._yAxis = this._createYAxis();
          }

          this._yAxis.scale(this._y);

          this._renderHorizontalGridLinesForAxis(g, this._y, this._yAxis);
      }

      renderYAxisLabel (axisClass, text, rotation, labelXPosition) {
          labelXPosition = labelXPosition || this._yAxisLabelPadding;

          let axisYLab = this.g().select('text.' + Y_AXIS_LABEL_CLASS + '.' + axisClass + '-label');
          const labelYPosition = (this.margins().top + this.yAxisHeight() / 2);
          if (axisYLab.empty() && text) {
              axisYLab = this.g().append('text')
                  .attr('transform', 'translate(' + labelXPosition + ',' + labelYPosition + '),rotate(' + rotation + ')')
                  .attr('class', Y_AXIS_LABEL_CLASS + ' ' + axisClass + '-label')
                  .attr('text-anchor', 'middle')
                  .text(text);
          }
          if (text && axisYLab.text() !== text) {
              axisYLab.text(text);
          }
          transition$1(axisYLab, this.transitionDuration(), this.transitionDelay())
              .attr('transform', 'translate(' + labelXPosition + ',' + labelYPosition + '),rotate(' + rotation + ')');
      }

      renderYAxisAt (axisClass, axis, position) {
          let axisYG = this.g().select('g.' + axisClass);
          if (axisYG.empty()) {
              axisYG = this.g().append('g')
                  .attr('class', 'axis ' + axisClass)
                  .attr('transform', 'translate(' + position + ',' + this.margins().top + ')');
          }

          transition$1(axisYG, this.transitionDuration(), this.transitionDelay())
              .attr('transform', 'translate(' + position + ',' + this.margins().top + ')')
              .call(axis);
      }

      renderYAxis () {
          const axisPosition = this._useRightYAxis ? (this.width() - this.margins().right) : this._yAxisX();
          this.renderYAxisAt('y', this._yAxis, axisPosition);
          const labelPosition = this._useRightYAxis ? (this.width() - this._yAxisLabelPadding) : this._yAxisLabelPadding;
          const rotation = this._useRightYAxis ? 90 : -90;
          this.renderYAxisLabel('y', this.yAxisLabel(), rotation, labelPosition);
      }

      _renderHorizontalGridLinesForAxis (g, scale, axis) {
          let gridLineG = g.select('g.' + HORIZONTAL_CLASS);

          if (this._renderHorizontalGridLine) {
              // see https://github.com/d3/d3-axis/blob/master/src/axis.js#L48
              const ticks = axis.tickValues() ? axis.tickValues() :
                  (scale.ticks ? scale.ticks.apply(scale, axis.tickArguments()) : scale.domain());

              if (gridLineG.empty()) {
                  gridLineG = g.insert('g', ':first-child')
                      .attr('class', GRID_LINE_CLASS + ' ' + HORIZONTAL_CLASS)
                      .attr('transform', 'translate(' + this.margins().left + ',' + this.margins().top + ')');
              }

              const lines = gridLineG.selectAll('line')
                  .data(ticks);

              // enter
              const linesGEnter = lines.enter()
                  .append('line')
                  .attr('x1', 1)
                  .attr('y1', d => scale(d))
                  .attr('x2', this.xAxisLength())
                  .attr('y2', d => scale(d))
                  .attr('opacity', 0);
              transition$1(linesGEnter, this.transitionDuration(), this.transitionDelay())
                  .attr('opacity', 0.5);

              // update
              transition$1(lines, this.transitionDuration(), this.transitionDelay())
                  .attr('x1', 1)
                  .attr('y1', d => scale(d))
                  .attr('x2', this.xAxisLength())
                  .attr('y2', d => scale(d));

              // exit
              lines.exit().remove();
          } else {
              gridLineG.selectAll('line').remove();
          }
      }

      _yAxisX () {
          return this.useRightYAxis() ? this.width() - this.margins().right : this.margins().left;
      }

      /**
       * Set or get the y axis label. If setting the label, you may optionally include additional padding
       * to the margin to make room for the label. By default the padding is set to 12 to accommodate the
       * text height.
       * @param {String} [labelText]
       * @param {Number} [padding=12]
       * @returns {String|CoordinateGridMixin}
       */
      yAxisLabel (labelText, padding) {
          if (!arguments.length) {
              return this._yAxisLabel;
          }
          this._yAxisLabel = labelText;
          this.margins().left -= this._yAxisLabelPadding;
          this._yAxisLabelPadding = (padding === undefined) ? DEFAULT_AXIS_LABEL_PADDING : padding;
          this.margins().left += this._yAxisLabelPadding;
          return this;
      }

      /**
       * Get or set the y scale. The y scale is typically automatically determined by the chart implementation.
       * @see {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}
       * @param {d3.scale} [yScale]
       * @returns {d3.scale|CoordinateGridMixin}
       */
      y (yScale) {
          if (!arguments.length) {
              return this._y;
          }
          this._y = yScale;
          this.rescale();
          return this;
      }

      /**
       * Set or get the y axis used by the coordinate grid chart instance. This function is most useful
       * when y axis customization is required. Depending on `useRightYAxis` the y axis in dc.js is an instance of
       * either [d3.axisLeft](https://github.com/d3/d3-axis/blob/master/README.md#axisLeft) or
       * [d3.axisRight](https://github.com/d3/d3-axis/blob/master/README.md#axisRight); therefore it supports any
       * valid d3 axis manipulation.
       *
       * **Caution**: The y axis is usually generated internally by dc; resetting it may cause
       * unexpected results.  Note also that when used as a getter, this function is not chainable: it
       * returns the axis, not the chart,
       * {@link https://github.com/dc-js/dc.js/wiki/FAQ#why-does-everything-break-after-a-call-to-xaxis-or-yaxis
           * so attempting to call chart functions after calling `.yAxis()` will fail}.
       * In addition, depending on whether you are going to use the axis on left or right
       * you need to appropriately pass [d3.axisLeft](https://github.com/d3/d3-axis/blob/master/README.md#axisLeft)
       * or [d3.axisRight](https://github.com/d3/d3-axis/blob/master/README.md#axisRight)
       * @see {@link https://github.com/d3/d3-axis/blob/master/README.md d3.axis}
       * @example
       * // customize y axis tick format
       * chart.yAxis().tickFormat(function(v) {return v + '%';});
       * // customize y axis tick values
       * chart.yAxis().tickValues([0, 100, 200, 300]);
       * @param {d3.axisLeft|d3.axisRight} [yAxis]
       * @returns {d3.axisLeft|d3.axisRight|CoordinateGridMixin}
       */
      yAxis (yAxis) {
          if (!arguments.length) {
              if (!this._yAxis) {
                  this._yAxis = this._createYAxis();
              }
              return this._yAxis;
          }
          this._yAxis = yAxis;
          return this;
      }

      /**
       * Turn on/off elastic y axis behavior. If y axis elasticity is turned on, then the grid chart will
       * attempt to recalculate the y axis range whenever a redraw event is triggered.
       * @param {Boolean} [elasticY=false]
       * @returns {Boolean|CoordinateGridMixin}
       */
      elasticY (elasticY) {
          if (!arguments.length) {
              return this._yElasticity;
          }
          this._yElasticity = elasticY;
          return this;
      }

      /**
       * Turn on/off horizontal grid lines.
       * @param {Boolean} [renderHorizontalGridLines=false]
       * @returns {Boolean|CoordinateGridMixin}
       */
      renderHorizontalGridLines (renderHorizontalGridLines) {
          if (!arguments.length) {
              return this._renderHorizontalGridLine;
          }
          this._renderHorizontalGridLine = renderHorizontalGridLines;
          return this;
      }

      /**
       * Turn on/off vertical grid lines.
       * @param {Boolean} [renderVerticalGridLines=false]
       * @returns {Boolean|CoordinateGridMixin}
       */
      renderVerticalGridLines (renderVerticalGridLines) {
          if (!arguments.length) {
              return this._renderVerticalGridLine;
          }
          this._renderVerticalGridLine = renderVerticalGridLines;
          return this;
      }

      /**
       * Calculates the minimum x value to display in the chart. Includes xAxisPadding if set.
       * @returns {*}
       */
      xAxisMin () {
          const min$1 = min(this.data(), e => this.keyAccessor()(e));
          return utils.subtract(min$1, this._xAxisPadding, this._xAxisPaddingUnit);
      }

      /**
       * Calculates the maximum x value to display in the chart. Includes xAxisPadding if set.
       * @returns {*}
       */
      xAxisMax () {
          const max$1 = max(this.data(), e => this.keyAccessor()(e));
          return utils.add(max$1, this._xAxisPadding, this._xAxisPaddingUnit);
      }

      /**
       * Calculates the minimum y value to display in the chart. Includes yAxisPadding if set.
       * @returns {*}
       */
      yAxisMin () {
          const min$1 = min(this.data(), e => this.valueAccessor()(e));
          return utils.subtract(min$1, this._yAxisPadding);
      }

      /**
       * Calculates the maximum y value to display in the chart. Includes yAxisPadding if set.
       * @returns {*}
       */
      yAxisMax () {
          const max$1 = max(this.data(), e => this.valueAccessor()(e));
          return utils.add(max$1, this._yAxisPadding);
      }

      /**
       * Set or get y axis padding for the elastic y axis. The padding will be added to the top and
       * bottom of the y axis if elasticY is turned on; otherwise it is ignored.
       *
       * Padding can be an integer or percentage in string (e.g. '10%'). Padding can be applied to
       * number or date axes. When padding a date axis, an integer represents number of days being padded
       * and a percentage string will be treated the same as an integer.
       * @param {Number|String} [padding=0]
       * @returns {Number|CoordinateGridMixin}
       */
      yAxisPadding (padding) {
          if (!arguments.length) {
              return this._yAxisPadding;
          }
          this._yAxisPadding = padding;
          return this;
      }

      yAxisHeight () {
          return this.effectiveHeight();
      }

      /**
       * Set or get the rounding function used to quantize the selection when brushing is enabled.
       * @example
       * // set x unit round to by month, this will make sure range selection brush will
       * // select whole months
       * chart.round(d3.timeMonth.round);
       * @param {Function} [round]
       * @returns {Function|CoordinateGridMixin}
       */
      round (round) {
          if (!arguments.length) {
              return this._round;
          }
          this._round = round;
          return this;
      }

      _rangeBandPadding (_) {
          if (!arguments.length) {
              return this._fRangeBandPadding;
          }
          this._fRangeBandPadding = _;
          return this;
      }

      _outerRangeBandPadding (_) {
          if (!arguments.length) {
              return this._fOuterRangeBandPadding;
          }
          this._fOuterRangeBandPadding = _;
          return this;
      }

      filter (_) {
          if (!arguments.length) {
              return super.filter();
          }

          super.filter(_);

          this.redrawBrush(_, false);

          return this;
      }

      /**
       * Get or set the brush. Brush must be an instance of d3 brushes
       * https://github.com/d3/d3-brush/blob/master/README.md
       * You will use this only if you are writing a new chart type that supports brushing.
       *
       * **Caution**: dc creates and manages brushes internally. Go through and understand the source code
       * if you want to pass a new brush object. Even if you are only using the getter,
       * the brush object may not behave the way you expect.
       *
       * @param {d3.brush} [_]
       * @returns {d3.brush|CoordinateGridMixin}
       */
      brush (_) {
          if (!arguments.length) {
              return this._brush;
          }
          this._brush = _;
          return this;
      }

      renderBrush (g, doTransition) {
          if (this._brushOn) {
              this._brush.on('start brush end', () => this._brushing());

              // To retrieve selection we need self._gBrush
              this._gBrush = g.append('g')
                  .attr('class', 'brush')
                  .attr('transform', 'translate(' + this.margins().left + ',' + this.margins().top + ')');

              this.setBrushExtents();

              this.createBrushHandlePaths(this._gBrush, doTransition);

              this.redrawBrush(this.filter(), doTransition);
          }
      }

      createBrushHandlePaths (gBrush) {
          let brushHandles = gBrush.selectAll('path.' + CUSTOM_BRUSH_HANDLE_CLASS).data([{type: 'w'}, {type: 'e'}]);

          brushHandles = brushHandles
              .enter()
              .append('path')
              .attr('class', CUSTOM_BRUSH_HANDLE_CLASS)
              .merge(brushHandles);

          brushHandles
              .attr('d', d => this.resizeHandlePath(d));
      }

      extendBrush (brushSelection) {
          if (brushSelection && this.round()) {
              brushSelection[0] = this.round()(brushSelection[0]);
              brushSelection[1] = this.round()(brushSelection[1]);
          }
          return brushSelection;
      }

      brushIsEmpty (brushSelection) {
          return !brushSelection || brushSelection[1] <= brushSelection[0];
      }

      _brushing () {
          // Avoids infinite recursion (mutual recursion between range and focus operations)
          // Source Event will be null when brush.move is called programmatically (see below as well).
          if (!event.sourceEvent) {
              return;
          }

          // Ignore event if recursive event - i.e. not directly generated by user action (like mouse/touch etc.)
          // In this case we are more worried about this handler causing brush move programmatically which will
          // cause this handler to be invoked again with a new d3.event (and current event set as sourceEvent)
          // This check avoids recursive calls
          if (event.sourceEvent.type && ['start', 'brush', 'end'].indexOf(event.sourceEvent.type) !== -1) {
              return;
          }

          let brushSelection = event.selection;
          if (brushSelection) {
              brushSelection = brushSelection.map(this.x().invert);
          }

          brushSelection = this.extendBrush(brushSelection);

          this.redrawBrush(brushSelection, false);

          const rangedFilter = this.brushIsEmpty(brushSelection) ? null : filters.RangedFilter(brushSelection[0], brushSelection[1]);

          events.trigger(() => {
              this.applyBrushSelection(rangedFilter);
          }, constants.EVENT_DELAY);
      }

      // This can be overridden in a derived chart. For example Composite chart overrides it
      applyBrushSelection (rangedFilter) {
          this.replaceFilter(rangedFilter);
          this.redrawGroup();
      }

      setBrushExtents (doTransition) {
          // Set boundaries of the brush, must set it before applying to self._gBrush
          this._brush.extent([[0, 0], [this.effectiveWidth(), this.effectiveHeight()]]);

          this._gBrush
              .call(this._brush);
      }

      redrawBrush (brushSelection, doTransition) {
          if (this._brushOn && this._gBrush) {
              if (this._resizing) {
                  this.setBrushExtents(doTransition);
              }

              if (!brushSelection) {
                  this._gBrush
                      .call(this._brush.move, null);

                  this._gBrush.selectAll('path.' + CUSTOM_BRUSH_HANDLE_CLASS)
                      .attr('display', 'none');
              } else {
                  const scaledSelection = [this._x(brushSelection[0]), this._x(brushSelection[1])];

                  const gBrush =
                      optionalTransition(doTransition, this.transitionDuration(), this.transitionDelay())(this._gBrush);

                  gBrush
                      .call(this._brush.move, scaledSelection);

                  gBrush.selectAll('path.' + CUSTOM_BRUSH_HANDLE_CLASS)
                      .attr('display', null)
                      .attr('transform', (d, i) => 'translate(' + this._x(brushSelection[i]) + ', 0)')
                      .attr('d', d => this.resizeHandlePath(d));
              }
          }
          this.fadeDeselectedArea(brushSelection);
      }

      fadeDeselectedArea (brushSelection) {
          // do nothing, sub-chart should override this function
      }

      // borrowed from Crossfilter example
      resizeHandlePath (d) {
          d = d.type;
          const e = +(d === 'e'), x = e ? 1 : -1, y = this.effectiveHeight() / 3;
          return 'M' + (0.5 * x) + ',' + y +
              'A6,6 0 0 ' + e + ' ' + (6.5 * x) + ',' + (y + 6) +
              'V' + (2 * y - 6) +
              'A6,6 0 0 ' + e + ' ' + (0.5 * x) + ',' + (2 * y) +
              'Z' +
              'M' + (2.5 * x) + ',' + (y + 8) +
              'V' + (2 * y - 8) +
              'M' + (4.5 * x) + ',' + (y + 8) +
              'V' + (2 * y - 8);
      }

      _getClipPathId () {
          return this.anchorName().replace(/[ .#=\[\]"]/g, '-') + '-clip';
      }

      /**
       * Get or set the padding in pixels for the clip path. Once set padding will be applied evenly to
       * the top, left, right, and bottom when the clip path is generated. If set to zero, the clip area
       * will be exactly the chart body area minus the margins.
       * @param {Number} [padding=5]
       * @returns {Number|CoordinateGridMixin}
       */
      clipPadding (padding) {
          if (!arguments.length) {
              return this._clipPadding;
          }
          this._clipPadding = padding;
          return this;
      }

      _generateClipPath () {
          const defs = utils.appendOrSelect(this._parent, 'defs');
          // cannot select <clippath> elements; bug in WebKit, must select by id
          // https://groups.google.com/forum/#!topic/d3-js/6EpAzQ2gU9I
          const id = this._getClipPathId();
          const chartBodyClip = utils.appendOrSelect(defs, '#' + id, 'clipPath').attr('id', id);

          const padding = this._clipPadding * 2;

          utils.appendOrSelect(chartBodyClip, 'rect')
              .attr('width', this.xAxisLength() + padding)
              .attr('height', this.yAxisHeight() + padding)
              .attr('transform', 'translate(-' + this._clipPadding + ', -' + this._clipPadding + ')');
      }

      _preprocessData () {
      }

      _doRender () {
          this.resetSvg();

          this._preprocessData();

          this._generateG();
          this._generateClipPath();

          this._drawChart(true);

          this._configureMouseZoom();

          return this;
      }

      _doRedraw () {
          this._preprocessData();

          this._drawChart(false);
          this._generateClipPath();

          return this;
      }

      _drawChart (render) {
          if (this.isOrdinal()) {
              this._brushOn = false;
          }

          this._prepareXAxis(this.g(), render);
          this._prepareYAxis(this.g());

          this.plotData();

          if (this.elasticX() || this._resizing || render) {
              this.renderXAxis(this.g());
          }

          if (this.elasticY() || this._resizing || render) {
              this.renderYAxis(this.g());
          }

          if (render) {
              this.renderBrush(this.g(), false);
          } else {
              // Animate the brush only while resizing
              this.redrawBrush(this.filter(), this._resizing);
          }
          this.fadeDeselectedArea(this.filter());
          this.resizing(false);
      }

      _configureMouseZoom () {
          // Save a copy of original x scale
          this._origX = this._x.copy();

          if (this._mouseZoomable) {
              this._enableMouseZoom();
          } else if (this._hasBeenMouseZoomable) {
              this._disableMouseZoom();
          }
      }

      _enableMouseZoom () {
          this._hasBeenMouseZoomable = true;

          const extent = [[0, 0], [this.effectiveWidth(), this.effectiveHeight()]];

          this._zoom
              .scaleExtent(this._zoomScale)
              .extent(extent)
              .duration(this.transitionDuration());

          if (this._zoomOutRestrict) {
              // Ensure minimum zoomScale is at least 1
              const zoomScaleMin = Math.max(this._zoomScale[0], 1);
              this._zoom
                  .translateExtent(extent)
                  .scaleExtent([zoomScaleMin, this._zoomScale[1]]);
          }

          this.root().call(this._zoom);

          // Tell D3 zoom our current zoom/pan status
          this._updateD3zoomTransform();
      }

      _disableMouseZoom () {
          this.root().call(this._nullZoom);
      }

      _zoomHandler (newDomain, noRaiseEvents) {
          let domFilter;

          if (this._hasRangeSelected(newDomain)) {
              this.x().domain(newDomain);
              domFilter = filters.RangedFilter(newDomain[0], newDomain[1]);
          } else {
              this.x().domain(this._xOriginalDomain);
              domFilter = null;
          }

          this.replaceFilter(domFilter);
          this.rescale();
          this.redraw();

          if (!noRaiseEvents) {
              if (this._rangeChart && !utils.arraysEqual(this.filter(), this._rangeChart.filter())) {
                  events.trigger(() => {
                      this._rangeChart.replaceFilter(domFilter);
                      this._rangeChart.redraw();
                  });
              }

              this._invokeZoomedListener();
              events.trigger(() => {
                  this.redrawGroup();
              }, constants.EVENT_DELAY);
          }
      }

      // event.transform.rescaleX(self._origX).domain() should give back newDomain
      _domainToZoomTransform (newDomain, origDomain, xScale) {
          const k = (origDomain[1] - origDomain[0]) / (newDomain[1] - newDomain[0]);
          const xt = -1 * xScale(newDomain[0]);

          return identity$5.scale(k).translate(xt, 0);
      }

      // If we changing zoom status (for example by calling focus), tell D3 zoom about it
      _updateD3zoomTransform () {
          if (this._zoom) {
              this._zoom.transform(this.root(), this._domainToZoomTransform(this.x().domain(), this._xOriginalDomain, this._origX));
          }
      }

      _onZoom () {
          // Avoids infinite recursion (mutual recursion between range and focus operations)
          // Source Event will be null when zoom is called programmatically (see below as well).
          if (!event.sourceEvent) {
              return;
          }

          // Ignore event if recursive event - i.e. not directly generated by user action (like mouse/touch etc.)
          // In this case we are more worried about this handler causing zoom programmatically which will
          // cause this handler to be invoked again with a new d3.event (and current event set as sourceEvent)
          // This check avoids recursive calls
          if (event.sourceEvent.type && ['start', 'zoom', 'end'].indexOf(event.sourceEvent.type) !== -1) {
              return;
          }

          const newDomain = event.transform.rescaleX(this._origX).domain();
          this.focus(newDomain, false);
      }

      _checkExtents (ext, outerLimits) {
          if (!ext || ext.length !== 2 || !outerLimits || outerLimits.length !== 2) {
              return ext;
          }

          if (ext[0] > outerLimits[1] || ext[1] < outerLimits[0]) {
              console.warn('Could not intersect extents, will reset');
          }
          // Math.max does not work (as the values may be dates as well)
          return [ext[0] > outerLimits[0] ? ext[0] : outerLimits[0], ext[1] < outerLimits[1] ? ext[1] : outerLimits[1]];
      }

      /**
       * Zoom this chart to focus on the given range. The given range should be an array containing only
       * 2 elements (`[start, end]`) defining a range in the x domain. If the range is not given or set
       * to null, then the zoom will be reset. _For focus to work elasticX has to be turned off;
       * otherwise focus will be ignored.
       *
       * To avoid ping-pong volley of events between a pair of range and focus charts please set
       * `noRaiseEvents` to `true`. In that case it will update this chart but will not fire `zoom` event
       * and not try to update back the associated range chart.
       * If you are calling it manually - typically you will leave it to `false` (the default).
       *
       * @example
       * chart.on('renderlet', function(chart) {
       *     // smooth the rendering through event throttling
       *     events.trigger(function(){
       *          // focus some other chart to the range selected by user on this chart
       *          someOtherChart.focus(chart.filter());
       *     });
       * })
       * @param {Array<Number>} [range]
       * @param {Boolean} [noRaiseEvents = false]
       * @return {undefined}
       */
      focus (range, noRaiseEvents) {
          if (this._zoomOutRestrict) {
              // ensure range is within self._xOriginalDomain
              range = this._checkExtents(range, this._xOriginalDomain);

              // If it has an associated range chart ensure range is within domain of that rangeChart
              if (this._rangeChart) {
                  range = this._checkExtents(range, this._rangeChart.x().domain());
              }
          }

          this._zoomHandler(range, noRaiseEvents);
          this._updateD3zoomTransform();
      }

      refocused () {
          return !utils.arraysEqual(this.x().domain(), this._xOriginalDomain);
      }

      focusChart (c) {
          if (!arguments.length) {
              return this._focusChart;
          }
          this._focusChart = c;
          this.on('filtered.dcjs-range-chart', chart => {
              if (!chart.filter()) {
                  events.trigger(() => {
                      this._focusChart.x().domain(this._focusChart.xOriginalDomain(), true);
                  });
              } else if (!utils.arraysEqual(chart.filter(), this._focusChart.filter())) {
                  events.trigger(() => {
                      this._focusChart.focus(chart.filter(), true);
                  });
              }
          });
          return this;
      }

      /**
       * Turn on/off the brush-based range filter. When brushing is on then user can drag the mouse
       * across a chart with a quantitative scale to perform range filtering based on the extent of the
       * brush, or click on the bars of an ordinal bar chart or slices of a pie chart to filter and
       * un-filter them. However turning on the brush filter will disable other interactive elements on
       * the chart such as highlighting, tool tips, and reference lines. Zooming will still be possible
       * if enabled, but only via scrolling (panning will be disabled.)
       * @param {Boolean} [brushOn=true]
       * @returns {Boolean|CoordinateGridMixin}
       */
      brushOn (brushOn) {
          if (!arguments.length) {
              return this._brushOn;
          }
          this._brushOn = brushOn;
          return this;
      }

      /**
       * This will be internally used by composite chart onto children. Please go not invoke directly.
       *
       * @protected
       * @param {Boolean} [brushOn=false]
       * @returns {Boolean|CoordinateGridMixin}
       */
      parentBrushOn (brushOn) {
          if (!arguments.length) {
              return this._parentBrushOn;
          }
          this._parentBrushOn = brushOn;
          return this;
      }

      // Get the SVG rendered brush
      gBrush () {
          return this._gBrush;
      }

      _hasRangeSelected (range) {
          return range instanceof Array && range.length > 1;
      }
  }

  /**
   * Cap is a mixin that groups small data elements below a _cap_ into an *others* grouping for both the
   * Row and Pie Charts.
   *
   * The top ordered elements in the group up to the cap amount will be kept in the chart, and the rest
   * will be replaced with an *others* element, with value equal to the sum of the replaced values. The
   * keys of the elements below the cap limit are recorded in order to filter by those keys when the
   * others* element is clicked.
   * @mixin CapMixin
   * @param {Object} Base
   * @returns {CapMixin}
   */
  const CapMixin = Base => {
      return class extends Base {
          constructor () {
              super();

              this._cap = Infinity;
              this._takeFront = true;
              this._othersLabel = 'Others';

              // emulate old group.top(N) ordering
              this.ordering(kv => -kv.value);

              // return N "top" groups, where N is the cap, sorted by baseMixin.ordering
              // whether top means front or back depends on takeFront
              this.data(group => {
                  if (this._cap === Infinity) {
                      return this._computeOrderedGroups(group.all());
                  } else {
                      let items = group.all(), rest;
                      items = this._computeOrderedGroups(items); // sort by baseMixin.ordering

                      if (this._cap) {
                          if (this._takeFront) {
                              rest = items.slice(this._cap);
                              items = items.slice(0, this._cap);
                          } else {
                              const start = Math.max(0, items.length - this._cap);
                              rest = items.slice(0, start);
                              items = items.slice(start);
                          }
                      }

                      if (this._othersGrouper) {
                          return this._othersGrouper(items, rest);
                      }
                      return items;
                  }
              });
          }

          cappedKeyAccessor (d, i) {
              if (d.others) {
                  return d.key;
              }
              return this.keyAccessor()(d, i);
          }

          cappedValueAccessor (d, i) {
              if (d.others) {
                  return d.value;
              }
              return this.valueAccessor()(d, i);
          }

          _othersGrouper (topItems, restItems) {
              const restItemsSum = sum(restItems, this.valueAccessor()),
                  restKeys = restItems.map(this.keyAccessor());
              if (restItemsSum > 0) {
                  return topItems.concat([{
                      others: restKeys,
                      key: this.othersLabel(),
                      value: restItemsSum
                  }]);
              }
              return topItems;
          }

          /**
           * Get or set the count of elements to that will be included in the cap. If there is an
           * {@link CapMixin#othersGrouper othersGrouper}, any further elements will be combined in an
           * extra element with its name determined by {@link CapMixin#othersLabel othersLabel}.
           *
           * As of dc.js 2.1 and onward, the capped charts use
           * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group_all group.all()}
           * and {@link BaseMixin#ordering BaseMixin.ordering()} to determine the order of
           * elements. Then `cap` and {@link CapMixin#takeFront takeFront} determine how many elements
           * to keep, from which end of the resulting array.
           *
           * **Migration note:** Up through dc.js 2.0.*, capping used
           * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group_top group.top(N)},
           * which selects the largest items according to
           * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group_order group.order()}.
           * The chart then sorted the items according to {@link BaseMixin#ordering baseMixin.ordering()}.
           * So the two values essentially had to agree, but if the `group.order()` was incorrect (it's
           * easy to forget about), the wrong rows or slices would be displayed, in the correct order.
           *
           * If your chart previously relied on `group.order()`, use `chart.ordering()` instead. As of
           * 2.1.5, the ordering defaults to sorting from greatest to least like `group.top(N)` did.
           *
           * If you want to cap by one ordering but sort by another, you can still do this by
           * specifying your own {@link BaseMixin#data `.data()`} callback. For details, see the example
           * {@link https://dc-js.github.io/dc.js/examples/cap-and-sort-differently.html Cap and Sort Differently}.
           * @memberof CapMixin
           * @instance
           * @param {Number} [count=Infinity]
           * @returns {Number|CapMixin}
           */
          cap (count) {
              if (!arguments.length) {
                  return this._cap;
              }
              this._cap = count;
              return this;
          }

          /**
           * Get or set the direction of capping. If set, the chart takes the first
           * {@link CapMixin#cap cap} elements from the sorted array of elements; otherwise
           * it takes the last `cap` elements.
           * @memberof CapMixin
           * @instance
           * @param {Boolean} [takeFront=true]
           * @returns {Boolean|CapMixin}
           */
          takeFront (takeFront) {
              if (!arguments.length) {
                  return this._takeFront;
              }
              this._takeFront = takeFront;
              return this;
          }

          /**
           * Get or set the label for *Others* slice when slices cap is specified.
           * @memberof CapMixin
           * @instance
           * @param {String} [label="Others"]
           * @returns {String|CapMixin}
           */
          othersLabel (label) {
              if (!arguments.length) {
                  return this._othersLabel;
              }
              this._othersLabel = label;
              return this;
          }

          /**
           * Get or set the grouper function that will perform the insertion of data for the *Others* slice
           * if the slices cap is specified. If set to a falsy value, no others will be added.
           *
           * The grouper function takes an array of included ("top") items, and an array of the rest of
           * the items. By default the grouper function computes the sum of the rest.
           * @memberof CapMixin
           * @instance
           * @example
           * // Do not show others
           * chart.othersGrouper(null);
           * // Default others grouper
           * chart.othersGrouper(function (topItems, restItems) {
           *     var restItemsSum = d3.sum(restItems, _chart.valueAccessor()),
           *         restKeys = restItems.map(_chart.keyAccessor());
           *     if (restItemsSum > 0) {
           *         return topItems.concat([{
           *             others: restKeys,
           *             key: _chart.othersLabel(),
           *             value: restItemsSum
           *         }]);
           *     }
           *     return topItems;
           * });
           * @param {Function} [grouperFunction]
           * @returns {Function|CapMixin}
           */
          othersGrouper (grouperFunction) {
              if (!arguments.length) {
                  return this._othersGrouper;
              }
              this._othersGrouper = grouperFunction;
              return this;
          }

          onClick (d) {
              if (d.others) {
                  this.filter([d.others]);
              }
              super.onClick(d);
          }
      }
  };

  const LABEL_GAP = 2;

  /**
   * Legend is a attachable widget that can be added to other dc charts to render horizontal legend
   * labels.
   *
   * Examples:
   * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
   * - {@link http://dc-js.github.com/dc.js/crime/index.html Canadian City Crime Stats}
   * @example
   * chart.legend(new Legend().x(400).y(10).itemHeight(13).gap(5))
   * @returns {Legend}
   */
  class Legend {
      constructor () {
          this._parent = undefined;
          this._x = 0;
          this._y = 0;
          this._itemHeight = 12;
          this._gap = 5;
          this._horizontal = false;
          this._legendWidth = 560;
          this._itemWidth = 70;
          this._autoItemWidth = false;
          this._legendText = pluck('name');
          this._maxItems = undefined;

          this._g = undefined;
      }

      parent (p) {
          if (!arguments.length) {
              return this._parent;
          }
          this._parent = p;
          return this;
      }

      /**
       * Set or get x coordinate for legend widget.
       * @param  {Number} [x=0]
       * @returns {Number|Legend}
       */
      x (x) {
          if (!arguments.length) {
              return this._x;
          }
          this._x = x;
          return this;
      }

      /**
       * Set or get y coordinate for legend widget.
       * @param  {Number} [y=0]
       * @returns {Number|Legend}
       */
      y (y) {
          if (!arguments.length) {
              return this._y;
          }
          this._y = y;
          return this;
      }

      /**
       * Set or get gap between legend items.
       * @param  {Number} [gap=5]
       * @returns {Number|Legend}
       */
      gap (gap) {
          if (!arguments.length) {
              return this._gap;
          }
          this._gap = gap;
          return this;
      }

      /**
       * Set or get legend item height.
       * @param  {Number} [itemHeight=12]
       * @returns {Number|Legend}
       */
      itemHeight (itemHeight) {
          if (!arguments.length) {
              return this._itemHeight;
          }
          this._itemHeight = itemHeight;
          return this;
      }

      /**
       * Position legend horizontally instead of vertically.
       * @param  {Boolean} [horizontal=false]
       * @returns {Boolean|Legend}
       */
      horizontal (horizontal) {
          if (!arguments.length) {
              return this._horizontal;
          }
          this._horizontal = horizontal;
          return this;
      }

      /**
       * Maximum width for horizontal legend.
       * @param  {Number} [legendWidth=500]
       * @returns {Number|Legend}
       */
      legendWidth (legendWidth) {
          if (!arguments.length) {
              return this._legendWidth;
          }
          this._legendWidth = legendWidth;
          return this;
      }

      /**
       * Legend item width for horizontal legend.
       * @param  {Number} [itemWidth=70]
       * @returns {Number|Legend}
       */
      itemWidth (itemWidth) {
          if (!arguments.length) {
              return this._itemWidth;
          }
          this._itemWidth = itemWidth;
          return this;
      }

      /**
       * Turn automatic width for legend items on or off. If true, {@link Legend#itemWidth itemWidth} is ignored.
       * This setting takes into account the {@link Legend#gap gap}.
       * @param  {Boolean} [autoItemWidth=false]
       * @returns {Boolean|Legend}
       */
      autoItemWidth (autoItemWidth) {
          if (!arguments.length) {
              return this._autoItemWidth;
          }
          this._autoItemWidth = autoItemWidth;
          return this;
      }

      /**
       * Set or get the legend text function. The legend widget uses this function to render the legend
       * text for each item. If no function is specified the legend widget will display the names
       * associated with each group.
       * @param  {Function} [legendText]
       * @returns {Function|Legend}
       * @example
       * // default legendText
       * legend.legendText(pluck('name'))
       *
       * // create numbered legend items
       * chart.legend(new Legend().legendText(function(d, i) { return i + '. ' + d.name; }))
       *
       * // create legend displaying group counts
       * chart.legend(new Legend().legendText(function(d) { return d.name + ': ' d.data; }))
       */
      legendText (legendText) {
          if (!arguments.length) {
              return this._legendText;
          }
          this._legendText = legendText;
          return this;
      }

      /**
       * Maximum number of legend items to display
       * @param  {Number} [maxItems]
       * @return {Legend}
       */
      maxItems (maxItems) {
          if (!arguments.length) {
              return this._maxItems;
          }
          this._maxItems = utils.isNumber(maxItems) ? maxItems : undefined;
          return this;
      }

      // Implementation methods

      _legendItemHeight () {
          return this._gap + this._itemHeight;
      }

      render () {
          this._parent.svg().select('g.dc-legend').remove();
          this._g = this._parent.svg().append('g')
              .attr('class', 'dc-legend')
              .attr('transform', 'translate(' + this._x + ',' + this._y + ')');
          let legendables = this._parent.legendables();

          if (this._maxItems !== undefined) {
              legendables = legendables.slice(0, this._maxItems);
          }

          const itemEnter = this._g.selectAll('g.dc-legend-item')
              .data(legendables)
              .enter()
              .append('g')
              .attr('class', 'dc-legend-item')
              .on('mouseover', d => {
                  this._parent.legendHighlight(d);
              })
              .on('mouseout', d => {
                  this._parent.legendReset(d);
              })
              .on('click', d => {
                  d.chart.legendToggle(d);
              });

          this._g.selectAll('g.dc-legend-item')
              .classed('fadeout', d => d.chart.isLegendableHidden(d));

          if (legendables.some(pluck('dashstyle'))) {
              itemEnter
                  .append('line')
                  .attr('x1', 0)
                  .attr('y1', this._itemHeight / 2)
                  .attr('x2', this._itemHeight)
                  .attr('y2', this._itemHeight / 2)
                  .attr('stroke-width', 2)
                  .attr('stroke-dasharray', pluck('dashstyle'))
                  .attr('stroke', pluck('color'));
          } else {
              itemEnter
                  .append('rect')
                  .attr('width', this._itemHeight)
                  .attr('height', this._itemHeight)
                  .attr('fill', d => d ? d.color : 'blue');
          }

          {
              const self = this;

              itemEnter.append('text')
                  .text(self._legendText)
                  .attr('x', self._itemHeight + LABEL_GAP)
                  .attr('y', function () {
                      return self._itemHeight / 2 + (this.clientHeight ? this.clientHeight : 13) / 2 - 2;
                  });
          }

          let cumulativeLegendTextWidth = 0;
          let row = 0;

          {
              const self = this;

              itemEnter.attr('transform', function (d, i) {
                  if (self._horizontal) {
                      const itemWidth = self._autoItemWidth === true ? this.getBBox().width + self._gap : self._itemWidth;
                      if ((cumulativeLegendTextWidth + itemWidth) > self._legendWidth && cumulativeLegendTextWidth > 0) {
                          ++row;
                          cumulativeLegendTextWidth = 0;
                      }
                      const translateBy = 'translate(' + cumulativeLegendTextWidth + ',' + row * self._legendItemHeight() + ')';
                      cumulativeLegendTextWidth += itemWidth;
                      return translateBy;
                  } else {
                      return 'translate(0,' + i * self._legendItemHeight() + ')';
                  }
              });
          }
      }

  }

  /**
   * Stack Mixin is an mixin that provides cross-chart support of stackability using d3.stackD3v3.
   * @mixin StackMixin
   * @mixes CoordinateGridMixin
   */
  class StackMixin extends CoordinateGridMixin {
      constructor () {
          super();

          this._stackLayout = stack();

          this._stack = [];
          this._titles = {};

          this._hidableStacks = false;
          this._evadeDomainFilter = false;

          this.data(() => {
              const layers = this._stack.filter(this._visibility);
              if (!layers.length) {
                  return [];
              }
              layers.forEach((l, i) => this._prepareValues(l, i));
              const v4data = layers[0].values.map((v, i) => {
                  const col = {x: v.x};
                  layers.forEach(layer => {
                      col[layer.name] = layer.values[i].y;
                  });
                  return col;
              });
              const keys = layers.map(layer => layer.name);
              const v4result = this.stackLayout().keys(keys)(v4data);
              v4result.forEach((series, i) => {
                  series.forEach((ys, j) => {
                      layers[i].values[j].y0 = ys[0];
                      layers[i].values[j].y1 = ys[1];
                  });
              });
              return layers;
          });

          this.colorAccessor(function (d) {
              return this.layer || this.name || d.name || d.layer;
          });
      }

      _prepareValues (layer, layerIdx) {
          const valAccessor = layer.accessor || this.valueAccessor();
          layer.name = String(layer.name || layerIdx);
          const allValues = layer.group.all().map((d, i) => ({
              x: this.keyAccessor()(d, i),
              y: layer.hidden ? null : valAccessor(d, i),
              data: d,
              layer: layer.name,
              hidden: layer.hidden
          }));

          layer.domainValues = allValues.filter(l => this._domainFilter()(l));
          layer.values = this.evadeDomainFilter() ? allValues : layer.domainValues;
      }

      _domainFilter () {
          if (!this.x()) {
              return utils.constant(true);
          }
          const xDomain = this.x().domain();
          if (this.isOrdinal()) {
              // TODO #416
              //var domainSet = d3.set(xDomain);
              return () => {
                  return true; //domainSet.has(p.x);
              };
          }
          if (this.elasticX()) {
              return () => true;
          }
          return p => {
              //return true;
              return p.x >= xDomain[0] && p.x <= xDomain[xDomain.length - 1];
          };
      }

      /**
       * Stack a new crossfilter group onto this chart with an optional custom value accessor. All stacks
       * in the same chart will share the same key accessor and therefore the same set of keys.
       *
       * For example, in a stacked bar chart, the bars of each stack will be positioned using the same set
       * of keys on the x axis, while stacked vertically. If name is specified then it will be used to
       * generate the legend label.
       * @see {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group-map-reduce crossfilter.group}
       * @example
       * // stack group using default accessor
       * chart.stack(valueSumGroup)
       * // stack group using custom accessor
       * .stack(avgByDayGroup, function(d){return d.value.avgByDay;});
       * @param {crossfilter.group} group
       * @param {String} [name]
       * @param {Function} [accessor]
       * @returns {Array<{group: crossfilter.group, name: String, accessor: Function}>|StackMixin}
       */
      stack (group, name, accessor) {
          if (!arguments.length) {
              return this._stack;
          }

          if (arguments.length <= 2) {
              accessor = name;
          }

          const layer = {group: group};
          if (typeof name === 'string') {
              layer.name = name;
          }
          if (typeof accessor === 'function') {
              layer.accessor = accessor;
          }
          this._stack.push(layer);

          return this;
      }

      group (g, n, f) {
          if (!arguments.length) {
              return super.group();
          }
          this._stack = [];
          this._titles = {};
          this.stack(g, n);
          if (f) {
              this.valueAccessor(f);
          }
          return super.group(g, n);
      }

      /**
       * Allow named stacks to be hidden or shown by clicking on legend items.
       * This does not affect the behavior of hideStack or showStack.
       * @param {Boolean} [hidableStacks=false]
       * @returns {Boolean|StackMixin}
       */
      hidableStacks (hidableStacks) {
          if (!arguments.length) {
              return this._hidableStacks;
          }
          this._hidableStacks = hidableStacks;
          return this;
      }

      _findLayerByName (n) {
          const i = this._stack.map(pluck('name')).indexOf(n);
          return this._stack[i];
      }

      /**
       * Hide all stacks on the chart with the given name.
       * The chart must be re-rendered for this change to appear.
       * @param {String} stackName
       * @returns {StackMixin}
       */
      hideStack (stackName) {
          const layer = this._findLayerByName(stackName);
          if (layer) {
              layer.hidden = true;
          }
          return this;
      }

      /**
       * Show all stacks on the chart with the given name.
       * The chart must be re-rendered for this change to appear.
       * @param {String} stackName
       * @returns {StackMixin}
       */
      showStack (stackName) {
          const layer = this._findLayerByName(stackName);
          if (layer) {
              layer.hidden = false;
          }
          return this;
      }

      getValueAccessorByIndex (index) {
          return this._stack[index].accessor || this.valueAccessor();
      }

      yAxisMin () {
          const min$1 = min(this._flattenStack(), p => (p.y < 0) ? (p.y + p.y0) : p.y0);
          return utils.subtract(min$1, this.yAxisPadding());
      }

      yAxisMax () {
          const max$1 = max(this._flattenStack(), p => (p.y > 0) ? (p.y + p.y0) : p.y0);
          return utils.add(max$1, this.yAxisPadding());
      }

      _flattenStack () {
          // A round about way to achieve flatMap
          // When target browsers support flatMap, just replace map -> flatMap, no concat needed
          const values = this.data().map(layer => layer.domainValues);
          return [].concat(...values);
      }

      xAxisMin () {
          const min$1 = min(this._flattenStack(), pluck('x'));
          return utils.subtract(min$1, this.xAxisPadding(), this.xAxisPaddingUnit());
      }

      xAxisMax () {
          const max$1 = max(this._flattenStack(), pluck('x'));
          return utils.add(max$1, this.xAxisPadding(), this.xAxisPaddingUnit());
      }

      /**
       * Set or get the title function. Chart class will use this function to render svg title (usually interpreted by
       * browser as tooltips) for each child element in the chart, i.e. a slice in a pie chart or a bubble in a bubble chart.
       * Almost every chart supports title function however in grid coordinate chart you need to turn off brush in order to
       * use title otherwise the brush layer will block tooltip trigger.
       *
       * If the first argument is a stack name, the title function will get or set the title for that stack. If stackName
       * is not provided, the first stack is implied.
       * @example
       * // set a title function on 'first stack'
       * chart.title('first stack', function(d) { return d.key + ': ' + d.value; });
       * // get a title function from 'second stack'
       * var secondTitleFunction = chart.title('second stack');
       * @param {String} [stackName]
       * @param {Function} [titleAccessor]
       * @returns {String|StackMixin}
       */
      title (stackName, titleAccessor) {
          if (!stackName) {
              return super.title();
          }

          if (typeof stackName === 'function') {
              return super.title(stackName);
          }
          if (stackName === this._groupName && typeof titleAccessor === 'function') {
              return super.title(titleAccessor);
          }

          if (typeof titleAccessor !== 'function') {
              return this._titles[stackName] || super.title();
          }

          this._titles[stackName] = titleAccessor;

          return this;
      }

      /**
       * Gets or sets the stack layout algorithm, which computes a baseline for each stack and
       * propagates it to the next.
       * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Stack-Layout.md d3.stackD3v3}
       * @param {Function} [stack=d3.stackD3v3]
       * @returns {Function|StackMixin}
       */
      stackLayout (stack) {
          if (!arguments.length) {
              return this._stackLayout;
          }
          this._stackLayout = stack;
          return this;
      }

      /**
       * Since dc.js 2.0, there has been {@link https://github.com/dc-js/dc.js/issues/949 an issue}
       * where points are filtered to the current domain. While this is a useful optimization, it is
       * incorrectly implemented: the next point outside the domain is required in order to draw lines
       * that are clipped to the bounds, as well as bars that are partly clipped.
       *
       * A fix will be included in dc.js 2.1.x, but a workaround is needed for dc.js 2.0 and until
       * that fix is published, so set this flag to skip any filtering of points.
       *
       * Once the bug is fixed, this flag will have no effect, and it will be deprecated.
       * @param {Boolean} [evadeDomainFilter=false]
       * @returns {Boolean|StackMixin}
       */
      evadeDomainFilter (evadeDomainFilter) {
          if (!arguments.length) {
              return this._evadeDomainFilter;
          }
          this._evadeDomainFilter = evadeDomainFilter;
          return this;
      }

      _visibility (l) {
          return !l.hidden;
      }

      _ordinalXDomain () {
          const flat = this._flattenStack().map(pluck('data'));
          const ordered = this._computeOrderedGroups(flat);
          return ordered.map(this.keyAccessor());
      }

      legendables () {
          return this._stack.map((layer, i) => ({
              chart: this,
              name: layer.name,
              hidden: layer.hidden || false,
              color: this.getColor.call(layer, layer.values, i)
          }));
      }

      isLegendableHidden (d) {
          const layer = this._findLayerByName(d.name);
          return layer ? layer.hidden : false;
      }

      legendToggle (d) {
          if (this._hidableStacks) {
              if (this.isLegendableHidden(d)) {
                  this.showStack(d.name);
              } else {
                  this.hideStack(d.name);
              }
              //_chart.redraw();
              this.renderGroup();
          }
      }
  }

  const MIN_BAR_WIDTH = 1;
  const DEFAULT_GAP_BETWEEN_BARS = 2;
  const LABEL_PADDING = 3;

  /**
   * Concrete bar chart/histogram implementation.
   *
   * Examples:
   * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
   * - {@link http://dc-js.github.com/dc.js/crime/index.html Canadian City Crime Stats}
   * @mixes StackMixin
   */
  class BarChart extends StackMixin {
      /**
       * Create a Bar Chart
       * @example
       * // create a bar chart under #chart-container1 element using the default global chart group
       * var chart1 = new BarChart('#chart-container1');
       * // create a bar chart under #chart-container2 element using chart group A
       * var chart2 = new BarChart('#chart-container2', 'chartGroupA');
       * // create a sub-chart under a composite parent chart
       * var chart3 = new BarChart(compositeChart);
       * @param {String|node|d3.selection|CompositeChart} parent - Any valid
       * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector}
       * specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar
       * chart is a sub-chart in a {@link CompositeChart Composite Chart} then pass in the parent
       * composite chart instance instead.
       * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
       * Interaction with a chart will only trigger events and redraws within the chart's group.
       */
      constructor (parent, chartGroup) {
          super();

          this._gap = DEFAULT_GAP_BETWEEN_BARS;
          this._centerBar = false;
          this._alwaysUseRounding = false;

          this._barWidth = undefined;

          this.label(d => utils.printSingleValue(d.y0 + d.y), false);

          this.anchor(parent, chartGroup);
      }

      /**
       * Get or set the outer padding on an ordinal bar chart. This setting has no effect on non-ordinal charts.
       * Will pad the width by `padding * barWidth` on each side of the chart.
       * @param {Number} [padding=0.5]
       * @returns {Number|BarChart}
       */
      outerPadding (padding) {
          if (!arguments.length) {
              return this._outerRangeBandPadding();
          }
          return this._outerRangeBandPadding(padding);
      }

      rescale () {
          super.rescale();
          this._barWidth = undefined;
          return this;
      }

      render () {
          if (this.round() && this._centerBar && !this._alwaysUseRounding) {
              logger.warn('By default, brush rounding is disabled if bars are centered. ' +
                  'See dc.js bar chart API documentation for details.');
          }

          return super.render();
      }

      plotData () {
          let layers = this.chartBodyG().selectAll('g.stack')
              .data(this.data());

          this._calculateBarWidth();

          layers = layers
              .enter()
              .append('g')
              .attr('class', (d, i) => 'stack ' + '_' + i)
              .merge(layers);

          const last = layers.size() - 1;
          {
              const chart = this;
              layers.each(function (d, i) {
                  const layer = select(this);

                  chart._renderBars(layer, i, d);

                  if (chart.renderLabel() && last === i) {
                      chart._renderLabels(layer, i, d);
                  }
              });
          }
      }

      _barHeight (d) {
          return utils.safeNumber(Math.abs(this.y()(d.y + d.y0) - this.y()(d.y0)));
      }

      _labelXPos (d) {
          let x = this.x()(d.x);
          if (!this._centerBar) {
              x += this._barWidth / 2;
          }
          if (this.isOrdinal() && this._gap !== undefined) {
              x += this._gap / 2;
          }
          return utils.safeNumber(x);
      }

      _labelYPos (d) {
          let y = this.y()(d.y + d.y0);

          if (d.y < 0) {
              y -= this._barHeight(d);
          }

          return utils.safeNumber(y - LABEL_PADDING);
      }

      _renderLabels (layer, layerIndex, d) {
          const labels = layer.selectAll('text.barLabel')
              .data(d.values, pluck('x'));

          const labelsEnterUpdate = labels
              .enter()
              .append('text')
              .attr('class', 'barLabel')
              .attr('text-anchor', 'middle')
              .attr('x', d => this._labelXPos(d))
              .attr('y', d => this._labelYPos(d))
              .merge(labels);

          if (this.isOrdinal()) {
              labelsEnterUpdate.on('click', d => this.onClick(d));
              labelsEnterUpdate.attr('cursor', 'pointer');
          }

          transition$1(labelsEnterUpdate, this.transitionDuration(), this.transitionDelay())
              .attr('x', d => this._labelXPos(d))
              .attr('y', d => this._labelYPos(d))
              .text(d => this.label()(d));

          transition$1(labels.exit(), this.transitionDuration(), this.transitionDelay())
              .attr('height', 0)
              .remove();
      }

      _barXPos (d) {
          let x = this.x()(d.x);
          if (this._centerBar) {
              x -= this._barWidth / 2;
          }
          if (this.isOrdinal() && this._gap !== undefined) {
              x += this._gap / 2;
          }
          return utils.safeNumber(x);
      }

      _renderBars (layer, layerIndex, d) {
          const bars = layer.selectAll('rect.bar')
              .data(d.values, pluck('x'));

          const enter = bars.enter()
              .append('rect')
              .attr('class', 'bar')
              .attr('fill', pluck('data', this.getColor))
              .attr('x', d => this._barXPos(d))
              .attr('y', this.yAxisHeight())
              .attr('height', 0);

          const barsEnterUpdate = enter.merge(bars);

          if (this.renderTitle()) {
              enter.append('title').text(pluck('data', this.title(d.name)));
          }

          if (this.isOrdinal()) {
              barsEnterUpdate.on('click', d => this.onClick(d));
          }

          transition$1(barsEnterUpdate, this.transitionDuration(), this.transitionDelay())
              .attr('x', d => this._barXPos(d))
              .attr('y', d => {
                  let y = this.y()(d.y + d.y0);

                  if (d.y < 0) {
                      y -= this._barHeight(d);
                  }

                  return utils.safeNumber(y);
              })
              .attr('width', this._barWidth)
              .attr('height', d => this._barHeight(d))
              .attr('fill', pluck('data', this.getColor))
              .select('title').text(pluck('data', this.title(d.name)));

          transition$1(bars.exit(), this.transitionDuration(), this.transitionDelay())
              .attr('x', d => this.x()(d.x))
              .attr('width', this._barWidth * 0.9)
              .remove();
      }

      _calculateBarWidth () {
          if (this._barWidth === undefined) {
              const numberOfBars = this.xUnitCount();

              // please can't we always use rangeBands for bar charts?
              if (this.isOrdinal() && this._gap === undefined) {
                  this._barWidth = Math.floor(this.x().bandwidth());
              } else if (this._gap) {
                  this._barWidth = Math.floor((this.xAxisLength() - (numberOfBars - 1) * this._gap) / numberOfBars);
              } else {
                  this._barWidth = Math.floor(this.xAxisLength() / (1 + this.barPadding()) / numberOfBars);
              }

              if (this._barWidth === Infinity || isNaN(this._barWidth) || this._barWidth < MIN_BAR_WIDTH) {
                  this._barWidth = MIN_BAR_WIDTH;
              }
          }
      }

      fadeDeselectedArea (brushSelection) {
          const bars = this.chartBodyG().selectAll('rect.bar');

          if (this.isOrdinal()) {
              if (this.hasFilter()) {
                  bars.classed(constants.SELECTED_CLASS, d => this.hasFilter(d.x));
                  bars.classed(constants.DESELECTED_CLASS, d => !this.hasFilter(d.x));
              } else {
                  bars.classed(constants.SELECTED_CLASS, false);
                  bars.classed(constants.DESELECTED_CLASS, false);
              }
          } else if (this.brushOn() || this.parentBrushOn()) {
              if (!this.brushIsEmpty(brushSelection)) {
                  const start = brushSelection[0];
                  const end = brushSelection[1];

                  bars.classed(constants.DESELECTED_CLASS, d => d.x < start || d.x >= end);
              } else {
                  bars.classed(constants.DESELECTED_CLASS, false);
              }
          }
      }

      /**
       * Whether the bar chart will render each bar centered around the data position on the x-axis.
       * @param {Boolean} [centerBar=false]
       * @returns {Boolean|BarChart}
       */
      centerBar (centerBar) {
          if (!arguments.length) {
              return this._centerBar;
          }
          this._centerBar = centerBar;
          return this;
      }

      onClick (d) {
          super.onClick(d.data);
      }

      /**
       * Get or set the spacing between bars as a fraction of bar size. Valid values are between 0-1.
       * Setting this value will also remove any previously set {@link BarChart#gap gap}. See the
       * {@link https://github.com/d3/d3-scale/blob/master/README.md#scaleBand d3 docs}
       * for a visual description of how the padding is applied.
       * @param {Number} [barPadding=0]
       * @returns {Number|BarChart}
       */
      barPadding (barPadding) {
          if (!arguments.length) {
              return this._rangeBandPadding();
          }
          this._rangeBandPadding(barPadding);
          this._gap = undefined;
          return this;
      }

      _useOuterPadding () {
          return this._gap === undefined;
      }

      /**
       * Manually set fixed gap (in px) between bars instead of relying on the default auto-generated
       * gap.  By default the bar chart implementation will calculate and set the gap automatically
       * based on the number of data points and the length of the x axis.
       * @param {Number} [gap=2]
       * @returns {Number|BarChart}
       */
      gap (gap) {
          if (!arguments.length) {
              return this._gap;
          }
          this._gap = gap;
          return this;
      }

      extendBrush (brushSelection) {
          if (brushSelection && this.round() && (!this._centerBar || this._alwaysUseRounding)) {
              brushSelection[0] = this.round()(brushSelection[0]);
              brushSelection[1] = this.round()(brushSelection[1]);
          }
          return brushSelection;
      }

      /**
       * Set or get whether rounding is enabled when bars are centered. If false, using
       * rounding with centered bars will result in a warning and rounding will be ignored.  This flag
       * has no effect if bars are not {@link BarChart#centerBar centered}.
       * When using standard d3.js rounding methods, the brush often doesn't align correctly with
       * centered bars since the bars are offset.  The rounding function must add an offset to
       * compensate, such as in the following example.
       * @example
       * chart.round(function(n) { return Math.floor(n) + 0.5; });
       * @param {Boolean} [alwaysUseRounding=false]
       * @returns {Boolean|BarChart}
       */
      alwaysUseRounding (alwaysUseRounding) {
          if (!arguments.length) {
              return this._alwaysUseRounding;
          }
          this._alwaysUseRounding = alwaysUseRounding;
          return this;
      }

      legendHighlight (d) {
          const colorFilter = (color, inv) => function () {
              const item = select(this);
              const match = item.attr('fill') === color;
              return inv ? !match : match;
          };

          if (!this.isLegendableHidden(d)) {
              this.g().selectAll('rect.bar')
                  .classed('highlight', colorFilter(d.color))
                  .classed('fadeout', colorFilter(d.color, true));
          }
      }

      legendReset () {
          this.g().selectAll('rect.bar')
              .classed('highlight', false)
              .classed('fadeout', false);
      }

      xAxisMax () {
          let max = super.xAxisMax();
          if ('resolution' in this.xUnits()) {
              const res = this.xUnits().resolution;
              max += res;
          }
          return max;
      }
  }

  /**
   * A concrete implementation of a general purpose bubble chart that allows data visualization using the
   * following dimensions:
   * - x axis position
   * - y axis position
   * - bubble radius
   * - color
   *
   * Examples:
   * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
   * - {@link http://dc-js.github.com/dc.js/vc/index.html US Venture Capital Landscape 2011}
   * @mixes BubbleMixin
   * @mixes CoordinateGridMixin
   */
  class BubbleChart extends BubbleMixin(CoordinateGridMixin) {
      /**
       * Create a Bubble Chart.
       *
       * @example
       * // create a bubble chart under #chart-container1 element using the default global chart group
       * var bubbleChart1 = new BubbleChart('#chart-container1');
       * // create a bubble chart under #chart-container2 element using chart group A
       * var bubbleChart2 = new BubbleChart('#chart-container2', 'chartGroupA');
       * @param {String|node|d3.selection} parent - Any valid
       * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
       * a dom block element such as a div; or a dom element or d3 selection.
       * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
       * Interaction with a chart will only trigger events and redraws within the chart's group.
       */
      constructor (parent, chartGroup) {
          super();

          this.transitionDuration(750);

          this.transitionDelay(0);

          this.anchor(parent, chartGroup);
      }

      _bubbleLocator (d) {
          return 'translate(' + (this._bubbleX(d)) + ',' + (this._bubbleY(d)) + ')';
      }

      plotData () {
          this.calculateRadiusDomain();
          this.r().range([this.MIN_RADIUS, this.xAxisLength() * this.maxBubbleRelativeSize()]);

          const data = this.data();
          let bubbleG = this.chartBodyG().selectAll('g.' + this.BUBBLE_NODE_CLASS)
              .data(data, d => d.key);
          if (this.sortBubbleSize()) {
              // update dom order based on sort
              bubbleG.order();
          }

          this._removeNodes(bubbleG);

          bubbleG = this._renderNodes(bubbleG);

          this._updateNodes(bubbleG);

          this.fadeDeselectedArea(this.filter());
      }

      _renderNodes (bubbleG) {
          const bubbleGEnter = bubbleG.enter().append('g');

          bubbleGEnter
              .attr('class', this.BUBBLE_NODE_CLASS)
              .attr('transform', (d) => this._bubbleLocator(d))
              .append('circle').attr('class', (d, i) => this.BUBBLE_CLASS + ' _' + i)
              .on('click', d => this.onClick(d))
              .attr('fill', this.getColor)
              .attr('r', 0);

          bubbleG = bubbleGEnter.merge(bubbleG);

          transition$1(bubbleG, this.transitionDuration(), this.transitionDelay())
              .select('circle.' + this.BUBBLE_CLASS)
              .attr('r', d => this.bubbleR(d))
              .attr('opacity', d => (this.bubbleR(d) > 0) ? 1 : 0);

          this._doRenderLabel(bubbleGEnter);

          this._doRenderTitles(bubbleGEnter);

          return bubbleG;
      }

      _updateNodes (bubbleG) {
          transition$1(bubbleG, this.transitionDuration(), this.transitionDelay())
              .attr('transform', (d) => this._bubbleLocator(d))
              .select('circle.' + this.BUBBLE_CLASS)
              .attr('fill', this.getColor)
              .attr('r', d => this.bubbleR(d))
              .attr('opacity', d => (this.bubbleR(d) > 0) ? 1 : 0);

          this.doUpdateLabels(bubbleG);
          this.doUpdateTitles(bubbleG);
      }

      _removeNodes (bubbleG) {
          bubbleG.exit().remove();
      }

      _bubbleX (d) {
          let x = this.x()(this.keyAccessor()(d));
          if (isNaN(x) || !isFinite(x)) {
              x = 0;
          }
          return x;
      }

      _bubbleY (d) {
          let y = this.y()(this.valueAccessor()(d));
          if (isNaN(y) || !isFinite(y)) {
              y = 0;
          }
          return y;
      }

      renderBrush () {
          // override default x axis brush from parent chart
      }

      redrawBrush (brushSelection, doTransition) {
          // override default x axis brush from parent chart
          this.fadeDeselectedArea(brushSelection);
      }
  }

  /**
   * The data count widget is a simple widget designed to display the number of records selected by the
   * current filters out of the total number of records in the data set. Once created the data count widget
   * will automatically update the text content of child elements with the following classes:
   *
   * * `.total-count` - total number of records
   * * `.filter-count` - number of records matched by the current filters
   *
   * Note: this widget works best for the specific case of showing the number of records out of a
   * total. If you want a more general-purpose numeric display, please use the
   * {@link NumberDisplay} widget instead.
   *
   * Examples:
   * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
   * @mixes BaseMixin
   */
  class DataCount extends BaseMixin {
      /**
       * Create a Data Count widget.
       * @example
       * var ndx = crossfilter(data);
       * var all = ndx.groupAll();
       *
       * new DataCount('.dc-data-count')
       *     .crossfilter(ndx)
       *     .groupAll(all);
       * @param {String|node|d3.selection} parent - Any valid
       * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
       * a dom block element such as a div; or a dom element or d3 selection.
       * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
       * Interaction with a chart will only trigger events and redraws within the chart's group.
       */
      constructor (parent, chartGroup) {
          super();

          this._formatNumber = format(',d');
          this._crossfilter = null;
          this._groupAll = null;
          this._html = {some: '', all: ''};

          this._mandatoryAttributes(['crossfilter', 'groupAll']);

          this.anchor(parent, chartGroup);
      }

      /**
       * Gets or sets an optional object specifying HTML templates to use depending how many items are
       * selected. The text `%total-count` will replaced with the total number of records, and the text
       * `%filter-count` will be replaced with the number of selected records.
       * - all: HTML template to use if all items are selected
       * - some: HTML template to use if not all items are selected
       * @example
       * counter.html({
       *      some: '%filter-count out of %total-count records selected',
       *      all: 'All records selected. Click on charts to apply filters'
       * })
       * @param {{some:String, all: String}} [options]
       * @returns {{some:String, all: String}|DataCount}
       */
      html (options) {
          if (!arguments.length) {
              return this._html;
          }
          if (options.all) {
              this._html.all = options.all;
          }
          if (options.some) {
              this._html.some = options.some;
          }
          return this;
      }

      /**
       * Gets or sets an optional function to format the filter count and total count.
       * @see {@link https://github.com/d3/d3-format/blob/master/README.md#format d3.format}
       * @example
       * counter.formatNumber(d3.format('.2g'))
       * @param {Function} [formatter=d3.format('.2g')]
       * @returns {Function|DataCount}
       */
      formatNumber (formatter) {
          if (!arguments.length) {
              return this._formatNumber;
          }
          this._formatNumber = formatter;
          return this;
      }

      _doRender () {
          const tot = this.crossfilter().size(),
              val = this.groupAll().value();
          const all = this._formatNumber(tot);
          const selected = this._formatNumber(val);

          if ((tot === val) && (this._html.all !== '')) {
              this.root().html(this._html.all.replace('%total-count', all).replace('%filter-count', selected));
          } else if (this._html.some !== '') {
              this.root().html(this._html.some.replace('%total-count', all).replace('%filter-count', selected));
          } else {
              this.selectAll('.total-count').text(all);
              this.selectAll('.filter-count').text(selected);
          }
          return this;
      }

      _doRedraw () {
          return this._doRender();
      }

      crossfilter (cf) {
          if (!arguments.length) {
              return this._crossfilter;
          }
          this._crossfilter = cf;
          return this;
      }

      dimension (cf) {
          logger.warnOnce('consider using dataCount.crossfilter instead of dataCount.dimension for clarity');
          if (!arguments.length) {
              return this.crossfilter();
          }
          return this.crossfilter(cf);
      }

      groupAll (groupAll) {
          if (!arguments.length) {
              return this._groupAll;
          }
          this._groupAll = groupAll;
          return this;
      }

      group (groupAll) {
          logger.warnOnce('consider using dataCount.groupAll instead of dataCount.group for clarity');
          if (!arguments.length) {
              return this.groupAll();
          }
          return this.groupAll(groupAll);
      }
  }

  const LABEL_CSS_CLASS = 'dc-table-label';
  const ROW_CSS_CLASS = 'dc-table-row';
  const COLUMN_CSS_CLASS = 'dc-table-column';
  const SECTION_CSS_CLASS = 'dc-table-section dc-table-group';
  const HEAD_CSS_CLASS = 'dc-table-head';

  /**
   * The data table is a simple widget designed to list crossfilter focused data set (rows being
   * filtered) in a good old tabular fashion.
   *
   * An interesting feature of the data table is that you can pass a crossfilter group to the
   * `dimension`, if you want to show aggregated data instead of raw data rows. This requires no
   * special code as long as you specify the {@link DataTable#order order} as `d3.descending`,
   * since the data table will use `dimension.top()` to fetch the data in that case, and the method is
   * equally supported on the crossfilter group as the crossfilter dimension.
   *
   * If you want to display aggregated data in ascending order, you will need to wrap the group
   * in a [fake dimension](https://github.com/dc-js/dc.js/wiki/FAQ#fake-dimensions) to support the
   * `.bottom()` method. See the example linked below for more details.
   *
   * Note: Formerly the data table (and data grid chart) used the {@link DataTable#group group} attribute as a
   * keying function for {@link https://github.com/d3/d3-collection/blob/master/README.md#nest nesting} the data
   * together in sections.  This was confusing so it has been renamed to `section`, although `group` still works.
   * Examples:
   * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
   * - {@link http://dc-js.github.io/dc.js/examples/table-on-aggregated-data.html dataTable on a crossfilter group}
   * ({@link https://github.com/dc-js/dc.js/blob/develop/web/examples/table-on-aggregated-data.html source})
   *
   * @mixes BaseMixin
   */
  class DataTable extends BaseMixin {
      /**
       * Create a Data Table.
       *
       * @param {String|node|d3.selection} parent - Any valid
       * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
       * a dom block element such as a div; or a dom element or d3 selection.
       * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
       * Interaction with a chart will only trigger events and redraws within the chart's group.
       */
      constructor (parent, chartGroup) {
          super();

          this._size = 25;
          this._columns = [];
          this._sortBy = d => d;
          this._order = ascending;
          this._beginSlice = 0;
          this._endSlice = undefined;
          this._showSections = true;
          this._section = () => ''; // all in one section

          this._mandatoryAttributes(['dimension']);

          this.anchor(parent, chartGroup);
      }

      _doRender () {
          this.selectAll('tbody').remove();

          this._renderRows(this._renderSections());

          return this;
      }

      _doColumnValueFormat (v, d) {
          return (typeof v === 'function') ? v(d) :  // v as function
              (typeof v === 'string') ? d[v] :       // v is field name string
              v.format(d);                           // v is Object, use fn (element 2)
      }

      _doColumnHeaderFormat (d) {
          // if 'function', convert to string representation
          // show a string capitalized
          // if an object then display its label string as-is.
          return (typeof d === 'function') ? this._doColumnHeaderFnToString(d) :
              (typeof d === 'string') ? this._doColumnHeaderCapitalize(d) :
              String(d.label);
      }

      _doColumnHeaderCapitalize (s) {
          // capitalize
          return s.charAt(0).toUpperCase() + s.slice(1);
      }

      _doColumnHeaderFnToString (f) {
          // columnString(f) {
          let s = String(f);
          const i1 = s.indexOf('return ');
          if (i1 >= 0) {
              const i2 = s.lastIndexOf(';');
              if (i2 >= 0) {
                  s = s.substring(i1 + 7, i2);
                  const i3 = s.indexOf('numberFormat');
                  if (i3 >= 0) {
                      s = s.replace('numberFormat', '');
                  }
              }
          }
          return s;
      }

      _renderSections () {
          // The 'original' example uses all 'functions'.
          // If all 'functions' are used, then don't remove/add a header, and leave
          // the html alone. This preserves the functionality of earlier releases.
          // A 2nd option is a string representing a field in the data.
          // A third option is to supply an Object such as an array of 'information', and
          // supply your own _doColumnHeaderFormat and _doColumnValueFormat functions to
          // create what you need.
          let bAllFunctions = true;
          this._columns.forEach(f => {
              bAllFunctions = bAllFunctions & (typeof f === 'function');
          });

          if (!bAllFunctions) {
              // ensure one thead
              let thead = this.selectAll('thead').data([0]);
              thead.exit().remove();
              thead = thead.enter()
                  .append('thead')
                  .merge(thead);

              // with one tr
              let headrow = thead.selectAll('tr').data([0]);
              headrow.exit().remove();
              headrow = headrow.enter()
                  .append('tr')
                  .merge(headrow);

              // with a th for each column
              const headcols = headrow.selectAll('th')
                  .data(this._columns);
              headcols.exit().remove();
              headcols.enter().append('th')
                  .merge(headcols)
                  .attr('class', HEAD_CSS_CLASS)
                  .html(d => (this._doColumnHeaderFormat(d)));
          }

          const sections = this.root().selectAll('tbody')
              .data(this._nestEntries(), d => this.keyAccessor()(d));

          const rowSection = sections
              .enter()
              .append('tbody');

          if (this._showSections === true) {
              rowSection
                  .append('tr')
                  .attr('class', SECTION_CSS_CLASS)
                  .append('td')
                  .attr('class', LABEL_CSS_CLASS)
                  .attr('colspan', this._columns.length)
                  .html(d => this.keyAccessor()(d));
          }

          sections.exit().remove();

          return rowSection;
      }

      _nestEntries () {
          let entries;
          if (this._order === ascending) {
              entries = this.dimension().bottom(this._size);
          } else {
              entries = this.dimension().top(this._size);
          }

          return nest()
              .key(this.section())
              .sortKeys(this._order)
              .entries(entries.sort((a, b) => this._order(this._sortBy(a), this._sortBy(b))).slice(this._beginSlice, this._endSlice));
      }

      _renderRows (sections) {
          const rows = sections.order()
              .selectAll('tr.' + ROW_CSS_CLASS)
              .data(d => d.values);

          const rowEnter = rows.enter()
              .append('tr')
              .attr('class', ROW_CSS_CLASS);

          this._columns.forEach((v, i) => {
              rowEnter.append('td')
                  .attr('class', COLUMN_CSS_CLASS + ' _' + i)
                  .html(d => this._doColumnValueFormat(v, d));
          });

          rows.exit().remove();

          return rows;
      }

      _doRedraw () {
          return this._doRender();
      }

      /**
       * Get or set the section function for the data table. The section function takes a data row and
       * returns the key to specify to {@link https://github.com/d3/d3-collection/blob/master/README.md#nest d3.nest}
       * to split rows into sections. By default there will be only one section with no name.
       *
       * Set {@link DataTable#showSections showSections} to false to hide the section headers
       *
       * @example
       * // section rows by the value of their field
       * chart
       *     .section(function(d) { return d.field; })
       * @param {Function} section Function taking a row of data and returning the nest key.
       * @returns {Function|DataTable}
       */
      section (section) {
          if (!arguments.length) {
              return this._section;
          }
          this._section = section;
          return this;
      }

      /**
       * Backward-compatible synonym for {@link DataTable#section section}.
       *
       * @param {Function} section Function taking a row of data and returning the nest key.
       * @returns {Function|DataTable}
       */
      group (section) {
          logger.warnOnce('consider using dataTable.section instead of dataTable.group for clarity');
          if (!arguments.length) {
              return this.section();
          }
          return this.section(section);
      }

      /**
       * Get or set the table size which determines the number of rows displayed by the widget.
       * @param {Number} [size=25]
       * @returns {Number|DataTable}
       */
      size (size) {
          if (!arguments.length) {
              return this._size;
          }
          this._size = size;
          return this;
      }

      /**
       * Get or set the index of the beginning slice which determines which entries get displayed
       * by the widget. Useful when implementing pagination.
       *
       * Note: the sortBy function will determine how the rows are ordered for pagination purposes.

       * See the {@link http://dc-js.github.io/dc.js/examples/table-pagination.html table pagination example}
       * to see how to implement the pagination user interface using `beginSlice` and `endSlice`.
       * @param {Number} [beginSlice=0]
       * @returns {Number|DataTable}
       */
      beginSlice (beginSlice) {
          if (!arguments.length) {
              return this._beginSlice;
          }
          this._beginSlice = beginSlice;
          return this;
      }

      /**
       * Get or set the index of the end slice which determines which entries get displayed by the
       * widget. Useful when implementing pagination. See {@link DataTable#beginSlice `beginSlice`} for more information.
       * @param {Number|undefined} [endSlice=undefined]
       * @returns {Number|DataTable}
       */
      endSlice (endSlice) {
          if (!arguments.length) {
              return this._endSlice;
          }
          this._endSlice = endSlice;
          return this;
      }

      /**
       * Get or set column functions. The data table widget supports several methods of specifying the
       * columns to display.
       *
       * The original method uses an array of functions to generate dynamic columns. Column functions
       * are simple javascript functions with only one input argument `d` which represents a row in
       * the data set. The return value of these functions will be used to generate the content for
       * each cell. However, this method requires the HTML for the table to have a fixed set of column
       * headers.
       *
       * <pre><code>chart.columns([
       *     function(d) { return d.date; },
       *     function(d) { return d.open; },
       *     function(d) { return d.close; },
       *     function(d) { return numberFormat(d.close - d.open); },
       *     function(d) { return d.volume; }
       * ]);
       * </code></pre>
       *
       * In the second method, you can list the columns to read from the data without specifying it as
       * a function, except where necessary (ie, computed columns).  Note the data element name is
       * capitalized when displayed in the table header. You can also mix in functions as necessary,
       * using the third `{label, format}` form, as shown below.
       *
       * <pre><code>chart.columns([
       *     "date",    // d["date"], ie, a field accessor; capitalized automatically
       *     "open",    // ...
       *     "close",   // ...
       *     {
       *         label: "Change",
       *         format: function (d) {
       *             return numberFormat(d.close - d.open);
       *         }
       *     },
       *     "volume"   // d["volume"], ie, a field accessor; capitalized automatically
       * ]);
       * </code></pre>
       *
       * In the third example, we specify all fields using the `{label, format}` method:
       * <pre><code>chart.columns([
       *     {
       *         label: "Date",
       *         format: function (d) { return d.date; }
       *     },
       *     {
       *         label: "Open",
       *         format: function (d) { return numberFormat(d.open); }
       *     },
       *     {
       *         label: "Close",
       *         format: function (d) { return numberFormat(d.close); }
       *     },
       *     {
       *         label: "Change",
       *         format: function (d) { return numberFormat(d.close - d.open); }
       *     },
       *     {
       *         label: "Volume",
       *         format: function (d) { return d.volume; }
       *     }
       * ]);
       * </code></pre>
       *
       * You may wish to override the dataTable functions `_doColumnHeaderCapitalize` and
       * `_doColumnHeaderFnToString`, which are used internally to translate the column information or
       * function into a displayed header. The first one is used on the "string" column specifier; the
       * second is used to transform a stringified function into something displayable. For the Stock
       * example, the function for Change becomes the table header **d.close - d.open**.
       *
       * Finally, you can even specify a completely different form of column definition. To do this,
       * override `_chart._doColumnHeaderFormat` and `_chart._doColumnValueFormat` Be aware that
       * fields without numberFormat specification will be displayed just as they are stored in the
       * data, unformatted.
       * @param {Array<Function>} [columns=[]]
       * @returns {Array<Function>}|DataTable}
       */
      columns (columns) {
          if (!arguments.length) {
              return this._columns;
          }
          this._columns = columns;
          return this;
      }

      /**
       * Get or set sort-by function. This function works as a value accessor at row level and returns a
       * particular field to be sorted by.
       * @example
       * chart.sortBy(function(d) {
       *     return d.date;
       * });
       * @param {Function} [sortBy=identity function]
       * @returns {Function|DataTable}
       */
      sortBy (sortBy) {
          if (!arguments.length) {
              return this._sortBy;
          }
          this._sortBy = sortBy;
          return this;
      }

      /**
       * Get or set sort order. If the order is `d3.ascending`, the data table will use
       * `dimension().bottom()` to fetch the data; otherwise it will use `dimension().top()`
       * @see {@link https://github.com/d3/d3-array/blob/master/README.md#ascending d3.ascending}
       * @see {@link https://github.com/d3/d3-array/blob/master/README.md#descending d3.descending}
       * @example
       * chart.order(d3.descending);
       * @param {Function} [order=d3.ascending]
       * @returns {Function|DataTable}
       */
      order (order) {
          if (!arguments.length) {
              return this._order;
          }
          this._order = order;
          return this;
      }

      /**
       * Get or set if section header rows will be shown.
       * @example
       * chart
       *     .section([value], [name])
       *     .showSections(true|false);
       * @param {Boolean} [showSections=true]
       * @returns {Boolean|DataTable}
       */
      showSections (showSections) {
          if (!arguments.length) {
              return this._showSections;
          }
          this._showSections = showSections;
          return this;
      }

      /**
       * Backward-compatible synonym for {@link DataTable#showSections showSections}.
       * @param {Boolean} [showSections=true]
       * @returns {Boolean|DataTable}
       */
      showGroups (showSections) {
          logger.warnOnce('consider using dataTable.showSections instead of dataTable.showGroups for clarity');
          if (!arguments.length) {
              return this.showSections();
          }
          return this.showSections(showSections);
      }
  }

  const DEFAULT_DOT_RADIUS = 5;
  const TOOLTIP_G_CLASS = 'dc-tooltip';
  const DOT_CIRCLE_CLASS = 'dot';
  const Y_AXIS_REF_LINE_CLASS = 'yRef';
  const X_AXIS_REF_LINE_CLASS = 'xRef';
  const DEFAULT_DOT_OPACITY = 1e-6;
  const LABEL_PADDING$1 = 3;

  /**
   * Concrete line/area chart implementation.
   *
   * Examples:
   * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
   * - {@link http://dc-js.github.com/dc.js/crime/index.html Canadian City Crime Stats}
   * @mixes StackMixin
   * @mixes CoordinateGridMixin
   */
  class LineChart extends StackMixin {
      /**
       * Create a Line Chart.
       * @example
       * // create a line chart under #chart-container1 element using the default global chart group
       * var chart1 = new LineChart('#chart-container1');
       * // create a line chart under #chart-container2 element using chart group A
       * var chart2 = new LineChart('#chart-container2', 'chartGroupA');
       * // create a sub-chart under a composite parent chart
       * var chart3 = new LineChart(compositeChart);
       * @param {String|node|d3.selection|CompositeChart} parent - Any valid
       * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector}
       * specifying a dom block element such as a div; or a dom element or d3 selection.  If the line
       * chart is a sub-chart in a {@link CompositeChart Composite Chart} then pass in the parent
       * composite chart instance instead.
       * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
       * Interaction with a chart will only trigger events and redraws within the chart's group.
       */
      constructor (parent, chartGroup) {
          super();

          this._renderArea = false;
          this._dotRadius = DEFAULT_DOT_RADIUS;
          this._dataPointRadius = null;
          this._dataPointFillOpacity = DEFAULT_DOT_OPACITY;
          this._dataPointStrokeOpacity = DEFAULT_DOT_OPACITY;
          this._curve = null;
          this._interpolate = null; // d3.curveLinear;  // deprecated in 3.0
          this._tension = null;  // deprecated in 3.0
          this._defined = undefined;
          this._dashStyle = undefined;
          this._xyTipsOn = true;

          this.transitionDuration(500);
          this.transitionDelay(0);
          this._rangeBandPadding(1);

          this.label(d => utils.printSingleValue(d.y0 + d.y), false);

          this.anchor(parent, chartGroup);
      }

      plotData () {
          const chartBody = this.chartBodyG();
          let layersList = chartBody.select('g.stack-list');

          if (layersList.empty()) {
              layersList = chartBody.append('g').attr('class', 'stack-list');
          }

          let layers = layersList.selectAll('g.stack').data(this.data());

          const layersEnter = layers
              .enter()
              .append('g')
              .attr('class', (d, i) => 'stack ' + '_' + i);

          layers = layersEnter.merge(layers);

          this._drawLine(layersEnter, layers);

          this._drawArea(layersEnter, layers);

          this._drawDots(chartBody, layers);

          if (this.renderLabel()) {
              this._drawLabels(layers);
          }
      }

      /**
       * Gets or sets the curve factory to use for lines and areas drawn, allowing e.g. step
       * functions, splines, and cubic interpolation. Typically you would use one of the interpolator functions
       * provided by {@link https://github.com/d3/d3-shape/blob/master/README.md#curves d3 curves}.
       *
       * Replaces the use of {@link LineChart#interpolate} and {@link LineChart#tension}
       * in dc.js < 3.0
       *
       * This is passed to
       * {@link https://github.com/d3/d3-shape/blob/master/README.md#line_curve line.curve} and
       * {@link https://github.com/d3/d3-shape/blob/master/README.md#area_curve area.curve}.
       * @example
       * // default
       * chart
       *     .curve(d3.curveLinear);
       * // Add tension to curves that support it
       * chart
       *     .curve(d3.curveCardinal.tension(0.5));
       * // You can use some specialized variation like
       * // https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline
       * chart
       *     .curve(d3.curveCatmullRom.alpha(0.5));
       * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#line_curve line.curve}
       * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#area_curve area.curve}
       * @param  {d3.curve} [curve=d3.curveLinear]
       * @returns {d3.curve|LineChart}
       */
      curve (curve) {
          if (!arguments.length) {
              return this._curve;
          }
          this._curve = curve;
          return this;
      }

      /**
       * Gets or sets the interpolator to use for lines drawn, by string name, allowing e.g. step
       * functions, splines, and cubic interpolation.
       *
       * Possible values are: 'linear', 'linear-closed', 'step', 'step-before', 'step-after', 'basis',
       * 'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'cardinal-closed', and
       * 'monotone'.
       *
       * This function exists for backward compatibility. Use {@link LineChart#curve}
       * which is generic and provides more options.
       * Value set through `.curve` takes precedence over `.interpolate` and `.tension`.
       * @deprecated since version 3.0 use {@link LineChart#curve} instead
       * @see {@link LineChart#curve}
       * @param  {d3.curve} [interpolate=d3.curveLinear]
       * @returns {d3.curve|LineChart}
       */
      interpolate (interpolate) {
          logger.warnOnce('dc.lineChart.interpolate has been deprecated since version 3.0 use dc.lineChart.curve instead');
          if (!arguments.length) {
              return this._interpolate;
          }
          this._interpolate = interpolate;
          return this;
      }

      /**
       * Gets or sets the tension to use for lines drawn, in the range 0 to 1.
       *
       * Passed to the {@link https://github.com/d3/d3-shape/blob/master/README.md#curves d3 curve function}
       * if it provides a `.tension` function. Example:
       * {@link https://github.com/d3/d3-shape/blob/master/README.md#curveCardinal_tension curveCardinal.tension}.
       *
       * This function exists for backward compatibility. Use {@link LineChart#curve}
       * which is generic and provides more options.
       * Value set through `.curve` takes precedence over `.interpolate` and `.tension`.
       * @deprecated since version 3.0 use {@link LineChart#curve} instead
       * @see {@link LineChart#curve}
       * @param  {Number} [tension=0]
       * @returns {Number|LineChart}
       */
      tension (tension) {
          logger.warnOnce('dc.lineChart.tension has been deprecated since version 3.0 use dc.lineChart.curve instead');
          if (!arguments.length) {
              return this._tension;
          }
          this._tension = tension;
          return this;
      }

      /**
       * Gets or sets a function that will determine discontinuities in the line which should be
       * skipped: the path will be broken into separate subpaths if some points are undefined.
       * This function is passed to
       * {@link https://github.com/d3/d3-shape/blob/master/README.md#line_defined line.defined}
       *
       * Note: crossfilter will sometimes coerce nulls to 0, so you may need to carefully write
       * custom reduce functions to get this to work, depending on your data. See
       * {@link https://github.com/dc-js/dc.js/issues/615#issuecomment-49089248 this GitHub comment}
       * for more details and an example.
       * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#line_defined line.defined}
       * @param  {Function} [defined]
       * @returns {Function|LineChart}
       */
      defined (defined) {
          if (!arguments.length) {
              return this._defined;
          }
          this._defined = defined;
          return this;
      }

      /**
       * Set the line's d3 dashstyle. This value becomes the 'stroke-dasharray' of line. Defaults to empty
       * array (solid line).
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray stroke-dasharray}
       * @example
       * // create a Dash Dot Dot Dot
       * chart.dashStyle([3,1,1,1]);
       * @param  {Array<Number>} [dashStyle=[]]
       * @returns {Array<Number>|LineChart}
       */
      dashStyle (dashStyle) {
          if (!arguments.length) {
              return this._dashStyle;
          }
          this._dashStyle = dashStyle;
          return this;
      }

      /**
       * Get or set render area flag. If the flag is set to true then the chart will render the area
       * beneath each line and the line chart effectively becomes an area chart.
       * @param  {Boolean} [renderArea=false]
       * @returns {Boolean|LineChart}
       */
      renderArea (renderArea) {
          if (!arguments.length) {
              return this._renderArea;
          }
          this._renderArea = renderArea;
          return this;
      }

      _getColor (d, i) {
          return this.getColor.call(d, d.values, i);
      }

      // To keep it backward compatible, this covers multiple cases
      // See https://github.com/dc-js/dc.js/issues/1376
      // It will be removed when interpolate and tension are removed.
      _getCurveFactory () {
          let curve = null;

          // _curve takes precedence
          if (this._curve) {
              return this._curve;
          }

          // Approximate the D3v3 behavior
          if (typeof this._interpolate === 'function') {
              curve = this._interpolate;
          } else {
              // If _interpolate is string
              const mapping = {
                  'linear': curveLinear,
                  'linear-closed': curveLinearClosed,
                  'step': curveStep,
                  'step-before': stepBefore,
                  'step-after': stepAfter,
                  'basis': curveBasis,
                  'basis-open': curveBasisOpen,
                  'basis-closed': curveBasisClosed,
                  'bundle': curveBundle,
                  'cardinal': curveCardinal,
                  'cardinal-open': curveCardinalOpen,
                  'cardinal-closed': curveCardinalClosed,
                  'monotone': monotoneX
              };
              curve = mapping[this._interpolate];
          }

          // Default value
          if (!curve) {
              curve = curveLinear;
          }

          if (this._tension !== null) {
              if (typeof curve.tension !== 'function') {
                  logger.warn('tension was specified but the curve/interpolate does not support it.');
              } else {
                  curve = curve.tension(this._tension);
              }
          }
          return curve;
      }

      _drawLine (layersEnter, layers) {
          const line$1 = line()
              .x(d => this.x()(d.x))
              .y(d => this.y()(d.y + d.y0))
              .curve(this._getCurveFactory());
          if (this._defined) {
              line$1.defined(this._defined);
          }

          const path = layersEnter.append('path')
              .attr('class', 'line')
              .attr('stroke', (d, i) => this._getColor(d, i));
          if (this._dashStyle) {
              path.attr('stroke-dasharray', this._dashStyle);
          }

          transition$1(layers.select('path.line'), this.transitionDuration(), this.transitionDelay())
          //.ease('linear')
              .attr('stroke', (d, i) => this._getColor(d, i))
              .attr('d', d => this._safeD(line$1(d.values)));
      }

      _drawArea (layersEnter, layers) {
          if (this._renderArea) {
              const area$1 = area()
                  .x(d => this.x()(d.x))
                  .y1(d => this.y()(d.y + d.y0))
                  .y0(d => this.y()(d.y0))
                  .curve(this._getCurveFactory());
              if (this._defined) {
                  area$1.defined(this._defined);
              }

              layersEnter.append('path')
                  .attr('class', 'area')
                  .attr('fill', (d, i) => this._getColor(d, i))
                  .attr('d', d => this._safeD(area$1(d.values)));

              transition$1(layers.select('path.area'), this.transitionDuration(), this.transitionDelay())
              //.ease('linear')
                  .attr('fill', (d, i) => this._getColor(d, i))
                  .attr('d', d => this._safeD(area$1(d.values)));
          }
      }

      _safeD (d) {
          return (!d || d.indexOf('NaN') >= 0) ? 'M0,0' : d;
      }

      _drawDots (chartBody, layers) {
          if (this.xyTipsOn() === 'always' || (!(this.brushOn() || this.parentBrushOn()) && this.xyTipsOn())) {
              const tooltipListClass = TOOLTIP_G_CLASS + '-list';
              let tooltips = chartBody.select('g.' + tooltipListClass);

              if (tooltips.empty()) {
                  tooltips = chartBody.append('g').attr('class', tooltipListClass);
              }

              layers.each((d, layerIndex) => {
                  let points = d.values;
                  if (this._defined) {
                      points = points.filter(this._defined);
                  }

                  let g = tooltips.select('g.' + TOOLTIP_G_CLASS + '._' + layerIndex);
                  if (g.empty()) {
                      g = tooltips.append('g').attr('class', TOOLTIP_G_CLASS + ' _' + layerIndex);
                  }

                  this._createRefLines(g);

                  const dots = g.selectAll('circle.' + DOT_CIRCLE_CLASS)
                      .data(points, pluck('x'));

                  const chart = this;
                  const dotsEnterModify = dots
                      .enter()
                      .append('circle')
                      .attr('class', DOT_CIRCLE_CLASS)
                      .attr('cx', d => utils.safeNumber(this.x()(d.x)))
                      .attr('cy', d => utils.safeNumber(this.y()(d.y + d.y0)))
                      .attr('r', this._getDotRadius())
                      .style('fill-opacity', this._dataPointFillOpacity)
                      .style('stroke-opacity', this._dataPointStrokeOpacity)
                      .attr('fill', this.getColor)
                      .attr('stroke', this.getColor)
                      .on('mousemove', function () {
                          const dot = select(this);
                          chart._showDot(dot);
                          chart._showRefLines(dot, g);
                      })
                      .on('mouseout', function () {
                          const dot = select(this);
                          chart._hideDot(dot);
                          chart._hideRefLines(g);
                      })
                      .merge(dots);

                  dotsEnterModify.call(dot => this._doRenderTitle(dot, d));

                  transition$1(dotsEnterModify, this.transitionDuration())
                      .attr('cx', d => utils.safeNumber(this.x()(d.x)))
                      .attr('cy', d => utils.safeNumber(this.y()(d.y + d.y0)))
                      .attr('fill', this.getColor);

                  dots.exit().remove();
              });
          }
      }

      _drawLabels (layers) {
          const chart = this;
          layers.each(function (d, layerIndex) {
              const layer = select(this);
              const labels = layer.selectAll('text.lineLabel')
                  .data(d.values, pluck('x'));

              const labelsEnterModify = labels
                  .enter()
                  .append('text')
                  .attr('class', 'lineLabel')
                  .attr('text-anchor', 'middle')
                  .merge(labels);

              transition$1(labelsEnterModify, chart.transitionDuration())
                  .attr('x', d => utils.safeNumber(chart.x()(d.x)))
                  .attr('y', d => {
                      const y = chart.y()(d.y + d.y0) - LABEL_PADDING$1;
                      return utils.safeNumber(y);
                  })
                  .text(d => chart.label()(d));

              transition$1(labels.exit(), chart.transitionDuration())
                  .attr('height', 0)
                  .remove();
          });
      }

      _createRefLines (g) {
          const yRefLine = g.select('path.' + Y_AXIS_REF_LINE_CLASS).empty() ?
              g.append('path').attr('class', Y_AXIS_REF_LINE_CLASS) : g.select('path.' + Y_AXIS_REF_LINE_CLASS);
          yRefLine.style('display', 'none').attr('stroke-dasharray', '5,5');

          const xRefLine = g.select('path.' + X_AXIS_REF_LINE_CLASS).empty() ?
              g.append('path').attr('class', X_AXIS_REF_LINE_CLASS) : g.select('path.' + X_AXIS_REF_LINE_CLASS);
          xRefLine.style('display', 'none').attr('stroke-dasharray', '5,5');
      }

      _showDot (dot) {
          dot.style('fill-opacity', 0.8);
          dot.style('stroke-opacity', 0.8);
          dot.attr('r', this._dotRadius);
          return dot;
      }

      _showRefLines (dot, g) {
          const x = dot.attr('cx');
          const y = dot.attr('cy');
          const yAxisX = (this._yAxisX() - this.margins().left);
          const yAxisRefPathD = 'M' + yAxisX + ' ' + y + 'L' + (x) + ' ' + (y);
          const xAxisRefPathD = 'M' + x + ' ' + this.yAxisHeight() + 'L' + x + ' ' + y;
          g.select('path.' + Y_AXIS_REF_LINE_CLASS).style('display', '').attr('d', yAxisRefPathD);
          g.select('path.' + X_AXIS_REF_LINE_CLASS).style('display', '').attr('d', xAxisRefPathD);
      }

      _getDotRadius () {
          return this._dataPointRadius || this._dotRadius;
      }

      _hideDot (dot) {
          dot.style('fill-opacity', this._dataPointFillOpacity)
              .style('stroke-opacity', this._dataPointStrokeOpacity)
              .attr('r', this._getDotRadius());
      }

      _hideRefLines (g) {
          g.select('path.' + Y_AXIS_REF_LINE_CLASS).style('display', 'none');
          g.select('path.' + X_AXIS_REF_LINE_CLASS).style('display', 'none');
      }

      _doRenderTitle (dot, d) {
          if (this.renderTitle()) {
              dot.select('title').remove();
              dot.append('title').text(pluck('data', this.title(d.name)));
          }
      }

      /**
       * Turn on/off the mouseover behavior of an individual data point which renders a circle and x/y axis
       * dashed lines back to each respective axis.  This is ignored if the chart
       * {@link CoordinateGridMixin#brushOn brush} is on
       * @param  {Boolean} [xyTipsOn=false]
       * @returns {Boolean|LineChart}
       */
      xyTipsOn (xyTipsOn) {
          if (!arguments.length) {
              return this._xyTipsOn;
          }
          this._xyTipsOn = xyTipsOn;
          return this;
      }

      /**
       * Get or set the radius (in px) for dots displayed on the data points.
       * @param  {Number} [dotRadius=5]
       * @returns {Number|LineChart}
       */
      dotRadius (dotRadius) {
          if (!arguments.length) {
              return this._dotRadius;
          }
          this._dotRadius = dotRadius;
          return this;
      }

      /**
       * Always show individual dots for each datapoint.
       *
       * If `options` is falsy, it disables data point rendering. If no `options` are provided, the
       * current `options` values are instead returned.
       * @example
       * chart.renderDataPoints({radius: 2, fillOpacity: 0.8, strokeOpacity: 0.0})
       * @param  {{fillOpacity: Number, strokeOpacity: Number, radius: Number}} [options={fillOpacity: 0.8, strokeOpacity: 0.0, radius: 2}]
       * @returns {{fillOpacity: Number, strokeOpacity: Number, radius: Number}|LineChart}
       */
      renderDataPoints (options) {
          if (!arguments.length) {
              return {
                  fillOpacity: this._dataPointFillOpacity,
                  strokeOpacity: this._dataPointStrokeOpacity,
                  radius: this._dataPointRadius
              };
          } else if (!options) {
              this._dataPointFillOpacity = DEFAULT_DOT_OPACITY;
              this._dataPointStrokeOpacity = DEFAULT_DOT_OPACITY;
              this._dataPointRadius = null;
          } else {
              this._dataPointFillOpacity = options.fillOpacity || 0.8;
              this._dataPointStrokeOpacity = options.strokeOpacity || 0.0;
              this._dataPointRadius = options.radius || 2;
          }
          return this;
      }

      _colorFilter (color, dashstyle, inv) {
          return function () {
              const item = select(this);
              const match = (item.attr('stroke') === color &&
                  item.attr('stroke-dasharray') === ((dashstyle instanceof Array) ?
                      dashstyle.join(',') : null)) || item.attr('fill') === color;
              return inv ? !match : match;
          };
      }

      legendHighlight (d) {
          if (!this.isLegendableHidden(d)) {
              this.g().selectAll('path.line, path.area')
                  .classed('highlight', this._colorFilter(d.color, d.dashstyle))
                  .classed('fadeout', this._colorFilter(d.color, d.dashstyle, true));
          }
      }

      legendReset () {
          this.g().selectAll('path.line, path.area')
              .classed('highlight', false)
              .classed('fadeout', false);
      }

      legendables () {
          const legendables = super.legendables();
          if (!this._dashStyle) {
              return legendables;
          }
          return legendables.map(l => {
              l.dashstyle = this._dashStyle;
              return l;
          });
      }
  }

  const DEFAULT_MIN_ANGLE_FOR_LABEL = 0.5;

  /**
   * The pie chart implementation is usually used to visualize a small categorical distribution.  The pie
   * chart uses keyAccessor to determine the slices, and valueAccessor to calculate the size of each
   * slice relative to the sum of all values. Slices are ordered by {@link BaseMixin#ordering ordering}
   * which defaults to sorting by key.
   *
   * Examples:
   * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
   * @mixes CapMixin
   * @mixes ColorMixin
   * @mixes BaseMixin
   */
  class PieChart extends CapMixin(ColorMixin(BaseMixin)) {
      /**
       * Create a Pie Chart
       *
       * @example
       * // create a pie chart under #chart-container1 element using the default global chart group
       * var chart1 = new PieChart('#chart-container1');
       * // create a pie chart under #chart-container2 element using chart group A
       * var chart2 = new PieChart('#chart-container2', 'chartGroupA');
       * @param {String|node|d3.selection} parent - Any valid
       * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
       * a dom block element such as a div; or a dom element or d3 selection.
       * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
       * Interaction with a chart will only trigger events and redraws within the chart's group.
       */
      constructor (parent, chartGroup) {
          super();

          this._sliceCssClass = 'pie-slice';
          this._labelCssClass = 'pie-label';
          this._sliceGroupCssClass = 'pie-slice-group';
          this._labelGroupCssClass = 'pie-label-group';
          this._emptyCssClass = 'empty-chart';
          this._emptyTitle = 'empty';

          this._radius = undefined;
          this._givenRadius = undefined; // specified radius, if any
          this._innerRadius = 0;
          this._externalRadiusPadding = 0;


          this._g = undefined;
          this._cx = undefined;
          this._cy = undefined;
          this._minAngleForLabel = DEFAULT_MIN_ANGLE_FOR_LABEL;
          this._externalLabelRadius = undefined;
          this._drawPaths = false;

          this.colorAccessor(d => this.cappedKeyAccessor(d));

          this.title(d => this.cappedKeyAccessor(d) + ': ' + this.cappedValueAccessor(d));

          this.label(d => this.cappedKeyAccessor(d));
          this.renderLabel(true);

          this.transitionDuration(350);
          this.transitionDelay(0);

          this.anchor(parent, chartGroup);
      }

      /**
       * Get or set the maximum number of slices the pie chart will generate. The top slices are determined by
       * value from high to low. Other slices exeeding the cap will be rolled up into one single *Others* slice.
       * @param {Number} [cap]
       * @returns {Number|PieChart}
       */
      slicesCap (cap) {
          return this.cap(cap)
      }

      _doRender () {
          this.resetSvg();

          this._g = this.svg()
              .append('g')
              .attr('transform', 'translate(' + this.cx() + ',' + this.cy() + ')');

          this._g.append('g').attr('class', this._sliceGroupCssClass);
          this._g.append('g').attr('class', this._labelGroupCssClass);

          this._drawChart();

          return this;
      }

      _drawChart () {
          // set radius from chart size if none given, or if given radius is too large
          const maxRadius = min([this.width(), this.height()]) / 2;
          this._radius = this._givenRadius && this._givenRadius < maxRadius ? this._givenRadius : maxRadius;

          const arc = this._buildArcs();

          const pie = this._pieLayout();
          let pieData;
          // if we have data...
          if (sum(this.data(), d => this.cappedValueAccessor(d))) {
              pieData = pie(this.data());
              this._g.classed(this._emptyCssClass, false);
          } else {
              // otherwise we'd be getting NaNs, so override
              // note: abuse others for its ignoring the value accessor
              pieData = pie([{key: this._emptyTitle, value: 1, others: [this._emptyTitle]}]);
              this._g.classed(this._emptyCssClass, true);
          }

          if (this._g) {
              const slices = this._g.select('g.' + this._sliceGroupCssClass)
                  .selectAll('g.' + this._sliceCssClass)
                  .data(pieData);

              const labels = this._g.select('g.' + this._labelGroupCssClass)
                  .selectAll('text.' + this._labelCssClass)
                  .data(pieData);

              this._removeElements(slices, labels);

              this._createElements(slices, labels, arc, pieData);

              this._updateElements(pieData, arc);

              this._highlightFilter();

              transition$1(this._g, this.transitionDuration(), this.transitionDelay())
                  .attr('transform', 'translate(' + this.cx() + ',' + this.cy() + ')');
          }
      }

      _createElements (slices, labels, arc, pieData) {
          const slicesEnter = this._createSliceNodes(slices);

          this._createSlicePath(slicesEnter, arc);

          this._createTitles(slicesEnter);

          this._createLabels(labels, pieData, arc);
      }

      _createSliceNodes (slices) {
          return slices
              .enter()
              .append('g')
              .attr('class', (d, i) => this._sliceCssClass + ' _' + i);
      }

      _createSlicePath (slicesEnter, arc) {
          const slicePath = slicesEnter.append('path')
              .attr('fill', (d, i) => this._fill(d, i))
              .on('click', (d, i) => this._onClick(d, i))
              .attr('d', (d, i) => this._safeArc(d, i, arc));

          const tranNodes = transition$1(slicePath, this.transitionDuration(), this.transitionDelay());
          if (tranNodes.attrTween) {
              const chart = this;
              tranNodes.attrTween('d', function (d) {
                  return chart._tweenPie(d, this);
              });
          }
      }

      _createTitles (slicesEnter) {
          if (this.renderTitle()) {
              slicesEnter.append('title').text(d => this.title()(d.data));
          }
      }

      _applyLabelText (labels) {
          labels
              .text(d => {
                  const data = d.data;
                  if ((this._sliceHasNoData(data) || this._sliceTooSmall(d)) && !this._isSelectedSlice(d)) {
                      return '';
                  }
                  return this.label()(d.data);
              });
      }

      _positionLabels (labels, arc) {
          this._applyLabelText(labels);
          transition$1(labels, this.transitionDuration(), this.transitionDelay())
              .attr('transform', d => this._labelPosition(d, arc))
              .attr('text-anchor', 'middle');
      }

      _highlightSlice (i, whether) {
          this.select('g.pie-slice._' + i)
              .classed('highlight', whether);
      }

      _createLabels (labels, pieData, arc) {
          if (this.renderLabel()) {
              const labelsEnter = labels
                  .enter()
                  .append('text')
                  .attr('class', (d, i) => {
                      let classes = this._sliceCssClass + ' ' + this._labelCssClass + ' _' + i;
                      if (this._externalLabelRadius) {
                          classes += ' external';
                      }
                      return classes;
                  })
                  .on('click', (d, i) => this._onClick(d, i))
                  .on('mouseover', (d, i) => {
                      this._highlightSlice(i, true);
                  })
                  .on('mouseout', (d, i) => {
                      this._highlightSlice(i, false);
                  });
              this._positionLabels(labelsEnter, arc);
              if (this._externalLabelRadius && this._drawPaths) {
                  this._updateLabelPaths(pieData, arc);
              }
          }
      }

      _updateLabelPaths (pieData, arc$1) {
          let polyline = this._g.selectAll('polyline.' + this._sliceCssClass)
              .data(pieData);

          polyline.exit().remove();

          polyline = polyline
              .enter()
              .append('polyline')
              .attr('class', (d, i) => 'pie-path _' + i + ' ' + this._sliceCssClass)
              .on('click', (d, i) => this._onClick(d, i))
              .on('mouseover', (d, i) => {
                  this._highlightSlice(i, true);
              })
              .on('mouseout', (d, i) => {
                  this._highlightSlice(i, false);
              })
              .merge(polyline);

          const arc2 = arc()
              .outerRadius(this._radius - this._externalRadiusPadding + this._externalLabelRadius)
              .innerRadius(this._radius - this._externalRadiusPadding);
          const tranNodes = transition$1(polyline, this.transitionDuration(), this.transitionDelay());
          // this is one rare case where d3.selection differs from d3.transition
          if (tranNodes.attrTween) {
              tranNodes
                  .attrTween('points', function (d) {
                      let current = this._current || d;
                      current = {startAngle: current.startAngle, endAngle: current.endAngle};
                      const interpolate$1 = interpolate(current, d);
                      this._current = interpolate$1(0);
                      return t => {
                          const d2 = interpolate$1(t);
                          return [arc$1.centroid(d2), arc2.centroid(d2)];
                      };
                  });
          } else {
              tranNodes.attr('points', d => [arc$1.centroid(d), arc2.centroid(d)]);
          }
          tranNodes.style('visibility', d => d.endAngle - d.startAngle < 0.0001 ? 'hidden' : 'visible');

      }

      _updateElements (pieData, arc) {
          this._updateSlicePaths(pieData, arc);
          this._updateLabels(pieData, arc);
          this._updateTitles(pieData);
      }

      _updateSlicePaths (pieData, arc) {
          const slicePaths = this._g.selectAll('g.' + this._sliceCssClass)
              .data(pieData)
              .select('path')
              .attr('d', (d, i) => this._safeArc(d, i, arc));
          const tranNodes = transition$1(slicePaths, this.transitionDuration(), this.transitionDelay());
          if (tranNodes.attrTween) {
              const chart = this;
              tranNodes.attrTween('d', function (d) {
                  return chart._tweenPie(d, this);
              });
          }
          tranNodes.attr('fill', (d, i) => this._fill(d, i));
      }

      _updateLabels (pieData, arc) {
          if (this.renderLabel()) {
              const labels = this._g.selectAll('text.' + this._labelCssClass)
                  .data(pieData);
              this._positionLabels(labels, arc);
              if (this._externalLabelRadius && this._drawPaths) {
                  this._updateLabelPaths(pieData, arc);
              }
          }
      }

      _updateTitles (pieData) {
          if (this.renderTitle()) {
              this._g.selectAll('g.' + this._sliceCssClass)
                  .data(pieData)
                  .select('title')
                  .text(d => this.title()(d.data));
          }
      }

      _removeElements (slices, labels) {
          slices.exit().remove();
          labels.exit().remove();
      }

      _highlightFilter () {
          const chart = this;
          if (this.hasFilter()) {
              this.selectAll('g.' + this._sliceCssClass).each(function (d) {
                  if (chart._isSelectedSlice(d)) {
                      chart.highlightSelected(this);
                  } else {
                      chart.fadeDeselected(this);
                  }
              });
          } else {
              this.selectAll('g.' + this._sliceCssClass).each(function () {
                  chart.resetHighlight(this);
              });
          }
      }

      /**
       * Get or set the external radius padding of the pie chart. This will force the radius of the
       * pie chart to become smaller or larger depending on the value.
       * @param {Number} [externalRadiusPadding=0]
       * @returns {Number|PieChart}
       */
      externalRadiusPadding (externalRadiusPadding) {
          if (!arguments.length) {
              return this._externalRadiusPadding;
          }
          this._externalRadiusPadding = externalRadiusPadding;
          return this;
      }

      /**
       * Get or set the inner radius of the pie chart. If the inner radius is greater than 0px then the
       * pie chart will be rendered as a doughnut chart.
       * @param {Number} [innerRadius=0]
       * @returns {Number|PieChart}
       */
      innerRadius (innerRadius) {
          if (!arguments.length) {
              return this._innerRadius;
          }
          this._innerRadius = innerRadius;
          return this;
      }

      /**
       * Get or set the outer radius. If the radius is not set, it will be half of the minimum of the
       * chart width and height.
       * @param {Number} [radius]
       * @returns {Number|PieChart}
       */
      radius (radius) {
          if (!arguments.length) {
              return this._givenRadius;
          }
          this._givenRadius = radius;
          return this;
      }

      /**
       * Get or set center x coordinate position. Default is center of svg.
       * @param {Number} [cx]
       * @returns {Number|PieChart}
       */
      cx (cx) {
          if (!arguments.length) {
              return (this._cx || this.width() / 2);
          }
          this._cx = cx;
          return this;
      }

      /**
       * Get or set center y coordinate position. Default is center of svg.
       * @param {Number} [cy]
       * @returns {Number|PieChart}
       */
      cy (cy) {
          if (!arguments.length) {
              return (this._cy || this.height() / 2);
          }
          this._cy = cy;
          return this;
      }

      _buildArcs () {
          return arc()
              .outerRadius(this._radius - this._externalRadiusPadding)
              .innerRadius(this._innerRadius);
      }

      _isSelectedSlice (d) {
          return this.hasFilter(this.cappedKeyAccessor(d.data));
      }

      _doRedraw () {
          this._drawChart();
          return this;
      }

      /**
       * Get or set the minimal slice angle for label rendering. Any slice with a smaller angle will not
       * display a slice label.
       * @param {Number} [minAngleForLabel=0.5]
       * @returns {Number|PieChart}
       */
      minAngleForLabel (minAngleForLabel) {
          if (!arguments.length) {
              return this._minAngleForLabel;
          }
          this._minAngleForLabel = minAngleForLabel;
          return this;
      }

      _pieLayout () {
          return pie().sort(null).value(d => this.cappedValueAccessor(d));
      }

      _sliceTooSmall (d) {
          const angle = (d.endAngle - d.startAngle);
          return isNaN(angle) || angle < this._minAngleForLabel;
      }

      _sliceHasNoData (d) {
          return this.cappedValueAccessor(d) === 0;
      }

      _isOffCanvas (current) {
          return !current || isNaN(current.startAngle) || isNaN(current.endAngle);
      }

      _fill (d, i) {
          return this.getColor(d.data, i);
      }

      _onClick (d, i) {
          if (this._g.attr('class') !== this._emptyCssClass) {
              this.onClick(d.data, i);
          }
      }

      _safeArc (d, i, arc) {
          let path = arc(d, i);
          if (path.indexOf('NaN') >= 0) {
              path = 'M0,0';
          }
          return path;
      }

      /**
       * Title to use for the only slice when there is no data.
       * @param {String} [title]
       * @returns {String|PieChart}
       */
      emptyTitle (title) {
          if (arguments.length === 0) {
              return this._emptyTitle;
          }
          this._emptyTitle = title;
          return this;
      }

      /**
       * Position slice labels offset from the outer edge of the chart.
       *
       * The argument specifies the extra radius to be added for slice labels.
       * @param {Number} [externalLabelRadius]
       * @returns {Number|PieChart}
       */
      externalLabels (externalLabelRadius) {
          if (arguments.length === 0) {
              return this._externalLabelRadius;
          } else if (externalLabelRadius) {
              this._externalLabelRadius = externalLabelRadius;
          } else {
              this._externalLabelRadius = undefined;
          }

          return this;
      }

      /**
       * Get or set whether to draw lines from pie slices to their labels.
       *
       * @param {Boolean} [drawPaths]
       * @returns {Boolean|PieChart}
       */
      drawPaths (drawPaths) {
          if (arguments.length === 0) {
              return this._drawPaths;
          }
          this._drawPaths = drawPaths;
          return this;
      }

      _labelPosition (d, arc$1) {
          let centroid;
          if (this._externalLabelRadius) {
              centroid = arc()
                  .outerRadius(this._radius - this._externalRadiusPadding + this._externalLabelRadius)
                  .innerRadius(this._radius - this._externalRadiusPadding + this._externalLabelRadius)
                  .centroid(d);
          } else {
              centroid = arc$1.centroid(d);
          }
          if (isNaN(centroid[0]) || isNaN(centroid[1])) {
              return 'translate(0,0)';
          } else {
              return 'translate(' + centroid + ')';
          }
      }

      legendables () {
          return this.data().map((d, i) => {
              const legendable = {name: d.key, data: d.value, others: d.others, chart: this};
              legendable.color = this.getColor(d, i);
              return legendable;
          });
      }

      legendHighlight (d) {
          this._highlightSliceFromLegendable(d, true);
      }

      legendReset (d) {
          this._highlightSliceFromLegendable(d, false);
      }

      legendToggle (d) {
          this.onClick({key: d.name, others: d.others});
      }

      _highlightSliceFromLegendable (legendable, highlighted) {
          this.selectAll('g.pie-slice').each(function (d) {
              if (legendable.name === d.data.key) {
                  select(this).classed('highlight', highlighted);
              }
          });
      }

      _tweenPie (b, element) {
          b.innerRadius = this._innerRadius;
          let current = element._current;
          if (this._isOffCanvas(current)) {
              current = {startAngle: 0, endAngle: 0};
          } else {
              // only interpolate startAngle & endAngle, not the whole data object
              current = {startAngle: current.startAngle, endAngle: current.endAngle};
          }
          const i = interpolate(current, b);
          element._current = i(0);
          return t => this._safeArc(i(t), 0, this._buildArcs());
      }


  }

  /**
   * Concrete row chart implementation.
   *
   * Examples:
   * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
   * @mixes CapMixin
   * @mixes MarginMixin
   * @mixes ColorMixin
   * @mixes BaseMixin
   */
  class RowChart extends CapMixin(ColorMixin(MarginMixin)) {
      /**
       * Create a Row Chart.
       * @example
       * // create a row chart under #chart-container1 element using the default global chart group
       * var chart1 = new RowChart('#chart-container1');
       * // create a row chart under #chart-container2 element using chart group A
       * var chart2 = new RowChart('#chart-container2', 'chartGroupA');
       * @param {String|node|d3.selection} parent - Any valid
       * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
       * a dom block element such as a div; or a dom element or d3 selection.
       * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
       * Interaction with a chart will only trigger events and redraws within the chart's group.
       */
      constructor (parent, chartGroup) {
          super();

          this._g = undefined;

          this._labelOffsetX = 10;
          this._labelOffsetY = 15;
          this._hasLabelOffsetY = false;
          this._dyOffset = '0.35em'; // this helps center labels https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#svg_text
          this._titleLabelOffsetX = 2;

          this._gap = 5;

          this._fixedBarHeight = false;
          this._rowCssClass = 'row';
          this._titleRowCssClass = 'titlerow';
          this._renderTitleLabel = false;

          this._x = undefined;

          this._elasticX = undefined;

          this._xAxis = axisBottom();

          this._rowData = undefined;

          this.rowsCap = this.cap;

          this.title(d => this.cappedKeyAccessor(d) + ': ' + this.cappedValueAccessor(d));

          this.label(d => this.cappedKeyAccessor(d));

          this.anchor(parent, chartGroup);
      }

      _calculateAxisScale () {
          if (!this._x || this._elasticX) {
              const extent$1 = extent(this._rowData, d => this.cappedValueAccessor(d));
              if (extent$1[0] > 0) {
                  extent$1[0] = 0;
              }
              if (extent$1[1] < 0) {
                  extent$1[1] = 0;
              }
              this._x = linear$1().domain(extent$1)
                  .range([0, this.effectiveWidth()]);
          }
          this._xAxis.scale(this._x);
      }

      _drawAxis () {
          let axisG = this._g.select('g.axis');

          this._calculateAxisScale();

          if (axisG.empty()) {
              axisG = this._g.append('g').attr('class', 'axis');
          }
          axisG.attr('transform', 'translate(0, ' + this.effectiveHeight() + ')');

          transition$1(axisG, this.transitionDuration(), this.transitionDelay())
              .call(this._xAxis);
      }

      _doRender () {
          this.resetSvg();

          this._g = this.svg()
              .append('g')
              .attr('transform', 'translate(' + this.margins().left + ',' + this.margins().top + ')');

          this._drawChart();

          return this;
      }

      /**
       * Gets or sets the x scale. The x scale can be any d3
       * {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}.
       * @see {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}
       * @param {d3.scale} [scale]
       * @returns {d3.scale|RowChart}
       */
      x (scale) {
          if (!arguments.length) {
              return this._x;
          }
          this._x = scale;
          return this;
      }

      _drawGridLines () {
          this._g.selectAll('g.tick')
              .select('line.grid-line')
              .remove();

          this._g.selectAll('g.tick')
              .append('line')
              .attr('class', 'grid-line')
              .attr('x1', 0)
              .attr('y1', 0)
              .attr('x2', 0)
              .attr('y2', () => -this.effectiveHeight());
      }

      _drawChart () {
          this._rowData = this.data();

          this._drawAxis();
          this._drawGridLines();

          let rows = this._g.selectAll('g.' + this._rowCssClass)
              .data(this._rowData);

          this._removeElements(rows);
          rows = this._createElements(rows)
              .merge(rows);
          this._updateElements(rows);
      }

      _createElements (rows) {
          const rowEnter = rows.enter()
              .append('g')
              .attr('class', (d, i) => this._rowCssClass + ' _' + i);

          rowEnter.append('rect').attr('width', 0);

          this._createLabels(rowEnter);

          return rowEnter;
      }

      _removeElements (rows) {
          rows.exit().remove();
      }

      _rootValue () {
          const root = this._x(0);
          return (root === -Infinity || root !== root) ? this._x(1) : root;
      }

      _updateElements (rows) {
          const n = this._rowData.length;

          let height;
          if (!this._fixedBarHeight) {
              height = (this.effectiveHeight() - (n + 1) * this._gap) / n;
          } else {
              height = this._fixedBarHeight;
          }

          // vertically align label in center unless they override the value via property setter
          if (!this._hasLabelOffsetY) {
              this._labelOffsetY = height / 2;
          }

          const rect = rows.attr('transform', (d, i) => 'translate(0,' + ((i + 1) * this._gap + i * height) + ')').select('rect')
              .attr('height', height)
              .attr('fill', this.getColor)
              .on('click', d => this._onClick(d))
              .classed('deselected', d => (this.hasFilter()) ? !this._isSelectedRow(d) : false)
              .classed('selected', d => (this.hasFilter()) ? this._isSelectedRow(d) : false);

          transition$1(rect, this.transitionDuration(), this.transitionDelay())
              .attr('width', d => Math.abs(this._rootValue() - this._x(this.cappedValueAccessor(d))))
              .attr('transform', d => this._translateX(d));

          this._createTitles(rows);
          this._updateLabels(rows);
      }

      _createTitles (rows) {
          if (this.renderTitle()) {
              rows.select('title').remove();
              rows.append('title').text(this.title());
          }
      }

      _createLabels (rowEnter) {
          if (this.renderLabel()) {
              rowEnter.append('text')
                  .on('click', d => this._onClick(d));
          }
          if (this.renderTitleLabel()) {
              rowEnter.append('text')
                  .attr('class', this._titleRowCssClass)
                  .on('click', d => this._onClick(d));
          }
      }

      _updateLabels (rows) {
          if (this.renderLabel()) {
              const lab = rows.select('text')
                  .attr('x', this._labelOffsetX)
                  .attr('y', this._labelOffsetY)
                  .attr('dy', this._dyOffset)
                  .on('click', d => this._onClick(d))
                  .attr('class', (d, i) => this._rowCssClass + ' _' + i)
                  .text(d => this.label()(d));
              transition$1(lab, this.transitionDuration(), this.transitionDelay())
                  .attr('transform', d => this._translateX(d));
          }
          if (this.renderTitleLabel()) {
              const titlelab = rows.select('.' + this._titleRowCssClass)
                  .attr('x', this.effectiveWidth() - this._titleLabelOffsetX)
                  .attr('y', this._labelOffsetY)
                  .attr('dy', this._dyOffset)
                  .attr('text-anchor', 'end')
                  .on('click', d => this._onClick(d))
                  .attr('class', (d, i) => this._titleRowCssClass + ' _' + i)
                  .text(d => this.title()(d));
              transition$1(titlelab, this.transitionDuration(), this.transitionDelay())
                  .attr('transform', d => this._translateX(d));
          }
      }

      /**
       * Turn on/off Title label rendering (values) using SVG style of text-anchor 'end'.
       * @param {Boolean} [renderTitleLabel=false]
       * @returns {Boolean|RowChart}
       */
      renderTitleLabel (renderTitleLabel) {
          if (!arguments.length) {
              return this._renderTitleLabel;
          }
          this._renderTitleLabel = renderTitleLabel;
          return this;
      }

      _onClick (d) {
          this.onClick(d);
      }

      _translateX (d) {
          const x = this._x(this.cappedValueAccessor(d)),
              x0 = this._rootValue(),
              s = x > x0 ? x0 : x;
          return 'translate(' + s + ',0)';
      }

      _doRedraw () {
          this._drawChart();
          return this;
      }

      /**
       * Get or sets the x axis for the row chart instance.
       * See the {@link https://github.com/d3/d3-axis/blob/master/README.md d3.axis}
       * documention for more information.
       * @param {d3.axis} [xAxis]
       * @example
       * // customize x axis tick format
       * chart.xAxis().tickFormat(function (v) {return v + '%';});
       * // customize x axis tick values
       * chart.xAxis().tickValues([0, 100, 200, 300]);
       * // use a top-oriented axis. Note: position of the axis and grid lines will need to
       * // be set manually, see https://dc-js.github.io/dc.js/examples/row-top-axis.html
       * chart.xAxis(d3.axisTop())
       * @returns {d3.axis|RowChart}
       */
      xAxis (xAxis) {
          if (!arguments.length) {
              return this._xAxis;
          }
          this._xAxis = xAxis;
          return this;
      }

      /**
       * Get or set the fixed bar height. Default is [false] which will auto-scale bars.
       * For example, if you want to fix the height for a specific number of bars (useful in TopN charts)
       * you could fix height as follows (where count = total number of bars in your TopN and gap is
       * your vertical gap space).
       * @example
       * chart.fixedBarHeight( chartheight - (count + 1) * gap / count);
       * @param {Boolean|Number} [fixedBarHeight=false]
       * @returns {Boolean|Number|RowChart}
       */
      fixedBarHeight (fixedBarHeight) {
          if (!arguments.length) {
              return this._fixedBarHeight;
          }
          this._fixedBarHeight = fixedBarHeight;
          return this;
      }

      /**
       * Get or set the vertical gap space between rows on a particular row chart instance.
       * @param {Number} [gap=5]
       * @returns {Number|RowChart}
       */
      gap (gap) {
          if (!arguments.length) {
              return this._gap;
          }
          this._gap = gap;
          return this;
      }

      /**
       * Get or set the elasticity on x axis. If this attribute is set to true, then the x axis will rescale to auto-fit the
       * data range when filtered.
       * @param {Boolean} [elasticX]
       * @returns {Boolean|RowChart}
       */
      elasticX (elasticX) {
          if (!arguments.length) {
              return this._elasticX;
          }
          this._elasticX = elasticX;
          return this;
      }

      /**
       * Get or set the x offset (horizontal space to the top left corner of a row) for labels on a particular row chart.
       * @param {Number} [labelOffsetX=10]
       * @returns {Number|RowChart}
       */
      labelOffsetX (labelOffsetX) {
          if (!arguments.length) {
              return this._labelOffsetX;
          }
          this._labelOffsetX = labelOffsetX;
          return this;
      }

      /**
       * Get or set the y offset (vertical space to the top left corner of a row) for labels on a particular row chart.
       * @param {Number} [labelOffsety=15]
       * @returns {Number|RowChart}
       */
      labelOffsetY (labelOffsety) {
          if (!arguments.length) {
              return this._labelOffsetY;
          }
          this._labelOffsetY = labelOffsety;
          this._hasLabelOffsetY = true;
          return this;
      }

      /**
       * Get of set the x offset (horizontal space between right edge of row and right edge or text.
       * @param {Number} [titleLabelOffsetX=2]
       * @returns {Number|RowChart}
       */
      titleLabelOffsetX (titleLabelOffsetX) {
          if (!arguments.length) {
              return this._titleLabelOffsetX;
          }
          this._titleLabelOffsetX = titleLabelOffsetX;
          return this;
      }

      _isSelectedRow (d) {
          return this.hasFilter(this.cappedKeyAccessor(d));
      }
  }

  //# dc.js Getting Started and How-To Guide

  // ### Create Chart Objects

  // Create chart objects associated with the container elements identified by the css selector.
  // Note: It is often a good idea to have these objects accessible at the global scope so that they can be modified or
  // filtered by other page controls.
  var gainOrLossChart = new PieChart('#gain-loss-chart');
  var fluctuationChart = new BarChart('#fluctuation-chart');
  var quarterChart = new PieChart('#quarter-chart');
  var dayOfWeekChart = new RowChart('#day-of-week-chart');
  var moveChart = new LineChart('#monthly-move-chart');
  var volumeChart = new BarChart('#monthly-volume-chart');
  var yearlyBubbleChart = new BubbleChart('#yearly-bubble-chart');
  var nasdaqCount = new DataCount('.dc-data-count');
  var nasdaqTable = new DataTable('.dc-data-table');

  // ### Anchor Div for Charts
  /*
  // A div anchor that can be identified by id
      <div id='your-chart'></div>
  // Title or anything you want to add above the chart
      <div id='chart'><span>Days by Gain or Loss</span></div>
  // ##### .turnOnControls()

  // If a link with css class `reset` is present then the chart
  // will automatically hide/show it based on whether there is a filter
  // set on the chart (e.g. slice selection for pie chart and brush
  // selection for bar chart). Enable this with `chart.turnOnControls(true)`

  // By default, dc.js >=2.1 uses `display: none` to control whether or not chart
  // controls are shown. To use `visibility: hidden` to hide/show controls
  // without disrupting the layout, set `chart.controlsUseVisibility(true)`.

      <div id='chart'>
         <a class='reset'
            href='javascript:myChart.filterAll();dc.redrawAll();'
            style='visibility: hidden;'>reset</a>
      </div>
  // dc.js will also automatically inject the current filter value into
  // any html element with its css class set to `filter`
      <div id='chart'>
          <span class='reset' style='visibility: hidden;'>
            Current filter: <span class='filter'></span>
          </span>
      </div>
  */

  //### Load your data

  //Data can be loaded through regular means with your
  //favorite javascript library
  //
  //```javascript
  //d3.csv('data.csv').then(function(data) {...});
  //d3.json('data.json').then(function(data) {...});
  //jQuery.getJson('data.json', function(data){...});
  //```
  csv$1('../data/ndx.csv').then(function (data) {
      // Since its a csv file we need to format the data a bit.
      var dateFormatSpecifier = '%m/%d/%Y';
      var dateFormat = timeFormat(dateFormatSpecifier);
      var dateFormatParser = timeParse(dateFormatSpecifier);
      var numberFormat = format('.2f');

      data.forEach(function (d) {
          d.dd = dateFormatParser(d.date);
          d.month = month(d.dd); // pre-calculate month for better performance
          d.close = +d.close; // coerce to number
          d.open = +d.open;
      });

      //### Create Crossfilter Dimensions and Groups

      //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
      var ndx = crossfilter(data);
      var all = ndx.groupAll();

      // Dimension by year
      var yearlyDimension = ndx.dimension(function (d) {
          return year(d.dd).getFullYear();
      });
      // Maintain running tallies by year as filters are applied or removed
      var yearlyPerformanceGroup = yearlyDimension.group().reduce(
          /* callback for when data is added to the current filter results */
          function (p, v) {
              ++p.count;
              p.absGain += v.close - v.open;
              p.fluctuation += Math.abs(v.close - v.open);
              p.sumIndex += (v.open + v.close) / 2;
              p.avgIndex = p.sumIndex / p.count;
              p.percentageGain = p.avgIndex ? (p.absGain / p.avgIndex) * 100 : 0;
              p.fluctuationPercentage = p.avgIndex ? (p.fluctuation / p.avgIndex) * 100 : 0;
              return p;
          },
          /* callback for when data is removed from the current filter results */
          function (p, v) {
              --p.count;
              p.absGain -= v.close - v.open;
              p.fluctuation -= Math.abs(v.close - v.open);
              p.sumIndex -= (v.open + v.close) / 2;
              p.avgIndex = p.count ? p.sumIndex / p.count : 0;
              p.percentageGain = p.avgIndex ? (p.absGain / p.avgIndex) * 100 : 0;
              p.fluctuationPercentage = p.avgIndex ? (p.fluctuation / p.avgIndex) * 100 : 0;
              return p;
          },
          /* initialize p */
          function () {
              return {
                  count: 0,
                  absGain: 0,
                  fluctuation: 0,
                  fluctuationPercentage: 0,
                  sumIndex: 0,
                  avgIndex: 0,
                  percentageGain: 0
              };
          }
      );

      // Dimension by full date
      var dateDimension = ndx.dimension(function (d) {
          return d.dd;
      });

      // Dimension by month
      var moveMonths = ndx.dimension(function (d) {
          return d.month;
      });
      // Group by total movement within month
      var monthlyMoveGroup = moveMonths.group().reduceSum(function (d) {
          return Math.abs(d.close - d.open);
      });
      // Group by total volume within move, and scale down result
      var volumeByMonthGroup = moveMonths.group().reduceSum(function (d) {
          return d.volume / 500000;
      });
      var indexAvgByMonthGroup = moveMonths.group().reduce(
          function (p, v) {
              ++p.days;
              p.total += (v.open + v.close) / 2;
              p.avg = Math.round(p.total / p.days);
              return p;
          },
          function (p, v) {
              --p.days;
              p.total -= (v.open + v.close) / 2;
              p.avg = p.days ? Math.round(p.total / p.days) : 0;
              return p;
          },
          function () {
              return {days: 0, total: 0, avg: 0};
          }
      );

      // Create categorical dimension
      var gainOrLoss = ndx.dimension(function (d) {
          return d.open > d.close ? 'Loss' : 'Gain';
      });
      // Produce counts records in the dimension
      var gainOrLossGroup = gainOrLoss.group();

      // Determine a histogram of percent changes
      var fluctuation = ndx.dimension(function (d) {
          return Math.round((d.close - d.open) / d.open * 100);
      });
      var fluctuationGroup = fluctuation.group();

      // Summarize volume by quarter
      var quarter = ndx.dimension(function (d) {
          var month = d.dd.getMonth();
          if (month <= 2) {
              return 'Q1';
          } else if (month > 2 && month <= 5) {
              return 'Q2';
          } else if (month > 5 && month <= 8) {
              return 'Q3';
          } else {
              return 'Q4';
          }
      });
      var quarterGroup = quarter.group().reduceSum(function (d) {
          return d.volume;
      });

      // Counts per weekday
      var dayOfWeek = ndx.dimension(function (d) {
          var day = d.dd.getDay();
          var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return day + '.' + name[day];
      });
      var dayOfWeekGroup = dayOfWeek.group();

      //### Define Chart Attributes
      // Define chart attributes using fluent methods. See the
      // [dc.js API Reference](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md) for more information
      //

      //#### Bubble Chart

      //Create a bubble chart and use the given css selector as anchor. You can also specify
      //an optional chart group for this chart to be scoped within. When a chart belongs
      //to a specific group then any interaction with the chart will only trigger redraws
      //on charts within the same chart group.
      // <br>API: [Bubble Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#bubble-chart)

      yearlyBubbleChart /* dc.bubbleChart('#yearly-bubble-chart', 'chartGroup') */
      // (_optional_) define chart width, `default = 200`
          .width(990)
          // (_optional_) define chart height, `default = 200`
          .height(250)
          // (_optional_) define chart transition duration, `default = 750`
          .transitionDuration(1500)
          .margins({top: 10, right: 50, bottom: 30, left: 40})
          .dimension(yearlyDimension)
          //The bubble chart expects the groups are reduced to multiple values which are used
          //to generate x, y, and radius for each key (bubble) in the group
          .group(yearlyPerformanceGroup)
          // (_optional_) define color function or array for bubbles: [ColorBrewer](http://colorbrewer2.org/)
          .colors(scheme[9])
          //(optional) define color domain to match your data domain if you want to bind data or color
          .colorDomain([-500, 500])
          //##### Accessors

          //Accessor functions are applied to each value returned by the grouping

          // `.colorAccessor` - the returned value will be passed to the `.colors()` scale to determine a fill color
          .colorAccessor(function (d) {
              return d.value.absGain;
          })
          // `.keyAccessor` - the `X` value will be passed to the `.x()` scale to determine pixel location
          .keyAccessor(function (p) {
              return p.value.absGain;
          })
          // `.valueAccessor` - the `Y` value will be passed to the `.y()` scale to determine pixel location
          .valueAccessor(function (p) {
              return p.value.percentageGain;
          })
          // `.radiusValueAccessor` - the value will be passed to the `.r()` scale to determine radius size;
          //   by default this maps linearly to [0,100]
          .radiusValueAccessor(function (p) {
              return p.value.fluctuationPercentage;
          })
          .maxBubbleRelativeSize(0.3)
          .x(linear$1().domain([-2500, 2500]))
          .y(linear$1().domain([-100, 100]))
          .r(linear$1().domain([0, 4000]))
          //##### Elastic Scaling

          //`.elasticY` and `.elasticX` determine whether the chart should rescale each axis to fit the data.
          .elasticY(true)
          .elasticX(true)
          //`.yAxisPadding` and `.xAxisPadding` add padding to data above and below their max values in the same unit
          //domains as the Accessors.
          .yAxisPadding(100)
          .xAxisPadding(500)
          // (_optional_) render horizontal grid lines, `default=false`
          .renderHorizontalGridLines(true)
          // (_optional_) render vertical grid lines, `default=false`
          .renderVerticalGridLines(true)
          // (_optional_) render an axis label below the x axis
          .xAxisLabel('Index Gain')
          // (_optional_) render a vertical axis lable left of the y axis
          .yAxisLabel('Index Gain %')
          //##### Labels and  Titles

          //Labels are displayed on the chart for each bubble. Titles displayed on mouseover.
          // (_optional_) whether chart should render labels, `default = true`
          .renderLabel(true)
          .label(function (p) {
              return p.key;
          })
          // (_optional_) whether chart should render titles, `default = false`
          .renderTitle(true)
          .title(function (p) {
              return [
                  p.key,
                  'Index Gain: ' + numberFormat(p.value.absGain),
                  'Index Gain in Percentage: ' + numberFormat(p.value.percentageGain) + '%',
                  'Fluctuation / Index Ratio: ' + numberFormat(p.value.fluctuationPercentage) + '%'
              ].join('\n');
          })
          //#### Customize Axes

          // Set a custom tick format. Both `.yAxis()` and `.xAxis()` return an axis object,
          // so any additional method chaining applies to the axis, not the chart.
          .yAxis().tickFormat(function (v) {
          return v + '%';
      });

      // #### Pie/Donut Charts

      // Create a pie chart and use the given css selector as anchor. You can also specify
      // an optional chart group for this chart to be scoped within. When a chart belongs
      // to a specific group then any interaction with such chart will only trigger redraw
      // on other charts within the same chart group.
      // <br>API: [Pie Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#pie-chart)

      gainOrLossChart /* dc.pieChart('#gain-loss-chart', 'chartGroup') */
      // (_optional_) define chart width, `default = 200`
          .width(180)
          // (optional) define chart height, `default = 200`
          .height(180)
          // Define pie radius
          .radius(80)
          // Set dimension
          .dimension(gainOrLoss)
          // Set group
          .group(gainOrLossGroup)
          // (_optional_) by default pie chart will use `group.key` as its label but you can overwrite it with a closure.
          .label(function (d) {
              if (gainOrLossChart.hasFilter() && !gainOrLossChart.hasFilter(d.key)) {
                  return d.key + '(0%)';
              }
              var label = d.key;
              if (all.value()) {
                  label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
              }
              return label;
          })
      /*
          // (_optional_) whether chart should render labels, `default = true`
          .renderLabel(true)
          // (_optional_) if inner radius is used then a donut chart will be generated instead of pie chart
          .innerRadius(40)
          // (_optional_) define chart transition duration, `default = 350`
          .transitionDuration(500)
          // (_optional_) define color array for slices
          .colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
          // (_optional_) define color domain to match your data domain if you want to bind data or color
          .colorDomain([-1750, 1644])
          // (_optional_) define color value accessor
          .colorAccessor(function(d, i){return d.value;})
          */;

      quarterChart /* dc.pieChart('#quarter-chart', 'chartGroup') */
          .width(180)
          .height(180)
          .radius(80)
          .innerRadius(30)
          .dimension(quarter)
          .group(quarterGroup);

      //#### Row Chart

      // Create a row chart and use the given css selector as anchor. You can also specify
      // an optional chart group for this chart to be scoped within. When a chart belongs
      // to a specific group then any interaction with such chart will only trigger redraw
      // on other charts within the same chart group.
      // <br>API: [Row Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#row-chart)
      dayOfWeekChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
          .width(180)
          .height(180)
          .margins({top: 20, left: 10, right: 10, bottom: 20})
          .group(dayOfWeekGroup)
          .dimension(dayOfWeek)
          // Assign colors to each value in the x scale domain
          .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
          .label(function (d) {
              return d.key.split('.')[1];
          })
          // Title sets the row text
          .title(function (d) {
              return d.value;
          })
          .elasticX(true)
          .xAxis().ticks(4);

      //#### Bar Chart

      // Create a bar chart and use the given css selector as anchor. You can also specify
      // an optional chart group for this chart to be scoped within. When a chart belongs
      // to a specific group then any interaction with such chart will only trigger redraw
      // on other charts within the same chart group.
      // <br>API: [Bar Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#bar-chart)
      fluctuationChart /* dc.barChart('#volume-month-chart', 'chartGroup') */
          .width(420)
          .height(180)
          .margins({top: 10, right: 50, bottom: 30, left: 40})
          .dimension(fluctuation)
          .group(fluctuationGroup)
          .elasticY(true)
          // (_optional_) whether bar should be center to its x value. Not needed for ordinal chart, `default=false`
          .centerBar(true)
          // (_optional_) set gap between bars manually in px, `default=2`
          .gap(1)
          // (_optional_) set filter brush rounding
          .round(Math.floor)
          .alwaysUseRounding(true)
          .x(linear$1().domain([-25, 25]))
          .renderHorizontalGridLines(true)
          // Customize the filter displayed in the control span
          .filterPrinter(function (filters) {
              var filter = filters[0], s = '';
              s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
              return s;
          });

      // Customize axes
      fluctuationChart.xAxis().tickFormat(
          function (v) {
              return v + '%';
          });
      fluctuationChart.yAxis().ticks(5);

      //#### Stacked Area Chart

      //Specify an area chart by using a line chart with `.renderArea(true)`.
      // <br>API: [Stack Mixin](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#stack-mixin),
      // [Line Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#line-chart)
      moveChart /* dc.lineChart('#monthly-move-chart', 'chartGroup') */
          .renderArea(true)
          .width(990)
          .height(200)
          .transitionDuration(1000)
          .margins({top: 30, right: 50, bottom: 25, left: 40})
          .dimension(moveMonths)
          .mouseZoomable(true)
          // Specify a "range chart" to link its brush extent with the zoom of the current "focus chart".
          .rangeChart(volumeChart)
          .x(time().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
          .round(month.round)
          .xUnits(months)
          .elasticY(true)
          .renderHorizontalGridLines(true)
          //##### Legend

          // Position the legend relative to the chart origin and specify items' height and separation.
          .legend(new Legend().x(800).y(10).itemHeight(13).gap(5))
          .brushOn(false)
          // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
          // legend.
          // The `.valueAccessor` will be used for the base layer
          .group(indexAvgByMonthGroup, 'Monthly Index Average')
          .valueAccessor(function (d) {
              return d.value.avg;
          })
          // Stack additional layers with `.stack`. The first paramenter is a new group.
          // The second parameter is the series name. The third is a value accessor.
          .stack(monthlyMoveGroup, 'Monthly Index Move', function (d) {
              return d.value;
          })
          // Title can be called by any stack layer.
          .title(function (d) {
              var value = d.value.avg ? d.value.avg : d.value;
              if (isNaN(value)) {
                  value = 0;
              }
              return dateFormat(d.key) + '\n' + numberFormat(value);
          });

      //#### Range Chart

      // Since this bar chart is specified as "range chart" for the area chart, its brush extent
      // will always match the zoom of the area chart.
      volumeChart.width(990) /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
          .height(40)
          .margins({top: 0, right: 50, bottom: 20, left: 40})
          .dimension(moveMonths)
          .group(volumeByMonthGroup)
          .centerBar(true)
          .gap(1)
          .x(time().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
          .round(month.round)
          .alwaysUseRounding(true)
          .xUnits(months);

      //#### Data Count

      // Create a data count widget and use the given css selector as anchor. You can also specify
      // an optional chart group for this chart to be scoped within. When a chart belongs
      // to a specific group then any interaction with such chart will only trigger redraw
      // on other charts within the same chart group.
      // <br>API: [Data Count Widget](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#data-count-widget)
      //
      //```html
      //<div class='dc-data-count'>
      //  <span class='filter-count'></span>
      //  selected out of <span class='total-count'></span> records.
      //</div>
      //```

      nasdaqCount /* dc.dataCount('.dc-data-count', 'chartGroup'); */
          .crossfilter(ndx)
          .groupAll(all)
          // (_optional_) `.html` sets different html when some records or all records are selected.
          // `.html` replaces everything in the anchor with the html given using the following function.
          // `%filter-count` and `%total-count` are replaced with the values obtained.
          .html({
              some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
                  ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset All</a>',
              all: 'All records selected. Please click on the graph to apply filters.'
          });

      //#### Data Table

      // Create a data table widget and use the given css selector as anchor. You can also specify
      // an optional chart group for this chart to be scoped within. When a chart belongs
      // to a specific group then any interaction with such chart will only trigger redraw
      // on other charts within the same chart group.
      // <br>API: [Data Table Widget](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#data-table-widget)
      //
      // You can statically define the headers like in
      //
      // ```html
      //    <!-- anchor div for data table -->
      //    <div id='data-table'>
      //       <!-- create a custom header -->
      //       <div class='header'>
      //           <span>Date</span>
      //           <span>Open</span>
      //           <span>Close</span>
      //           <span>Change</span>
      //           <span>Volume</span>
      //       </div>
      //       <!-- data rows will filled in here -->
      //    </div>
      // ```
      // or do it programmatically using `.columns()`.

      nasdaqTable /* dc.dataTable('.dc-data-table', 'chartGroup') */
          .dimension(dateDimension)
          // Specify a section function to nest rows of the table
          .section(function (d) {
              var format$1 = format('02d');
              return d.dd.getFullYear() + '/' + format$1((d.dd.getMonth() + 1));
          })
          // (_optional_) max number of records to be shown, `default = 25`
          .size(10)
          // There are several ways to specify the columns; see the data-table documentation.
          // This code demonstrates generating the column header automatically based on the columns.
          .columns([
              // Use the `d.date` field; capitalized automatically
              'date',
              // Use `d.open`, `d.close`
              'open',
              'close',
              {
                  // Specify a custom format for column 'Change' by using a label with a function.
                  label: 'Change',
                  format: function (d) {
                      return numberFormat(d.close - d.open);
                  }
              },
              // Use `d.volume`
              'volume'
          ])

          // (_optional_) sort using the given field, `default = function(d){return d;}`
          .sortBy(function (d) {
              return d.dd;
          })
          // (_optional_) sort order, `default = d3.ascending`
          .order(ascending)
          // (_optional_) custom renderlet to post-process chart using [D3](http://d3js.org)
          .on('renderlet', function (table) {
              table.selectAll('.dc-table-group').classed('info', true);
          });

      /*
      //#### Geo Choropleth Chart

      //Create a choropleth chart and use the given css selector as anchor. You can also specify
      //an optional chart group for this chart to be scoped within. When a chart belongs
      //to a specific group then any interaction with such chart will only trigger redraw
      //on other charts within the same chart group.
      // <br>API: [Geo Chroropleth Chart][choro]
      // [choro]: https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#geo-choropleth-chart
      dc.geoChoroplethChart('#us-chart')
           // (_optional_) define chart width, default 200
          .width(990)
          // (optional) define chart height, default 200
          .height(500)
          // (optional) define chart transition duration, default 1000
          .transitionDuration(1000)
          // set crossfilter dimension, dimension key should match the name retrieved in geojson layer
          .dimension(states)
          // set crossfilter group
          .group(stateRaisedSum)
          // (_optional_) define color function or array for bubbles
          .colors(['#ccc', '#E2F2FF','#C4E4FF','#9ED2FF','#81C5FF','#6BBAFF','#51AEFF','#36A2FF','#1E96FF','#0089FF',
              '#0061B5'])
          // (_optional_) define color domain to match your data domain if you want to bind data or color
          .colorDomain([-5, 200])
          // (_optional_) define color value accessor
          .colorAccessor(function(d, i){return d.value;})
          // Project the given geojson. You can call this function multiple times with different geojson feed to generate
          // multiple layers of geo paths.
          //
          // * 1st param - geojson data
          // * 2nd param - name of the layer which will be used to generate css class
          // * 3rd param - (_optional_) a function used to generate key for geo path, it should match the dimension key
          // in order for the coloring to work properly
          .overlayGeoJson(statesJson.features, 'state', function(d) {
              return d.properties.name;
          })
          // (_optional_) closure to generate title for path, `default = d.key + ': ' + d.value`
          .title(function(d) {
              return 'State: ' + d.key + '\nTotal Amount Raised: ' + numberFormat(d.value ? d.value : 0) + 'M';
          });

          //#### Bubble Overlay Chart

          // Create a overlay bubble chart and use the given css selector as anchor. You can also specify
          // an optional chart group for this chart to be scoped within. When a chart belongs
          // to a specific group then any interaction with the chart will only trigger redraw
          // on charts within the same chart group.
          // <br>API: [Bubble Overlay Chart][bubble]
          // [bubble]: https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#bubble-overlay-chart
          dc.bubbleOverlay('#bubble-overlay', 'chartGroup')
              // The bubble overlay chart does not generate its own svg element but rather reuses an existing
              // svg to generate its overlay layer
              .svg(d3.select('#bubble-overlay svg'))
              // (_optional_) define chart width, `default = 200`
              .width(990)
              // (_optional_) define chart height, `default = 200`
              .height(500)
              // (_optional_) define chart transition duration, `default = 1000`
              .transitionDuration(1000)
              // Set crossfilter dimension, dimension key should match the name retrieved in geo json layer
              .dimension(states)
              // Set crossfilter group
              .group(stateRaisedSum)
              // Closure used to retrieve x value from multi-value group
              .keyAccessor(function(p) {return p.value.absGain;})
              // Closure used to retrieve y value from multi-value group
              .valueAccessor(function(p) {return p.value.percentageGain;})
              // (_optional_) define color function or array for bubbles
              .colors(['#ccc', '#E2F2FF','#C4E4FF','#9ED2FF','#81C5FF','#6BBAFF','#51AEFF','#36A2FF','#1E96FF','#0089FF',
                  '#0061B5'])
              // (_optional_) define color domain to match your data domain if you want to bind data or color
              .colorDomain([-5, 200])
              // (_optional_) define color value accessor
              .colorAccessor(function(d, i){return d.value;})
              // Closure used to retrieve radius value from multi-value group
              .radiusValueAccessor(function(p) {return p.value.fluctuationPercentage;})
              // set radius scale
              .r(d3.scaleLinear().domain([0, 3]))
              // (_optional_) whether chart should render labels, `default = true`
              .renderLabel(true)
              // (_optional_) closure to generate label per bubble, `default = group.key`
              .label(function(p) {return p.key.getFullYear();})
              // (_optional_) whether chart should render titles, `default = false`
              .renderTitle(true)
              // (_optional_) closure to generate title per bubble, `default = d.key + ': ' + d.value`
              .title(function(d) {
                  return 'Title: ' + d.key;
              })
              // add data point to its layer dimension key that matches point name: it will be used to
              // generate a bubble. Multiple data points can be added to the bubble overlay to generate
              // multiple bubbles.
              .point('California', 100, 120)
              .point('Colorado', 300, 120)
              // (_optional_) setting debug flag to true will generate a transparent layer on top of
              // bubble overlay which can be used to obtain relative `x`,`y` coordinate for specific
              // data point, `default = false`
              .debug(true);
      */

      //#### Rendering

      //simply call `.renderAll()` to render all charts on the page
      renderAll();
      /*
      // Or you can render charts belonging to a specific chart group
      dc.renderAll('group');
      // Once rendered you can call `.redrawAll()` to update charts incrementally when the data
      // changes, without re-rendering everything
      dc.redrawAll();
      // Or you can choose to redraw only those charts associated with a specific chart group
      dc.redrawAll('group');
      */

  });

  //#### Versions

  //Determine the current version of dc with `dc.version`
  // d3.selectAll('#version').text(dc.version);

  // Determine latest stable version in the repo via Github API
  json('https://api.github.com/repos/dc-js/dc.js/releases/latest').then(function (latestRelease) {
      /* eslint camelcase: 0 */
      selectAll('#latest').text(latestRelease.tag_name);
  });

}());
