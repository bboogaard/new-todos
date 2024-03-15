import { BrowserRouter, Route } from "react-router-dom";

import './App.css';
import LoginWidget from './widgets/login.js';
import Logout from './widgets/logout.js';
import UserWidgets from './widgets/user-widgets.js';
import AdminWidgets from './widgets/admin-widgets.js';
import UserInfo from './widgets/userinfo.js';
import WallPapers from './widgets/wallpapers.js';
import ProfileWidget from './widgets/profile.js';


const App = () => {

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <a className="navbar-brand">Todo's</a>
        <WallPapers />
        <div className="mr-auto"></div>
        <div className="mr-2">
          <UserInfo />
        </div>
      </nav>
      <BrowserRouter basename="/" forceRefresh={true}>
        <Route path="/login" component={LoginWidget}></Route>
        <Route path="/dashboard" component={UserWidgets}></Route>  
        <Route path="/admin" component={AdminWidgets}></Route>
        <Route path="/logout" component={Logout}></Route>
        <Route exact path="/" component={UserWidgets}></Route>
        <Route path="/profile" component={ProfileWidget}></Route> 
      </BrowserRouter>
    </> 
  ) 

}

export default App;
