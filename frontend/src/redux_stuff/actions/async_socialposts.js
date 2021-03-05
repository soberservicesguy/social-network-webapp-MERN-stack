export const loading = () => {
	return {
		type: "LOADING"
	};
};



export const async_socialposts_callback = (socialpost_list) => {

	return { type: "APPEND_FETCHED_SOCIALPOST", socialpost_list: socialpost_list }

};


export const async_socialposts = (socialpost_list) => {

	return (dispatch) => {

		setTimeout(() => {
			dispatch( async_socialposts_callback(socialpost_list) )
			console.log('DISPATCHED')
	    }, 5);

		// dispatch( async_socialposts_callback(socialpost_list) )

	}

};





