import {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";

import Form from '../form.js';
import Page from './page.js';
import ApiClient from '../api.client.js';


const Widget = (client) => {

	const form = Form({
    email: {
      name: 'email',
      coerce: (value) => value,
      valueSetter: useState(''),
      errorSetter: useState('')
    },
    full_name: {
      name: 'full_name',
      coerce: (value) => value,
      valueSetter: useState(''),
      errorSetter: useState('')
    },
    password: {
      name: 'password',
      coerce: (value) => value,
      valueSetter: useState(''),
      errorSetter: useState('')
    }
  });
  const history = useHistory();

  useEffect( () => {
    client.getJson('/users/userinfo/me').then( (res) => {
    	const profile = res.json;
      form.setFields(profile);
    });
  }, []);

  const handleChange = (value, fieldName) => {
    form.fields[fieldName].setValue(value);
    form.setHasChanged(true);
  }

  const handleSave = (ev) => {
  	ev.preventDefault();
    const payload = {
      email: form.fields.email.value,
      full_name: form.fields.full_name.value,
      password: form.fields.password.value
    }
    const handler = async (data) => {
      return await client.putJson('/users/userinfo/me', data);
    }
    form.submit(() => handler(payload), () => {
      client.getJson('/users/userinfo/me').then( (res) => {
      	history.push('/dashboard');
      });
  	});
  }

	return (
		<div className="col">
		  <div className="card .h-100" id="profile-widget">
		    <div className="card-block">
		      <h4 className="card-title">My profile</h4>
		      <div className="card-text">
		        <div className="form-group">
		          <label for="user_email">Email:</label>
		          <input type="email" onChange={(ev) => {handleChange(ev.target.value, 'email')}} id="user_email" name="user_email" value={form.fields.email.value} className="form-control" />
		          <div className="invalid-feedback" id="email-error" style={{display: form.fields.email.error ? 'block': 'none'}}>
		          {form.fields.email.error ? form.fields.email.error : ''}</div>
		        </div>
		        <div className="form-group">
		          <label for="user_full_name">Name:</label>
		          <input type="text" onChange={(ev) => {handleChange(ev.target.value, 'full_name')}} id="user_full_name" name="user_full_name" value={form.fields.full_name.value} className="form-control" />
		          <div className="invalid-feedback" id="full_name-error" style={{display: form.fields.full_name.error ? 'block': 'none'}}>
		          {form.fields.full_name.error ? form.fields.full_name.error : ''}</div>
		        </div>
		        <div className="form-group">
		          <label for="user_password">Password:</label>
		          <input type="password" onChange={(ev) => {handleChange(ev.target.value, 'password')}} id="user_password" name="user_password" className="form-control" />
		          <div className="invalid-feedback" id="password-error" style={{display: form.fields.password.error ? 'block': 'none'}}>
		          {form.fields.password.error ? form.fields.password.error : ''}</div>
		        </div>
		        <a onClick={handleSave} className={!form.hasChanged ? 'btn btn-primary disabled' : 'btn btn-primary'}>Save</a>
		      </div>
		    </div>
		  </div>
		</div>
  )

}

const Widgets = () => {

  const client = ApiClient();
  const history = useHistory();

  if (!client.isAuthenticated()) {
    history.push("/login");
  }
	
	return (
		<>
      { Widget(client) }
		</>
	)
}

const ProfileWidget = () => {

  return Page(Widgets, 1);

}

export default ProfileWidget;
