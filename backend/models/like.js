
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new mongoose.Schema({

	_id: Schema.Types.ObjectId,
	user:{ type: Schema.Types.ObjectId, ref: 'User'  },

// other model links
	socialpost:{ type: Schema.Types.ObjectId, ref: 'SocialPost'  },
	page: { type: Schema.Types.ObjectId, ref: 'Page'  },

})

mongoose.model('Like', LikeSchema);