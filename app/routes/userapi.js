var User = require('../models/User');
var config = require('../../config');
var userValidations = require('../validations/userValidations');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var async = require('async');
var crypto = require("crypto");
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
logger = require('../logger/logger.js');
// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {
	var apiRouter = express.Router();

	// route to authenticate a user
	apiRouter
			.post(
					'/login',
					function(req, res) {
						logger.debug('apiRouter /login post started');
						// Validating the user information
						var validate = userValidations.validateLogin(req);

						if (validate != 'LOGIN VALIDATED') {
							return res.json({
								success : false,
								message : validate,
								returnCode : '100'
							});
						}
						if (validate === 'LOGIN VALIDATED') {
							User
									.findOne({
										username : req.body.username
									})
									.select('name username password')
									.exec(
											function(err, user) {
												if (err)
													throw err;
												// No user with that username
												// was found
												if (!user) {
													res
															.json({
																success : false,
																message : 'Authentication failed. User not found.',
																returnCode : '1'
															});
												} else if (user) {
													// check if password matches
													var validPassword = user
															.comparePassword(req.body.password);
													if (!validPassword) {
														res
																.json({
																	success : false,
																	message : 'Authentication failed. Wrong password.',
																	returnCode : '2'
																});
													} else {
														user.password = "";
														// if user is found and
														// password is right
														// then create a token
														var token = jwt
																.sign(
																		{
																			name : user.name,
																			username : user.username
																		},
																		superSecret,
																		{
																			// expires
																			// in
																			// 24
																			// hours
																			expiresInMinutes : 1440
																		});

														// return the
														// information including
														// token as JSON
														res
																.json({
																	success : true,
																	message : 'Enjoy your token!',
																	returnCode : '3',
																	token : token,
																	user : user
																});
													}

												}

											});
							logger.debug('apiRouter /login ended');
						}
					});

	apiRouter
			.route('/user')
			// Create a user
			.post(
					function(req, res) {
						logger.debug('apiRouter /user post started');
						// Validating the user information
						var validate = userValidations.validateRegister(req);
						if (validate != 'REGISTER VALIDATED') {
							return res.json({
								success : false,
								message : validate,
								returnCode : '100'
							});
						}
						if (validate === 'REGISTER VALIDATED') {
							var user = new User(); // create a new instance of
							// the User
							// model
							user.name = req.body.name; // set the users name
							user.username = req.body.username; // set the users
							// username
							user.password = req.body.password; // set the users
							// password
							user.confirmed = false;

							user
									.save(function(err) {
										if (err) {
											// duplicate entry
											if (err.code == 11000) {
												console.log('ERROR' + 11000);
												return res
														.json({
															success : false,
															message : 'A user with that username already exists. ',
															returnCode : '1'
														});
											} else {

												return res.send(err);
											}

										}
										// return a message
										res.json({
											success : true,
											message : 'User created!',
											returnCode : '2'
										});
									});
							confirmEmail(req, res);
							logger.debug('apiRouter /user ended');
						}
					})

	// get all the users
	/*
	 * .get(function(req, res) { User.find({}, function(err, users) { if (err)
	 * res.send(err); // return the users res.json(users); }); });
	 */

	function confirmEmail(req, res) {
		logger.debug('confirmEmail started');
		async
				.waterfall(
						[
								function(done) {
									crypto.randomBytes(20, function(err, buf) {
										var token = buf.toString('hex');
										done(err, token);
									});
								},
								function(token, done) {
									User
											.findOne(
													{
														username : req.body.username
													},
													function(err, user) {
														if (!user) {
															res
																	.json({
																		success : false,
																		message : 'No user with given username found.',
																		returnCode : '1'
																	});
														}
														user.confirmEmailToken = token;
														user
																.save(function(
																		err) {
																	done(
																			err,
																			token,
																			user);
																});
													});
								},
								function(token, user, done) {
									console.log('EMAIL TOKEN MAIL SENDING');
									var smtpTransport = nodemailer
											.createTransport({
												service : 'Yahoo',
												auth : {
													user : 'donupapp@yahoo.com',
													pass : 'kuchbhi77'
												}
											});
									var mailOptions = {
										to : req.body.username,
										from : 'donupapp@yahoo.com',
										subject : 'Donup Confirm Email',
										text : 'Please confirm your Email address.\n\n'
												+ 'Please click on the following link, or paste this into your browser to complete the registeration process:\n\n'
												+ 'http://'
												+ req.headers.host
												+ '/confirmEmailLink/'
												+ token
												+ '\n\n'
												+ 'If you did not request this, please ignore this email..\n'
									};
									smtpTransport.sendMail(mailOptions,
											function(err) {
												if (err) {
													return console.log(err);
												}
												done(err, 'done');
											});
								} ], function(err) {
							if (err) {
								console.log(err);
								return next(err);
							}
							;
						});
		logger.debug('confirmEmail ended');
	}
	;
	apiRouter
			.post(
					'/forgotPassword',
					function(req, res, next) {
						logger.debug('apiRouter /forgotPassword post started');
						async
								.waterfall(
										[
												function(done) {
													crypto
															.randomBytes(
																	20,
																	function(
																			err,
																			buf) {
																		var token = buf
																				.toString('hex');
																		done(
																				err,
																				token);
																	});
												},
												function(token, done) {
													User
															.findOne(
																	{
																		username : req.body.username
																	},
																	function(
																			err,
																			user) {
																		if (!user) {
																			console
																					.log("NO USER");
																			return res
																					.json({
																						success : false,
																						message : 'No user with given username found.',
																						returnCode : '1'
																					});
																		}

																		console
																				.log("USER IS THERE sending mail");
																		user.resetPasswordToken = token;
																		user.resetPasswordExpires = Date
																				.now() + 3600000; // 1
																		// hour
																		user
																				.save(function(
																						err) {
																					done(
																							err,
																							token,
																							user);
																					res
																							.json({
																								success : true,
																								message : 'user with given username found.',
																								returnCode : '2'
																							});
																				});
																	});
												},
												function(token, user, done) {
													var smtpTransport = nodemailer
															.createTransport({
																service : 'Yahoo',
																auth : {
																	user : 'donupapp@yahoo.com',
																	pass : 'kuchbhi77'
																}
															});
													var mailOptions = {
														to : req.body.username,
														from : 'donupapp@yahoo.com',
														subject : 'Donup Password Reset',
														text : 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
																+ 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
																+ 'http://'
																+ req.headers.host
																+ '/resetPassword/'
																+ token
																+ '\n\n'
																+ 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
													};
													smtpTransport
															.sendMail(
																	mailOptions,
																	function(
																			err) {
																		if (err) {
																			return console
																					.log(err);
																		}
																		done(
																				err,
																				'done');
																	});
												} ], function(err) {
											if (err) {
												console.log(err);
												return next(err);
											}
										});
						logger.debug('apiRouter /forgotPassword post started');
					});

	apiRouter.post('/resetPassword', function(req, res, next) {
		logger.debug('apiRouter /resetPassword post started');
		User.findOne({
			resetPasswordToken : req.body.resetPasswordToken
		}).select('username').exec(function(err, user) {
			if (err) {
				console.log("error :" + err);
				res.send(err);
			}
			if (!user) {
				return res.json({
					success : false,
					message : 'Not a valid link.',
					returnCode : '1'
				})
			}
			if (user) {
				console.log(user);
				console.log(req.body);
				if (req.body.name)
					user.name = req.body.name;
				if (req.body.username)
					user.username = req.body.username;
				if (req.body.password)
					user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err)
						res.send(err);

					// return a message
					res.json({
						success : true,
						message : 'Reset password token validated!',
						returnCode : '2'
					});
				});
			}
		});
		logger.debug('apiRouter /resetPassword post ended');
	});

	apiRouter.post('/confirmEmailLinks', function(req, res, next) {
		logger.debug('apiRouter /confirmEmailLinks post started');
		User.findOne({
			confirmEmailToken : req.body.confirmEmailURLLink
		}).select('username').exec(function(err, user) {

			if (err) {
				console.log("error :" + err);
				res.send(err);
			}
			if (!user) {
				return res.json({
					success : false,
					message : 'Not a valid link.',
					returnCode : '1'
				})

			}
			if (user) {

				user.confirmed = true;

				// save the user
				user.save(function(err) {
					if (err)
						res.send(err);

					// return a message
					res.json({
						success : true,
						message : 'Email token validated!',
						returnCode : '2'
					});

				});

			}
		});
		logger.debug('apiRouter /confirmEmailLinks post ended');
	});

	apiRouter.route('/user/:id')
	// update the points

	.put(function(req, res) {
		logger.debug('apiRouter /user/:id put started');
		User.findById(req.params.id, function(err, user) {
			if (err)
				res.send(err);
			if (user === undefined) {

			} else {
				user.points = user.points + 1;
				// save the updated image info
				user.save(function(err) {
					if (err)
						res.send(err);
					res.json({
						success : true,
						message : 'Points updated. ',
						returnCode : '1'
					});
				});
			}
		});
		logger.debug('apiRouter /user/:id put ended');
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// check header or url parameters or post parameters for token
		logger.debug('middleware started');
		var token = req.body.token || req.query.token
				|| req.headers['x-access-token'];

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, superSecret, function(err, decoded) {

				if (err) {
					res.status(403).send({
						success : false,
						message : 'Failed to authenticate token.',
						returnCode : '1'
					});
				} else {
					// if everything is good, save to request for use in other
					// routes
					req.decoded = decoded;

					next(); // make sure we go to the next routes and don't stop
					// here
				}
			});

		} else {
			// if there is no token
			// return an HTTP response of 403 (access forbidden) and an error
			// message
			res.status(403).send({
				success : false,
				message : 'No token provided.',
				returnCode : '2'
			});

		}
		logger.debug('middleware ended');
	});

	apiRouter.route('/user/:user_id')
	// get the user with that id
	.get(function(req, res) {
		logger.debug('apiRouter /user/:user_id get started');
		User.findById(req.params.user_id, function(err, user) {
			if (err)
				res.send(err);

			// return that user
			res.json(user);
		});
		logger.debug('apiRouter /user/:user_id get ended');
	})

	// update the user with this id
	.put(function(req, res) {
		logger.debug('apiRouter /user/:user_id put started');
		User.findById(req.params.user_id, function(err, user) {

			if (err)
				res.send(err);

			// set the new user information if it exists in the request
			if (req.body.name)
				user.name = req.body.name;
			if (req.body.username)
				user.username = req.body.username;
			if (req.body.password)
				user.password = req.body.password;

			// save the user
			user.save(function(err) {
				if (err)
					res.send(err);

				// return a message
				res.json({
					success : true,
					message : 'Password changed',
					returnCode : '1'
				});
			});

		});
		logger.debug('apiRouter /user/:user_id put ended');
	})

	apiRouter.post('/changePassword', function(req, res, next) {
		logger.debug('apiRouter /changePassword post started');
		User.findById(req.body.userID).select('name username password').exec(
				function(err, user) {
					if (err)
						throw err;
					// No user with that username
					// was found
					if (!user) {
						res.json({
							success : false,
							message : 'Authentication failed. User not found.',
							returnCode : '1'
						});
					} else if (user) {
						// check if password matches
						var validPassword = user
								.comparePassword(req.body.password.old);
						if (!validPassword) {
							res.json({
								success : false,
								message : 'Old Passoword is Wrong.',
								returnCode : '1'
							});
						} else if (validPassword) {
							user.password = req.body.password.new;
							user.save(function(err) {
								if (err)
									res.send(err);

								// return a message
								res.json({
									success : true,
									message : 'Password changed successfully!',
									returnCode : '2'
								});
							})
						}
					}
				});
		logger.debug('apiRouter /changePassword post ended');
	});

	/*
	 * // delete the user with this id .delete(function(req, res) {
	 * User.remove({ _id: req.params.user_id }, function(err, user) { if (err)
	 * res.send(err);
	 * 
	 * res.json({ message: 'Successfully deleted' }); }); // api endpoint to get
	 * user information apiRouter.get('/me', function(req, res) {
	 * res.send(req.decoded); }); });
	 */
	return apiRouter;
};