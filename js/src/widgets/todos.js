import {useEffect, useState} from 'react';

import TodoRenderer from './todos.widget.js';


const TodoWidget = (client) => {

	const [todos, setTodos] = useState([]);
	const [currentTodo, setCurrentTodo] = useState(null);

  useEffect( () => {
    const renderer = TodoRenderer(client);
    renderer.render().then( (todos) => {
    	setTodos(todos);
    });
  }, []);

  const selectRow = (todo) => {
    const renderer = TodoRenderer(client);
    setCurrentTodo(todo);
    renderer.render().then( (todos) => {
      setTodos(todos);
    });
  }

  const handleAdd = (event) => {
  	const value = event.target.value.trim();
  	if (event.keyCode != 13 || value === '') {
  		return;
  	}
  	
  	const renderer = TodoRenderer(client);
  	const payload = {
  		text: value
  	}
    renderer.createTodo(payload).then( (todo) => {
    	setCurrentTodo(todo);
  		event.target.value = '';
  		renderer.render().then( (todos) => {
        setTodos(todos);
  		});
  	});
  }

  const handleDelete = (todo) => {
  	const renderer = TodoRenderer(client);
    renderer.deleteTodo(todo.id).then( () => {
  		renderer.render().then( (todos) => {
        setTodos(todos);
  		});
  	});
  }

  return (
  	 <div className="col">
	     <div className="card h-100" id="todo-widget">
	        <div className="card-block">
	            <h4 className="card-title">Todo's</h4>
	            <div className="card-text">
	                <div className="form-group">
	                  <div className="list-group" id="list-tab" role="tablist">
	                  {
	                  	todos.map( (todo) => (
	                  		<a className={'list-group-item list-group-item-action' + (currentTodo && currentTodo.id === todo.id ? ' active': '')} id="list-home-list" data-toggle="list" role="tab" aria-controls="home" onClick={ ( (ev) => { ev.preventDefault(); selectRow(todo) }) }>{todo.text}
									        <button type="button" className="close" data-dismiss="alert" aria-label="Close" style={{color: "white"}} onClick={ ( (ev) => { ev.preventDefault(); handleDelete(todo) }) }>
												    <span aria-hidden="true">&times;</span>
												  </button>
									      </a>
	                  	))
	                  }
								    </div>
	                </div>    
	                <input type="text" name="todo_text" className="form-control" onKeyDown={handleAdd} />
	            </div>
	        </div>
	    </div>
	  </div>  
  );
}

export default TodoWidget;
