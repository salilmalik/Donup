var User = require('../models/User');
var config = require('../../config');
var userValidations = require('../validations/userValidations');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var async = require('async');
var crypto = require("crypto");
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
// super secret for creating tokens
var superSecret = config.secret;



			.post(
					'/login',
					function(req, res) {
						// Validating the user information
						var validate = userValidations.validateLogin(req);
						console.log("validate: " + validate);
						/*
						 * if (validate != 'LOGIN VALIDATED') {
						 * console.log("OUT"); res.json(validate); }
						 */
						validate = 'LOGIN VALIDATED';
						if (validate === 'LOGIN VALIDATED') {
							User
					function (req, res) {
					    // Validating the user information
					    var validate = userValidations.validateLogin(req);
					    console.log("validate: " + validate);
					    /*
					    * if (validate != 'LOGIN VALIDATED') {
					    * console.log("OUT"); res.json(validate); }
					    */
					    validate = 'LOGIN VALIDATED';
					    if (validate === 'LOGIN VALIDATED') {
					        User
									.findOne({
										username : req.body.username
									    username: req.body.username
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
											function (err, user) {
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
															    success: false,
															    message: 'Authentication failed. User not found.',
															    returnCode: '1'
															});
												} else if (user) {
													// check if password matches
													var validPassword = user
											    } else if (user) {
											        // check if password matches
											        var validPassword = user
															.comparePassword(req.body.password);
													if (!validPassword) {
														res
											        if (!validPassword) {
											            res
																.json({
																	success : false,
																	message : 'Authentication failed. Wrong password.',
																	returnCode : '2'
																    success: false,
																    message: 'Authentication failed. Wrong password.',
																    returnCode: '2'
																});
													} else {
														// if user is found and
														// password is right
														// then create a token
														var token = jwt
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
																		    name: user.name,
																		    username: user.username
																		},
																		superSecret,
																		{
																			// expires
																			// in
																			// 24
																			// hours
																			expiresInMinutes : 1440
																		    // expires
																		    // in
																		    // 24
																		    // hours
																		    expiresInMinutes: 1440
																		});

														// return the
														// information including
														// token as JSON
														res
											            // return the
											            // information including
											            // token as JSON
											            res
																.json({
																	success : true,
																	message : 'Enjoy your token!',
																	returnCode : '3',
																	token : token
																    success: true,
																    message: 'Enjoy your token!',
																    returnCode: '3',
																    token: token,
                                                                    user : user
																});
													}
											        }

												}
											    }

											});
						}
					    }
					});

			.route('/user')
			.post(
														.json({
														});
									});
					})


				.waterfall(
						[
								},
											.findOne(
													{
													},
																	.json({
																	});
																		err) {
																			err,
																			token,
																			user);
																});
													});
								},
											.createTransport({
											});
												+ 'Please click on the following link, or paste this into your browser to complete the registeration process:\n\n'
												+ 'http://'
												+ req.headers.host
												+ '/confirmEmail/'
												+ token
												+ '\n\n'
												+ 'If you did not request this, please ignore this email..\n'
											});
			.post(
					'/forgotPassword',
								.waterfall(
										[
															.randomBytes(
																	20,
																			err,
																			buf) {
																				.toString('hex');
																				err,
																				token);
																	});
												},
															.findOne(
																	{
																	},
																			err,
																			user) {
																					.json({
																					});
																				.now() + 3600000; // 1
																						err) {
																							err,
																							token,
																							user);
																				});
																	});
												},
															.createTransport({
															});
																+ 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
																+ 'http://'
																+ req.headers.host
																+ '/resetPassword/'
																+ token
																+ '\n\n'
																+ 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
															.sendMail(
																	mailOptions,
																			err) {
																					.log(err);
																				err,
																				'done');
																	});
					});

			next) {
			.post('/confirmEmail/:confirmEmailToken',
								+ req.params.confirmEmailToken);
					});

				|| req.headers['x-access-token'];

	})

	})
		
};