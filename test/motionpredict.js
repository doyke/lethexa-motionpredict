var assert = require('assert');
var vecmat = require('lethexa-vecmat');
var motionpredict = require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../lib/') + 'motionpredict.js');



describe('quadEquation', function () {
    describe('when position=[1,2,3], velocity=[1,1,1] and dt=1.0', function () {
        it('should return a new position of [2,3,4]', function () {
		var position = new vecmat.Vector3d(1,2,3);
		var velocity = new vecmat.Vector3d(1,1,1);
		var dt = 1.0;
                var result = motionpredict.getPositionByVeloAndTime(position, velocity, dt);
                var expected = new vecmat.Vector3d(2,3,4);

                assert.deepEqual(expected, result);
        });
    })
});




describe('quadEquation', function () {
    describe('when p=1 and q=0.25', function () {
        it('should return one solution [-0.5]', function () {
		var result = motionpredict.quadEquation(1.0, 0.25);
		var expected = [-0.5]; 

            	assert.deepEqual(expected, result);
        });
    }),

    describe('when p=2 and q=0', function () {
        it('should return two solutions [0, -2]', function () {
		var result = motionpredict.quadEquation(2.0, 0.0);
		var expected = [0, -2]; 

            	assert.deepEqual(expected, result);
        });
    });

    describe('when p=2 and q=2', function () {
        it('should return no solutions', function () {
		var result = motionpredict.quadEquation(2.0, 2.0);
		var expected = []; 

            	assert.deepEqual(expected, result);
        });
    });
});



describe('calcCPATime', function () {
    describe('when track1(pos=[0,0,0], velocity=[0,1,0]) and track2(pos=[0,1,0], velocity=[0,0,0])', function () {
        it('should return a TCPA of 1s', function () {
		var position1 = new vecmat.Vector3d(0,0,0);
		var velocity1 = new vecmat.Vector3d(0,1,0);
		var position2 = new vecmat.Vector3d(0,1,0);
		var velocity2 = new vecmat.Vector3d(0,0,0);

		var result = motionpredict.calcCPATime(position1,velocity1,position2,velocity2);
                var expected = 1;

                assert.deepEqual(expected, result);
        });
    }),

    describe('when track1(pos=[0,1,0], velocity=[0,1,0]) and track2(pos=[0,1,0], velocity=[0,1,0])', function () {
        it('should return an undefined TCPA', function () {
		var position1 = new vecmat.Vector3d(0,1,0);
		var velocity1 = new vecmat.Vector3d(0,1,0);
		var position2 = new vecmat.Vector3d(0,1,0);
		var velocity2 = new vecmat.Vector3d(0,1,0);

		var result = motionpredict.calcCPATime(position1,velocity1,position2,velocity2);
                var expected = undefined;

                assert.deepEqual(expected, result);
        });
    })

    describe('when track1(pos=[0,2,0], velocity=[0,1,0]) and track2(pos=[0,1,0], velocity=[0,0,0])', function () {
        it('should return a TCPA of -1s', function () {
		var position1 = new vecmat.Vector3d(0,2,0);
		var velocity1 = new vecmat.Vector3d(0,1,0);
		var position2 = new vecmat.Vector3d(0,1,0);
		var velocity2 = new vecmat.Vector3d(0,0,0);

		var result = motionpredict.calcCPATime(position1,velocity1,position2,velocity2);
                var expected = -1;

                assert.deepEqual(expected, result);
        });
    })
});



describe('calcCPAPositionTarget1', function () {
    describe('when track1(pos=[0,0,0], velocity=[0,1,0]) and track2(pos=[1,1,0], velocity=[0,0,0])', function () {
        it('should return a CPA of [0,1,0]', function () {
		var position1 = new vecmat.Vector3d(0,0,0);
		var velocity1 = new vecmat.Vector3d(0,1,0);
		var position2 = new vecmat.Vector3d(1,1,0);
		var velocity2 = new vecmat.Vector3d(0,0,0);

		var result = motionpredict.calcCPAPositionTarget1(position1,velocity1,position2,velocity2);
                var expected = new vecmat.Vector3d(0,1,0);

                assert.deepEqual(expected, result);
        });
    }),

    describe('when track1(pos=[0,1,0], velocity=[0,1,0]) and track2(pos=[1,1,0], velocity=[0,1,0])', function () {
        it('should return an undefined CPA', function () {
		var position1 = new vecmat.Vector3d(0,1,0);
		var velocity1 = new vecmat.Vector3d(0,1,0);
		var position2 = new vecmat.Vector3d(1,1,0);
		var velocity2 = new vecmat.Vector3d(0,1,0);

		var result = motionpredict.calcCPAPositionTarget1(position1,velocity1,position2,velocity2);
                var expected = undefined;

                assert.deepEqual(expected, result);
        });
    })

    describe('when track1(pos=[0,2,0], velocity=[0,1,0]) and track2(pos=[1,1,0], velocity=[0,0,0])', function () {
        it('should return a CPA of [0,1,0]', function () {
		var position1 = new vecmat.Vector3d(0,2,0);
		var velocity1 = new vecmat.Vector3d(0,1,0);
		var position2 = new vecmat.Vector3d(1,1,0);
		var velocity2 = new vecmat.Vector3d(0,0,0);

		var result = motionpredict.calcCPAPositionTarget1(position1,velocity1,position2,velocity2);
                var expected = new vecmat.Vector3d(0,1,0);

                assert.deepEqual(expected, result);
        });
    })
});



describe('calcCPAPositionTarget2', function () {
    describe('when track1(pos=[0,0,0], velocity=[0,1,0]) and track2(pos=[1,1,0], velocity=[0,0,0])', function () {
        it('should return a CPA of [1,1,0]', function () {
		var position1 = new vecmat.Vector3d(0,0,0);
		var velocity1 = new vecmat.Vector3d(0,1,0);
		var position2 = new vecmat.Vector3d(1,1,0);
		var velocity2 = new vecmat.Vector3d(0,0,0);

		var result = motionpredict.calcCPAPositionTarget2(position1,velocity1,position2,velocity2);
                var expected = new vecmat.Vector3d(1,1,0);

                assert.deepEqual(expected, result);
        });
    }),

    describe('when track1(pos=[0,1,0], velocity=[0,1,0]) and track2(pos=[1,1,0], velocity=[0,1,0])', function () {
        it('should return an undefined CPA', function () {
		var position1 = new vecmat.Vector3d(0,1,0);
		var velocity1 = new vecmat.Vector3d(0,1,0);
		var position2 = new vecmat.Vector3d(1,1,0);
		var velocity2 = new vecmat.Vector3d(0,1,0);

		var result = motionpredict.calcCPAPositionTarget2(position1,velocity1,position2,velocity2);
                var expected = undefined;

                assert.deepEqual(expected, result);
        });
    })

    describe('when track1(pos=[0,2,0], velocity=[0,1,0]) and track2(pos=[1,1,0], velocity=[0,0,0])', function () {
        it('should return a CPA of [1,1,0]', function () {
		var position1 = new vecmat.Vector3d(0,2,0);
		var velocity1 = new vecmat.Vector3d(0,1,0);
		var position2 = new vecmat.Vector3d(1,1,0);
		var velocity2 = new vecmat.Vector3d(0,0,0);

		var result = motionpredict.calcCPAPositionTarget2(position1,velocity1,position2,velocity2);
                var expected = new vecmat.Vector3d(1,1,0);

                assert.deepEqual(expected, result);
        });
    })
});




