
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,

	book_name:String,
	book_image:String,
	book_description:String,
	endpoint:String,

// other model links
	interested_users: [{ type: Schema.Types.ObjectId, ref: 'User'  }],

})

mongoose.model('Book', BookSchema);
	
// BookSchema.pre('save', function(next) {

//     next();

// });
