import { useHistory } from "react-router-dom";

import ApiClient from '../api.client.js';
import TodoWidget from './todos.js';
import EventWidget from './events.js';
import FileWidget from './files.js';
import NoteWidget from './notes.js';
import Page from './page.js';


const Widgets = () => {

  const client = ApiClient();
  const history = useHistory();

  if (!client.isAuthenticated()) {
    history.push("/login");
  }
	
	return (
		<>
      { TodoWidget(client) }
      { EventWidget(client) }
      { NoteWidget(client) }
      { FileWidget(client) }
		</>
	)
}

const UserWidgets = () => {

  return Page(Widgets, 2);

}

export default UserWidgets;