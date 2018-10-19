(function () {

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

      ctx.strokeRect(
        -width / 2,
        -height / 2,
        width,
        height
      );

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
        var deleteIcon = "data:image/png;base64,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";
        var resizeIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAL60lEQVR4AeydBWzjShCGZ20HmjIcMz1mZmZmZmZmZmZmZmZmhmNmhlJKybUhZ19HepGs0Wq0uaTnuukvjey4tPPNzux64ssJ6L7K99ikd5x0fwwix/FK/evuBsbqBtBFll8XGvDFKgKWPTMD9KEKzWvZgJT8Nf7nPB8ABqBgjvQaHwwOMDlyX3MjEMIl8II5V17LIQBS9ZoJChMIDwQgy1nO2vDhFcYHz1RsOKC/uX4oaIwJ+MVo04RhhiFKBUCJEFACSEZCVAJE02kZsW1YFE/Iue2x9JwVtfaUQ85ombRwYUuagGdMIzvyKOHCjHeaQc/feHrggN22DR1YVmLs4PfDtgKgPMe9Z2siAb+3RdO/fPd7+8fHnLl8xf8Q03hUnGtnhNsB4BdRBjo9Hn103+C9V5YeWFNhHhUIwI4gweiiopiOx+Hnxhb7rcvvjnz85pv1sQx8eiTGlTgXA0BB64NHE+efVlV6w8VVp1RXGucIgH6w+oTk6sLN6SduebDphUefa4o44OsGIi9BEF0M31DB33jjEv9XL/c7q0+1dZEQsgpclJSiqSGcemivE+uemjAhmqBBIMe8B0HkeaGlZlAb++2wbTZcK3CPZcI60I2UsmH6pJnxKzbbfdEfCFxhUr806Uvkr97z4HfaqTj40dMDbi0vM04FCaKbdp9ka1v6+YPOXHH9Tz+tjGkGIqd1wcwVPgPe/N+sN58aMurOK6reCRWJfdiguy8RDIhNjj2wbPd11gz99v5nba1MxjNs9GVAttIHj2aN+3bYTkceUPS9z4INwSPCseKYcezoA/HJyBhhsEoycp39dIHNgEeb8cuIQzZZN/imACgDjwnHjGNHHzL+OANAfOcY5VaCdHc5dObP/2fUSWNGWA/jOXhXZk21ue+JR1Y0Pvxs85SsG4saMvIFn8z8g0YMMe8mN1SeFPqAvqBPJBNMmglqVrzMVYSPpqz5f3w2dKeN1w0+h+fQcyRqqqw999y5ePzzb7Quyb5q5BIABj6t+c/eP2jkAXuE3hUAIeh5MgcPsPYcPDD4+affRFo1t5wihxLE7PMVdX/jjYNFxx9S/Ayz4Hpe6Bv6iL4qdkaCmk4gjKwiyMz+b18bfGMgAOtDDxf6iL6qdkZoSmaMjKxnv6Luf/vu4K2rq4yToECEvqLP6nsEPgtyKUGGavYPHx4MbL956A7aXujJQl/RZ/RdmQVo2ZcgZuFldj7fvTngtIAf1oQCE/qMvivvkpm3V7PNAHbns+9uJWUjhvjPgQIV+o4MmLXAaUwGMKnC3fE+dEvfEwxDVkKBCn1HBjQLCDPgGFvMzGfLz2ablYZGDLVOBReUSEi44d5GeOXdNlhRb0M2GtDXhBMOL4NbLq8Bv19ArkIGnSxeGjs2EnW0rA3HA2Lc0xtgsLOfaTE/dUfVvqYBfcAFIfy7H2/OGj4KfwZ/Fn9HPoQMkIWiRWHwWcCXIKEw0xmEMcN8h4BLwpnv6u8gQhYEvsncmAmdXRBwvf4Lz6gcWFZmbA0eFmZCvoQskAmTASr4/I0Y0+s3TzumYm83O51Yw7tbx/S0oyv2ogEgDJkbsSz3/oP6ma7OflxArzy3EhdU6C4a2B+ZZH9PYGm0IAynlZT4rbJSYzNwUbh7uevaPmigIzFwNnS1ykuNzZFNNJpI0RKk4CrZNYArQfdeV7W+aUApFLqIkAmy4UoQuwbovvGy4Xr+tUCpXiEbpgTxuyB2DXBY32prBCjVK2RDeHFrAF2E9UpQWYlRwAHghWyyKEECHF/UXoRDITEQlOoVsmEyQMmYX4QVQTBNUdIVvZ2rbm+AgRvNQ8NzvAZeE7Jhyw8akaUAzwbBMiDUVb2djDLnuM30kpANA5+ylTrbUEF/mWmJ0Oro7eA1rwnZcOw0WxH8Yty1fRn+Gi++Bc1fy6v4xVcdAP5fJTp/oZ2S7eAxYe+Iv5YfIRsCn2WrWAOcUm+dkjZ0WBaUg4eEvSNnWUP4eC3fQjbMlp6ylTQAOqUIUim5EgICvCS+d5Q/IRsFM078Iqy6Homma0GpXiEbjh2/CGs+YNrYZC8BpXqFbBh2XAboa+mKVG8AcmejHQBJjvD3+Ng8UKpXyIZjpxsAmTHV9XueaJmdsiEKhS4iZIJsOHZoWh/YxP1wLJaStfX21MEDzK2gi8W8k8U/5+OCOplMQTYscD4DmKiRazPnJSaAu+Kf83FBM+ciEzUvFVsaAGXkyDGdOT70XPMvIPB195GbvSNk8dDzzb/SjzbQYWtolR7yiz//Jtq4vNaelM9ejZeFLJAJ/6kr2S7CFD55/cvfHd/nv1fjzWeFkAXHymlcAGh6UEs77dJbwr/GE9Ds9nM++DP4s/g73BAyQBZZfriH5HZBSvjE7OXL4/Ff/ur4ePcdik5yv1fjnpABskAmWkEgMpiPW6HwqdnnXF33RSIBEShQoe/IgMCnJjnGBrnILb5otsPScxckVv7w+8r3oUCFviMDFRuNxViq7wM0yo/Tjjir9pPm1vRiKDChz+g75aFRhhT3AUwQKHjHeQqPkYidfODZ5mdAgIQCEfqKPqPvThaUExoHH2Xo7v8peMd56rYHwtPGTop/DQUi9BV9Rt8pD/0SxGcAaJSglNP2OHrpyw3h9ALo4UIf0Vfqv0YJAiYD2HsAVe1P0SA0N9uxM66ofzCJb0z3UKFv6CP6qoCfIozYNYBtRWjuglLEkh992bb8jkeaHkxLkYIeJvQJfUMf0VcmA5gSpNmKYEqQCn4SLXN+033hSU++3PIkadZ5WugL+oS+OX1F48sQha+/BkiF2WwQHHbeNXW/v/5B9CUceE+Aj76gT9RPBr7NtSK4XhCRfgZQO+7c5d89+kLLk14uRzh29AF9of7pZgDDlStBClMHIckEInHBtfV/3Hhf4/1eXJhxzDh29AF9YcBnzrnFl9+GamaBVC3ETuBOy1y77cHw5INOqb2prsFeBB4RjhXHjGNHHxj/0FQLsNSZ/dwuiG9J8GUoQe2L7yLL1tpx4S1/jot9353vmHFsOEYcK45Z5QtffvgWhEqm/gc28Q+bMkdAxWJSPv9m69S2lelZm25QNCJUJMqgG6mxOb3sunsanzj90rofOseaYOAn2ABo7P31M4CWIT4LaAbE8UhfP/hU84xhmy+46b3Po+/GE+4/3oJjwLHgmHBs3Ng14KsX3xwyAM0p/ddMWUsmpXz308i8l99p+2XoYH/H8CG+QT5LBGE1qj0mWz/5pv3zfY9b9txzb7RO7xwTnelcFvD1n2k/aweAKTXZwWce02iLpFPvfBKZ+/RrkZ+Li4266kozWFVpVnOBzHVPP29RcuabH0c/PfDkFa++/HbLjM4xxDSAa89+5SMojCyt/5FO/UvTbLbov7dghcNJ+7yr8UYH/txqs6KqC06t3HST9QJrjRhqjfb7RAhyUCIp2xcsTs0dOzk+87EXm8f9NbajCf92Bh63jSbHbGe+VgkS+f7oYof5iPnJa8txNFUfeBQIGObRB5UO23qz4OBRw/z9BvW3+lV3ZkggIIJ+X6f5RQCQUELGO0HH4nEZCzfb4WW1qbp5ixJ1f46NLX39g8ii/9o7A9WGQSiKdrD9/wdHdTCgjHA4XFEgDyo8VIVS7gkvatrc6xqd9jGwnwEAvukKzv4dwKmXdwOIHwBB/W+A8Iarf3bLf1JzB9B8Kc19EL7nPjOnXl/vAKeJIqes1B8g3C1U0Oa7dc73UDfK+YviO4CTEADGFAgWLDYLTmMXhAHg1OMpJxf/tIdM6Os4F0B0aHcQ3a94z+l+g10/ZBu5kc95ALmVrKQgefAvKcZvojCGy0mA0PCql5QjYh8F4BC87Kcgh9Bc/DgaRH+AjZVAcBBTQAzoe/rhNAThEAAWP9t9sJHbtpXhH3hpQ7w/TzZ+/0UZBBcgW3vdyrCamSeK7eJ/hQCmQ8Aoaea5b2frYFLxcwjc3rezrW7oLG33ZmFxMADIeUPn4pbmHr4Km1B71LQ0/5j6FwCQgZBa5jIAUtucCl8TwLr/oo9pcRg+JsLXB+AwlmF5WRTV5+sD8OIAfDyHkAN4FQBQ9rvN1wPLL8kixzbPyS4xAAAAAElFTkSuQmCC";

        var del = new Image();
        del.src = deleteIcon;
        // top-right
        ctx.drawImage(del, left + width, top, this.cornerSize, this.cornerSize);

        var resize = new Image();
        resize.src = resizeIcon;
        // bottom-left
        ctx.drawImage(resize, left, top + height, this.cornerSize, this.cornerSize);
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
