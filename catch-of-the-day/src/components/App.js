import React from 'react';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';

import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
	constructor() {
		super();

		this.addFish = this.addFish.bind(this);
		this.updateFish = this.updateFish.bind(this);
		this.removeFish = this.removeFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.removeFromOrder = this.removeFromOrder.bind(this);

		// getInitialState
		this.state = {
			fishes: {},
			order: {}
		};
	}

	componentWillMount() {
		// this runs right before the app is rendered
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
			context: this,
			state: 'fishes'
		});	

		// check if there is nay order in local storage
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

		if(localStorageRef) {
			// update our App component's order state
			this.setState({
				order: JSON.parse(localStorageRef)
			});
		}
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState) {
		// console.log({nextProps, nextState}); // Adding {} in console log will auto name those vars in the object
		localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
	}

	addFish(fish) {
		// update state
		const fishes = {...this.state.fishes}; // takes a copy of existing state rather than making a reference to state
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		// set state
		this.setState({ fishes }); // in ES6, this is the same as doing this.setState({fishes: fishes});
	}

	updateFish(key, updatedFish) {
		const fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		this.setState({ fishes });
	}

	removeFish(key) {
		const fishes = {...this.state.fishes};
		// delete fishes[key]; // can't just use this because we're using firebase
		fishes[key] = null;
		this.setState({ fishes });
	}

	loadSamples() {
		this.setState({
			fishes: sampleFishes
		});
	}

	addToOrder(key) {
		const order = {...this.state.order};
		order[key] = order[key] + 1 || 1; // this checks if it already exists and adds 1 or sets it to 1
		this.setState({ order });
	}

	removeFromOrder(key) {
		const order = {...this.state.order};
		delete order[key]; // since we're not using firebase
		this.setState({ order });
	}

    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                    	{
			              Object
			                .keys(this.state.fishes)
			                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
			            }
                    </ul>
                </div>
                <Order 
                	fishes={this.state.fishes} 
                	order={this.state.order} 
                	params={this.props.params} 
                	removeFromOrder={this.removeFromOrder} />
                <Inventory 
                	addFish={this.addFish} 
                	updateFish={this.updateFish} 
                	removeFish={this.removeFish} 
                	loadSamples={this.loadSamples} 
                	fishes={this.state.fishes} 
                	storeId={this.props.params.storeId} />
            </div>
        )
    }
}

App.propTypes = {
  params: React.PropTypes.object.isRequired
}

export default App;