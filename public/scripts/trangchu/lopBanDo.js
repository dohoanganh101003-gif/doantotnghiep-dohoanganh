export function taoLayer(map) {
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

  return { wmsLayer, polygonLayer };
}
