import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {
	// constructor() {
	// 	super();
	// 	this.goToStore = this.goToStore.bind(this); // bind 'this' in goToStore so 'this' refers to StorePicker and not null
	// }

	goToStore(event) {
		event.preventDefault();
		// first grab text from box
		const storeId = this.storeInput.value;
		console.log(storeId);
		// transition from / to /store/:storeId
		this.context.router.transitionTo(`store/${storeId}`);
	}

	render() {
		return (
			<form className="store-selector" onSubmit={(e) => this.goToStore(e)}>
				{ /* This is how to make a comment in ReactJS */ }
				<h2>Please Enter A Store</h2>
				<input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input) => { this.storeInput = input }} />
				<button type="submit">Visit Store</button>
			</form>
		);
	}
}

StorePicker.contextTypes = {
	router: React.PropTypes.object
}

export default StorePicker;