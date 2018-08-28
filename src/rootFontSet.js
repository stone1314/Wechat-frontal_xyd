/* eslint-disable no-dupe-keys */
/**
 * Created by abrahamchen on 2018/5/31.
 */

(function flexible (window, document) {
    var docEl = document.documentElement
    var dpr = window.devicePixelRatio || 1
    // 设置 1rem = viewWidth / 10
    function setRemUnit () {
      var rem = docEl.clientWidth / 10
      docEl.style.fontSize = rem + 'px'
    }
    setRemUnit()
  
    // 设置 rem 在屏幕大小变化时
    window.addEventListener('resize', setRemUnit)
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        setRemUnit()
      }
    })
  }(window, document))