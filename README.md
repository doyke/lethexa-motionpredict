lethexa-motionpredict
---------------------

This library is used to predict track position.

  * Intercept-calculation of two tracks. 
  * Closest point of approach of two tracks.


Usage 
-----

	var motionpredict = require('lethexa-motionpredict');

	var position1 = new vecmat.Vector3d(0,0,0);
	var velocity1 = new vecmat.Vector3d(0,1,0);

	var position2 = new vecmat.Vector3d(0,1,0);
	var velocity2 = new vecmat.Vector3d(0,0,0);

	var tcpa = motionpredict.calcCPATime(position1,velocity1,position2,velocity2);
	console.log('TCPA=' + tcpa);


License
-------

This library is published under MIT license.
 

