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

const { 
	get_image_to_display,
	get_multer_storage_to_use, 
	get_file_storage_venue, 
	get_file_path_to_use,

	use_gcp_storage, 
	use_aws_s3_storage, 

	save_file_to_gcp,
	gcp_bucket,

	checkFileTypeForImages,
} = require('../../config/storage/')


router.get('/ads-list', async function(req, res, next){

	// console.log('GETTING ADS')

	Advertisement.
	find().
	limit(10).
	then(async (advertisements)=>{

		// console.log(`number of ads are ${advertisements.length}`)

		if (advertisements){

			var newAdvertisements_list = []

			let all_ads = await Promise.all(advertisements.map(async (advertisement, index)=>{
				var newAdvertisement = {}

				newAdvertisement.ad_name = advertisement[ 'ad_name' ]

				// OLD VERSION
				// newAdvertisement.ad_image = await get_image_to_display(advertisement.ad_image, advertisement.object_files_hosted_at)
				// NEW VERSION				
				newAdvertisement.ad_image = advertisement.ad_image
				newAdvertisement.ad_image_host = advertisement.object_files_hosted_at
				newAdvertisement.ad_description = advertisement[ 'ad_description' ]
				newAdvertisement.endpoint = advertisement[ 'endpoint' ]

				newAdvertisements_list.push({...newAdvertisement})
				newAdvertisement = {}
			}))

			// console.log(newAdvertisements_list)
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