(function () {
  // icon
  // need to be download first
  var deleteIcon = "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM2IiB2aWV3Qm94PSIwIDAgMzYgMzYiIHdpZHRoPSIzNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PGNpcmNsZSBpZD0iYSIgY3g9IjE4IiBjeT0iMTgiIHI9IjEyIi8+PGZpbHRlciBpZD0iYiIgaGVpZ2h0PSIxNTguMyUiIHdpZHRoPSIxNTguMyUiIHg9Ii0yOS4yJSIgeT0iLTIwLjglIj48ZmVPZmZzZXQgZHg9IjAiIGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+PGZlR2F1c3NpYW5CbHVyIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSIgc3RkRGV2aWF0aW9uPSIyIi8+PGZlQ29sb3JNYXRyaXggaW49InNoYWRvd0JsdXJPdXRlcjEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuNSAwIi8+PC9maWx0ZXI+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdHJhbnNmb3JtPSIiPjx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI2IpIiB4bGluazpocmVmPSIjYSIvPjx1c2UgZmlsbD0iI2ZmZTYyNiIgZmlsbC1ydWxlPSJldmVub2RkIiB4bGluazpocmVmPSIjYSIvPjxwYXRoIGQ9Im0xOSAxN2g0Yy41NTIyODQ3IDAgMSAuNDQ3NzE1MyAxIDFzLS40NDc3MTUzIDEtMSAxaC00djRjMCAuNTUyMjg0Ny0uNDQ3NzE1MyAxLTEgMXMtMS0uNDQ3NzE1My0xLTF2LTRoLTRjLS41NTIyODQ3IDAtMS0uNDQ3NzE1My0xLTFzLjQ0NzcxNTMtMSAxLTFoNHYtNGMwLS41NTIyODQ3LjQ0NzcxNTMtMSAxLTFzMSAuNDQ3NzE1MyAxIDF6IiBmaWxsPSIjMDAwIiB0cmFuc2Zvcm09Im1hdHJpeCguNzA3MTA2NzggLjcwNzEwNjc4IC0uNzA3MTA2NzggLjcwNzEwNjc4IDE4IC03LjQ1NTg0NCkiLz48L2c+PC9zdmc+";
  var resizeIcon = "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM2IiB2aWV3Qm94PSIwIDAgMzYgMzYiIHdpZHRoPSIzNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PGNpcmNsZSBpZD0iYSIgY3g9IjE4IiBjeT0iMTgiIHI9IjEyIi8+PGZpbHRlciBpZD0iYiIgaGVpZ2h0PSIxNTguMyUiIHdpZHRoPSIxNTguMyUiIHg9Ii0yOS4yJSIgeT0iLTIwLjglIj48ZmVPZmZzZXQgZHg9IjAiIGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+PGZlR2F1c3NpYW5CbHVyIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSIgc3RkRGV2aWF0aW9uPSIyIi8+PGZlQ29sb3JNYXRyaXggaW49InNoYWRvd0JsdXJPdXRlcjEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuNSAwIi8+PC9maWx0ZXI+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdHJhbnNmb3JtPSIiPjx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI2IpIiB4bGluazpocmVmPSIjYSIvPjx1c2UgZmlsbD0iI2ZmZTYyNiIgZmlsbC1ydWxlPSJldmVub2RkIiB4bGluazpocmVmPSIjYSIvPjxwYXRoIGQ9Im0xNSAyMWgzYy41NTIyODQ3IDAgMSAuNDQ3NzE1MyAxIDFzLS40NDc3MTUzIDEtMSAxaC00Yy0uNTUyMjg0NyAwLTEtLjQ0NzcxNTMtMS0xdi00YzAtLjU1MjI4NDcuNDQ3NzE1My0xIDEtMXMxIC40NDc3MTUzIDEgMXptOC03djRjMCAuNTUyMjg0Ny0uNDQ3NzE1MyAxLTEgMXMtMS0uNDQ3NzE1My0xLTF2LTNoLTNjLS41NTIyODQ3IDAtMS0uNDQ3NzE1My0xLTFzLjQ0NzcxNTMtMSAxLTFoNGMuNTUyMjg0NyAwIDEgLjQ0NzcxNTMgMSAxeiIgZmlsbD0iIzAwMCIvPjwvZz48L3N2Zz4=";

  var del = new Image();
  del.src = deleteIcon;
  var resize = new Image();
  resize.src = resizeIcon;
  // end of icon define

  var degreesToRadians = fabric.util.degreesToRadians,
    /* eslint-disable camelcase */
    isVML = function () {
      return typeof G_vmlCanvasManager !== 'undefined';
    };
  /* eslint-enable camelcase */
  fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

    /**
     * The object interactivity controls.
     * @private
     */
    _controlsVisibility: null,

    /**
     * Determines which corner has been clicked
     * @private
     * @param {Object} pointer The pointer indicating the mouse position
     * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or false if nothing is found
     */
    _findTargetCorner: function (pointer) {
      if (!this.hasControls || !this.active) {
        return false;
      }

      var ex = pointer.x,
        ey = pointer.y,
        xPoints,
        lines;
      this.__corner = 0;
      for (var i in this.oCoords) {

        if (!this.isControlVisible(i)) {
          continue;
        }

        if (i === 'mtr' && !this.hasRotatingPoint) {
          continue;
        }

        if (this.get('lockUniScaling') &&
          (i === 'mt' || i === 'mr' || i === 'mb' || i === 'ml')) {
          continue;
        }

        lines = this._getImageLines(this.oCoords[i].corner);

        // debugging

        // canvas.contextTop.fillRect(lines.bottomline.d.x, lines.bottomline.d.y, 2, 2);
        // canvas.contextTop.fillRect(lines.bottomline.o.x, lines.bottomline.o.y, 2, 2);

        // canvas.contextTop.fillRect(lines.leftline.d.x, lines.leftline.d.y, 2, 2);
        // canvas.contextTop.fillRect(lines.leftline.o.x, lines.leftline.o.y, 2, 2);

        // canvas.contextTop.fillRect(lines.topline.d.x, lines.topline.d.y, 2, 2);
        // canvas.contextTop.fillRect(lines.topline.o.x, lines.topline.o.y, 2, 2);

        // canvas.contextTop.fillRect(lines.rightline.d.x, lines.rightline.d.y, 2, 2);
        // canvas.contextTop.fillRect(lines.rightline.o.x, lines.rightline.o.y, 2, 2);

        xPoints = this._findCrossPoints({x: ex, y: ey}, lines);
        if (xPoints !== 0 && xPoints % 2 === 1) {
          this.__corner = i;
          return i;
        }
      }
      return false;
    },

    /**
     * Sets the coordinates of the draggable boxes in the corners of
     * the image used to scale/rotate it.
     * @private
     */
    _setCornerCoords: function () {
      var coords = this.oCoords,
        newTheta = degreesToRadians(45 - this.angle),
        /* Math.sqrt(2 * Math.pow(this.cornerSize, 2)) / 2, */
        /* 0.707106 stands for sqrt(2)/2 */
        cornerHypotenuse = this.cornerSize * 0.707106,
        cosHalfOffset = cornerHypotenuse * Math.cos(newTheta),
        sinHalfOffset = cornerHypotenuse * Math.sin(newTheta),
        x, y;

      for (var point in coords) {
        x = coords[point].x;
        y = coords[point].y;
        coords[point].corner = {
          tl: {
            x: x - sinHalfOffset,
            y: y - cosHalfOffset
          },
          tr: {
            x: x + cosHalfOffset,
            y: y - sinHalfOffset
          },
          bl: {
            x: x - cosHalfOffset,
            y: y + sinHalfOffset
          },
          br: {
            x: x + sinHalfOffset,
            y: y + cosHalfOffset
          }
        };
      }
    },

    /*
     * Calculate object dimensions from its properties
     * @private
     */
    _getNonTransformedDimensions: function () {
      var strokeWidth = this.strokeWidth,
        w = this.width,
        h = this.height,
        addStrokeToW = true,
        addStrokeToH = true;

      if (this.type === 'line' && this.strokeLineCap === 'butt') {
        addStrokeToH = w;
        addStrokeToW = h;
      }

      if (addStrokeToH) {
        h += h < 0 ? -strokeWidth : strokeWidth;
      }

      if (addStrokeToW) {
        w += w < 0 ? -strokeWidth : strokeWidth;
      }

      return {x: w, y: h};
    },

    /*
     * @private
     */
    _getTransformedDimensions: function (skewX, skewY) {
      if (typeof skewX === 'undefined') {
        skewX = this.skewX;
      }
      if (typeof skewY === 'undefined') {
        skewY = this.skewY;
      }
      var dimensions = this._getNonTransformedDimensions(),
        dimX = dimensions.x / 2, dimY = dimensions.y / 2,
        points = [
          {
            x: -dimX,
            y: -dimY
          },
          {
            x: dimX,
            y: -dimY
          },
          {
            x: -dimX,
            y: dimY
          },
          {
            x: dimX,
            y: dimY
          }],
        i, transformMatrix = this._calcDimensionsTransformMatrix(skewX, skewY, false),
        bbox;
      for (i = 0; i < points.length; i++) {
        points[i] = fabric.util.transformPoint(points[i], transformMatrix);
      }
      bbox = fabric.util.makeBoundingBoxFromPoints(points);
      return {x: bbox.width, y: bbox.height};
    },

    /*
     * private
     */
    _calculateCurrentDimensions: function () {
      var vpt = this.getViewportTransform(),
        dim = this._getTransformedDimensions(),
        w = dim.x, h = dim.y,
        p = fabric.util.transformPoint(new fabric.Point(w, h), vpt, true);

      return p.scalarAdd(2 * this.padding);
    },

    /**
     * Draws a colored layer behind the object, inside its selection borders.
     * Requires public options: padding, selectionBackgroundColor
     * this function is called when the context is transformed
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawSelectionBackground: function (ctx) {
      if (!this.selectionBackgroundColor || this.group || !this.active) {
        return this;
      }
      ctx.save();
      var center = this.getCenterPoint(), wh = this._calculateCurrentDimensions(),
        vpt = this.canvas.viewportTransform;
      ctx.translate(center.x, center.y);
      ctx.scale(1 / vpt[0], 1 / vpt[3]);
      ctx.rotate(degreesToRadians(this.angle));
      ctx.fillStyle = this.selectionBackgroundColor;
      ctx.fillRect(-wh.x / 2, -wh.y / 2, wh.x, wh.y);
      ctx.restore();
      return this;
    },

    /**
     * Draws borders of an object's bounding box.
     * Requires public properties: width, height
     * Requires public options: padding, borderColor
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawBorders: function (ctx) {
      if (!this.hasBorders) {
        return this;
      }

      var wh = this._calculateCurrentDimensions(),
        strokeWidth = 1 / this.borderScaleFactor,
        width = wh.x + strokeWidth,
        height = wh.y + strokeWidth;

      ctx.save();
      ctx.lineWidth = this.borderLineWidth;
      ctx.strokeStyle = this.borderColor;
      this._setLineDash(ctx, this.borderDashArray, null);

      if (this.cornerStyle === 'editor') {
        // 编译模式需要预留更多的空间
        var extra = this.cornerSize / 2;
        ctx.strokeRect(
          -width / 2 - extra,
          -height / 2,
          width + extra * 2,
          height
        );
      }else {
        ctx.strokeRect(
          -width / 2,
          -height / 2,
          width,
          height
        );
      }

      if (this.hasRotatingPoint && this.isControlVisible('mtr') && !this.get('lockRotation') && this.hasControls) {

        var rotateHeight = -height / 2;
        ctx.beginPath();
        ctx.moveTo(0, rotateHeight);
        ctx.lineTo(0, rotateHeight - this.rotatingPointOffset);
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
      return this;
    },

    /**
     * Draws borders of an object's bounding box when it is inside a group.
     * Requires public properties: width, height
     * Requires public options: padding, borderColor
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @param {object} options object representing current object parameters
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawBordersInGroup: function (ctx, options) {
      if (!this.hasBorders) {
        return this;
      }

      var p = this._getNonTransformedDimensions(),
        matrix = fabric.util.customTransformMatrix(options.scaleX, options.scaleY, options.skewX),
        wh = fabric.util.transformPoint(p, matrix),
        strokeWidth = 1 / this.borderScaleFactor,
        width = wh.x + strokeWidth + 2 * this.padding,
        height = wh.y + strokeWidth + 2 * this.padding;

      ctx.save();
      this._setLineDash(ctx, this.borderDashArray, null);
      ctx.strokeStyle = this.borderColor;

      ctx.strokeRect(
        -width / 2,
        -height / 2,
        width,
        height
      );

      ctx.restore();
      return this;
    },

    /**
     * Draws corners of an object's bounding box.
     * Requires public properties: width, height
     * Requires public options: cornerSize, padding
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawControls: function (ctx) {
      if (!this.hasControls) {
        return this;
      }

      var wh = this._calculateCurrentDimensions(),
        width = wh.x,
        height = wh.y,
        scaleOffset = this.cornerSize,
        left = -(width + scaleOffset) / 2,
        top = -(height + scaleOffset) / 2,
        methodName = this.transparentCorners ? 'stroke' : 'fill';

      ctx.save();
      ctx.strokeStyle = ctx.fillStyle = this.cornerColor;
      if (!this.transparentCorners) {
        ctx.strokeStyle = this.cornerStrokeColor;
      }
      this._setLineDash(ctx, this.cornerDashArray, null);

      if (this.cornerStyle === 'editor') {
        var extra = this.cornerSize / 2;
        // top-right
        ctx.drawImage(del, left + width + extra, top, this.cornerSize, this.cornerSize);

        // bottom-left
        ctx.drawImage(resize, left - extra, top + height, this.cornerSize, this.cornerSize);
      } else if (this.cornerStyle === 'cropper') {
        var l = left + this.cornerSize / 2;
        var t = top + this.cornerSize / 2;
        var len = 16;
        ctx.strokeStyle = this.cornerColor;
        ctx.lineWidth = 4;
        // top-left
        ctx.beginPath();
        ctx.moveTo(l, t + len);
        ctx.lineTo(l, t);
        ctx.lineTo(l + len, t);
        ctx.stroke();

        // top-right
        ctx.beginPath();
        ctx.moveTo(l + width - len, t);
        ctx.lineTo(l + width, t);
        ctx.lineTo(l + width, t + len);
        ctx.stroke();

        // bottom-left
        ctx.beginPath();
        ctx.moveTo(l, t + height - len);
        ctx.lineTo(l, t + height);
        ctx.lineTo(l + len, t + height);
        ctx.stroke();

        // bottom-right
        ctx.beginPath();
        ctx.moveTo(l + width -len, t + height);
        ctx.lineTo(l + width, t + height);
        ctx.lineTo(l + width, t + height - len);
        ctx.stroke();
      } else {
        // bottom-right
        this._drawControl('br', ctx, methodName,
          left + width,
          top + height);

        // top-left
        this._drawControl('tl', ctx, methodName,
          left,
          top);

        // top-right
        this._drawControl('tr', ctx, methodName,
          left + width,
          top);

        // bottom-left
        this._drawControl('bl', ctx, methodName,
          left,
          top + height);

        if (!this.get('lockUniScaling')) {

          // middle-top
          this._drawControl('mt', ctx, methodName,
            left + width / 2,
            top);

          // middle-bottom
          this._drawControl('mb', ctx, methodName,
            left + width / 2,
            top + height);

          // middle-right
          this._drawControl('mr', ctx, methodName,
            left + width,
            top + height / 2);

          // middle-left
          this._drawControl('ml', ctx, methodName,
            left,
            top + height / 2);
        }

        // middle-top-rotate
        if (this.hasRotatingPoint) {
          var _left = left + width / 2;
          var _top = top - this.rotatingPointOffset;

          this._drawControl('mtr', ctx, methodName,
            _left,
            _top);
        }
      }

      ctx.restore();

      return this;
    },

    /**
     * @private
     */
    _drawControl: function (control, ctx, methodName, left, top) {
      if (!this.isControlVisible(control)) {
        return;
      }
      var size = this.cornerSize, stroke = !this.transparentCorners && this.cornerStrokeColor;

      switch (this.cornerStyle) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(left + size / 2, top + size / 2, size / 2, 0, 2 * Math.PI, false);
          ctx[methodName]();
          if (stroke) {
            ctx.stroke();
          }
          break;
        default:
          isVML() || this.transparentCorners || ctx.clearRect(left, top, size, size);
          ctx[methodName + 'Rect'](left, top, size, size);
          if (stroke) {
            ctx.strokeRect(left, top, size, size);
          }
      }
    },

    /**
     * Returns true if the specified control is visible, false otherwise.
     * @param {String} controlName The name of the control. Possible values are 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr'.
     * @returns {Boolean} true if the specified control is visible, false otherwise
     */
    isControlVisible: function (controlName) {
      return this._getControlsVisibility()[controlName];
    },

    /**
     * Sets the visibility of the specified control.
     * @param {String} controlName The name of the control. Possible values are 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr'.
     * @param {Boolean} visible true to set the specified control visible, false otherwise
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setControlVisible: function (controlName, visible) {
      this._getControlsVisibility()[controlName] = visible;
      return this;
    },

    /**
     * Sets the visibility state of object controls.
     * @param {Object} [options] Options object
     * @param {Boolean} [options.bl] true to enable the bottom-left control, false to disable it
     * @param {Boolean} [options.br] true to enable the bottom-right control, false to disable it
     * @param {Boolean} [options.mb] true to enable the middle-bottom control, false to disable it
     * @param {Boolean} [options.ml] true to enable the middle-left control, false to disable it
     * @param {Boolean} [options.mr] true to enable the middle-right control, false to disable it
     * @param {Boolean} [options.mt] true to enable the middle-top control, false to disable it
     * @param {Boolean} [options.tl] true to enable the top-left control, false to disable it
     * @param {Boolean} [options.tr] true to enable the top-right control, false to disable it
     * @param {Boolean} [options.mtr] true to enable the middle-top-rotate control, false to disable it
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setControlsVisibility: function (options) {
      options || (options = {});

      for (var p in options) {
        this.setControlVisible(p, options[p]);
      }
      return this;
    },

    /**
     * Returns the instance of the control visibility set for this object.
     * @private
     * @returns {Object}
     */
    _getControlsVisibility: function () {
      if (!this._controlsVisibility) {
        this._controlsVisibility = {
          tl: true,
          tr: true,
          br: true,
          bl: true,
          ml: true,
          mt: true,
          mr: true,
          mb: true,
          mtr: true
        };
      }
      return this._controlsVisibility;
    }
  });
})();
