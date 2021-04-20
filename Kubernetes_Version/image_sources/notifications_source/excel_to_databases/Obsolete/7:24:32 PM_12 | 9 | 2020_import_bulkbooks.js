require('./db_settings')

const readXlsxFile = require('read-excel-file/node');
var base64_encode = require('../lib/image_to_base64');
const {resolve} = require('path')
const mongoose = require('mongoose');

require('../models/socialpost');
require('../models/comment');
require('../models/like');
require('../models/share');
require('../models/user');

const SocialPost = mongoose.model('SocialPost');
const Comment = mongoose.model('Comment');

const Like = mongoose.model('Like');

const Share = mongoose.model('Share');

const User = mongoose.model('User');

const file_name = 'all_socialposts.xlsx';

const sheet_to_class_mapper = (sheet_name, db_object) => {
	if (sheet_name === 'all_socialposts'){

		return new SocialPost(db_object)
	
	} else if (sheet_name === 'comments'){

	return new Comment(db_object)
	
	} else if (sheet_name === 'likes'){

	return new Like(db_object)
	
	} else if (sheet_name === 'shares'){

	return new Share(db_object)
	
	} else if (sheet_name === 'users'){

	return new User(db_object)

	} else {

		null

	}
}


const save_parent_and_children_in_db = (parent_children_rows_dict, sheet_to_class_dict) =>{

	const parent_header = parent_children_rows_dict.parent_header
	const parent_sheet = parent_children_rows_dict.parent_sheet_name
	const row_details_list = parent_children_rows_dict.row_details

	for (let i = 0; i < row_details_list.length; i++) {

		const parent_row = row_details_list[i].parent_row
		var parent_db_object_dict = {};

		for (let j = 0; j < parent_row.length; j++) {
			// generating objects by combining header and row values
			parent_db_object_dict[ parent_header[j] ] = parent_row[j]

		} 

		const socialpost = sheet_to_class_mapper(parent_sheet, {...parent_db_object_dict, _id: new mongoose.Types.ObjectId()})

		socialpost.save(function (err, socialpost) {

			if (err) return handleError(err);

			// accessing children

			const related_children = row_details_list[i].children
			// console.log(related_children)

			// doing below condition since some children are just empty arrays []
			if (related_children.length > 0){
				for (let k = 0; k < related_children.length; k++) {

					const related_child = related_children[k]
					const child_sheet = related_child.child_sheet
					const child_header = related_child.childs_header
					const child_rows = related_child.child_rows

					for (let l = 0; l < child_rows.length; l++) {

						const child_row = child_rows[l]
						var child_db_object_dict = {};

						// generating objects by combining header and row values
						for (let m = 0; m < child_row.length; m++) {
							child_db_object_dict[ child_header[m] ] = parent_row[m]
						} 

						const related_child = sheet_to_class_mapper(child_sheet, {...child_db_object_dict, socialpost: socialpost._id})

						related_child.save(function (err) {
						  if (err) return handleError(err);
						});

	
						if (child_sheet === 'comments'){

							socialpost.comments.push(related_child._id)

		
						} else if (child_sheet === 'likes'){

							socialpost.likes.push(related_child._id)

		
						} else if (child_sheet === 'shares'){

							socialpost.shares.push(related_child._id)

		
						} else if (child_sheet === 'users'){

							socialpost.users.push(related_child._id)

	
						}
					} 
				} 
				// saving parent object after assigning child objects to it
 
 				socialpost.save()

			}			
		})
	}
}





const parent_children_detailed = (file_name, old_parent_child_relationship_data ,  parent_completely_detailed, sheet_to_class_dict) =>{

	/**
	 * -------------- CODE BLOCK 1 START ----------------
	 * GOALS:
		take the output from previous and convert into [{parent:already_done, children:{
		sheet_name:,child_header:,row_details:[}},]
	 * STEPS:
		open first child sheet, filter row for addition, find and save header, access row and match it with parent index if matched
		loop over output_From_previous.row_details, find matched children and add children in the dict so that it becomes
		row_details:{ index: 1, parent_row: [Array] , children:[ {child_row:entire_row, child_sheet:''}, ] }
		also push child_sheet_name:[headers] in it
		var parent_complete_details = {};
		var children_complete_details = {};
		parent_complete_details.row_details = []; //{index:'', entire_row:[]}
	*/

	/**
	 * -------------- LOOP START ----------------
	 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
	 */
	wrappedPomise = new Promise((resolve, reject)=>{

		var all_results1 = [];
		var all_results2 = [];

		parent_completely_detailed.row_details.map((detailed_row_object, index0)=>{
			detailed_row_object.children = [];
			// 2nd access old_parent_child_relationship_data

			/**
			 * --------------  NESTED LOOP 1 START ----------------
			 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
			 */
				old_parent_child_relationship_data.map((parent_child_data, index1)=>{
					// console.log(parent_child_data)
					var parent_details = parent_child_data.parent;
					var children_details = parent_child_data.children;
					var parent_sheet = parent_details.name;

				/**
				 * --------------  NESTED LOOP 2 START ----------------
				 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
				 */

					children_details.map((children_detail, index2)=>{
						// console.log(children_detail)
						const child_sheet = children_detail.name
						// converting range from string to array of numbers
						var child_range_in_string_array = children_detail.range.split(",");
						var child_range_array =[];
						child_range_in_string_array.map((item, index3)=>{
							child_range_array.push(Number(item))
						})

						// opening children files
						var related_child_all_filtered_rows = [];
						readXlsxFile( String(file_name), { sheet: String(child_sheet) })
						.then(
							(child_rows) => {
						/**
						 * --------------  NESTED LOOP 3 START ----------------
						 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
						 */
							var child_header ;
							child_rows.map((child_row, index4) => {
								if (index4 === 0) {
								}

								if (index4 === 1) {

									child_header = child_row;
									child_header.shift()
									
								} else {

	// HERE, ACCESSED PARENT INDEX, NOW MATCH IT, LEARN BREAK AND CONTINUE

									const parent_index = detailed_row_object.index
									
									// 'checking if childindex is same as parentindex'
									var child_index = child_row[0]

									if( parent_index === child_index ){
										// 'keeping only range of parent data and removing rest of the cells'
										const child_filtered_row = child_row.slice( Math.min.apply(Math, child_range_array), Math.max.apply(Math, child_range_array) + 1)
										related_child_all_filtered_rows.push([...child_filtered_row])

										// checking if the last child row reached then pushing things in parent_complete_details
										// detailed_row_object.children = { child_sheet:child_sheet, childs_header:child_header, child_rows:[] }

											var new_related_child_all_filtered_rows = [...related_child_all_filtered_rows]
											detailed_row_object.children.push( {child_sheet:child_sheet, childs_header:child_header, child_rows:related_child_all_filtered_rows} )


											related_child_all_filtered_rows = []

										if ( index4 < child_rows.length - 1 ){

											return

										} else {
										}

									}


								}
								
							})

						/**
						 * --------------  NESTED LOOP 3 ENDS ----------------
						 */
							return parent_completely_detailed
						})
						// 'BELOW IS BEING DONE SINCE ITS IN A LOOP, THAT IS TO REMOVE ALL OTHER ENTRIES EXCEPT LAST FROM THE LOOP AND ONLY THEN FEED TO NEXT .then FUNCTION, AND THEN SAME IS DONT IN IT BEFORE FEEDING TO save_parent_and_children_in_db function'
						.then( ()=> {
							if ( !all_results1.includes(parent_completely_detailed) ){
								all_results1.push(parent_completely_detailed);
								return parent_completely_detailed
							}
						})
						.then( (ans_for_above) => {
							if ( !all_results2.includes(ans_for_above) && ans_for_above !== undefined  ){
								all_results2.push(ans_for_above);
								save_parent_and_children_in_db(ans_for_above, sheet_to_class_dict); 
							}
						})
						// .then( ()=> console.log(parent_completely_detailed.row_details[0].children[0].child_rows) )

					})

				/**
				 * --------------  NESTED LOOP 2 START ----------------
				 */
				})
			/**
			 * --------------  NESTED LOOP 1 START ----------------
			 */
		})
		/**
		 * -------------- CODE BLOCK 1 END ----------------
		 */

	}) // FROM WRAPPED PROMISE
	// .then( (parent_child_rows_dict_generated)=>save_parent_and_children_in_db(parent_child_rows_dict_generated) )

}












