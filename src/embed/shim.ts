
;(function () {
  try {
    if (typeof (window as any).process === 'undefined') {
      ;(window as any).process = { env: {} }
    }
  } catch (e) {
  
  }
})();
