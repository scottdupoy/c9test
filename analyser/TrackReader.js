var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var method = TrackReader.prototype;

function TrackReader() {
};

method.readFile = function(file, callback) {
    console.log('Reading file: ' + file);
    fs.readFile(file, function(err, data) {
        if (err) {
            console.log('ERROR: Could not read file: ' + err);
            callback(err, null);
            return;
        }
        parser.parseString(data, function(err, trackData) {
            if (err) {
                console.log('ERROR: Could not parse XML in file: ' + err);
                callback(err, null);
                return;
            }
            callback(null, trackData);
        });
    });
};

module.exports = TrackReader;