const generate_parent_completely_detailed = (file_name, parent_child_relationship_data, sheet_to_class_dict) => {
// NOTE : TEST THIS TO WORK FOR MULTIPLE PARENTS AND THEIR CHILDREN, OR ONLY USE IT FOR SINGLE PARENT AND ITS CHILDREN

	/**
	 * -------------- CODE BLOCK 1 START ----------------
	 * GOALS:
		 to get all rows from parent sheet and save in the form 
		 db_parent_objects_list = [ {sheet_name:, index:, entire_row:,} ], db_children_objects_list = [ {sheet_name:, index:, entire_row:,} ] 
		 and parent_header and return the variable    
	 * STEPS:
		access parent sheet through parent_child_relationship_data and then save all rows in above mentioned form
	 */
		var parent_complete_details = {};
		var children_complete_details = {};
		parent_complete_details.row_details = []; //{index:'', entire_row:[]}

		/**
		 * -------------- LOOP START ----------------
		 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
		 */

		parent_child_relationship_data.map((parent_child_data, index1)=>{
			var parent_details = parent_child_data.parent;
			var children_details = parent_child_data.children;
			var parent_sheet = parent_details.name;
			var parent_range_in_string = parent_details.range;
			// 'converting parent range into Numbers array so that min and max can be applied'
			var parent_range_in_string_array = parent_range_in_string.split(",");
			var parent_range_array =[];
			parent_range_in_string_array.map((item, index2)=>{
				parent_range_array.push(Number(item))
			})

			readXlsxFile( String(file_name), { sheet: String(parent_sheet) })
				.then(
					(parent_rows) => {

				 /**
				  * -------------- NESTED LOOP START ----------------
				  * LOOP OVER: parent sheet, PROCESS OVER CHILDREN: pull header, pull entire row and save them in above dict
				  */	

						const parent_all_filtered_rows = []
						parent_rows.map((parent_row, index3) => {
							if (index3 === 0) {
							}

							if (index3 === 1) {

								const parent_header = parent_row;
								parent_header.shift()
								
								parent_complete_details.parent_sheet_name = parent_sheet
								parent_complete_details.parent_header = parent_header

							} else {
								const parent_index = parent_row[0]
								// 'keeping only range of parent data and removing rest of the cells'
								const parent_filtered_row = parent_row.slice( Math.min.apply(Math, parent_range_array), Math.max.apply(Math, parent_range_array)  + 1)
								parent_complete_details.row_details.push( {index:parent_index, parent_row:parent_filtered_row} )
							}
						})
						// 'removing first row as it isnt clear from where its coming'
						parent_complete_details.row_details.shift()

				 /**
				  * -------------- NESTED LOOP ENDS ----------------
				  */
					  return parent_complete_details
					}) // from .then block
					// .then( res => console.log(res) )
					.then( parent_detailed => parent_children_detailed(file_name, parent_child_relationship_data, parent_detailed, sheet_to_class_dict) )


			}) // from parent_child_relationship_data.map block

		 /**
		  * -------------- LOOP END ----------------
		  */
	/**
	 * -------------- CODE BLOCK 1 END ----------------
	 */

}






const pull_parent_child_data_from_excel = (file_name, sheet_to_class_dict) => {
	var all_collection = [];

	var parent_child_details = {};

	return readXlsxFile( String(file_name), { sheet: String('relationship_structure') })
		.then(

			(rows) => {

				rows.map( (row, index) => {

				var children = [];

// removing the header

				if (index > 0){
					var parent_name = row[0];
					var parent_range = row[1];

// entering parent details in parent_child_details
					parent_child_details.parent={name:parent_name, range:parent_range}

// removing null values from array
					while (row.includes(null)) {
						row.pop(null)
					}
// removing parent sheet name and parent range
					row.shift();
					row.shift();

					var child = {};

					row.map((item, item_index)=>{
// locating children sheets
						if (item_index % 2 === 0){
							child.name = item
						}
// locating children ranges
						if (item_index % 2 !== 0){
							child.range = item

							if ( !children.includes(child) ){
								children.push(child)
								child = {};
							}
						}
					})

// assigning children to parent_child_details dict 
					parent_child_details.children = children
					if ( !all_collection.includes(parent_child_details) ){

						all_collection.push(parent_child_details)
						parent_child_details = {};
					}
				}
			})

		return all_collection

	})
	.then( result => generate_parent_completely_detailed(file_name, result, sheet_to_class_dict) )
	// .catch( (err) => console.log('ERROR IS ', err) )
}



