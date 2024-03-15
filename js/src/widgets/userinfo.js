import {useEffect, useState} from 'react';

import ApiClient from '../api.client.js';


const UserInfo = () => {

  const client = ApiClient();
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const generateAvatar = (text) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 50;
    canvas.height = 50;

    // Draw background
    context.fillStyle = "#325ea8";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = "bold 18px Arial";
    context.fillStyle = "#FFFFFF";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
  }

  useEffect( () => {
  	setLoggedIn(client.isAuthenticated());
  	client.getJson('/users/userinfo/me').then( (res) => {
  		const name = res.json.full_name ? res.json.full_name : res.json.username; 
  		setUserName(name);
  		if (name) {
  		  setAvatarUrl(generateAvatar(name.toUpperCase().slice(0, 2)));	
  		}
  		client.getWidgets().then( (widgets) => {
  			setIsAdmin(widgets.indexOf('users') !== -1);
  		});
  	});
  }, []);

  return (
		loggedIn ? (
      <>
	    	<ul className="nav navbar-nav ml-auto mr-2">
	    	  <li className="nav-item" style={{color: "white", padding: "10px"}}>Welcome, {userName}&nbsp;&nbsp;</li>
				  <li className="nav-item dropdown" style={{height:"40px", padding:0}}>
				    <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{padding: 0}}>
				      <img src={avatarUrl} width="40" className="rounded-circle" />
				    </a>
				    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
				      <a className="dropdown-item" href="/dashboard">Dashboard</a>
				      <a className="dropdown-item" href="/profile">My Profile</a>
				      {
				      	isAdmin && (
				      	  <a className="dropdown-item" href="/admin">Admin</a>  
				      	)
				      } 	
				      <a className="dropdown-item" href="/logout">Log Out</a>
				    </div>
				  </li>
				</ul>
			</>
		)	: (
		  <a className="nav-link" href="/login" style={{color: "white"}}>Log In</a>
		)
	)

}

export default UserInfo;
