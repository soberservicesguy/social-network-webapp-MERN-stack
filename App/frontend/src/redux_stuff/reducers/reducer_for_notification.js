const initialState = {
	all_notifications:[
	],
}

const reducerForNotification = (state = initialState, action) => {

	let list_with_key = []
	let last_key

	switch (action.type) {

		case "APPEND_FETCHED_NOTIFICATIONS":

			last_key = (state.all_notifications.length > 0) ? state.all_notifications[ state.all_notifications.length - 1 ].key : 0
			// console.log({last_key:last_key})
			list_with_key = [ ...state.all_notifications ] // since previously we assigned keys

			action.notifications_list.map((item, index) => {
				list_with_key.push( {key: last_key + index + 1, ...item} )
			})

			return {...state, all_notifications: list_with_key }
			break;


		case "SET_FETCHED_NOTIFICATIONS":

			list_with_key = []

			action.notifications_list.map((item, index) => {
				list_with_key.push( {key: index, ...item} )
			})

			return {...state, all_notifications: list_with_key}
			break;

		default:

			return state

	}

};

export default reducerForNotification;