const sheet_to_class = (file_name) => {
	const sheet_to_class_dict = {};

	readXlsxFile( String(file_name), { sheet: String('sheets_classes') })
	.then(
		(rows) => {
			const key_row = rows[0];
			const value_row = rows[1]
			// for loop
			for (let i = 0; i < key_row.length; i++) {
				sheet_to_class_dict[ key_row[i] ] = value_row[i]
			} 
		
		return sheet_to_class_dict

		})
		// .then( (ans) => console.log(ans) )
		.then ( (sheet_to_class_dict) => pull_parent_child_data_from_excel(file_name, sheet_to_class_dict) )
		.catch( err => console.log(err) )	
}




sheet_to_class(file_name)

const readXlsxFile = require('read-excel-file/node');
var base64_encode = require('../lib/image_to_base64');
const {resolve} = require('path')
const mongoose = require('mongoose');

require('../models/advertisement');

const Advertisement = mongoose.model('Advertisement');
const file_name = 'all_advertisements.xlsx';

const sheet_to_class_mapper = (sheet_name, db_object) => {
	if (sheet_name === 'all_advertisements'){

		return new Advertisement(db_object)

	} else {

		null

	}
}


const save_parent_and_children_in_db = (parent_children_rows_dict, sheet_to_class_dict) =>{

	const parent_header = parent_children_rows_dict.parent_header
	const parent_sheet = parent_children_rows_dict.parent_sheet_name
	const row_details_list = parent_children_rows_dict.row_details

	for (let i = 0; i < row_details_list.length; i++) {

		const parent_row = row_details_list[i].parent_row
		var parent_db_object_dict = {};

		for (let j = 0; j < parent_row.length; j++) {
			// generating objects by combining header and row values
			parent_db_object_dict[ parent_header[j] ] = parent_row[j]

		} 

		const advertisement = sheet_to_class_mapper(parent_sheet, {...parent_db_object_dict, _id: new mongoose.Types.ObjectId()})

		advertisement.save(function (err, advertisement) {

			if (err) return handleError(err);

			// accessing children

			const related_children = row_details_list[i].children
			// console.log(related_children)

			// doing below condition since some children are just empty arrays []
			if (related_children.length > 0){
				for (let k = 0; k < related_children.length; k++) {

					const related_child = related_children[k]
					const child_sheet = related_child.child_sheet
					const child_header = related_child.childs_header
					const child_rows = related_child.child_rows

					for (let l = 0; l < child_rows.length; l++) {

						const child_row = child_rows[l]
						var child_db_object_dict = {};

						// generating objects by combining header and row values
						for (let m = 0; m < child_row.length; m++) {
							child_db_object_dict[ child_header[m] ] = parent_row[m]
						} 

						const related_child = sheet_to_class_mapper(child_sheet, {...child_db_object_dict, advertisement: advertisement._id})

						related_child.save(function (err) {
						  if (err) return handleError(err);
						});


						}
					} 
				} 
				// saving parent object after assigning child objects to it
 
 				advertisement.save()

			}			
		})
	}
}





const parent_children_detailed = (file_name, old_parent_child_relationship_data ,  parent_completely_detailed, sheet_to_class_dict) =>{

	/**
	 * -------------- CODE BLOCK 1 START ----------------
	 * GOALS:
		take the output from previous and convert into [{parent:already_done, children:{
		sheet_name:,child_header:,row_details:[}},]
	 * STEPS:
		open first child sheet, filter row for addition, find and save header, access row and match it with parent index if matched
		loop over output_From_previous.row_details, find matched children and add children in the dict so that it becomes
		row_details:{ index: 1, parent_row: [Array] , children:[ {child_row:entire_row, child_sheet:''}, ] }
		also push child_sheet_name:[headers] in it
		var parent_complete_details = {};
		var children_complete_details = {};
		parent_complete_details.row_details = []; //{index:'', entire_row:[]}
	*/

	/**
	 * -------------- LOOP START ----------------
	 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
	 */
	wrappedPomise = new Promise((resolve, reject)=>{

		var all_results1 = [];
		var all_results2 = [];

		parent_completely_detailed.row_details.map((detailed_row_object, index0)=>{
			detailed_row_object.children = [];
			// 2nd access old_parent_child_relationship_data

			/**
			 * --------------  NESTED LOOP 1 START ----------------
			 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
			 */
				old_parent_child_relationship_data.map((parent_child_data, index1)=>{
					// console.log(parent_child_data)
					var parent_details = parent_child_data.parent;
					var children_details = parent_child_data.children;
					var parent_sheet = parent_details.name;

				/**
				 * --------------  NESTED LOOP 2 START ----------------
				 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
				 */

					children_details.map((children_detail, index2)=>{
						// console.log(children_detail)
						const child_sheet = children_detail.name
						// converting range from string to array of numbers
						var child_range_in_string_array = children_detail.range.split(",");
						var child_range_array =[];
						child_range_in_string_array.map((item, index3)=>{
							child_range_array.push(Number(item))
						})

						// opening children files
						var related_child_all_filtered_rows = [];
						readXlsxFile( String(file_name), { sheet: String(child_sheet) })
						.then(
							(child_rows) => {
						/**
						 * --------------  NESTED LOOP 3 START ----------------
						 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
						 */
							var child_header ;
							child_rows.map((child_row, index4) => {
								if (index4 === 0) {
								}

								if (index4 === 1) {

									child_header = child_row;
									child_header.shift()
									
								} else {

	// HERE, ACCESSED PARENT INDEX, NOW MATCH IT, LEARN BREAK AND CONTINUE

									const parent_index = detailed_row_object.index
									
									// 'checking if childindex is same as parentindex'
									var child_index = child_row[0]

									if( parent_index === child_index ){
										// 'keeping only range of parent data and removing rest of the cells'
										const child_filtered_row = child_row.slice( Math.min.apply(Math, child_range_array), Math.max.apply(Math, child_range_array) + 1)
										related_child_all_filtered_rows.push([...child_filtered_row])

										// checking if the last child row reached then pushing things in parent_complete_details
										// detailed_row_object.children = { child_sheet:child_sheet, childs_header:child_header, child_rows:[] }

											var new_related_child_all_filtered_rows = [...related_child_all_filtered_rows]
											detailed_row_object.children.push( {child_sheet:child_sheet, childs_header:child_header, child_rows:related_child_all_filtered_rows} )


											related_child_all_filtered_rows = []

										if ( index4 < child_rows.length - 1 ){

											return

										} else {
										}

									}


								}
								
							})

						/**
						 * --------------  NESTED LOOP 3 ENDS ----------------
						 */
							return parent_completely_detailed
						})
						// 'BELOW IS BEING DONE SINCE ITS IN A LOOP, THAT IS TO REMOVE ALL OTHER ENTRIES EXCEPT LAST FROM THE LOOP AND ONLY THEN FEED TO NEXT .then FUNCTION, AND THEN SAME IS DONT IN IT BEFORE FEEDING TO save_parent_and_children_in_db function'
						.then( ()=> {
							if ( !all_results1.includes(parent_completely_detailed) ){
								all_results1.push(parent_completely_detailed);
								return parent_completely_detailed
							}
						})
						.then( (ans_for_above) => {
							if ( !all_results2.includes(ans_for_above) && ans_for_above !== undefined  ){
								all_results2.push(ans_for_above);
								save_parent_and_children_in_db(ans_for_above, sheet_to_class_dict); 
							}
						})
						// .then( ()=> console.log(parent_completely_detailed.row_details[0].children[0].child_rows) )

					})

				/**
				 * --------------  NESTED LOOP 2 START ----------------
				 */
				})
			/**
			 * --------------  NESTED LOOP 1 START ----------------
			 */
		})
		/**
		 * -------------- CODE BLOCK 1 END ----------------
		 */

	}) // FROM WRAPPED PROMISE
	// .then( (parent_child_rows_dict_generated)=>save_parent_and_children_in_db(parent_child_rows_dict_generated) )

}












