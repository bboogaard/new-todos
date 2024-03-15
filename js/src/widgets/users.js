import {useEffect, useState} from 'react';

import UserRenderer from './users.widget.js';
import Form from '../form.js';


const UserWidget = (client) => {

	const [users, setUsers] = useState([]);

  const form = Form({
    username: {
      name: 'username',
      coerce: (value) => value,
      valueSetter: useState(''),
      errorSetter: useState('')
    },
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
    widgets: {
      name: 'widgets',
      coerce: (value) => value,
      valueSetter: useState([]),
      errorSetter: useState([])
    },
    password: {
      name: 'password',
      coerce: (value) => value,
      valueSetter: useState(''),
      errorSetter: useState('')
    }
  });

  useEffect( () => {
    const renderer = UserRenderer(client);
    renderer.render().then( (users) => {
      form.setFields(users.length ? users[0] : null);
      setUsers(users);
    });
  }, []);

  const selectRow = (user) => {
    const renderer = UserRenderer(client);
    renderer.getUser(user.username).then( (user) => {
      form.setFields(user);
      renderer.render().then( (users) => {
        setUsers(users);
      });
    });
  }

  const handleAdd = (ev) => {
    form.setFields(null);
  }

  const handleChange = (value, fieldName) => {
    form.fields[fieldName].setValue(value);
    form.setHasChanged(true);
  }

  const handleWidgetChange = (ev) => {
    handleChange(Array.from(document.getElementsByName('user_widgets')).filter( (el) => {
      return el.checked;
    }).map( (el) => {
      return el.value;
    }), 'widgets');
  }

  const handleSave = (ev) => {
  	ev.preventDefault();
    const renderer = UserRenderer(client);
    let payload = {
      email: form.fields.email.value,
      full_name: form.fields.full_name.value,
      widgets: form.fields.widgets.value,
      password: form.fields.password.value
    }
    if (!form.currentObj) {
      payload.username = form.fields.username.value;
    }
    const handler = async (data) => {
      return form.currentObj ? await renderer.updateUser(form.currentObj.username, data) : await renderer.createUser(data);
    } 
    form.submit(() => handler(payload), (user) => {
      renderer.render().then( (users) => {
        setUsers(users);
  		});
  	});
  }

  const handleDelete = (ev) => {
    ev.preventDefault();
    const renderer = UserRenderer(client);
    renderer.deleteUser(form.currentObj.username).then( (results) => {
  		renderer.render().then( (users) => {
        form.setFields(users.length ? users[0] : null);
        setUsers(users);
  		});
  	});
  }

  return (
     <div className="col">
       <div className="card h-100" id="user-widget">
          <div className="card-block">
              <h4 className="card-title">Users</h4>
              <div className="card-text">
                  <div className="form-group">
                    <table id="users" width="100%" cellpadding="2" cellspacing="2">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                      {
                        users.map( (user) => (
                            <tr className={form.currentObj && form.currentObj.username === user.username ? "selected" : ""} onClick={( (ev) => selectRow(user))}>
                              <td>
                                {user.username}
                              </td>
                              <td>
                                {user.email}
                              </td>
                              <td>
                                {user.full_name}
                              </td>
                            </tr>
                        ))
                      }
                      </tbody>
                    </table>
                  </div>
                  {
                    !form.currentObj && (
                      <div className="form-group">
                        <label for="user_username">Username:</label>
                        <input type="text" onChange={(ev) => {handleChange(ev.target.value, 'username')}} id="user_username" name="user_username" value={form.fields.username.value} className="form-control" />
                        <div className="invalid-feedback" id="username-error" style={{display: form.fields.username.error ? 'block': 'none'}}>
                           {form.fields.username.error ? form.fields.username.error : ''}
                        </div>
                      </div>
                    )  
                  }
                  <div className="form-group">
                    <label for="user_email">Email:</label>
                    <input type="email" onChange={(ev) => {handleChange(ev.target.value, 'email')}} id="user_email" name="user_email" value={form.fields.email.value} className="form-control" />
                    <div className="invalid-feedback" id="email-error" style={{display: form.fields.email.error ? 'block': 'none'}}>
                      {form.fields.email.error ? form.fields.email.error : ''}
                    </div>
                  </div>
                  <div className="form-group">
                    <label for="user_full_name">Name:</label>
                    <input type="text" onChange={(ev) => {handleChange(ev.target.value, 'full_name')}} id="user_full_name" name="user_full_name" value={form.fields.full_name.value} className="form-control" />
                    <div className="invalid-feedback" id="full_name-error" style={{display: form.fields.full_name.error ? 'block': 'none'}}>
                      {form.fields.full_name.error ? form.fields.full_name.error : ''}
                    </div>
                  </div>
                  <div className="form-group">
                    <label for="user_widgets">Widgets:</label>
                  </div>  
                  <div className="form-group">
                    <input type="checkbox" onChange={handleWidgetChange} name="user_widgets" value="todos" checked={form.fields.widgets.value.indexOf('todos') !== -1} /> Todo's
                    &nbsp;
                    <input type="checkbox" onChange={handleWidgetChange} name="user_widgets" value="notes" checked={form.fields.widgets.value.indexOf('notes') !== -1} /> Notes
                    &nbsp;
                    <input type="checkbox" onChange={handleWidgetChange} name="user_widgets" value="files" checked={form.fields.widgets.value.indexOf('files') !== -1} /> Files
                    &nbsp;
                    <input type="checkbox" onChange={handleWidgetChange} name="user_widgets" value="events" checked={form.fields.widgets.value.indexOf('events') !== -1} /> Events
                    <div className="invalid-feedback" id="widget-error" style={{display: form.fields.widgets.error ? 'block': 'none'}}>
                      {form.fields.widgets.error ? form.fields.widgets.error : ''}
                    </div>
                  </div>
                  <div className="form-group">
                    <label for="user_password">Password:</label>
                    <input type="password" onChange={(ev) => {handleChange(ev.target.value, 'password')}} id="user_password" name="user_password" className="form-control" />
                    <div className="invalid-feedback" id="password-error" style={{display: form.fields.password.error ? 'block': 'none'}}>
                      {form.fields.password.error ? form.fields.password.error : ''}
                    </div>
                  </div>
                  <a onClick={handleAdd} className="btn btn-primary">Add</a>&nbsp;
                  <a onClick={handleSave} className={!form.hasChanged ? 'btn btn-primary disabled' : 'btn btn-primary'}>Save</a>&nbsp;
                  <a onClick={handleDelete} className={!form.currentObj ? 'btn btn-primary disabled' : 'btn btn-primary'}>Delete</a>
              </div>
          </div>
      </div>
    </div> 
  );
}

export default UserWidget;
