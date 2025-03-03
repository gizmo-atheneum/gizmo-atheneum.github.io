namespace("gizmo-atheneum.namespaces.react.PaperDoll", {}, () => {
  return function ({ dataset, schematic, getLayerLabel, callback, width, height }) {
    const onClick = function (e, index) {
      e.preventDefault();
      callback(index);
    }
    const { dim, defs, background, svgLayers } = dataset.buildSVGComponents(schematic);
    return <svg width={ width } height={ height } viewBox={ dim.join(" ") }>
      <defs dangerouslySetInnerHTML={{ __html: defs }}></defs>
      <g dangerouslySetInnerHTML={{ __html: background }}></g>
      { svgLayers.map((layer, index) => <a 
          href="#" 
          onClick={(e) => onClick(e, index)} 
          dangerouslySetInnerHTML={{ 
            __html: `<title>${ getLayerLabel(index,layer) }</title>${ layer }`
          }}></a>) }
    </svg>;
  };
});