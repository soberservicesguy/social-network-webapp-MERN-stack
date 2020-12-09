
const components_list = ['React_Component_1',]
const containers_list = ['React_Grid',]

	
const all_schemas = [
	
	{
		parent:{
			react_class_name_for_component:'Individual_Social_Post', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
			react_class_name_for_container:'Social_Post', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
			react_class_name_for_card:'Social_Post_Card',

			class_name:'SocialPost', // first letter should be capitalized of each token and singular
			summarized_version_length:10,
			index:'endpoint',

			children_classes:['Comment','Like','Share','User',],
			schemafields:
					{
						type_of_post: 'String',
						author_name: 'String',
						author_image: 'String',
						post_text: 'String',
						image_for_post: 'String',
						video_for_post: 'String',
						video_thumbnail_image: 'String',
						total_likes: 'String',
						total_shares: 'String',
						endpoint: 'String',
						date_of_publishing: 'String',
					},

			
			special_lists_in_frontend: [],
			attributes_which_can_be_modified_in_frontend: [],
			object_filtering_keys: [],

			linked_object_and_live_object_in_redux: 'User',

			other_model_links:[
	
					{comments: `[{ type: Schema.Types.ObjectId, ref: 'Comment' }]`},

					{likes: `[{ type: Schema.Types.ObjectId, ref: 'Like' }]`},

					{shares: `[{ type: Schema.Types.ObjectId, ref: 'Share' }]`},

					{user: `{ type: Schema.Types.ObjectId, ref: 'User' }`},

				]
			},

		children:[
	
			{
				react_class_name_for_component:'Individual_Comment', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'Comment', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'Comment_Card',
				class_name:'Comment', // first letter should be capitalized of each token and singular
				summarized_version_length:8,
				index:'comment_order',
				schemafields:
					{
						comment_text: 'String',
						date_of_publishing: 'String',
					},

				other_model_links:[
					{socialpost: `{ type: Schema.Types.ObjectId, ref: 'SocialPost'  }`},
					{user: `{ type: Schema.Types.ObjectId, ref: 'User'  }`},


				],
			
				linked_object_and_live_object_in_redux: 'User',
			},				
	
			{
				react_class_name_for_component:'Individual_Like', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'Like', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'Like_Card',
				class_name:'Like', // first letter should be capitalized of each token and singular
				summarized_version_length:2,
				index:'comment_order',
				schemafields:
					{
					},

				other_model_links:[
					{socialpost: `{ type: Schema.Types.ObjectId, ref: 'SocialPost'  }`},
					{user: `{ type: Schema.Types.ObjectId, ref: 'User'  }`},


				],
			
				linked_object_and_live_object_in_redux: 'User',
			},				
	
			{
				react_class_name_for_component:'Individual_Share', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'Share', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'Share_Card',
				class_name:'Share', // first letter should be capitalized of each token and singular
				summarized_version_length:2,
				index:'comment_order',
				schemafields:
					{
					},

				other_model_links:[
					{socialpost: `{ type: Schema.Types.ObjectId, ref: 'SocialPost'  }`},
					{user: `{ type: Schema.Types.ObjectId, ref: 'User'  }`},


				],
			
				linked_object_and_live_object_in_redux: 'User',
			},				
	
			{
				react_class_name_for_component:'Individual_User', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
				react_class_name_for_container:'User', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
				react_class_name_for_card:'User_Card',
				class_name:'User', // first letter should be capitalized of each token and singular
				summarized_version_length:2,
				index:'phone_number',
				schemafields:
					{
						phone_number: 'String',
						user_name: 'String',
						user_name_in_profile: 'String',
						user_avatar_image: 'String',
						user_cover_image: 'String',
						user_brief_intro: 'String',
						user_about_me: 'String',
						user_working_zone: 'String',
						user_education: 'String',
						user_contact_details: 'String',
					},

				other_model_links:[
					{socialposts: `[{ type: Schema.Types.ObjectId, ref: 'Social_Post'  }]`},
					{comments: `[{ type: Schema.Types.ObjectId, ref: 'Comment'  }]`},
					{likes: `[{ type: Schema.Types.ObjectId, ref: 'Like'  }]`},
					{shares: `[{ type: Schema.Types.ObjectId, ref: 'Share'  }]`},

				],
			
				linked_object_and_live_object_in_redux: '',
			},				
	
		]
	},

	{
		parent:{
			react_class_name_for_component:'Individual_Book', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
			react_class_name_for_container:'Book', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
			react_class_name_for_card:'Book_Card',

			class_name:'Book', // first letter should be capitalized of each token and singular
			summarized_version_length:10,
			index:'endpoint',

			children_classes:[],
			schemafields:
					{
						book_name: 'String',
						book_image: 'String',
						book_description: 'String',
						endpoint: 'String',
					},

			
			special_lists_in_frontend: [],
			attributes_which_can_be_modified_in_frontend: [],
			object_filtering_keys: [],

			linked_object_and_live_object_in_redux: '',

			other_model_links:[
	
				]
			},

		children:[
	
		]
	},

	{
		parent:{
			react_class_name_for_component:'Individual_Sport', // used for pushing reducers and endpoints, and state to components. ALSO always use underscores, they will be removed where needed
			react_class_name_for_container:'Sport', // used for pushing reducers and endpoints, and state to containers. ALSO fill container names WITHOUT CONTAINER suffix but with underscores
			react_class_name_for_card:'Sport_Card',

			class_name:'Sport', // first letter should be capitalized of each token and singular
			summarized_version_length:10,
			index:'endpoint',

			children_classes:[],
			schemafields:
					{
						sport_name: 'String',
						sport_image: 'String',
						sport_description: 'String',
						endpoint: 'String',
					},

			
			special_lists_in_frontend: [],
			attributes_which_can_be_modified_in_frontend: [],
			object_filtering_keys: [],

			linked_object_and_live_object_in_redux: '',

			other_model_links:[
	
				]
			},

		children:[
	
		]
	},

]

module.exports = {
	components_list:components_list,
	containers_list:containers_list,
	all_schemas:all_schemas,
};
