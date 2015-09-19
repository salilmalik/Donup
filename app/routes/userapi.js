var bodyParser = require('body-parser'); // get body-parser
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var async = require('async');
var crypto = require("crypto");
var nodemailer = require('nodemailer');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to authenticate a user (POST
	// http://localhost:8080/user/login)
	apiRouter.post('/login', function(req, res) {
		// find the user
		User.findOne({
			username : req.body.username
		}).select('name username password').exec(function(err, user) {

			if (err)
				throw err;
			// no user with that username was found
			if (!user) {
				res.json({
					success : false,
					message : 'Authentication failed. User not found.',
					returnCode:'1'
				});
			} else if (user) {

				// check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success : false,
						message : 'Authentication failed. Wrong password.',
						returnCode:'2'
					});
				} else {

					// if user is found and password is right
					// create a token
					var token = jwt.sign({
						name : user.name,
						username : user.username
					}, superSecret, {
						expiresInMinutes : 1440
					// expires in 24 hours
					});

					// return the information including token as JSON
					res.json({
						success : true,
						message : 'Enjoy your token!',
						returnCode:'3',
						token : token
					});
				}

			}

		});
	});

	apiRouter.route('/user')
	// create a user (accessed at POST http://localhost:8080/user)
	.post(function(req, res) {

		var user = new User(); // create a new instance of the User
		// model
		user.name = req.body.name; // set the users name (comes from the
		// request)
		user.username = req.body.username; // set the users username (comes
		// from the request)
		user.password = req.body.password; // set the users password (comes
		// from the request)
		user.confirmed='false';
		
		if (req.body.password!=req.body.confirmPassword){
			return res.json({
						success : false,
						message : 'Password and confirm password do not match.'
					});
		}
		user.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code == 11000)
					return res.json({
						success : false,
						message : 'A user with that username already exists. '
					});
				else
					return res.send(err);
			}

			// return a message
			res.json({
				message : 'User created!'
			});
		});
		console.log("CONFIRM EMAIL");
		confirmPassword(req, res);

	})

	// get all the users (accessed at GET http://localhost:8080/api/user)
	.get(function(req, res) {

		User.find({}, function(err, users) {
			if (err)
				res.send(err);

			// return the users
			res.json(users);
		});
	});

function confirmPassword(req, res) {
	console.log("CONFIRM PASSWORD CALLED");
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ username: req.body.username }, function(err, user) {
        if (!user) {
        res.json({
					success : false,
					message : 'No user with given username found.',
					returnCode:'1'
				});
        }
        user.confirmEmailToken = token; // 1 hour
        
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Yahoo',
        auth: {
          user: 'donupapp@yahoo.com',
          pass: 'kuchbhi77'
        }
      });
      var mailOptions = {
        to: 'salilmalik92@gmail.com',
        from: 'donupapp@yahoo.com',
        subject: 'Node.js Confirm Email',
        text: 'Please confirm your Email address.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/confirmEmail/' + token + '\n\n' +
          'If you did not request this, please ignore this email..\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
       if(err){
        return console.log(err);
    }
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) {
console.log(err);
    	return next(err);
    }
   console.log("Mail sent");
  });
};

apiRouter.post('/forgotPassword', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ username: req.body.username }, function(err, user) {
        if (!user) {
        res.json({
					success : false,
					message : 'No user with given username found.',
					returnCode:'1'
				});
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Yahoo',
        auth: {
          user: 'donupapp@yahoo.com',
          pass: 'kuchbhi77'
        }
      });
      var mailOptions = {
        to: 'syal.anuj@gmail.com',
        from: 'donupapp@yahoo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/resetPassword/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
       if(err){
        return console.log(err);
    }
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) {
console.log(err);
    	return next(err);
    }
   console.log("Mail sent");
  });
});

apiRouter.post('/resetPassword/:resetPasswordToken', function(req, res, next) {
	console.log("resetPasswordToken"+req.params.resetPasswordToken);
	console.log("req.body.password"+req.body.password);
	User.findOne({
			resetPasswordToken : req.params.resetPasswordToken
		}).select('username').exec(function(err, user) {
  
			if (err){
				console.log("error :"+err);
				res.send(err);
		}
		if (!user) {
				res.json({
					success : false,
					message : 'Not a valid link.',
					returnCode:'1'
		})
		}
		if (user) {
			console.log(user);
			
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
					message : 'Password reset'
				});
			});

			res.json({
			success : true,
			message : 'Reset password token validated!',
			returnCode:'1'
			});
		}
		});
});

apiRouter.post('/confirmEmail/:confirmEmailToken', function(req, res, next) {
	console.log("confirmEmailToken"+req.params.confirmEmailToken);
	User.findOne({
			confirmEmailToken : req.params.confirmEmailToken
		}).select('username').exec(function(err, user) {
  
			if (err){
				console.log("error :"+err);
				res.send(err);
		}
		if (!user) {
				res.json({
					success : false,
					message : 'Not a valid link.',
					returnCode:'1'
		})
		}
		if (user) {
			console.log("user is there and req.params.confirmEmailToken : "+req.params.confirmEmailToken);
			user.confirmed = 'true';
		
			// save the user
			user.save(function(err) {
				if (err)
					res.send(err);

				// return a message
				res.json({
					message : 'Email confirmed'
				});
			});

			res.json({
			success : true,
			message : 'Email token validated!',
			returnCode:'1'
			});
		}
		});
});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token
				|| req.headers['x-access-token'];

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, superSecret, function(err, decoded) {

				if (err) {
					res.status(403).send({
						success : false,
						message : 'Failed to authenticate token.'
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
				message : 'No token provided.'
			});

		}
	});


	


	// on routes that end in /user/:user_id
	apiRouter.route('user/:user_id')

	// get the user with that id
	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err)
				res.send(err);

			// return that user
			res.json(user);
		});
	})

	// update the user with this id
	.put(function(req, res) {
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
					message : 'Password changed'
				});
			});

		});
	})
		/*// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});*/
	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});
	


	return apiRouter;
};