const generate_parent_completely_detailed = (file_name, parent_child_relationship_data, sheet_to_class_dict) => {
// NOTE : TEST THIS TO WORK FOR MULTIPLE PARENTS AND THEIR CHILDREN, OR ONLY USE IT FOR SINGLE PARENT AND ITS CHILDREN

	/**
	 * -------------- CODE BLOCK 1 START ----------------
	 * GOALS:
		 to get all rows from parent sheet and save in the form 
		 db_parent_objects_list = [ {sheet_name:, index:, entire_row:,} ], db_children_objects_list = [ {sheet_name:, index:, entire_row:,} ] 
		 and parent_header and return the variable    
	 * STEPS:
		access parent sheet through parent_child_relationship_data and then save all rows in above mentioned form
	 */
		var parent_complete_details = {};
		var children_complete_details = {};
		parent_complete_details.row_details = []; //{index:'', entire_row:[]}

		/**
		 * -------------- LOOP START ----------------
		 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
		 */

		parent_child_relationship_data.map((parent_child_data, index1)=>{
			var parent_details = parent_child_data.parent;
			var children_details = parent_child_data.children;
			var parent_sheet = parent_details.name;
			var parent_range_in_string = parent_details.range;
			// 'converting parent range into Numbers array so that min and max can be applied'
			var parent_range_in_string_array = parent_range_in_string.split(",");
			var parent_range_array =[];
			parent_range_in_string_array.map((item, index2)=>{
				parent_range_array.push(Number(item))
			})

			readXlsxFile( String(file_name), { sheet: String(parent_sheet) })
				.then(
					(parent_rows) => {

				 /**
				  * -------------- NESTED LOOP START ----------------
				  * LOOP OVER: parent sheet, PROCESS OVER CHILDREN: pull header, pull entire row and save them in above dict
				  */	

						const parent_all_filtered_rows = []
						parent_rows.map((parent_row, index3) => {
							if (index3 === 0) {
							}

							if (index3 === 1) {

								const parent_header = parent_row;
								parent_header.shift()
								
								parent_complete_details.parent_sheet_name = parent_sheet
								parent_complete_details.parent_header = parent_header

							} else {
								const parent_index = parent_row[0]
								// 'keeping only range of parent data and removing rest of the cells'
								const parent_filtered_row = parent_row.slice( Math.min.apply(Math, parent_range_array), Math.max.apply(Math, parent_range_array)  + 1)
								parent_complete_details.row_details.push( {index:parent_index, parent_row:parent_filtered_row} )
							}
						})
						// 'removing first row as it isnt clear from where its coming'
						parent_complete_details.row_details.shift()

				 /**
				  * -------------- NESTED LOOP ENDS ----------------
				  */
					  return parent_complete_details
					}) // from .then block
					// .then( res => console.log(res) )
					.then( parent_detailed => parent_children_detailed(file_name, parent_child_relationship_data, parent_detailed, sheet_to_class_dict) )


			}) // from parent_child_relationship_data.map block

		 /**
		  * -------------- LOOP END ----------------
		  */
	/**
	 * -------------- CODE BLOCK 1 END ----------------
	 */

}






const pull_parent_child_data_from_excel = (file_name, sheet_to_class_dict) => {
	var all_collection = [];

	var parent_child_details = {};

	return readXlsxFile( String(file_name), { sheet: String('relationship_structure') })
		.then(

			(rows) => {

				rows.map( (row, index) => {

				var children = [];

// removing the header

				if (index > 0){
					var parent_name = row[0];
					var parent_range = row[1];

// entering parent details in parent_child_details
					parent_child_details.parent={name:parent_name, range:parent_range}

// removing null values from array
					while (row.includes(null)) {
						row.pop(null)
					}
// removing parent sheet name and parent range
					row.shift();
					row.shift();

					var child = {};

					row.map((item, item_index)=>{
// locating children sheets
						if (item_index % 2 === 0){
							child.name = item
						}
// locating children ranges
						if (item_index % 2 !== 0){
							child.range = item

							if ( !children.includes(child) ){
								children.push(child)
								child = {};
							}
						}
					})

// assigning children to parent_child_details dict 
					parent_child_details.children = children
					if ( !all_collection.includes(parent_child_details) ){

						all_collection.push(parent_child_details)
						parent_child_details = {};
					}
				}
			})

		return all_collection

	})
	.then( result => generate_parent_completely_detailed(file_name, result, sheet_to_class_dict) )
	// .catch( (err) => console.log('ERROR IS ', err) )
}



