const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var endpoint_number = 393893

const UserSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,
	
	object_files_hosted_at: {type:String, enum:['gcp_storage', 'aws_s3', 'disk_storage',]},

	hash:String,
	salt:String,
	isLoggedIn: Boolean,
	phone_number:String,
	user_name:String,

	facebook:{
		id: String,
		token: String,
		name: String,
		email: String,
	},

	user_name_in_profile:String,
	user_avatar_image:String,
	user_cover_image:String,
	user_brief_intro:String,
	user_about_me:String,
	user_working_zone:String,
	user_education:String,
	user_contact_details:String,

// other model links
	socialposts:[{ type: Schema.Types.ObjectId, ref: 'Social_Post'  }],
	
	socialpost_comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'  }],
	socialpost_likes:[{ type: Schema.Types.ObjectId, ref: 'Like'  }],
	socialpost_shares:[{ type: Schema.Types.ObjectId, ref: 'Share'  }],

	books_created:[{ type: Schema.Types.ObjectId, ref: 'Book'  }],
	books_liked:[{ type: Schema.Types.ObjectId, ref: 'Like'  }],

	pages_created:[{ type: Schema.Types.ObjectId, ref: 'Page'  }],
	pages_liked:[{ type: Schema.Types.ObjectId, ref: 'Like'  }],

	ad_created:[{ type: Schema.Types.ObjectId, ref: 'Advertisement' }],
	ad_liked:[{ type: Schema.Types.ObjectId, ref: 'Like'  }],

	sport_created:[{ type: Schema.Types.ObjectId, ref: 'Sport' }],
	sport_liked:[{ type: Schema.Types.ObjectId, ref: 'Like' }],
	
	privileges: [{ type: Schema.Types.ObjectId, ref: 'Privilege'  }],

	total_socialposts:0,
	total_comments:0,
	total_likes:0,
	total_shares:0,
	total_privileges:0,

	friends: [{ type: Schema.Types.ObjectId, ref: 'User'  }],
	total_friends:0,

	friend_requests_sent: [{ type: Schema.Types.ObjectId, ref: 'User'  }],
	total_friend_requests_sent: 0,

	friend_requests: [{ type: Schema.Types.ObjectId, ref: 'User'  }],
	total_friend_requests:0,

	activities: [{ type: Schema.Types.ObjectId, ref: 'Activity'  }], // creating post, liking, sharing, commmenting
	total_activities: 0,

	endpoint:String,
	timestamp:String,


	last_timestamp_of_checking_notification: { type:String, default: null},

})

	
UserSchema.pre('save', function(next) {
	this.total_socialposts = this.socialposts.length
	this.total_comments = this.socialpost_comments.length
	this.total_likes = this.socialpost_likes.length
	this.total_shares = this.socialpost_shares.length

	this.total_friends = this.friends.length
	this.total_friend_requests = this.friend_requests.length
	this.total_friend_requests_sent = this.friend_requests_sent.length
	this.total_activities = this.activities.length

	this.total_privileges = this.privileges.length

	endpoint_number += 1

	if ( this.socialposts.length === 0 && this.socialpost_comments.length === 0 && this.socialpost_likes.length === 0 && this.socialpost_shares.length === 0 && this.books_created.length === 0 && this.books_liked.length === 0 && this.pages_created.length === 0 && this.pages_liked.length === 0 && this.ad_created.length === 0 && this.ad_liked.length === 0 && this.sport_created.length === 0 && this.sport_liked.length === 0 && this.friends.length === 0 && this.friend_requests_sent.length === 0 ){

		this.endpoint = String( endpoint_number )
		this.timestamp = String( Date.now() )
	
	}

    next();

});

UserSchema.post('save', function() {

	// console.log('SAVED CONDITION')
    // console.log(this)

    // only keep last 50 activities
    this.activities = this.activities.slice(1).slice(-50)

});

mongoose.model('User', UserSchema);