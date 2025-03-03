namespace("gizmo-atheneum.namespaces.Ajax", {}, () => {
  const callbackEvents = {
    success: 'AjaxSuccess',
    failure: 'AjaxFailure',
    stateChange: 'AjaxStateChanged',
  };
  const defaultCallbacks = Object.entries(callbackEvents).reduce(
    (out, [k, v]) => {
      out[k] = (arg) => {
        document.dispatchEvent(new CustomEvent(v, { detail: arg }));
      };
      return out;
    },
    {}
  );
  const wranglePayloadAndCallbacks = function (payload, callbacks) {
    [payload, callbacks] = callbacks ? [payload, callbacks] : [undefined, payload];
    if (typeof callbacks == 'function') {
      callbacks = {
        success: callbacks,
      };
    }
    callbacks = Object.entries(callbacks).reduce((out, [k, v]) => {
      out[k] = v;
      return out;
    }, defaultCallbacks);
    return { payload, callbacks };
  }
  const request = function (method, filepath, payload, callbacks) {
    const wrangler = wranglePayloadAndCallbacks(payload, callbacks);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          wrangler.callbacks.success(this.responseText);
        } else {
          if (wrangler.callbacks.failure) {
            wrangler.callbacks.failure({
              requestedFile: filepath,
              status: this.status,
              statusText: this.statusText,
              responseText: this.responseText,
            });
          }
        }
      } else {
        if (wrangler.callbacks.stateChange) {
          wrangler.callbacks.stateChange({
            state: this.readyState,
            min: 0,
            max: 4,
          });
        }
      }
    };
    xhttp.open(method, filepath, true);
    if (wrangler.payload) {
      xhttp.send(wrangler.payload);
    } else {
      xhttp.send();
    }
  };
  const poll = function (method, filepath, interval, payload, callbacks) {
    const wrangler = wranglePayloadAndCallbacks(payload, callbacks);
    const polling = {
      errorCount: 0
    };
    const pollingCallbacks = {
      success: (respText) => {
        polling.errorCount = 0;
        wrangler.callbacks.success(respText)
      },
      stateChange: wrangler.callbacks.stateChange,
      failure: (error) => {
        polling.errorCount++;
        error.pollingErrorCount = polling.errorCount;
        wrangler.callbacks.failure(error);
      }
    }
    polling.interval = setInterval(() => {
      request(method, filepath, wrangler.payload, pollingCallbacks);
    }, interval);
    return () => {
      clearInterval(polling.interval);
    }
  }
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTION'];
  const retval = methods.reduce((out, method) => {
    out[method.toLowerCase()] = ((filepath, payload, callbacks) => {
      return request(method, filepath, payload, callbacks);
    });
    return out;
  }, { request, poll });
  return retval;
});