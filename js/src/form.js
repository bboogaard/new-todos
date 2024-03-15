import {useState} from 'react';


class FormHandler {

  constructor(fields) {
  	this.fields = fields;
  	for (const fieldName in this.fields) {
  		const field = this.fields[fieldName];
  	  const [value, setValue] = field.valueSetter;
  	  field.value = value;
  	  field.setValue = setValue;
  	  const [error, setError] = field.errorSetter;
  	  field.error = error;
  	  field.setError = setError;
  	}
  }

  submit(handler, onSuccess) {
  	let self = this;

  	handler().then( (res) => {
  		if (res.ok) {
  			self.setFields(res.json);
  			onSuccess();
  		}
  		else if (res.json.detail !== undefined) {
  			self.parseDetail(res.json.detail);
  		}
  	});
  }

  setFields(obj) {
  	this.setCurrentObj(obj);
  	this.setHasChanged(false);
  	for (const fieldName in this.fields) {
  		const field = this.fields[fieldName];
	  	field.setError('');
	  }
  	if (!obj) {
  	  for (const fieldName in this.fields) {
  	  	const field = this.fields[fieldName];
	  		field.setValue('');
	  	}
	  	return;
  	}
  	for (const fieldName in this.fields) {
  		const field = this.fields[fieldName];
  		field.setValue(field.coerce(obj[field.name]));
  	}
  }

  parseDetail(detail) {
  	let errors = {};
  	for (let error of detail) {
  		let field = error.loc[1];
  		let msg = error.msg;
  		if (errors[field] === undefined) {
  			errors[field] = [];
  		}
  		errors[field].push(msg.charAt(0).toUpperCase() + msg.slice(1));
  	}
  	for (const fieldName in this.fields) {
  		const field = this.fields[fieldName];
  		const fieldError = errors[field.name];
  		if (fieldError !== undefined) {
  		  field.setError(fieldError.join(", "));	
  		}
  	}
  }

}

const Form = (fields) => {

  const formHandler = new FormHandler(fields);

  [formHandler.currentObj, formHandler.setCurrentObj] = useState(null);
  [formHandler.hasChanged, formHandler.setHasChanged] = useState(false); 
  return formHandler;

}

export default Form;
