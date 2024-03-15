import {useEffect, useState} from 'react';

import FileRenderer from './files.widget.js';


const FileWidget = (client) => {

  const [files, setFiles] = useState([]);
  const [hasChanged, setHasChanged] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect( () => {
    const renderer = FileRenderer(client);
    renderer.render().then( (files) => {
      setFiles(files);
    });
  }, []);

  const handleSave = (ev) => {
  	ev.preventDefault();
  	const renderer = FileRenderer(client);
    const form = document.getElementById('files-upload');
    const payload = new FormData(form);
    renderer.saveFile(payload).then( () => {
    	form.reset();
      renderer.render().then( (files) => {
    		setFiles(files);
        setHasChanged(false);
    	});
    });
  }

  const handleDownload = (file) => {
    const renderer = FileRenderer(client);
    renderer.downloadFile(file.id);
  }

  const handleDelete = (ev) => {
    ev.preventDefault();
    const renderer = FileRenderer(client);
    renderer.deleteFiles(selectedFiles).then( () => {
      setSelectedFiles([]);
      renderer.render().then( (files) => {
        setFiles(files);
      });
    });
  }

  const handleChange = (ev) => {
    setHasChanged(true);
  }

  const handleSelect = (ev) => {
    setSelectedFiles(Array.from(document.getElementsByName('files')).filter( (el) => {
      return el.checked;
    }).map( (el) => {
      return parseInt(el.value, 10);
    }));
  }

  return (
    <div className="col">
    	<div className="card h-100" id="file-widget">
        <div className="card-block">
            <h4 className="card-title">Files</h4>
            <div className="card-text">
                <div className="form-group">
                  <ul id="files">
                    {
                      files.map( (file) => (
                        <li>
                          <input type="checkbox" name="files" value={file.id} onClick={handleSelect} checked={selectedFiles.indexOf(file.id) !== -1} /> <a role="link" className="" onClick={(ev) => {ev.preventDefault(); handleDownload(file)}} style={{cursor: 'pointer'}}>{file.filename}</a>
                        </li>  
                      ))
                    }
                  </ul>
                </div> 
                <div className="form-group">
                  <form action="" id="files-upload" method="post" enctype="multipart/form-data">
                    <input type="file" name="file" onChange={handleChange} />
                  </form>
                </div>
                <a className={!hasChanged ? 'btn btn-primary disabled' : 'btn btn-primary'} onClick={handleSave}>Save</a>&nbsp;
                <a className={!selectedFiles.length ? 'btn btn-primary disabled' : 'btn btn-primary'} onClick={handleDelete}>Delete</a>
            </div>
        </div>
      </div>
    </div>    
  )

}

export default FileWidget;
