var bodyParser = require('body-parser');
var fs = require("fs");
var Img = require('../models/image');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var jwt = require('jsonwebtoken');
var config = require('../../config');
var mkdirp = require('mkdirp');
var crypto = require("crypto");
var gm = require('gm');

module.exports = function(app, express) {

	var apiRouter = express.Router();

	apiRouter.route('/')

	.post(
			multipartMiddleware,
			function(req, res) {
				console.log("POST CALLED");
				var file = req.files.file;
				console.log(file.name);
				console.log("FILE PATH" + file.path);
				console.log("FILE" + file);
				console.log("FILE TYPEE" + file.type);
				console.log(file);
				var image = new Img();
				image.name = file.name;
				console.log(image.name);
				image.userID = req.body.userID;

				var newPath = './public/uploads/';
				var imagePath = newPath
						+ crypto.randomBytes(12).toString('hex') + file.name;

				var newThPath = './public/tn/';
				var imageThPath = newThPath
						+ crypto.randomBytes(12).toString('hex') + file.name;

				mkdirp(newPath, function(err) {
					if (err)
						console.error(err)
				});
				mkdirp(newThPath, function(err) {
					if (err)
						console.error(err)
				});
				console.log('folder created at ' + newPath);
				fs.readFile(file.path, function(err, data) {
					fs.writeFile(imagePath, data, function(err) {
						if (err) {
							throw err;
						}
					});
					console.log("imagePath: " + imagePath);
				});

				gm(file.path).resize(200, 200).autoOrient().write(imageThPath,
						function(err) {
							if (err)
								console.log(' error! ' + err);
							if (!err)
								console.log(' hooray! ');
						});
				image.img = imagePath;
				image.imgtn = imageThPath;
				console.log("image.img" + image.img);
				image.save(function(err, objectToInsert) {
					if (err) {
						console.log(err);
						return res.json({
							success : false,
							message : 'Image not saved. '
						});
					}
					var objectId = objectToInsert._id;
					console.log("objectId" + objectId);
					res.json({
						message : 'Image saved'
					});
				});
			})

	apiRouter.route('/:id')
	// get the image with that id
	.get(function(req, res) {
		console.log("IMAGE GET CALLED" + req.params.id);
		Img.findById(req.params.id, function(err, image) {
			if (err)
				res.send(err);
			if (!image) {
				console.log("NOT FOUND");

			}
			if (image) {
				res.json(image);
			}
		});
	})
	apiRouter.route('/:id')
	// update the points
	.put(function(req, res) {
		Img.findById(req.params.id, function(err, image) {
			if (err)
				res.send(err);
			console.log(image.points + "image.points");
			// set the new user information if it exists in the request
			image.points = image.points + 1;
			// save the user
			console.log(image.points + "image.points");
			image.save(function(err) {
				if (err)
					res.send(err);
				// return a message
				res.json({
					message : 'Points Upgraded'
				});
			});

		});
	})
	apiRouter.route('/getUserImages/:userId')
	// get the image with that id
	.get(
			function(req, res) {
				Img.find({
					"userID" : req.params.userId
				}, function(err, imageList) {
					if (err)
						res.send(err);
					console.log("SEND BACK IMAGE: " + req.params.id);
					console.log(image.name);

					console.log("Images of UserID: " + req.params.userId);
					console.log("returned image");
					// new Buffer(image.img.data).toString('base64')
					if (!imageList) {
						console.log("NOT FOUND");
					}
					if (imageList) {
						console.log("RETURNED IMAGE");
						imageList.forEach(function(image) {
							image.img.data = new Buffer(image.img.data)
									.toString('base64');
						});
					}
					res.json(imageList);
				});
			})

	return apiRouter;
};