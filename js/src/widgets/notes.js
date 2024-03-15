import {useEffect, useState} from 'react';

import NoteRenderer from './notes.widget.js';


const NoteWidget = (client) => {

  const [notes, setNotes] = useState('');
  const [hasChanged, setHasChanged] = useState(false);

  useEffect( () => {
    const renderer = NoteRenderer(client);
    renderer.render().then( (notes) => {
      setNotes(notes);
      setHasChanged(false);
    });
  }, []);

  const handleSave = (ev) => {
  	ev.preventDefault();
  	const renderer = NoteRenderer(client);
    const payload = {
      text: notes
    }
    renderer.saveNotes(payload).then( () => {
    	renderer.render().then( (notes) => {
    		setNotes(notes);
    		setHasChanged(false);
    	});
    });
  }

  const handleChange = (ev) => {
    setNotes(ev.target.value);
    setHasChanged(true);
  }

  return (
  	<div className="col">
	  	<div className="card h-100" id="note-widget">
	      <div className="card-block">
	          <h4 className="card-title">Notes</h4>
	          <div className="card-text">
	              <div className="form-group">
	                <textarea onChange={handleChange} value={notes} className="form-control" rows="10" />
	              </div>
	              <a onClick={handleSave} className={!hasChanged ? 'btn btn-primary disabled' : 'btn btn-primary'}>Save</a>
	          </div>
	      </div>
	    </div>
	  </div>  
  )

}

export default NoteWidget;