const sheet_to_class = (file_name) => {
	const sheet_to_class_dict = {};

	readXlsxFile( String(file_name), { sheet: String('sheets_classes') })
	.then(
		(rows) => {
			const key_row = rows[0];
			const value_row = rows[1]
			// for loop
			for (let i = 0; i < key_row.length; i++) {
				sheet_to_class_dict[ key_row[i] ] = value_row[i]
			} 
		
		return sheet_to_class_dict

		})
		// .then( (ans) => console.log(ans) )
		.then ( (sheet_to_class_dict) => pull_parent_child_data_from_excel(file_name, sheet_to_class_dict) )
		.catch( err => console.log(err) )	
}




sheet_to_class(file_name)

const readXlsxFile = require('read-excel-file/node');
var base64_encode = require('../lib/image_to_base64');
const {resolve} = require('path')
const mongoose = require('mongoose');

require('../models/page');

const Page = mongoose.model('Page');
const file_name = 'all_pages.xlsx';

const sheet_to_class_mapper = (sheet_name, db_object) => {
	if (sheet_name === 'all_pages'){

		return new Page(db_object)

	} else {

		null

	}
}


const save_parent_and_children_in_db = (parent_children_rows_dict, sheet_to_class_dict) =>{

	const parent_header = parent_children_rows_dict.parent_header
	const parent_sheet = parent_children_rows_dict.parent_sheet_name
	const row_details_list = parent_children_rows_dict.row_details

	for (let i = 0; i < row_details_list.length; i++) {

		const parent_row = row_details_list[i].parent_row
		var parent_db_object_dict = {};

		for (let j = 0; j < parent_row.length; j++) {
			// generating objects by combining header and row values
			parent_db_object_dict[ parent_header[j] ] = parent_row[j]

		} 

		const page = sheet_to_class_mapper(parent_sheet, {...parent_db_object_dict, _id: new mongoose.Types.ObjectId()})

		page.save(function (err, page) {

			if (err) return handleError(err);

			// accessing children

			const related_children = row_details_list[i].children
			// console.log(related_children)

			// doing below condition since some children are just empty arrays []
			if (related_children.length > 0){
				for (let k = 0; k < related_children.length; k++) {

					const related_child = related_children[k]
					const child_sheet = related_child.child_sheet
					const child_header = related_child.childs_header
					const child_rows = related_child.child_rows

					for (let l = 0; l < child_rows.length; l++) {

						const child_row = child_rows[l]
						var child_db_object_dict = {};

						// generating objects by combining header and row values
						for (let m = 0; m < child_row.length; m++) {
							child_db_object_dict[ child_header[m] ] = parent_row[m]
						} 

						const related_child = sheet_to_class_mapper(child_sheet, {...child_db_object_dict, page: page._id})

						related_child.save(function (err) {
						  if (err) return handleError(err);
						});


						}
					} 
				} 
				// saving parent object after assigning child objects to it
 
 				page.save()

			}			
		})
	}
}





const parent_children_detailed = (file_name, old_parent_child_relationship_data ,  parent_completely_detailed, sheet_to_class_dict) =>{

	/**
	 * -------------- CODE BLOCK 1 START ----------------
	 * GOALS:
		take the output from previous and convert into [{parent:already_done, children:{
		sheet_name:,child_header:,row_details:[}},]
	 * STEPS:
		open first child sheet, filter row for addition, find and save header, access row and match it with parent index if matched
		loop over output_From_previous.row_details, find matched children and add children in the dict so that it becomes
		row_details:{ index: 1, parent_row: [Array] , children:[ {child_row:entire_row, child_sheet:''}, ] }
		also push child_sheet_name:[headers] in it
		var parent_complete_details = {};
		var children_complete_details = {};
		parent_complete_details.row_details = []; //{index:'', entire_row:[]}
	*/

	/**
	 * -------------- LOOP START ----------------
	 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
	 */
	wrappedPomise = new Promise((resolve, reject)=>{

		var all_results1 = [];
		var all_results2 = [];

		parent_completely_detailed.row_details.map((detailed_row_object, index0)=>{
			detailed_row_object.children = [];
			// 2nd access old_parent_child_relationship_data

			/**
			 * --------------  NESTED LOOP 1 START ----------------
			 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
			 */
				old_parent_child_relationship_data.map((parent_child_data, index1)=>{
					// console.log(parent_child_data)
					var parent_details = parent_child_data.parent;
					var children_details = parent_child_data.children;
					var parent_sheet = parent_details.name;

				/**
				 * --------------  NESTED LOOP 2 START ----------------
				 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
				 */

					children_details.map((children_detail, index2)=>{
						// console.log(children_detail)
						const child_sheet = children_detail.name
						// converting range from string to array of numbers
						var child_range_in_string_array = children_detail.range.split(",");
						var child_range_array =[];
						child_range_in_string_array.map((item, index3)=>{
							child_range_array.push(Number(item))
						})

						// opening children files
						var related_child_all_filtered_rows = [];
						readXlsxFile( String(file_name), { sheet: String(child_sheet) })
						.then(
							(child_rows) => {
						/**
						 * --------------  NESTED LOOP 3 START ----------------
						 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
						 */
							var child_header ;
							child_rows.map((child_row, index4) => {
								if (index4 === 0) {
								}

								if (index4 === 1) {

									child_header = child_row;
									child_header.shift()
									
								} else {

	// HERE, ACCESSED PARENT INDEX, NOW MATCH IT, LEARN BREAK AND CONTINUE

									const parent_index = detailed_row_object.index
									
									// 'checking if childindex is same as parentindex'
									var child_index = child_row[0]

									if( parent_index === child_index ){
										// 'keeping only range of parent data and removing rest of the cells'
										const child_filtered_row = child_row.slice( Math.min.apply(Math, child_range_array), Math.max.apply(Math, child_range_array) + 1)
										related_child_all_filtered_rows.push([...child_filtered_row])

										// checking if the last child row reached then pushing things in parent_complete_details
										// detailed_row_object.children = { child_sheet:child_sheet, childs_header:child_header, child_rows:[] }

											var new_related_child_all_filtered_rows = [...related_child_all_filtered_rows]
											detailed_row_object.children.push( {child_sheet:child_sheet, childs_header:child_header, child_rows:related_child_all_filtered_rows} )


											related_child_all_filtered_rows = []

										if ( index4 < child_rows.length - 1 ){

											return

										} else {
										}

									}


								}
								
							})

						/**
						 * --------------  NESTED LOOP 3 ENDS ----------------
						 */
							return parent_completely_detailed
						})
						// 'BELOW IS BEING DONE SINCE ITS IN A LOOP, THAT IS TO REMOVE ALL OTHER ENTRIES EXCEPT LAST FROM THE LOOP AND ONLY THEN FEED TO NEXT .then FUNCTION, AND THEN SAME IS DONT IN IT BEFORE FEEDING TO save_parent_and_children_in_db function'
						.then( ()=> {
							if ( !all_results1.includes(parent_completely_detailed) ){
								all_results1.push(parent_completely_detailed);
								return parent_completely_detailed
							}
						})
						.then( (ans_for_above) => {
							if ( !all_results2.includes(ans_for_above) && ans_for_above !== undefined  ){
								all_results2.push(ans_for_above);
								save_parent_and_children_in_db(ans_for_above, sheet_to_class_dict); 
							}
						})
						// .then( ()=> console.log(parent_completely_detailed.row_details[0].children[0].child_rows) )

					})

				/**
				 * --------------  NESTED LOOP 2 START ----------------
				 */
				})
			/**
			 * --------------  NESTED LOOP 1 START ----------------
			 */
		})
		/**
		 * -------------- CODE BLOCK 1 END ----------------
		 */

	}) // FROM WRAPPED PROMISE
	// .then( (parent_child_rows_dict_generated)=>save_parent_and_children_in_db(parent_child_rows_dict_generated) )

}












