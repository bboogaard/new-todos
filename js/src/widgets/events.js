import {useEffect, useState} from 'react';

import EventRenderer from './events.widget.js';
import Form from '../form.js';


const EventWidget = (client) => {

	const [events, setEvents] = useState([]);
  const form = Form({
    text: {
      name: 'text',
      coerce: (value) => value,
      valueSetter: useState(''),
      errorSetter: useState('')
    },
    date: {
      name: 'datetime',
      coerce: (value) => value.split('T')[0],
      valueSetter: useState(''),
      errorSetter: useState('')
    },
    time: {
      name: 'datetime',
      coerce: (value) => value.split('T')[1].slice(0, 5),
      valueSetter: useState(''),
      errorSetter: useState('')
    }
  });

  useEffect( () => {
    const renderer = EventRenderer(client);
    renderer.render().then( (events) => {
      form.setFields(events.length ? events[0] : null);
      setEvents(events);
    });
    return () => {};
  }, []);

  const selectRow = (event) => {
    const renderer = EventRenderer(client);
    renderer.getEvent(event.id).then( (event) => {
      form.setFields(event);
      renderer.render().then( (events) => {
        setEvents(events);
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

  const handleSave = (ev) => {
  	ev.preventDefault();
    const renderer = EventRenderer(client);
    const payload = {
      text: form.fields.text.value,
      datetime: form.fields.date.value + 'T' + form.fields.time.value
    }
    const handler = async (data) => {
      return form.currentObj ? await renderer.updateEvent(form.currentObj.id, data) : await renderer.createEvent(data);
    }
    form.submit(() => handler(payload), (event) => {
      renderer.render().then( (events) => {
        setEvents(events);
  		});
  	});
  }

  const handleDelete = (ev) => {
    ev.preventDefault();
    const renderer = EventRenderer(client);
    renderer.deleteEvent(form.currentObj.id).then( (results) => {
  		renderer.render().then( (events) => {
        form.setFields(events.length ? events[0] : null);
        setEvents(events);
  		});
  	});
  }

  return (
     <div className="col">
       <div className="card h-100" id="event-widget">
          <div className="card-block">
              <h4 className="card-title">Events</h4>
              <div className="card-text">
                  <div className="form-group">
                    <table id="events" width="100%" cellpadding="2" cellspacing="2">
                      <thead>
                        <tr>
                          <th>Date/time</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          events.map( (event) => (
                              <tr className={form.currentObj && form.currentObj.id === event.id ? "selected" : ""} onClick={( (ev) => selectRow(event))}>
                                <td>
                                  {event.datetimeHuman}
                                </td>
                                <td>
                                  {event.text}
                                </td>
                              </tr>
                          ))
                        }  
                      </tbody>
                    </table>
                  </div>
                  <div className="form-group">
                    <label for="event_text">Description:</label>
                    <input onChange={(ev) => {handleChange(ev.target.value, 'text')}} type="text" id="event_text" name="event_text" value={form.fields.text.value} className="form-control"/>
                    <div className="invalid-feedback" id="text-error" style={{display: form.fields.text.error ? 'block': 'none'}}>
                      {form.fields.text.error ? form.fields.text.error : ''}
                    </div>
                  </div>
                  <div className="form-group">  
                    <label for="event_date">Date:</label>
                    <input onChange={(ev) => {handleChange(ev.target.value, 'date')}} type="date" id="event_date" name="event_date" value={form.fields.date.value} className="form-control"/>
                  </div>
                  <div className="form-group">  
                    <label for="event_time">Time:</label>
                    <input onChange={(ev) => {handleChange(ev.target.value, 'time')}} type="time" id="event_time" name="event_time" value={form.fields.time.value} className="form-control"/>
                    <div class="invalid-feedback" id="datetime-error" style={{display: form.fields.time.error ? 'block': 'none'}}>
                      {form.fields.time.error ? form.fields.time.error : ''}
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

export default EventWidget;
