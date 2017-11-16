import React from 'react';

// this is a stateless component
const Header = (props) => {
	return (
		<header className="top">
			<h1>
				Catch 
				<span className="ofThe">
					<span className="of">of</span>
					<span className="the">the</span>
				</span>
				Day
			</h1>
			<h3 className="tagline"><span>{props.tagline}</span></h3>
		</header>
	);
}

// proptypes do not need to be part of the instance so it's outside the declaration
Header.propTypes = {
	tagline: React.PropTypes.string.isRequired
}	

export default Header;