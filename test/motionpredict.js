var assert = require('assert');
var vecmat = require('lethexa-vecmat');
var motionpredict = require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../lib/') + 'motionpredict.js');



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



