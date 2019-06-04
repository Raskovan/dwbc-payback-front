import React from 'react'
import { logOut } from '../actions'
import logo from '../assets/logo.svg'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Picker from '../components/Picker'
import {
	Menu,
	Button,
	Header,
	Segment,
	Image,
	Responsive,
	Dropdown
} from 'semantic-ui-react'

function HeaderMenu(props) {
	const { dispatch, user, history, selectedCity, allCities } = props
	let headerLink
	let headerText
	if (history.location.pathname === '/users') {
		headerLink = `/${selectedCity.city_name}`
		headerText = 'Manage Cities'
	} else {
		headerLink = '/users'
		headerText = 'Manage Users'
	}

	return (
		<div>
			<Menu attached='top' borderless fluid style={{ background: '#e6e6e6' }}>
				<Menu.Item as={Link} to='/'>
					<Image src={logo} alt='Logo' />
				</Menu.Item>
				<Menu.Item
					header
					fitted
					as='h1'
					style={{ fontWeight: '300' }}
					content='PeiBack'
				/>
				{/* Show menu on desktop */}
				{user.loggedIn && (
					<Responsive as={Menu.Menu} position='right' minWidth={665}>
						{user.is_admin && (
							<Menu.Item>
								<Picker />
							</Menu.Item>
						)}
						{user.is_admin && (
							<Menu.Item fitted>
								<Button size='tiny' as={Link} to={headerLink} color='blue'>
									{headerText}
								</Button>
							</Menu.Item>
						)}
						<Menu.Menu position='right'>
							<Menu.Item>
								<Button
									size='tiny'
									type='button'
									color='grey'
									onClick={() => dispatch(logOut())}>
									Log Out
								</Button>
							</Menu.Item>
						</Menu.Menu>
					</Responsive>
				)}
				{/* Show Dropdown menu for Admin */}
				{user.loggedIn && user.is_admin && (
					<Responsive as={Menu.Menu} position='right' maxWidth={665}>
						<Dropdown item text='Menu'>
							<Dropdown.Menu>
								<Dropdown.Item as={Link} to='/users'>
									Users
								</Dropdown.Item>
								<Dropdown.Item>
									<Dropdown text='Cities'>
										<Dropdown.Menu>
											{allCities.map((city, index) => {
												return (
													<Dropdown.Item
														as={Link}
														to={`/${city.city_name}`}
														key={index}>
														{city.city_name}
													</Dropdown.Item>
												)
											})}
										</Dropdown.Menu>
									</Dropdown>
								</Dropdown.Item>

								<Dropdown.Item as={Button} onClick={() => dispatch(logOut())}>
									Logout
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Responsive>
				)}
				{/* Show LOGOUT for phones if not ADMIN */}
				{user.loggedIn && !user.is_admin && (
					<Responsive as={Menu.Menu} position='right' maxWidth={380}>
						<Menu.Item>
							<Button
								size='tiny'
								type='button'
								color='grey'
								onClick={() => dispatch(logOut())}>
								Log Out
							</Button>
						</Menu.Item>
					</Responsive>
				)}
			</Menu>

			{user.username && (
				<Segment
					basic
					size='tiny'
					style={{ paddingTop: '0', marginTop: '5px' }}>
					<Header as='h5' floated='right' style={{ fontWeight: '300' }}>
						Logged in as {user.username}
					</Header>
				</Segment>
			)}
		</div>
	)
}

HeaderMenu.propTypes = {
	dispatch: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	selectedCity: PropTypes.object.isRequired,
	allCities: PropTypes.array.isRequired
}

function mapStateToProps(state) {
	const { user, selectedCity, cities } = state

	const { isFetchingCities, cityList: allCities } = cities || {
		isFetchingCities: true,
		cityList: []
	}

	return {
		user,
		selectedCity,
		allCities,
		cities,
		isFetchingCities
	}
}

export default withRouter(connect(mapStateToProps)(HeaderMenu))
