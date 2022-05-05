import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import GoogleLogin from 'react-google-login';
import GoogleLogout from 'react-google-login';
import targeturl from './targeturl.js';
import { useGoogleLogin } from 'react-google-login';
import { useGoogleLogout } from 'react-google-login';

function none()
{
  return null;
}

//QnP0q95cm5LOxDO1FHkM44I8

//This function is used to display the name of the logged in user. It was working fine locally, but on the server it's parent class is broken,
//so unfortunately right now it is unused.
function UsernameDisplay(props) {
  
  return(
    <div>
    <Grid container spacing={3}>
      <Grid item>
    <div style={{marginTop: 6, fontSize: 20}}>Hello, <strong>{props.user}</strong> ! </div>
    </Grid>
    <Grid item>
    <Button variant="contained" style={{backgroundColor: '#0F6A8B', color: "white", fontSize: 12, margin: 2}} onClick={() => props.onChange("Default")}>Logout</Button>
    </Grid>
    </Grid>
    </div>
  );
}

//This class object is used specifically for the google authentication. It is currently broken, and it is vital in the future to fix it.
class Authentication extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        user: "Default",
      }
  }

  //Simple global function to update the state of the Authentication object whenever a new user logs in.
  updateAuthentication = (value) => {
    this.setState({
        user: value
    });

    this.changeUser(value);
  }

  //This function changes which user is logged in, retrieving their history as needed.
  changeUser = (user) => {
      var bodyFormData = new FormData();
      bodyFormData.append("user",user);
      axios({
        method: "post",
        url: (targeturl.concat("/backend/queryhistoryaccess.php")),
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
        })
        .then(function (response) {
          var responsedata = response["data"];
          var tmp_array = [];
          //console.log("RESPONSE_changeuser", responsedata);
          this.props.updateQH(user, responsedata);
      })
      
  }

  //This is part of the Authentication class.
  responseGoogle = (response) => {
    //console.log("Google response: ", response);
    var user = response["Ys"]["Ve"];
    this.changeUser(user);
  };


  render()
  {
  return(
      <div>
        {this.state.user != "Default" && (
        <div>
          <UsernameDisplay onChange={this.updateAuthentication} user={this.state.user}/>
        </div>
        )}
        {this.state.user == "Default" && (
        <div>
          <GoogleLogin clientId="113946767130-k3hs8dhjbctc9dtaamubobdftphlr60q.apps.googleusercontent.com" onSuccess={this.responseGoogle} onFailure={this.responseGoogle}/>
        </div> 
        )}
      </div>
    );
  }

}

export default Authentication;
