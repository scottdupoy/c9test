var GeometryTools = require('./GeometryTools.js');

var method = TrackAnalyser.prototype;

function TrackAnalyser() {
};

method.analyseTrack = function(track, targets) {
    console.log('Analysing');

    var analysis = {
        track: track,
        bestEfforts: { },
    };

    targets = targets.sort(function (x, y) { return x - y; });
    targets.forEach(function (target) {
        var targetAnalysis = analyse(track, target);
        analysis.start = targetAnalysis.start;
        analysis.end = targetAnalysis.end;
        analysis.duration = targetAnalysis.duration;
        analysis.distanceInKm = targetAnalysis.distanceInKm;
        analysis.distanceInMiles = targetAnalysis.distanceInMiles;

        if (targetAnalysis.bestEffort != null) {
            analysis.bestEfforts[target] = targetAnalysis.bestEffort;
        }
    });

    return analysis;
};

function analyse(track, target) {
    console.log('Analysing target: ' + target);
    var geometryTools = new GeometryTools();

    var totalDistanceInKm = 0.0;

    if (track.points.length < 2) {
        return analysis;
    }

    var deltas = [ ];
    var efforts = [ ];

    var previousPoint = track.points[0];
    var inTargetWindow = false;
    var intermediatePoint = { };

    for (var index = 1; index < track.points.length; ) {
        // walk index forward but note that it might be moved backwards again
        // if the front delta is splot
        var nextPoint = track.points[index];
        index++;

        var proposedDelta = {
            duration: nextPoint.time.getTime() - previousPoint.time.getTime(),
            distanceInKm: geometryTools.distanceBetweenPointsInKm(previousPoint, nextPoint),
            start: previousPoint,
            end: nextPoint,
        };

        var currentRunningTotal = 0.0;
        deltas.forEach(function(delta) {
            currentRunningTotal += delta.distanceInKm;
        });

        if (!inTargetWindow && (proposedDelta.distanceInKm + currentRunningTotal) >= target) {
            inTargetWindow = true;

            // about to reach (or breach) the target for the first time, therefore want to split the new delta to fit exactly
            if ((proposedDelta.distanceInKm + currentRunningTotal) > target)
            {
                intermediatePoint = geometryTools.findIntermediatePoint(proposedDelta.start, proposedDelta.end, (target - currentRunningTotal) / proposedDelta.distanceInKm);
                proposedDelta = {
                    duration: intermediatePoint.time.getTime() - previousPoint.time.getTime(),
                    distanceInKm: target - currentRunningTotal,
                    start: proposedDelta.start,
                    end: intermediatePoint,
                };
                index--;
            }
            // otherwise it exactly fits so don't do anything else
        }
        else if (inTargetWindow) {
            var earliestDelta = deltas[0];
            if (proposedDelta.distanceInKm < earliestDelta.distanceInKm)
            {
                // split the earliest delta and add use the proposed one at the end
                intermediatePoint = geometryTools.findIntermediatePoint(earliestDelta.start, earliestDelta.end, proposedDelta.distanceInKm / earliestDelta.distanceInKm);
                deltas[0] =
                {
                    duration: earliestDelta.end.time.getTime() - intermediatePoint.time.getTime(),
                    distanceInKm: earliestDelta.distanceInKm - proposedDelta.distanceInKm,
                    start: intermediatePoint,
                    end: earliestDelta.end,
                };
            }
            else if (proposedDelta.distanceInKm == earliestDelta.distanceInKm)
            {
                // remove the earliest and add the proposed one
                deltas.splice(0, 1);
            }
            else
            {
                // remove the earliest and split the proposed one
                deltas.splice(0, 1);
                intermediatePoint = geometryTools.findIntermediatePoint(proposedDelta.start, proposedDelta.end, earliestDelta.distanceInKm / proposedDelta.distanceInKm);
                proposedDelta = {
                    duration: intermediatePoint.time.getTime() - proposedDelta.start.time.getTime(),
                    distanceInKm: earliestDelta.distanceInKm,
                    start: proposedDelta.start,
                    end: intermediatePoint,
                };
                index--;
            }
        }
        // otherwise we're still generating deltas while we work up to the target

        // add the final proposed delta to the end and update the previous point to the last one in the running delta window
        deltas.push(proposedDelta);
        totalDistanceInKm += proposedDelta.distanceInKm;
        previousPoint = proposedDelta.end;

        // cache the target effort (we'll find the fastest one later)
        if (inTargetWindow) {
            var deltaDistance = 0.0;
            deltas.forEach(function(delta) {
                deltaDistance += delta.distanceInKm;
            });

            var effort = {
                distanceInKm: deltaDistance,
                distanceInMiles: deltaDistance / 1.609344,
                duration: 0.0,
                points: [ ],
            };

            effort.points.push(deltas[0].start);
            deltas.forEach(function(effortDelta) {
                effort.points.push(effortDelta.end);
                effort.duration += effortDelta.duration;
            });

            efforts.push(effort);
        }
    }

    var analysis = {
        bestEffort: null,
        start: deltas[0].time,
        end: deltas[deltas.length - 1].end.time,
        duration: previousPoint.time.getTime() - track.points[0].time.getTime(),
        distanceInKm: totalDistanceInKm,
        distanceInMiles: totalDistanceInKm / 1.609344,
    };

    // may be null
    efforts.forEach(function(effort) {
        if (analysis.bestEffort === null || effort.duration < analysis.bestEffort.duration) {
            analysis.bestEffort = effort;
        }
    });

    return analysis;
}

module.exports = TrackAnalyser;
