import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { editDataOnChange, handleLogin } from '../actions'
import { Link } from 'react-router-dom'
import { fetchCitiesIfNeeded } from '../actions'
import logo from '../assets/logo.svg'
import {
  Grid,
  Form,
  Button,
  Input,
  Image,
  Header,
  Loader,
  Transition,
} from 'semantic-ui-react'

function LogIn(props) {
  const [imageLoaded, imageLoad] = useState(false)
  const { dispatch, dataToEdit, history, error, cities } = props

  useEffect(() => {
    dispatch(fetchCitiesIfNeeded())
    const token = localStorage.getItem('token')
    if (token) {
      props.history.push('/')
    }
  }, [])

  return (
    <React.Fragment>
      {error.message && alert(error.message)}
      <Grid
        style={{ height: '100%' }}
        verticalAlign="middle"
        centered
        doubling
        stackable
        columns={3}
      >
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Image
              size="small"
              src={logo}
              centered
              onLoad={() => imageLoad(!imageLoaded)}
            />
            <Transition
              visible={props.cities && imageLoaded}
              animation="slide up"
              duration={300}
            >
              <div>
                <Header as="h2" color="grey" style={{ margin: '20px' }}>
                  Sign in to PeiBack
                </Header>

                <Form
                  size="big"
                  onSubmit={e => {
                    e.preventDefault()
                    dispatch(handleLogin(dataToEdit, history))
                  }}
                >
                  <Form.Field>
                    <Input
                      fluid
                      name="email"
                      type="text"
                      placeholder="Email"
                      value={dataToEdit.email ? dataToEdit.email : ''}
                      onChange={e => {
                        dispatch(editDataOnChange(e))
                      }}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Input
                      fluid
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={dataToEdit.password ? dataToEdit.password : ''}
                      onChange={e => {
                        dispatch(editDataOnChange(e))
                      }}
                    />
                  </Form.Field>
                  <Button fluid size="big" type="submit" value="Sign In">
                    Sign In
                  </Button>
                </Form>
                <br />
                <Link to="/signup">Request Access</Link>
              </div>
            </Transition>

            {!cities.cityList && (
              <Grid.Column>
                <Loader active />
              </Grid.Column>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { dataToEdit, error, cities } = state

  return {
    dataToEdit,
    cities,
    error,
  }
}

export default connect(mapStateToProps)(LogIn)
