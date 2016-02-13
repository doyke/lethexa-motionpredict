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
 * Solves the quadratic equation for p1 and p2.
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

