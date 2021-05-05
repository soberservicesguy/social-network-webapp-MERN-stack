const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var endpoint_number = 3938932

const SocialPostSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	object_files_hosted_at: {type:String, enum:['gcp_storage', 'aws_s3', 'disk_storage',]},

	type_of_post:{ type:String, enum:['text_post', 'image_post', 'video_post', 'text_with_image_post', 'text_with_video_post']},
	post_text:{ type:String, default: null},
	image_for_post:{ type:String, default: null},
	video_for_post:{ type:String, default: null},
	video_thumbnail_image:{ type:String, default: null},

// other model links
	comments:[{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	likes:[{ type: Schema.Types.ObjectId, ref: 'Like' }],
	shares:[{ type: Schema.Types.ObjectId, ref: 'Share' }],
	user:{ type: Schema.Types.ObjectId, ref: 'User' },
	total_comments: {type:Number, default: 0 },
	total_likes: {type:Number, default: 0 },
	total_shares: {type:Number, default: 0 },

	endpoint:String,
	timestamp:String,

})


	
SocialPostSchema.pre('save', function(next) {

	endpoint_number += 1

	// adding timestamp and endpoint when post is created ie likes, comments, shares are 0
	if ( this.comments.length === 0 && this.likes.length === 0 && this.shares.length === 0 ){

		this.endpoint = String( endpoint_number )
		this.timestamp = String( Date.now() )

		console.log(`assigning endpoint to new post ${endpoint_number}`)
	}

	this.total_comments = this.comments.length
	this.total_likes = this.likes.length
	this.total_shares = this.shares.length
    next();

});

SocialPostSchema.post('save', function() {

	// console.log('SAVED CONDITION')
    // console.log(this)

});


mongoose.model('SocialPost', SocialPostSchema);