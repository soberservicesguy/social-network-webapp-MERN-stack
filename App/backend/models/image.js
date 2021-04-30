
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var endpoint_number = 31983

const ImageSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	object_files_hosted_at: {type:String, enum:['gcp_storage', 'aws_s3', 'disk_storage',]},

	category:String,
	image_filepath:String,
	title:String,
	endpoint:String,
	timestamp_of_uploading:String,
	description:String,
	all_tags:String,

// other model links
	comments:[{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	likes:[{ type: Schema.Types.ObjectId, ref: 'Like' }],

	user:{ type: Schema.Types.ObjectId, ref: 'User' },

	total_comments:0,
	total_likes:0,

})

ImageSchema.pre('save', function(next) {

	endpoint_number += 1

	// adding timestamp and endpoint when image is created ie likes, comments, shares are 0
	if ( this.total_comments.length === 0 && this.likes.length === 0  ){

		this.timestamp_of_uploading = String( Date.now() )
		this.endpoint = String( endpoint_number )

	}

	this.total_comments = this.comments.length
	this.total_likes = this.likes.length


    next();

});

ImageSchema.post('save', function() {

	// console.log('SAVED CONDITION')
 //    console.log(this)

});


mongoose.model('Image', ImageSchema);