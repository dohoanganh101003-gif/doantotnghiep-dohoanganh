export function taoLayer(map, baseMaps) {
  const wmsLayer = L.tileLayer
    .wms("http://localhost:8080/geoserver/nhamay/wms", {
      layers: "nhamay:nhamay_dien",
      styles: "nhamay_style",
      format: "image/png",
      transparent: true,
    })
    .addTo(map);

  const polygonLayer = L.tileLayer
    .wms("http://localhost:8080/geoserver/nhamay/wms", {
      layers: "nhamay:nhamay_polygon",
      styles: "nhamay_style_polygon",
      format: "image/png",
      transparent: true,
    })
    .addTo(map);

  const overlayMaps = {
    "Nhà máy điện (điểm)": wmsLayer,
    "Vùng nhà máy (polygon)": polygonLayer,
  };

  L.control.layers(baseMaps, overlayMaps).addTo(map);
  return { wmsLayer, polygonLayer };
}
