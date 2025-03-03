(function(){
  window.Template = function(tplStr) {
    this.apply = function(ctx) {
      return eval("`" + tplStr + "`");
    }
  }
  // todo - conditional templates "@condition"
  // todo - looping templates "@for,@as,@index"
  let TemplateMap = function(tplMap) {
    this.apply = function(tplName,ctx) {
      tplMap[tplName].apply(ctx);
    }
  }
  Template.collect = function() {
    let templates = {};
    let elems = Array.from(document.querySelectorAll("[templateName]")); 
    // traverse dom tree instead of by lookup, 
    // user must put id-based templates into a "templates" node which will be removed at runtime
    // to allow for nesting, ids of templates will be generated from the path to the node to ensure unique ids
    // inner templates will then be replaced by a call to the inner template with the current context
    // todo -- how is context to be maintained? how is dom to be updated? 
    elems.forEach((e) => {
      let tplName = e.getAttribute("templateName");
      e.removeAttribute("templateName");
      templates[tplName] = buildTemplateFn(e.outerHTML);
      e.parentNode.removeChild(e);
    });
    return new TemplateMap(templates);
  }
  let $ = 4;
  window.initTemplates = function() {
    window.Templates = new TemplateMap(Template.collect());
  }
})()