const generate_parent_completely_detailed = (file_name, parent_child_relationship_data, sheet_to_class_dict) => {
// NOTE : TEST THIS TO WORK FOR MULTIPLE PARENTS AND THEIR CHILDREN, OR ONLY USE IT FOR SINGLE PARENT AND ITS CHILDREN

	/**
	 * -------------- CODE BLOCK 1 START ----------------
	 * GOALS:
		 to get all rows from parent sheet and save in the form 
		 db_parent_objects_list = [ {sheet_name:, index:, entire_row:,} ], db_children_objects_list = [ {sheet_name:, index:, entire_row:,} ] 
		 and parent_header and return the variable    
	 * STEPS:
		access parent sheet through parent_child_relationship_data and then save all rows in above mentioned form
	 */
		var parent_complete_details = {};
		var children_complete_details = {};
		parent_complete_details.row_details = []; //{index:'', entire_row:[]}

		/**
		 * -------------- LOOP START ----------------
		 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
		 */

		parent_child_relationship_data.map((parent_child_data, index1)=>{
			var parent_details = parent_child_data.parent;
			var children_details = parent_child_data.children;
			var parent_sheet = parent_details.name;
			var parent_range_in_string = parent_details.range;
			// 'converting parent range into Numbers array so that min and max can be applied'
			var parent_range_in_string_array = parent_range_in_string.split(",");
			var parent_range_array =[];
			parent_range_in_string_array.map((item, index2)=>{
				parent_range_array.push(Number(item))
			})

			readXlsxFile( String(file_name), { sheet: String(parent_sheet) })
				.then(
					(parent_rows) => {

				 /**
				  * -------------- NESTED LOOP START ----------------
				  * LOOP OVER: parent sheet, PROCESS OVER CHILDREN: pull header, pull entire row and save them in above dict
				  */	

						const parent_all_filtered_rows = []
						parent_rows.map((parent_row, index3) => {
							if (index3 === 0) {
							}

							if (index3 === 1) {

								const parent_header = parent_row;
								parent_header.shift()
								
								parent_complete_details.parent_sheet_name = parent_sheet
								parent_complete_details.parent_header = parent_header

							} else {
								const parent_index = parent_row[0]
								// 'keeping only range of parent data and removing rest of the cells'
								const parent_filtered_row = parent_row.slice( Math.min.apply(Math, parent_range_array), Math.max.apply(Math, parent_range_array)  + 1)
								parent_complete_details.row_details.push( {index:parent_index, parent_row:parent_filtered_row} )
							}
						})
						// 'removing first row as it isnt clear from where its coming'
						parent_complete_details.row_details.shift()

				 /**
				  * -------------- NESTED LOOP ENDS ----------------
				  */
					  return parent_complete_details
					}) // from .then block
					// .then( res => console.log(res) )
					.then( parent_detailed => parent_children_detailed(file_name, parent_child_relationship_data, parent_detailed, sheet_to_class_dict) )


			}) // from parent_child_relationship_data.map block

		 /**
		  * -------------- LOOP END ----------------
		  */
	/**
	 * -------------- CODE BLOCK 1 END ----------------
	 */

}






const pull_parent_child_data_from_excel = (file_name, sheet_to_class_dict) => {
	var all_collection = [];

	var parent_child_details = {};

	return readXlsxFile( String(file_name), { sheet: String('relationship_structure') })
		.then(

			(rows) => {

				rows.map( (row, index) => {

				var children = [];

// removing the header

				if (index > 0){
					var parent_name = row[0];
					var parent_range = row[1];

// entering parent details in parent_child_details
					parent_child_details.parent={name:parent_name, range:parent_range}

// removing null values from array
					while (row.includes(null)) {
						row.pop(null)
					}
// removing parent sheet name and parent range
					row.shift();
					row.shift();

					var child = {};

					row.map((item, item_index)=>{
// locating children sheets
						if (item_index % 2 === 0){
							child.name = item
						}
// locating children ranges
						if (item_index % 2 !== 0){
							child.range = item

							if ( !children.includes(child) ){
								children.push(child)
								child = {};
							}
						}
					})

// assigning children to parent_child_details dict 
					parent_child_details.children = children
					if ( !all_collection.includes(parent_child_details) ){

						all_collection.push(parent_child_details)
						parent_child_details = {};
					}
				}
			})

		return all_collection

	})
	.then( result => generate_parent_completely_detailed(file_name, result, sheet_to_class_dict) )
	// .catch( (err) => console.log('ERROR IS ', err) )
}



const sheet_to_class = (file_name) => {
	const sheet_to_class_dict = {};

	readXlsxFile( String(file_name), { sheet: String('sheets_classes') })
	.then(
		(rows) => {
			const key_row = rows[0];
			const value_row = rows[1]
			// for loop
			for (let i = 0; i < key_row.length; i++) {
				sheet_to_class_dict[ key_row[i] ] = value_row[i]
			} 
		
		return sheet_to_class_dict

		})
		// .then( (ans) => console.log(ans) )
		.then ( (sheet_to_class_dict) => pull_parent_child_data_from_excel(file_name, sheet_to_class_dict) )
		.catch( err => console.log(err) )	
}




