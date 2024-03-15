import { useHistory } from "react-router-dom";

import ApiClient from '../api.client.js';


const Logout = () => {

  const client = ApiClient();
  const history = useHistory();

  client.logout();
  history.push("/login");

  return null;

}

export default Logout;
