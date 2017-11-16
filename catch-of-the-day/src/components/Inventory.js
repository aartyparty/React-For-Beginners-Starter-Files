import React from 'react';
import base from '../base';
import AddFishForm from './AddFishForm';

class Inventory extends React.Component {
	constructor() {
		super();
		this.renderInventory = this.renderInventory.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.authHandler = this.authHandler.bind(this);
		this.logout = this.logout.bind(this);

		this.state = {
			uid: null,
			owner: null
		}
	}

	componentDidMount() {
		base.onAuth((user) => {
			if(user) {
				this.authHandler(null, {user});
			}
		});
	}

	handleChange(e, key) {
		const fish = this.props.fishes[key];
		// take copy of fish & update with new data
		const updatedFish = {
			...fish, 
			[e.target.name]: e.target.value
		}
		this.props.updateFish(key, updatedFish);
	}

	authenticate(provider) {
		base.authWithOAuthPopup(provider, this.authHandler);
	}

	authHandler(err, authData) {
		if(err) {
			console.log(err);
			return;
		}

		// grab store info
		const storeRef = base.database().ref(this.props.storeId);

		// query the firebase once for the store data
		storeRef.once('value', (snapshot) => {
			const data = snapshot.val() || {};

			// claim it as our own if there is no owner already
			if(!data.owner) {
				storeRef.set({
					owner: authData.user.uid
				});
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			});
		})
	}

	logout() {
		base.unauth();
		this.setState({
			uid: null,
		});
	}

	renderLogin() {
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage your store's inventory</p>
				<button className="facebook" onClick={() => this.authenticate('facebook')}>Log In with Facebook</button>
			</nav>
		)
	}

	renderInventory(key) {
		const fish = this.props.fishes[key];
		return (
			<div className="fish-edit" key={key}>
				<input type="text" name="name" placeholder="Fish Name" value={fish.name} onChange={(e) => this.handleChange(e, key)} />
				<input type="text" name="price" placeholder="Fish Price" value={fish.price} onChange={(e) => this.handleChange(e, key)} />
				<select type="text" name="status" placeholder="Fish Status" value={fish.status} onChange={(e) => this.handleChange(e, key)}>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold!</option>					
				</select>
				<textarea type="text" name="desc" placeholder="Fish Desc" value={fish.desc} onChange={(e) => this.handleChange(e, key)}>
				</textarea>
				<input type="text" name="image" placeholder="Fish Image" value={fish.image} onChange={(e) => this.handleChange(e, key)} />
				<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
			</div>
		)
	}

	render() {
		const logout = <button onClick={this.logout}>Log out!</button>

		// check if they are not logged in at all
		if(!this.state.uid) {
			return <div>{this.renderLogin()}</div>;
		}

		if(this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry, you aren't the owner of this store!</p>
					{logout}
				</div>
			)
		}

		return (
			<div>
				<h2>Inventory</h2>
				{logout}
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish} />
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		);
	}
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  addFish: React.PropTypes.func.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired
}

export default Inventory;