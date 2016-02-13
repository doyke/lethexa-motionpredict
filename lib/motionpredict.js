var vecmat = require('lethexa-vecmat');

/**
 * calculates the new position by speed and delta-time.
 * @method getPositionByVeloAndTime
 * @param position {Vector3d} The old position.
 * @param velocity {Velocity} The velocity.
 * @param dt {Number} The delta-time.
 * @return {Vector3d} The new position.
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
 */
module.exports.calcCPATime = function(position1, velocity1, position2, velocity2) {
  var posDiff = position2.sub(position1);
  var veloDiff = velocity2.sub(velocity1);

  var zaehler = -posDiff.dot(veloDiff);
  var nenner = veloDiff.lengthSquared();

  return nenner === 0.0 ? undefined : zaehler / nenner;
};


/**
 * Calculates the position of closest point of approach (CPA) of two tracks.
 * @method calcCPAPosition
 * @param position1 {Vector3d} The position of track 1.
 * @param velocity1 {Vector3d} The velocity of track 1.
 * @param position2 {Vector3d} The position of track 2.
 * @param velocity2 {Vector3d} The velocity of track 2.
 * @return {Vector3d} The position of CPA or undefined if CPA does not exists. 
 */
module.exports.calcCPAPosition = function(position1, velocity1, position2, velocity2) {
  var tcpa = module.exports.calcCPATime(position1, velocity1, position2, velocity2);
  if(tcpa === undefined)
    return undefined;
  return module.exports.getPositionByVeloAndTime(position1, velocity1, tcpa);
};


