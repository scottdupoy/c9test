
var method = GeometryTools.prototype;

function GeometryTools() {
};

method.distanceBetweenPointsInKm = function(p1, p2) {
    var radiusKm = 6371;
    var latDiff = convertDegreesToRadians(p2.lat - p1.lat);
    var lonDiff = convertDegreesToRadians(p2.lon - p1.lon);
    var a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.cos(convertDegreesToRadians(p1.lat)) * Math.cos(convertDegreesToRadians(p2.lat)) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    var c = 2 * Math.asin(Math.min(1, Math.sqrt(a)));
    var d = radiusKm * c;
    return d;
};

function convertDegreesToRadians(degrees) {
    return (Math.PI / 180) * degrees;
}

module.exports = GeometryTools;
