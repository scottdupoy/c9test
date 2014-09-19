var TrackReader = require('./analyser/TrackReader.js');
var TrackParser = require('./analyser/TrackParser.js');

var file = __dirname + '/data/test-15km.gpx';

new TrackReader().readFile(file, function(err, trackData) {
    if (err) {
        return;
    }
    new TrackParser().parseTrackData(trackData, function(err, track) {
        if (err) {
            return;
        }
        console.log('PARSED:');
        console.log('  NAME: ' + track.name);
        console.log('  TIME: ' + track.time.toISOString());
    });
});
