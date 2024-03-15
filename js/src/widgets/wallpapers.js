import {useEffect, useState} from 'react';
import { useCookies } from 'react-cookie';

import ApiClient from '../api.client.js';
import metadata from '../assets/images/wallpapers/metadata.json';


const WallPapers = () => {

  const client = ApiClient();
  const [loggedIn, setLoggedIn] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();

  const setBackground = (className) => {
    metadata.forEach( (wallPaper) => {
      document.body.classList.remove(wallPaper.className);
    });
    document.body.classList.add(className);
  } 

  useEffect( () => {
    setLoggedIn(client.isAuthenticated());
    const wallPaper = cookies.todosWallPaper !== undefined ? cookies.todosWallPaper : 'default';
    setBackground(wallPaper);
  }, []);

  const saveWallpaper = (w) => {
    setCookie('todosWallPaper', w.className, { path: '/' });
    setBackground(w.className);
  }

  return (
    loggedIn ?
    (
      <ul class="navbar-nav mr-auto">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Wallpapers
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            {
                metadata.map( (wallPaper) => {
                  return (
                    <a className="dropdown-item" onClick={ (ev) => { saveWallpaper(wallPaper) } } style={{cursor: "pointer"}}>
                      { wallPaper.name }
                    </a>
                  )
                })
            }
          </div>
        </li>
      </ul>
    )
    :
    null
  )

}

export default WallPapers;