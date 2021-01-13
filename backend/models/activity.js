const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var endpoint_number = 393893

const ActivitySchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,
	user: { type: Schema.Types.ObjectId, ref: 'User'},
	activity_type: { type:String, enum:['created_post', 'liked', 'shared', 'commented', 'sent_request', 'accepted_request'] },
//
	post_created: { type: Schema.Types.ObjectId, ref: 'Social_Post'},
	post_liked: { type: Schema.Types.ObjectId, ref: 'Like'},
	page_liked: { type: Schema.Types.ObjectId, ref: 'Like'},
	post_share: { type: Schema.Types.ObjectId, ref: 'Share'},
	post_commented: { type: Schema.Types.ObjectId, ref: 'Comment'},
	sent_friend_request: { type: Schema.Types.ObjectId, ref: 'User'},
	accepted_friend_request: { type: Schema.Types.ObjectId, ref: 'User'},

	endpoint:String,
	timestamp:String,

})

ActivitySchema.pre('save', function(next) {

	endpoint_number += 1

	this.endpoint = String( endpoint_number )
	this.timestamp = String( Date.now() )
	
    next();

});

ActivitySchema.post('save', function() {

	// console.log('SAVED CONDITION')
    // console.log(this)

});


mongoose.model('Activity', ActivitySchema);