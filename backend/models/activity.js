const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,
	user: { type: Schema.Types.ObjectId, ref: 'User'},
	activity_type: String, // created post, liked, shared, commented, sent request, accepted request, 
//
	post_created: { type: Schema.Types.ObjectId, ref: 'Social_Post'},
	post_liked: { type: Schema.Types.ObjectId, ref: 'Like'},
	page_liked: { type: Schema.Types.ObjectId, ref: 'Like'},
	post_share: { type: Schema.Types.ObjectId, ref: 'Share'},
	post_commented: { type: Schema.Types.ObjectId, ref: 'Comment'},
	sent_friend_request: { type: Schema.Types.ObjectId, ref: 'User'},
	accepted_friend_request: { type: Schema.Types.ObjectId, ref: 'User'},

})

mongoose.model('Activity', ActivitySchema);
	
// ActivitySchema.pre('save', function(next) {

//     next();

// });
