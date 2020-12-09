
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PageSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	page_name:String,
	page_image:String,
	page_description:String,
	endpoint:String,

// other model links
	interested_users: [{ type: Schema.Types.ObjectId, ref: 'User'  }],
})

mongoose.model('Page', PageSchema);
	
// PageSchema.pre('save', function(next) {

//     next();

// });
