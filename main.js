var TrackReader = require('./analyser/TrackReader.js');
var TrackParser = require('./analyser/TrackParser.js');
var TrackAnalyser = require('./analyser/TrackAnalyser.js');
var GeometryTools = require('./analyser/GeometryTools.js');
var FormatTools = require('./analyser/FormatTools.js');

var geometryTools = new GeometryTools();
var formatTools = new FormatTools();

//var file = __dirname + '/data/test-4m.gpx';
var file = __dirname + '/data/test-15km.gpx';

new TrackReader().readFile(file, function(err, trackData) {
    if (err) {
        return;
    }
    new TrackParser().parseTrackData(trackData, function(err, track) {
        if (err) {
            return;
        }

        // synchronous call for analysis
        //var analysis = new TrackAnalyser().analyseTrack(track, [ 0.5, 1.609344 / 2, 1.0, 1.609344, 2 * 1.609344, 5.0, 5 * 1.609344, 10.0, 15.0, 10 * 1.609344, 20.0, 13.11 * 1.609344 ]);
        var analysis = new TrackAnalyser().analyseTrack(track, [ 1.0, 1.609344, 5.0, 10.0, 10 * 1.609344, 13.11 * 1.609344 ]);

        console.log();
        console.log('Analysed:');
        console.log('  Name:       ' + track.name);
        console.log('  Time:       ' + track.time.toISOString());
        console.log('  Duration:   ' + formatTools.formatTime(analysis.duration));
        console.log('  Distance K: ' + analysis.distanceInKm.toFixed(2));
        console.log('  Distance M: ' + analysis.distanceInMiles.toFixed(2));
        console.log('  Pace K:     ' + formatTools.formatTime(geometryTools.calculatePace(analysis.duration, analysis.distanceInKm, 'K')));
        console.log('  Pace M:     ' + formatTools.formatTime(geometryTools.calculatePace(analysis.duration, analysis.distanceInKm, 'M')));
        console.log();

        // list in numerical order (default for hash => alphabetical order)
        var targetKeys = Object.keys(analysis.bestEfforts);
        targetKeys.sort(function (x, y) { return x - y; });
        targetKeys.forEach(function(target) {
            var effort = analysis.bestEfforts[target];
            console.log('Best ' + effort.distanceInKm.toFixed(2) + 'k effort:');
            console.log('  Distance K:   ' + effort.distanceInKm.toFixed(2))
            console.log('  Distance M:   ' + effort.distanceInMiles.toFixed(2))
            console.log('  Duration:     ' + formatTools.formatTime(effort.duration));
            console.log('  Pace K:       ' + formatTools.formatTime(geometryTools.calculatePace(effort.duration, effort.distanceInKm, 'K')));
            console.log('  Pace M:       ' + formatTools.formatTime(geometryTools.calculatePace(effort.duration, effort.distanceInKm, 'M')));
            //console.log('  Start time:   ' + effort.points[0].time.toISOString());
            //console.log('  End time:     ' + effort.points[effort.points.length - 1].time.toISOString());
            //console.log('  Start pos K:  ' + effort.points[0].trackPositionInKm.toFixed(2));
            //console.log('  Start pos K:  ' + effort.points[effort.points.length - 1].trackPositionInKm.toFixed(2));
            console.log();
        });
    });
});
