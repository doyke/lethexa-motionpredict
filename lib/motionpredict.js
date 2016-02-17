var vecmat = require('lethexa-vecmat');

/* global exports */

(function (exports) {
  'use strict';

  /**
   * Object to provide vector math functions.
   * Can be exchanged to use other vector implementations. 
   * @class MathFunc
   */
  /*
  exports.MathFunc = {
    add: function(a, b) {
      return [
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2]
      ];
    },
    sub: function(a, b) {
      return [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2]
      ];
    },
    mulScalar: function(a, s) {
      return [
        a[0] * s,
        a[1] * s,
        a[2] * s
      ];
    },
    dot: function(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    },
    lengthSquared: function(a) {
      return a[0]*a[0] + a[1]*a[1] + a[2]*a[2];
    }
  };
  */



  /**
   * Object to provide vector math functions.
   * Can be exchanged to use other vector implementations. 
   * @class MathFunc
   */
  exports.MathFunc = {
    add: function(a, b) {
      return a.add(b);
    },
    sub: function(a, b) {
      return a.sub(b);
    },
    mulScalar: function(a, s) {
      return a.mul(s);
    },
    dot: function(a, b) {
      return a.dot(b);
    },
    lengthSquared: function(a) {
      return a.lengthSquared();
    }
  };



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
    var mf = exports.MathFunc;
    return mf.add(position, mf.mulScalar(velocity, dt));
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
    var mf = exports.MathFunc;
    var posDiff = mf.sub(position2, position1);
    var veloDiff = mf.sub(velocity2, velocity1);

    var zaehler = -mf.dot(posDiff, veloDiff);
    var nenner = mf.lengthSquared(veloDiff);

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
    var mf = exports.MathFunc;
    var relTargetPos = mf.sub(targetPos, myPos);
    var a = mf.lengthSquared(targetVelo) - myVelo * myVelo;
    var b = 2.0 * mf.dot(targetVelo, relTargetPos);
    var c = mf.lengthSquared(relTargetPos);

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
    var mf = exports.MathFunc;
    var distance = Math.sqrt(mf.lengthSquared(mf.sub(targetPos, myPos)));
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
    var mf = exports.MathFunc;
    var posDiff = mf.sub(targetPos, myPos);
    var veloDiff = mf.sub(targetVelo, myVelo);
    var approachSpeed = mf.dot(posDiff, veloDiff);
    var posDiffLength = Math.sqrt(mf.lengthSquared(posDiff));
    if( posDiffLength <= 0.0 )
      return 0.0;
    return -approachSpeed / posDiffLength;
  };

})(typeof exports === 'undefined' ? this.motionpredict = {} : exports);

