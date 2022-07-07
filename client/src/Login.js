import React from 'react'
import {Container} from "react-bootstrap"
const querystring = require('query-string')

var client_id = 'bd2805db7c36486bb2fcd5f9263e2f7c';
var redirect_uri='http://localhost:3000'
var scope = 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state'

const AUTH_URL= 'https://accounts.spotify.com/authorize?&'+
    querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
    });

export default function Login() {
  return (
    <Container 
        className="d-flex justify-content-center align-items-center" 
        style = {{minHeight: "100vh"}}
    >
        <a className='btn btn-success btn-lg' href={ AUTH_URL }>
            Login with Spotify
        </a>
    </Container>
  )
}
