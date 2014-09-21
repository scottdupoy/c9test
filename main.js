var TrackReader = require('./analyser/TrackReader.js');
var TrackParser = require('./analyser/TrackParser.js');
var TrackAnalyser = require('./analyser/TrackAnalyser.js');

var file = __dirname + '/data/test-15km.gpx';

new TrackReader().readFile(file, function(err, trackData) {
    if (err) {
        return;
    }
    new TrackParser().parseTrackData(trackData, function(err, track) {
        if (err) {
            return;
        }
        new TrackAnalyser().analyseTrack(track, [ 1.0, 5.0, 10.0, 15.0, 20.0 ], function(err, analysis) {
            console.log('PARSED:');
            console.log('  NAME: ' + track.name);
            console.log('  TIME: ' + track.time.toISOString());
        });
    });
});
