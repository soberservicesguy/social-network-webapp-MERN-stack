require('../../models/sport');
require('../../models/user');


const base64_encode = require('../../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const Sport = mongoose.model('Sport');
const User = mongoose.model('User');

const passport = require('passport');
const { isAllowedSurfing } = require('../authMiddleware/isAllowedSurfing')
const { isAllowedCreatingBooks } = require('../authMiddleware/isAllowedCreatingBooks')
const { isAllowedInteractingWithOthersPosts } = require('../authMiddleware/isAllowedInteractingWithOthersPosts')



// create a new sport with children

// will be used for creating interest
// USED
router.post('/create-interest-for-sport', passport.authenticate('jwt', { session: false }), isAllowedInteractingWithOthersPosts, function(req, res, next){

	var sport_endpoint = req.body.sport_endpoint

	// var newLike = new Like({
	// 	_id: new mongoose.Types.ObjectId(),
	// })

	User.findOne({ phone_number: req.user.user_object.phone_number })
	.then((user) => {
					
		// newLike.user = user

	// finding BlogPost object
		Sport.findOne({endpoint: sport_endpoint})
		.then((sport) => {

			sport.interested_users.push( user )

			// newLike.sport = sport

			// newLike.save(function (err, newLike) {
			// 	if (err) return console.log(err);
			// })
				
			sport.save((err, sport) => res.status(200).json(sport) )
		})
		.catch((err1) => {
			console.log(err1)
		})

	})
	.catch((err) => {
		console.log(err)
	})

})


// USED
router.get('/get-all-interest-in-sport',async function(req, res, next){

	let list_of_promises = []

// find blogpost
	var sport_with_interested_users = await Sport.findOne({endpoint:req.query.endpoint}).
	populate('interested_users').
	then((sport_with_interested_users) => {

		if ( sport_with_interested_users ){

			return sport_with_interested_users.interested_users
	
		} else {

			null

		}

	})

	list_of_promises.push( sport_with_interested_users )

// find likes from blogpost
	let final_interested_payload = await Promise.all(sport_with_interested_users.map(async (like_object) => {

	// find user from each like
		return await User.findOne({_id:like_object.user})
		.then(async (user_object) => {

			if (user_object){

				// return user_object
				return {
					user_name:user_object.user_name,
					user_avatar_image:base64_encode(user_object.user_avatar_image),
				}

			} else {
				null
			}
		})
		
	}))

	// console.log('PROMISE RESULT 1')
	// console.log(users_list_who_liked)

// find image from user
// NOT NEEDED SINCE WE DID NOT MAKE IMAGE AS SEPARATE ENTITY
	// let final_interested_payload = await Promise.all(users_list_who_liked.map(async (user_object) => {
	
	// 	return await Image.findOne({_id:user_object.user_image})
	// 	.then(async (image_object) => {

	// 		if (image_object){

	// 			return {
	// 				user_name:user_object.user_name,
	// 				user_image:base64_encode(image_object.image_filepath),
	// 			}

	// 		} else {
	// 			null
	// 		}

	// 	})

	// }))

	// console.log('PROMISE RESULT 2')
	// console.log(final_interested_payload)

	Promise.all(list_of_promises)
	.then(() => {

		// console.log(final_interested_payload)
		res.status(200).json( final_interested_payload );

	})

})






router.post('/create-sport-with-children', function(req, res, next){
	const newSport = new Sport({

		_id: new mongoose.Types.ObjectId(),
		sport_name: req.body.parent.sport_name,
		sport_image: req.body.parent.sport_image,
		sport_description: req.body.parent.sport_description,
		endpoint: req.body.parent.endpoint,

	});

	newSport.save(function (err, newSport) {
		if (err) return console.log(err);




	newSport.save();

	});

});

// find sport
	
router.get('/find-sport', function(req, res, next){

	Sport.findOne({ endpoint: req.body.endpoint })
		.then((sport) => {

			sport[ sport_image ] = base64_encode( sport[ 'sport_image' ] )

			if (!sport) {

				res.status(401).json({ success: false, msg: "could not find sport" });

			} else {

				res.status(200).json(sport);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// get sports_list

router.get('/sports-list', function(req, res, next){

Sport.
	find().
	limit(10).
	then((sports)=>{
		var newSports_list = []
		sports.map((sport, index)=>{
			var newSport = {}

			newSport.sport_name = sport[ 'sport_name' ]
			newSport.sport_image = base64_encode( sport[ 'sport_image' ] )
			newSport.sport_description = sport[ 'sport_description' ]
			newSport.endpoint = sport[ 'endpoint' ]

			newSports_list.push({...newSport})
			newSport = {}
		});

		return newSports_list
	})

	.then((newSports_list) => {

		if (!newSports_list) {

			res.status(401).json({ success: false, msg: "could not find Sports_list" });

		} else {

			res.status(200).json(newSports_list);

		}

	})
	.catch((err) => {

		next(err);

	});
});

// get sports_list_with_children

router.get('/sports-list-with-children', function(req, res, next){

	Sport.
		find().
		limit(10).
		populate('comments').
		populate('likes').
		populate('shares').
		populate('user').
		then((sports)=>{
			var newSports_list = []
			sports.map((sport, index)=>{
				var newSport = {}

				newSport.sport_name = sport[ 'sport_name' ]
				newSport.sport_image = base64_encode( sport[ 'sport_image' ] )
				newSport.sport_description = sport[ 'sport_description' ]
				newSport.endpoint = sport[ 'endpoint' ]

				newSports_list.push({...newSport})
				newSport = {}
			});

			return newSports_list
		})

		.then((newSports_list) => {

			if (!newSports_list) {

				res.status(401).json({ success: false, msg: "could not find Sports_list" });

			} else {

				res.status(200).json(newSports_list);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// get sports_list_next_10_with_children

router.get('/sports-list-next-10-with-children', function(req, res, next){

	Sport.
		find().
		skip(10).
		limit(10).
		populate('comments').
		populate('likes').
		populate('shares').
		populate('user').
		then((sports)=>{
			var newSports_list = []
			sports.map((sport, index)=>{
				var newSport = {}

				newSport.sport_name = sport[ 'sport_name' ]
				newSport.sport_image = base64_encode( sport[ 'sport_image' ] )
				newSport.sport_description = sport[ 'sport_description' ]
				newSport.endpoint = sport[ 'endpoint' ]

				newSports_list.push({...newSport})
				newSport = {}
			});

			return newSports_list
		})

		.then((newSports_list) => {

			if (!newSports_list) {

				res.status(401).json({ success: false, msg: "could not find Sports_list" });

			} else {

				res.status(200).json(newSports_list);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// get sport with children

router.get('/sport-with-children', function(req, res, next){
	Sport.
		findOne({endpoint:req.body.endpoint}).


		exec(function (err, sport_with_children) {
			if (err) return console.log(err);

			res.status(200).json(sport_with_children);
		});
})


// get sport with summarized children

router.get('/sport-with-summarized-children', function(req, res, next){
	Sport.
		findOne({endpoint:req.body.endpoint}).


		exec(function (err, blogpost_with_children) {

			if (err) return console.log(err);


		res.status(200).json(sport_with_children);

	});
})

// get next 10 sports_list

router.get('/sports-next-10-list', function(req, res, next){

	Sport.
		find().
		limit(10).
		skip(10).
		then( 
			(sports) => {
				var newSports_list = []
				sports.map((sport, index) => {
					var newSport = {}
	
					newSport.sport_name = sport[ 'sport_name' ]
					newSport.sport_image = base64_encode( sport[ 'sport_image' ] )
					newSport.sport_description = sport[ 'sport_description' ]
					newSport.endpoint = sport[ 'endpoint' ]

					newSports_list.push({...newSport})
					newSport = {}
					})
			})

			return newSports_list

		.then((newSports_list) => {

			if (!newSports_list) {

				res.status(401).json({ success: false, msg: "could not find Sports_list" });

			} else {

				res.status(200).json(newSports_list);

			}

		})
		.catch((err) => {

			next(err);

		});
});

// create User

router.post('/create-user', function(req, res, next){

	User.findOne({
		phone_number: req.body.phone_number,
		user_name: req.body.user_name,
		user_name_in_profile: req.body.user_name_in_profile,
		user_avatar_image: req.body.user_avatar_image,
		user_cover_image: req.body.user_cover_image,
		user_brief_intro: req.body.user_brief_intro,
		user_about_me: req.body.user_about_me,
		user_working_zone: req.body.user_working_zone,
		user_education: req.body.user_education,
		user_contact_details: req.body.user_contact_details,
	})
	.then((user) => {

		if (!user) {


			const newUser = new User({
				_id: new mongoose.Types.ObjectId(),
				phone_number: req.body.phone_number,
				user_name: req.body.user_name,
				user_name_in_profile: req.body.user_name_in_profile,
				user_avatar_image: req.body.user_avatar_image,
				user_cover_image: req.body.user_cover_image,
				user_brief_intro: req.body.user_brief_intro,
				user_about_me: req.body.user_about_me,
				user_working_zone: req.body.user_working_zone,
				user_education: req.body.user_education,
				user_contact_details: req.body.user_contact_details,
			});

			newUser.save(function (err, newUser) {

				if (err) return console.log(err);

				res.status(200).json({success: true})
				
			})

		} else {

			res.status(401).json({ success: false, msg: "user already registered, try another or login" })

		}

	})
	.catch((err) => {

		console.log(err)
		// next(err)

	});
})


module.exports = router;