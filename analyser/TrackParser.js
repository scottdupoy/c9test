var GeometryTools = require('./GeometryTools.js');

var method = TrackParser.prototype;

function TrackParser() {
};

method.parseTrackData = function(data, callback) {
    var geometryTools = new GeometryTools();

    var track = { };

    track.time = new Date(Date.parse(data['gpx']['metadata'][0]['time'][0]));
    track.name = data['gpx']['trk'][0]['name'][0];
    track.points = [ ];

    var previousPoint = null;
    var totalDistance = 0.0;

    var pointsData = data['gpx']['trk'][0]['trkseg'][0]['trkpt'];
    pointsData.forEach(function(pointData) {
        var point = { };

        point.lat = parseFloat(pointData['$']['lat']);
        point.lon = parseFloat(pointData['$']['lon']);
        point.ele = parseFloat(pointData['ele'][0]);
        point.time = new Date(Date.parse(pointData['time'][0]));

        // hr will probably fail if hr monitor wasn't used
        point.hr = parseInt(pointData['extensions'][0]['gpxtpx:TrackPointExtension'][0]['gpxtpx:hr'][0], 10);

        // update the distance running total
        if (previousPoint !== null) {
            totalDistance += geometryTools.distanceBetweenPointsInKm(previousPoint, point);
        }
        point.trackPositionInKm = totalDistance;

        track.points.push(point);

        previousPoint = point;
    });
    console.log('TOTAL DISTANCE: ' + totalDistance);

    callback(null, track);
};

module.exports = TrackParser;
