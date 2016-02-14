var vecmat = require('lethexa-vecmat');

/**
 * calculates the new position by speed and delta-time.
 * @method getPositionByVeloAndTime
 * @param position {Vector3d} The old position.
 * @param velocity {Velocity} The velocity.
 * @param dt {Number} The delta-time.
 * @return {Vector3d} The new position.
 * @for motionpredict
 */
module.exports.getPositionByVeloAndTime = function(position, velocity, dt) {
  return position.add(velocity.mul(dt));
}; 


/**
 * Solves the quadratic equation for p and q.
 * @method quadEquation
 * @param p {Number} The parameter p.
 * @param q {Number} The parameter q.
 * @return {Array} The result with zero, one or two solutions.
 * @for motionpredict
 */
module.exports.quadEquation = function( p, q ) {
  var wurzel = Math.sqrt((p * p / 4) - q);
  var vorwurzel = (-p / 2);
  var result = [];
  if( wurzel > 0 ) {
    result = [vorwurzel + wurzel, vorwurzel - wurzel];
  }
  else if( wurzel === 0 ) {
    result = [vorwurzel];
  }
  return result;
};


/**
 * Calculates the time of closest point of approach (TCPA) of two tracks.
 * @method calcCPATime
 * @param position1 {Vector3d} The position of track 1.
 * @param velocity1 {Vector3d} The velocity of track 1.
 * @param position2 {Vector3d} The position of track 2.
 * @param velocity2 {Vector3d} The velocity of track 2.
 * @return {Number} The time of CPA relative to now (0s) or undefined if CPA does not exists. Negative values show a CPA in the past 
 * @for motionpredict
 */
module.exports.calcCPATime = function(position1, velocity1, position2, velocity2) {
  var posDiff = position2.sub(position1);
  var veloDiff = velocity2.sub(velocity1);

  var zaehler = -posDiff.dot(veloDiff);
  var nenner = veloDiff.lengthSquared();

  return nenner === 0.0 ? undefined : zaehler / nenner;
};


/**
 * Calculates the position of closest point of approach (CPA) of track 1.
 * @method calcCPAPositionTarget1
 * @param position1 {Vector3d} The position of track 1.
 * @param velocity1 {Vector3d} The velocity of track 1.
 * @param position2 {Vector3d} The position of track 2.
 * @param velocity2 {Vector3d} The velocity of track 2.
 * @return {Vector3d} The position of CPA or undefined if CPA does not exists. 
 * @for motionpredict
 */
module.exports.calcCPAPositionTarget1 = function(position1, velocity1, position2, velocity2) {
  var tcpa = module.exports.calcCPATime(position1, velocity1, position2, velocity2);
  if(tcpa === undefined)
    return undefined;
  return module.exports.getPositionByVeloAndTime(position1, velocity1, tcpa);
};


/**
 * Calculates the position of closest point of approach (CPA) of track 2.
 * @method calcCPAPositionTarget2
 * @param position1 {Vector3d} The position of track 1.
 * @param velocity1 {Vector3d} The velocity of track 1.
 * @param position2 {Vector3d} The position of track 2.
 * @param velocity2 {Vector3d} The velocity of track 2.
 * @return {Vector3d} The position of CPA or undefined if CPA does not exists. 
 * @for motionpredict
 */
module.exports.calcCPAPositionTarget2 = function(position1, velocity1, position2, velocity2) {
  var tcpa = module.exports.calcCPATime(position1, velocity1, position2, velocity2);
  if(tcpa === undefined)
    return undefined;
  return module.exports.getPositionByVeloAndTime(position2, velocity2, tcpa);
};


/**
 * Calculates the intercepttime to the target at a given speed.
 * @method calcInterceptTime
 * @param myPos {Vector3d} The position of the interceptor.
 * @param myVelo {Number} The velocity at which the target should be intercepted.
 * @param targetPos {Vector3d} The position of the target.
 * @param targetVelo {Vector3d} The velocity and direction in which the target is moving.
 * @return {Number} The time from now at which the target is reached.
 * @for motionpredict
 */
module.exports.calcInterceptTime = function(myPos, myVelo, targetPos, targetVelo) {
  var relTargetPos = targetPos.sub(myPos);
  var a = targetVelo.lengthSquared() - myVelo * myVelo;
  var b = 2.0 * targetVelo.dot(relTargetPos);
  var c = relTargetPos.lengthSquared();

  if( a === 0 ) {
    if( b !== 0 ) {
      var time = -c / b;
      if( time > 0.0 )
        return time;
    }
  }
  else {
    // P und Q berechnen...
    var p = b / a;
    var q = c / a;

    // Quadratische Gleichung lösen...
    var times = module.exports.quadEquation(p, q);
    if( times.length === 0 )
      return [];

    if( times.length === 2 ) {
      var icptTime = Math.min(times[0], times[1]);
      if( icptTime < 0.0 ) {
        icptTime = Math.max(times[0], times[1]);
      }
      return icptTime;
    }
    else if( times.length === 1 ) {
      if( times[0] >= 0.0 ) {
        return times[0];
      }
    }
  }
  return undefined;
};


/**
 * Calculates the intercept-position of the target.
 * @method calcInterceptPosition
 * @param myPos {Vector3d} The position of the interceptor.
 * @param myVelo {Number} The velocity at which the target should be intercepted.
 * @param targetPos {Vector3d} The position of the target.
 * @param targetVelo {Vector3d} The velocity and direction in which the target is moving.
 * @return {Vector3d} The position at which the target is reached.
 * @for motionpredict
 */
module.exports.calcInterceptPosition = function(myPos, myVelo, targetPos, targetVelo) {
  var ticpt = module.exports.calcInterceptTime(myPos, myVelo, targetPos, targetVelo);
  if(ticpt === undefined)
    return undefined;
  return module.exports.getPositionByVeloAndTime(targetPos, targetVelo, ticpt);
};


/**
 * Calculates the arrivaltime of the target to my position.
 * @method calcArrivalTime
 * @param myPos {Vector3d} The position of me.
 * @param myVelo {Vector3d} The velocity of me.
 * @param targetPos {Vector3d} The position of the target.
 * @param targetVelo {Vector3d} The velocity and direction in which the target is moving.
 * @return {Number} The time in which the target has reached me or undefined if not reachable.
 * @for motionpredict
 */
module.exports.calcArrivalTime = function(myPos, myVelo, targetPos, targetVelo ) {
  var distance = myPos.distanceTo(targetPos);
  var approachSpeed = module.exports.calcApproachSpeed(myPos, myVelo, targetPos, targetVelo);
  if( approachSpeed > 0.0 ) {
    return distance / approachSpeed;
  }
  else {
    return undefined;
  }
};


/**
 * Calculates the approachspeed of the target to my position.
 * @method calcApproachSpeed
 * @param myPos {Vector3d} The position of me.
 * @param myVelo {Vector3d} The velocity of me.
 * @param targetPos {Vector3d} The position of the target.
 * @param targetVelo {Vector3d} The velocity and direction in which the target is moving.
 * @return {Number} The speed at which the target is approaching.
 * @for motionpredict
 */
module.exports.calcApproachSpeed = function(myPos, myVelo, targetPos, targetVelo) {
  var posDiff = targetPos.sub(myPos);
  var veloDiff = targetVelo.sub(myVelo);
  var approachSpeed = posDiff.dot(veloDiff);
  var posDiffLength = posDiff.length();
  if( posDiffLength <= 0.0 )
    return 0.0;
  return -approachSpeed / posDiffLength;
};


