lethexa-motionpredict
---------------------

This library is used to predict track position.

  * Intercept-calculation of two tracks. 
  * Closest point of approach of two tracks.
  * Arrival time of one track at another.
  * Approach speed of one track to another.


Usage 
-----

	var motionpredict = require('lethexa-motionpredict');

	// Calculate TCPA
	var position1 = new vecmat.Vector3d(0,0,0);
	var velocity1 = new vecmat.Vector3d(0,1,0);

	var position2 = new vecmat.Vector3d(0,1,0);
	var velocity2 = new vecmat.Vector3d(0,0,0);

	var tcpa = motionpredict.calcCPATime(position1,velocity1,position2,velocity2);
	console.log('TCPA=' + tcpa);



	// Calculate intercept time
	var icptPos = new vecmat.Vector3d(0,0,0);
	var icptVelo = 1.0;

	var targetPos = new vecmat.Vector3d(1,0,0);
	var targetVelo = new vecmat.Vector3d(0,0,0);

	var ticpt = motionpredict.calcInterceptTime(icptPos,icptVelo,targetPos,targetVelo);

	console.log('T intercept=' + ticpt);



License
-------

This library is published under MIT license.
 

