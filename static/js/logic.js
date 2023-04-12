
d3.json(https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson).then(function (data) {
  
  createFeatures(data.features);
  console.log(data.features)
});

function createFeatures(earthquakeData) {

  
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr> 
    <p> 
    ${new Date(feature.properties.time)}</br>
    <b>Magnitude:</b> ${feature.properties.mag}</br>
    <b>Quake Depth:</b> ${feature.geometry.coordinates[2]}
    </p>`);


  }

  
  let colorArray = ["#43D0AA","#46CED2","#49A7D4","#4C80D6","#4F59D8","purple"]

  function color(feature) {
   
    let depth = feature.geometry.coordinates[2];
    if (depth < 10) {
        this_color = colorArray[0];
      }
      else if (depth < 30) {
        this_color = colorArray[1];
      }
      else if (depth < 50) {
        this_color = colorArray[2];
      }
      else if (depth < 70) {
        this_color = colorArray[3];
      }
      else if (depth < 90) {
        this_color = colorArray[4];
      }
      else {
        this_color = colorArray[5];
      }
    return this_color;
  };


  let earthquakes = L.geoJSON(earthquakeData, {

    pointToLayer(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 3,
        fillColor: color(feature),
        color: "white",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    }, 
    onEachFeature
  }).addTo(myMap);



   //Legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function(map) {
      let div = L.DomUtil.create("div", "info legend");
      let limits = [-10, 10, 30, 50, 70, 90];
      let legcolors = colorArray;
      let labels = [];

      let from, to;

      for (let i = 0; i < limits.length; i++) {
        from = limits[i];
        to = limits[i + 1];
  
        labels.push(`<i style="background:${legcolors[i]}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
      }
      let lengendInfo = "<b>Earthquake Depth</b><hr>";
      div.innerHTML = lengendInfo + labels.join('<br>');
      return div;
    };
  
    legend.addTo(myMap);

 
  createMap(earthquakes);
}

function createMap(earthquakes) {

 
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  
  let overlayMaps = {
    "Earthquakes": earthquakes
  };


  //Layer Control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
