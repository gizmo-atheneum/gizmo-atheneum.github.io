(function(){
  
  const keyEventFields = [ 
    "altKey", "code", "ctrlKey", "shiftKey", 
    "key", "keyCode", "target", "type"
  ];

  const keyHolds = {};
  
  const eventMap = {
    "keyup": {
      "hold": false,
      "event": "keyrelease",
      "suffix": "release"
    },
    "keydown": {
      "hold": true,
      "event": "keyhold",
      "suffix": "hold"
    }
  };

  const suffixes = {
    "keyup":"up",
    "keydown":"down",
    "keypress":"press"
  }

  const getKeyState = ((detail) => {
    return (detail.altKey?"alt":"") + (detail.ctrlKey?"ctrl":"") + (detail.shiftKey?"shift":"");
  });

  const stateKeys = {
    "altAlt": true,
    "shiftShift": true,
    "ctrlControl": true,
  };

  const wrapKeyEvent = ((mapped, detail) => {
    const keyState = getKeyState(detail);
    const keyEvent = detail.code.toLowerCase() + mapped.suffix;
    const keyStateEvent = detail.code.toLowerCase() + keyState + mapped.suffix;
    document.dispatchEvent(new CustomEvent(keyEvent, { detail }));
    if (keyState.length > 0 && !stateKeys[keyState + detail.key]) {
      document.dispatchEvent(new CustomEvent(mapped.event + keyState, { detail }));
      document.dispatchEvent(new CustomEvent(keyStateEvent, { detail }));
    }
  });

  const handleKeyEvent = ((e) => {
    const detail = keyEventFields.reduce((out,field) => {
      out[field] = e[field];
      return out;
    },{});
    detail.preventDefault = (() => {
      e.preventDefault();
      if (keyHolds[detail.keyCode]) {
        keyHolds[detail.keyCode].preventDefault = true;
      }
    });
    wrapKeyEvent({
      event: detail.type,
      suffix: suffixes[detail.type]
    }, detail);
    if (detail.type in eventMap) {
      const mapped = eventMap[detail.type]
      if ((keyHolds[detail.keyCode]||{}).hold != mapped.hold) {
        document.dispatchEvent(new CustomEvent(mapped.event, { detail }));
        wrapKeyEvent(mapped, detail);
      }
      keyHolds[detail.keyCode] = { hold: mapped.hold };
    } else if (keyHolds[detail.keyCode] && keyHolds[detail.keyCode].preventDefault) {
      e.preventDefault();
    }
  });

  window.initKeyEventWrapper = function() {
    document.addEventListener("keydown",handleKeyEvent);
    document.addEventListener("keyup",handleKeyEvent);
    document.addEventListener("keypress",handleKeyEvent);
  }

})();