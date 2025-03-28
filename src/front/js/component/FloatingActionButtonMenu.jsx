import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Fab, 
  Menu, 
  MenuItem, 
  Backdrop, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Button, 
  DialogActions 
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PaymentIcon from '@material-ui/icons/Payment';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ChatIcon from '@material-ui/icons/Chat';
import { Link, useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { Context } from '../store/appContext';
import { mapContacts } from './callToApi';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    borderRadius: '50%', 
    width: theme.spacing(7), 
    height: theme.spacing(7),
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    minWidth: '200px',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  menuLink: {
    textDecoration: 'none',
    color: 'inherit',
  }
}));

export default function FloatingActionButtonMenu() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [contacts, setContacts] = useState([]);
  const open = Boolean(anchorEl);

  const { store } = useContext(Context);
  const userid = store.userInfo?.user_id;

  useEffect(() => {
    if (openContactDialog || openPaymentDialog) {
      mapContacts(setContacts, userid);
    }
  }, [openContactDialog, openPaymentDialog, userid]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStartConversation = (contactId) => {
    navigate(`/message/conversation/${contactId}`);
    setOpenContactDialog(false);
  };

  const handleMakePayment = (contactId) => {
    navigate(`/payment/user/${contactId}`);
    setOpenPaymentDialog(false);
  };

  const actions = [
    { 
      icon: <PaymentIcon />, 
      name: 'Make Payment',
      onClick: () => {
        setOpenPaymentDialog(true);
        handleClose();
      }
    },
    {
      icon: <ChatIcon />,
      name: 'Start Chat',
      onClick: () => {
        setOpenContactDialog(true);
        handleClose();
      }
    },
    { 
      icon: <GroupAddIcon />, 
      name: <Link to={`/group/create/${userid}`} className={classes.menuLink}>Create Group</Link> ,
    },
    { 
      icon: <AssignmentIcon />, 
      name: <Link to={`/objective/create/${userid}`} className={classes.menuLink}>Create Objective</Link>,
      onClick: () => {
        handleClose();
      }
    },
  ];

  return (
    <>
      <Fab 
        color="primary" 
        className={classes.fab} 
        onClick={handleClick}
      >
        <AddIcon />
      </Fab>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        {actions.map((action, index) => (
          <MenuItem 
            key={index} 
            onClick={action.onClick} 
            className={classes.menuItem}
          >
            {action.icon}
            {action.name}
          </MenuItem>
        ))}
      </Menu>
      <Backdrop 
        open={open} 
        onClick={handleClose} 
        className={classes.backdrop}
      />

      {/* Dialog to Select Contact for Chat */}
      <Dialog 
        open={openContactDialog} 
        onClose={() => setOpenContactDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Start a Conversation</DialogTitle>
        <DialogContent dividers>
          <List>
            {contacts?.contacts?.map((contact) => (
              <ListItem 
                button 
                key={contact.contact_id}
                onClick={() => handleStartConversation(contact.contact_id)}
              >
                <ListItemAvatar>
                  <Avatar>{contact.contact_initial}</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={contact.contact_name}
                  secondary={contact.contact_email}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenContactDialog(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to Select Contact for Payment */}
      <Dialog 
        open={openPaymentDialog} 
        onClose={() => setOpenPaymentDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Make a Payment</DialogTitle>
        <DialogContent dividers>
          <List>
            {contacts?.contacts?.map((contact) => (
              <ListItem 
                button 
                key={contact.contact_id}
                onClick={() => handleMakePayment(contact.contact_id)}
              >
                <ListItemAvatar>
                  <Avatar>{contact.contact_initial}</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={contact.contact_name}
                  secondary={contact.contact_email}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