sheet_to_class(file_name)

const readXlsxFile = require('read-excel-file/node');
var base64_encode = require('../lib/image_to_base64');
const {resolve} = require('path')
const mongoose = require('mongoose');

require('../models/book');

const Book = mongoose.model('Book');
const file_name = 'all_books.xlsx';

const sheet_to_class_mapper = (sheet_name, db_object) => {
	if (sheet_name === 'all_books'){

		return new Book(db_object)

	} else {

		null

	}
}


const save_parent_and_children_in_db = (parent_children_rows_dict, sheet_to_class_dict) =>{

	const parent_header = parent_children_rows_dict.parent_header
	const parent_sheet = parent_children_rows_dict.parent_sheet_name
	const row_details_list = parent_children_rows_dict.row_details

	for (let i = 0; i < row_details_list.length; i++) {

		const parent_row = row_details_list[i].parent_row
		var parent_db_object_dict = {};

		for (let j = 0; j < parent_row.length; j++) {
			// generating objects by combining header and row values
			parent_db_object_dict[ parent_header[j] ] = parent_row[j]

		} 

		const book = sheet_to_class_mapper(parent_sheet, {...parent_db_object_dict, _id: new mongoose.Types.ObjectId()})

		book.save(function (err, book) {

			if (err) return handleError(err);

			// accessing children

			const related_children = row_details_list[i].children
			// console.log(related_children)

			// doing below condition since some children are just empty arrays []
			if (related_children.length > 0){
				for (let k = 0; k < related_children.length; k++) {

					const related_child = related_children[k]
					const child_sheet = related_child.child_sheet
					const child_header = related_child.childs_header
					const child_rows = related_child.child_rows

					for (let l = 0; l < child_rows.length; l++) {

						const child_row = child_rows[l]
						var child_db_object_dict = {};

						// generating objects by combining header and row values
						for (let m = 0; m < child_row.length; m++) {
							child_db_object_dict[ child_header[m] ] = parent_row[m]
						} 

						const related_child = sheet_to_class_mapper(child_sheet, {...child_db_object_dict, book: book._id})

						related_child.save(function (err) {
						  if (err) return handleError(err);
						});


						}
					} 
				} 
				// saving parent object after assigning child objects to it
 
 				book.save()

			}			
		})
	}
}





const parent_children_detailed = (file_name, old_parent_child_relationship_data ,  parent_completely_detailed, sheet_to_class_dict) =>{

	/**
	 * -------------- CODE BLOCK 1 START ----------------
	 * GOALS:
		take the output from previous and convert into [{parent:already_done, children:{
		sheet_name:,child_header:,row_details:[}},]
	 * STEPS:
		open first child sheet, filter row for addition, find and save header, access row and match it with parent index if matched
		loop over output_From_previous.row_details, find matched children and add children in the dict so that it becomes
		row_details:{ index: 1, parent_row: [Array] , children:[ {child_row:entire_row, child_sheet:''}, ] }
		also push child_sheet_name:[headers] in it
		var parent_complete_details = {};
		var children_complete_details = {};
		parent_complete_details.row_details = []; //{index:'', entire_row:[]}
	*/

	/**
	 * -------------- LOOP START ----------------
	 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
	 */
	wrappedPomise = new Promise((resolve, reject)=>{

		var all_results1 = [];
		var all_results2 = [];

		parent_completely_detailed.row_details.map((detailed_row_object, index0)=>{
			detailed_row_object.children = [];
			// 2nd access old_parent_child_relationship_data

			/**
			 * --------------  NESTED LOOP 1 START ----------------
			 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
			 */
				old_parent_child_relationship_data.map((parent_child_data, index1)=>{
					// console.log(parent_child_data)
					var parent_details = parent_child_data.parent;
					var children_details = parent_child_data.children;
					var parent_sheet = parent_details.name;

				/**
				 * --------------  NESTED LOOP 2 START ----------------
				 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
				 */

					children_details.map((children_detail, index2)=>{
						// console.log(children_detail)
						const child_sheet = children_detail.name
						// converting range from string to array of numbers
						var child_range_in_string_array = children_detail.range.split(",");
						var child_range_array =[];
						child_range_in_string_array.map((item, index3)=>{
							child_range_array.push(Number(item))
						})

						// opening children files
						var related_child_all_filtered_rows = [];
						readXlsxFile( String(file_name), { sheet: String(child_sheet) })
						.then(
							(child_rows) => {
						/**
						 * --------------  NESTED LOOP 3 START ----------------
						 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
						 */
							var child_header ;
							child_rows.map((child_row, index4) => {
								if (index4 === 0) {
								}

								if (index4 === 1) {

									child_header = child_row;
									child_header.shift()
									
								} else {

	// HERE, ACCESSED PARENT INDEX, NOW MATCH IT, LEARN BREAK AND CONTINUE

									const parent_index = detailed_row_object.index
									
									// 'checking if childindex is same as parentindex'
									var child_index = child_row[0]

									if( parent_index === child_index ){
										// 'keeping only range of parent data and removing rest of the cells'
										const child_filtered_row = child_row.slice( Math.min.apply(Math, child_range_array), Math.max.apply(Math, child_range_array) + 1)
										related_child_all_filtered_rows.push([...child_filtered_row])

										// checking if the last child row reached then pushing things in parent_complete_details
										// detailed_row_object.children = { child_sheet:child_sheet, childs_header:child_header, child_rows:[] }

											var new_related_child_all_filtered_rows = [...related_child_all_filtered_rows]
											detailed_row_object.children.push( {child_sheet:child_sheet, childs_header:child_header, child_rows:related_child_all_filtered_rows} )


											related_child_all_filtered_rows = []

										if ( index4 < child_rows.length - 1 ){

											return

										} else {
										}

									}


								}
								
							})

						/**
						 * --------------  NESTED LOOP 3 ENDS ----------------
						 */
							return parent_completely_detailed
						})
						// 'BELOW IS BEING DONE SINCE ITS IN A LOOP, THAT IS TO REMOVE ALL OTHER ENTRIES EXCEPT LAST FROM THE LOOP AND ONLY THEN FEED TO NEXT .then FUNCTION, AND THEN SAME IS DONT IN IT BEFORE FEEDING TO save_parent_and_children_in_db function'
						.then( ()=> {
							if ( !all_results1.includes(parent_completely_detailed) ){
								all_results1.push(parent_completely_detailed);
								return parent_completely_detailed
							}
						})
						.then( (ans_for_above) => {
							if ( !all_results2.includes(ans_for_above) && ans_for_above !== undefined  ){
								all_results2.push(ans_for_above);
								save_parent_and_children_in_db(ans_for_above, sheet_to_class_dict); 
							}
						})
						// .then( ()=> console.log(parent_completely_detailed.row_details[0].children[0].child_rows) )

					})

				/**
				 * --------------  NESTED LOOP 2 START ----------------
				 */
				})
			/**
			 * --------------  NESTED LOOP 1 START ----------------
			 */
		})
		/**
		 * -------------- CODE BLOCK 1 END ----------------
		 */

	}) // FROM WRAPPED PROMISE
	// .then( (parent_child_rows_dict_generated)=>save_parent_and_children_in_db(parent_child_rows_dict_generated) )

}












