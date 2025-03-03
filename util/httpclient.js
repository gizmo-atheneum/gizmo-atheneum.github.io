(function(){
  let HttpClient = function() {
    this.send = function(request) {
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          request.callback(request,{
            status:xhr.status,
            headers:xhr.getAllResponseHeaders(),
            body:xhr.responseText
          });
        }
      };
      xhr.open(request.method,request.url,request.isAsync,request.user,request.password);
      xhr.send(request.body);
    }
  }
  window.HttpClient = new HttpClient();
})();