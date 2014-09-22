
var method = FormatTools.prototype;

function FormatTools() {
};

method.formatTime = function(pace) {
    // incoming pace is in milliseconds
    var totalSeconds = Math.round(pace / 1000);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    return padLeft(hours, 2, '0') + ':' + padLeft(minutes, 2, '0') + ':' + padLeft(seconds, 2, '0');
}

function padLeft(value, length, padding) {
    value = value.toString();
    while (value.length < length) {
        value = padding + value;
    }
    return value;
}

module.exports = FormatTools;
