import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import GoogleLogin from 'react-google-login';
import GoogleLogout from 'react-google-login';
import { useGoogleLogin } from 'react-google-login';
import { useGoogleLogout } from 'react-google-login';

const responseGoogle = response => {
	console.log(response["Ys"]["Ve"]);
	console.log("Google response: ", response);
	var user = response["Ys"]["Ve"];
	updateAuthentication(user);
};

function updateAuthentication(value) {
  //console.log("working");
  this.setState({
      user: value
  });
}
//QnP0q95cm5LOxDO1FHkM44I8

function UsernameDisplay(props) {
	
	return(
		<div>
		<Grid container spacing={3}>
    	<Grid item>
		<div style={{marginTop: 6, fontSize: 20}}>Hello, <strong>{props.user}</strong> ! </div>
		</Grid>
		<Grid item>
		<Button variant="contained" style={{backgroundColor: '#0F6A8B', color: "white", fontSize: 12, margin: 2}} onClick={() => updateAuthentication("Default")}>Logout</Button>
		</Grid>
		</Grid>
		</div>
	);
}

class Authentication extends React.Component {
	constructor(props) {
	    super(props)
	    this.state = {
	      user: "Default",
	    }
	    updateAuthentication = updateAuthentication.bind(this);
	}

	render()
	{
	return(
      <div>
        {this.state.user != "Default" && (
        <div>
        	<UsernameDisplay user={this.state.user}/>
        </div>
        )}
        {this.state.user == "Default" && (
        <div>
        	<GoogleLogin clientId="113946767130-k3hs8dhjbctc9dtaamubobdftphlr60q.apps.googleusercontent.com" onSuccess={responseGoogle} onFailure={responseGoogle}/>
        </div> 
        )}
      </div>
    );
	}

}

export default Authentication;