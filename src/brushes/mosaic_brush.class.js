/**
 * PatternBrush class
 * @class fabric.PatternBrush
 * @extends fabric.BaseBrush
 */

fabric.MosaicBrush = fabric.util.createClass(fabric.PencilBrush, /** @lends fabric.PatternBrush.prototype */ {

  getPatternSrc: function() {
    var patternCanvas = fabric.document.createElement('canvas'),
      patternCtx = patternCanvas.getContext('2d'),
      lowerCanvas = document.querySelector(this.lowerQuery),
      realHeight = lowerCanvas.height,
      realWidth = lowerCanvas.width,
      upperCanvas = document.querySelector(this.upperQuery),
      clientHeight = upperCanvas.height,
      clientWidth = upperCanvas.width,
      ctx = lowerCanvas.getContext('2d');

    var blocksize =  this.blocksize || 10;
    console.log(blocksize);
    // 临时图层用于存放经过马赛克处理的原图
    // 大小为用户所见canvas大小
    patternCanvas.width = clientWidth;
    patternCanvas.height = clientHeight;

    // 由于可见区域大小与原图像大小有可能不一致
    // 所以需要做缩放动作再写入临时图层
    patternCtx.scale(clientWidth / realWidth, clientHeight / realHeight);
    patternCtx.drawImage(ctx.canvas, 0, 0);
    var imageData = patternCtx.getImageData(0, 0, realWidth, realHeight);

    // 马赛克处理
    patternCtx.putImageData(getMosaicData(imageData, blocksize), 0, 0);

    function getMosaicData(imageData, blocksize) {
      var data = imageData.data,
        iLen = imageData.height,
        jLen = imageData.width,
        index, i, j, r, g, b, a;

      for (i = 0; i < iLen; i += blocksize) {
        for (j = 0; j < jLen; j += blocksize) {

          index = (i * 4) * jLen + (j * 4);

          r = data[index];
          g = data[index + 1];
          b = data[index + 2];
          a = data[index + 3];

          /*
           blocksize: 4

           [1,x,x,x,1]
           [x,x,x,x,1]
           [x,x,x,x,1]
           [x,x,x,x,1]
           [1,1,1,1,1]
           */

          for (var _i = i, _ilen = i + blocksize; _i < _ilen; _i++) {
            for (var _j = j, _jlen = j + blocksize; _j < _jlen; _j++) {
              index = (_i * 4) * jLen + (_j * 4);
              data[index] = r;
              data[index + 1] = g;
              data[index + 2] = b;
              data[index + 3] = a;
            }
          }
        }
      }
      return imageData;
    }

    return patternCanvas;
  },

  getPatternSrcFunction: function() {
    return String(this.getPatternSrc)
      .replace('this.upperQuery', '"' + this.upperQuery + '"')
      .replace('this.lowerQuery', '"' + this.lowerQuery + '"')
      .replace('this.blocksize', this.blocksize);
    //return String(this.getPatternSrc)
  },

  /**
   * Creates "pattern" instance property
   */
  getPattern: function() {
    var canvas = this.canvas;
    this.upperQuery = fabric.util.Simmer(canvas.upperCanvasEl);
    this.lowerQuery = fabric.util.Simmer(canvas.lowerCanvasEl);
    this.blocksize = this.blocksize || 10;

    return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), 'repeat');
  },

  /**
   * Sets brush styles
   */
  _setBrushStyles: function() {
    this.callSuper('_setBrushStyles');
    this.canvas.contextTop.strokeStyle = this.getPattern();
  },

  /**
   * Creates path
   */
  createPath: function(pathData) {
    var path = this.callSuper('createPath', pathData),
        topLeft = path._getLeftTopCoords().scalarAdd(path.strokeWidth / 2);

    path.stroke = new fabric.Pattern({
      source: this.source || this.getPatternSrcFunction(),
      offsetX: -topLeft.x,
      offsetY: -topLeft.y
    });
    return path;
  }
});
