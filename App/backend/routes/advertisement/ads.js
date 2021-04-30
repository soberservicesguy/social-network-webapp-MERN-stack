// 

require('../../models/advertisement');
require('../../models/user');

const base64_encode = require('../../lib/image_to_base64')
const mongoose = require('mongoose');
const router = require('express').Router();
const Advertisement = mongoose.model('Advertisement');
const User = mongoose.model('User');

const passport = require('passport');
const { isAllowedSurfing } = require('../authMiddleware/isAllowedSurfing')
const { isAllowedCreatingAds } = require('../authMiddleware/isAllowedCreatingAds')



router.get('/ads-list', function(req, res, next){

	console.log('GETTING ADS')

	Advertisement.
	find().
	limit(10).
	then((advertisements)=>{

		if (advertisements){

			var newAdvertisements_list = []
			advertisements.map((advertisement, index)=>{
				var newAdvertisement = {}

				newAdvertisement.ad_name = advertisement[ 'ad_name' ]
				newAdvertisement.ad_image = base64_encode( advertisement[ 'ad_image' ] )
				newAdvertisement.ad_description = advertisement[ 'ad_description' ]
				newAdvertisement.endpoint = advertisement[ 'endpoint' ]

				newAdvertisements_list.push({...newAdvertisement})
				newAdvertisement = {}
			});

			res.status(200).json(newAdvertisements_list);

		} else {
			res.status(401).json({ success: false, msg: "could not find Advertisements_list" });

		}
	})
	.catch((err) => {

		next(err);

	});

});



module.exports = router;