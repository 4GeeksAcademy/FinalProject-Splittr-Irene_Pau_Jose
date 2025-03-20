import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link } from "react-router-dom";
import { Link as MuiLink } from "@material-ui/core";
import { Home } from '../Home.jsx';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MessageIcon from '@material-ui/icons/Message';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useContext } from 'react';
import { Context } from '../../store/appContext.js';

export const MainListItems = ({ user }) => {

  const { store, actions } = useContext(Context);
  console.log(user);



  return (

    <div>
      <ListItem button component={Link} to="/dashboard">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to={`/user_contacts/user/${user.user_id}`}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="List Of Contacts" />
      </ListItem>
      <ListItem button component={Link} to={`/group/user/${user.user_id}`}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Groups" />
      </ListItem>
      <ListItem button component={Link} to={`/sharedobjectives/`}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Shared objetives" />
      </ListItem>
      <ListItem button component={Link} to={`/message/user/${user.user_id}`}>
        <ListItemIcon>
          <MessageIcon />
        </ListItemIcon>
        <ListItemText primary="Messages" />
      </ListItem>
      

    </div>
  )
};

export const SecondaryListItems = ({ user }) => {

  const { store, actions } = useContext(Context);
  console.log(user);


  return (
    <div>

      <ListItem button component={Link} to="/settings" >
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
      <ListItem button component={Link} to="/about">
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary="About" />
      </ListItem>
      <ListItem button component={Link} to="/feedback">
        <ListItemIcon>
          <MailOutlineIcon />
        </ListItemIcon>
        <ListItemText primary="Feedback" />
      </ListItem>
    </div>
  )
}

