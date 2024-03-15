import { useHistory } from "react-router-dom";

import ApiClient from '../api.client.js';
import UserWidget from './users.js';
import Page from './page.js';


const Widgets = () => {

  const client = ApiClient();
  const history = useHistory();

  if (!client.isAuthenticated()) {
    history.push("/login");
  }
	
	return (
		<>
      { UserWidget(client) }
		</>
	)
}

const AdminWidgets = () => {

  return Page(Widgets, 1);

}

export default AdminWidgets;