const generate_parent_completely_detailed = (file_name, parent_child_relationship_data, sheet_to_class_dict) => {
// NOTE : TEST THIS TO WORK FOR MULTIPLE PARENTS AND THEIR CHILDREN, OR ONLY USE IT FOR SINGLE PARENT AND ITS CHILDREN

	/**
	 * -------------- CODE BLOCK 1 START ----------------
	 * GOALS:
		 to get all rows from parent sheet and save in the form 
		 db_parent_objects_list = [ {sheet_name:, index:, entire_row:,} ], db_children_objects_list = [ {sheet_name:, index:, entire_row:,} ] 
		 and parent_header and return the variable    
	 * STEPS:
		access parent sheet through parent_child_relationship_data and then save all rows in above mentioned form
	 */
		var parent_complete_details = {};
		var children_complete_details = {};
		parent_complete_details.row_details = []; //{index:'', entire_row:[]}

		/**
		 * -------------- LOOP START ----------------
		 * LOOP OVER: parent_child_relationship_data, PROCESS OVER CHILDREN: open parent sheet
		 */

		parent_child_relationship_data.map((parent_child_data, index1)=>{
			var parent_details = parent_child_data.parent;
			var children_details = parent_child_data.children;
			var parent_sheet = parent_details.name;
			var parent_range_in_string = parent_details.range;
			// 'converting parent range into Numbers array so that min and max can be applied'
			var parent_range_in_string_array = parent_range_in_string.split(",");
			var parent_range_array =[];
			parent_range_in_string_array.map((item, index2)=>{
				parent_range_array.push(Number(item))
			})

			readXlsxFile( String(file_name), { sheet: String(parent_sheet) })
				.then(
					(parent_rows) => {

				 /**
				  * -------------- NESTED LOOP START ----------------
				  * LOOP OVER: parent sheet, PROCESS OVER CHILDREN: pull header, pull entire row and save them in above dict
				  */	

						const parent_all_filtered_rows = []
						parent_rows.map((parent_row, index3) => {
							if (index3 === 0) {
							}

							if (index3 === 1) {

								const parent_header = parent_row;
								parent_header.shift()
								
								parent_complete_details.parent_sheet_name = parent_sheet
								parent_complete_details.parent_header = parent_header

							} else {
								const parent_index = parent_row[0]
								// 'keeping only range of parent data and removing rest of the cells'
								const parent_filtered_row = parent_row.slice( Math.min.apply(Math, parent_range_array), Math.max.apply(Math, parent_range_array)  + 1)
								parent_complete_details.row_details.push( {index:parent_index, parent_row:parent_filtered_row} )
							}
						})
						// 'removing first row as it isnt clear from where its coming'
						parent_complete_details.row_details.shift()

				 /**
				  * -------------- NESTED LOOP ENDS ----------------
				  */
					  return parent_complete_details
					}) // from .then block
					// .then( res => console.log(res) )
					.then( parent_detailed => parent_children_detailed(file_name, parent_child_relationship_data, parent_detailed, sheet_to_class_dict) )


			}) // from parent_child_relationship_data.map block

		 /**
		  * -------------- LOOP END ----------------
		  */
	/**
	 * -------------- CODE BLOCK 1 END ----------------
	 */

}






const pull_parent_child_data_from_excel = (file_name, sheet_to_class_dict) => {
	var all_collection = [];

	var parent_child_details = {};

	return readXlsxFile( String(file_name), { sheet: String('relationship_structure') })
		.then(

			(rows) => {

				rows.map( (row, index) => {

				var children = [];

// removing the header

				if (index > 0){
					var parent_name = row[0];
					var parent_range = row[1];

// entering parent details in parent_child_details
					parent_child_details.parent={name:parent_name, range:parent_range}

// removing null values from array
					while (row.includes(null)) {
						row.pop(null)
					}
// removing parent sheet name and parent range
					row.shift();
					row.shift();

					var child = {};

					row.map((item, item_index)=>{
// locating children sheets
						if (item_index % 2 === 0){
							child.name = item
						}
// locating children ranges
						if (item_index % 2 !== 0){
							child.range = item

							if ( !children.includes(child) ){
								children.push(child)
								child = {};
							}
						}
					})

// assigning children to parent_child_details dict 
					parent_child_details.children = children
					if ( !all_collection.includes(parent_child_details) ){

						all_collection.push(parent_child_details)
						parent_child_details = {};
					}
				}
			})

		return all_collection

	})
	.then( result => generate_parent_completely_detailed(file_name, result, sheet_to_class_dict) )
	// .catch( (err) => console.log('ERROR IS ', err) )
}



const sheet_to_class = (file_name) => {
	const sheet_to_class_dict = {};

	readXlsxFile( String(file_name), { sheet: String('sheets_classes') })
	.then(
		(rows) => {
			const key_row = rows[0];
			const value_row = rows[1]
			// for loop
			for (let i = 0; i < key_row.length; i++) {
				sheet_to_class_dict[ key_row[i] ] = value_row[i]
			} 
		
		return sheet_to_class_dict

		})
		// .then( (ans) => console.log(ans) )
		.then ( (sheet_to_class_dict) => pull_parent_child_data_from_excel(file_name, sheet_to_class_dict) )
		.catch( err => console.log(err) )	
}




sheet_to_class(file_name)
