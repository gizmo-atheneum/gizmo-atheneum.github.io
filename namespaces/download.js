namespace('gizmo-atheneum.namespaces.Download',{
}, ({ }) => {
    const normalizeFilename = function (filename, ext, defaultFilename) {
        filename = filename || defaultFilename;
        if (filename.endsWith(ext)) {
            filename = filename.replace(ext, '');
        }
        filename = encodeURIComponent(filename);
        if (filename.length === 0) {
            return defaultFilename;
        }
        return filename + ext;
    };
    const triggerDownload = function (fileName, defaultFilename, extension, dataUrl) {
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.setAttribute('href', dataUrl);
        link.setAttribute(
            'download',
            normalizeFilename(fileName, extension, defaultFilename));
        link.click();
        document.body.removeChild(link);
    }
    const triggerPNGDownload = function (fileName, defaultFilename, imageURL) {
        triggerDownload(fileName,defaultFilename,".png",imageURL);
    };
    const triggerJSONDownload = function (fileName, defaultFilename, jsonData) {
        const dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(jsonData));
        triggerDownload(fileName,defaultFilename,".json",dataStr);
    };
    const triggerCSVDownload = function (fileName, defaultFilename, delim, table) {
      const dataStr =
          'data:text/csv;charset=utf-8,' +
          encodeURIComponent(table.map(row => row.join(delim)).join("\n"));
      triggerDownload(fileName,defaultFilename,".csv",dataStr);
  };
  return { triggerDownload, triggerJSONDownload, triggerPNGDownload, triggerCSVDownload };
});