(function(){
  EventTarget.prototype.addEventListeners = function(listenerMap) {
    var me = this;
    Object.entries(listenerMap).forEach((entry) => {
      me.addEventListener(entry[0],entry[1]);
    });
  };
})();