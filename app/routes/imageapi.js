var Img = require('../models/Image');
var config = require('../../config');
var bodyParser = require('body-parser');
var imageValidations = require('../validations/imageValidations');
var fs = require("fs");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var jwt = require('jsonwebtoken');
var mkdirp = require('mkdirp');
var crypto = require("crypto");
var gm = require('gm');



	.post(
			multipartMiddleware,
							+ crypto.randomBytes(12).toString('hex')
							+ file.name;
							+ crypto.randomBytes(12).toString('hex')
							+ file.name;
							});
			})

	})

	    });
	})
    apiRouter.route('/getUserImages/:userId')
    // get the image with that id for a user
	.get(function (req, res) {
	    Img.find({
	        "userID": req.params.userId
	    }, function (err, imageList) {
	        if (err)
	            res.send(err);
	        if (!imageList) {
	            res.json({
	                success: false,
	                message: 'No images found for the given user. ',
	                returnCode: '1'
	            });
	        }
	        if (imageList) {
	            res.json(imageList);
	        }
	    });
	});
    return apiRouter;
};