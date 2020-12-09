
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	phone_number:String,
	user_name:String,
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
	comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'  }],
	likes:[{ type: Schema.Types.ObjectId, ref: 'Like'  }],
	shares:[{ type: Schema.Types.ObjectId, ref: 'Share'  }],

	total_socialposts:0,
	total_comments:0,
	total_likes:0,
	total_shares:0,

	friends: [{ type: Schema.Types.ObjectId, ref: 'User'  }],
	total_friends:0,

	friend_requests: [{ type: Schema.Types.ObjectId, ref: 'User'  }],
	total_friend_requests:0,

	activities: [{ type: Schema.Types.ObjectId, ref: 'Activity'  }], // creating post, liking, sharing, commmenting
	total_activities: 0,
})

mongoose.model('User', UserSchema);
	
UserSchema.pre('save', function(next) {
	this.total_socialposts = this.socialposts.length
	this.total_comments = this.comments.length
	this.total_likes = this.likes.length
	this.total_shares = this.shares.length

	this.total_friends = this.friends.length
	this.total_friend_requests = this.friend_requests.length
	this.total_activities = this.activities.length

    next();

});
