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
  DialogActions,
  Typography 
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
    backgroundColor: '#FFFFFF', // White background
    color: '#000000', // Black icon color
    '&:hover': {
      backgroundColor: '#F5F5F5', // Light gray on hover
    },
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    minWidth: '200px',
    color: '#FFFFFF', // White text
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark semi-transparent
  },
  menuLink: {
    textDecoration: 'none',
    color: '#FFFFFF', // White text
  },
  sectionHeader: {
    padding: '8px 16px', 
    fontWeight: 'bold',
    backgroundColor: '#2C2F33', // Dark grey
    color: '#7289DA', // Discord blue
    borderBottom: '1px solid #23272A', // Slightly darker border
  },
  fadedItem: {
    opacity: 0.7,
    color: '#B9BBBE', // Light grey for text
    '&:hover': {
      backgroundColor: '#36393F', // Darker grey on hover
    },
  },
  dialog: {
    backgroundColor: '#2C2F33', // Dark grey background
    color: '#FFFFFF', // White text
  },
  dialogTitle: {
    backgroundColor: '#23272A', // Darker header
    color: '#FFFFFF',
    borderBottom: '1px solid #36393F',
  },
  dialogContent: {
    backgroundColor: '#2C2F33', // Match dark theme
    padding: 0,
  },
  listItem: {
    color: '#FFFFFF',
    backgroundColor: '#2C2F33',
    '&:hover': {
      backgroundColor: '#36393F', // Darker grey on hover
    },
  },
  avatar: {
    backgroundColor: '#7289DA', // Discord blue
    color: '#FFFFFF',
  },
  button: {
    color: '#7289DA', // Discord blue
    '&:hover': {
      backgroundColor: 'rgba(114, 137, 218, 0.1)', // Very light blue
    },
  },
}));

export default function FloatingActionButtonMenu() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [regularContacts, setRegularContacts] = useState([]);
  const [invitedContacts, setInvitedContacts] = useState([]);
  const open = Boolean(anchorEl);

  const { store } = useContext(Context);
  const userid = store.userInfo?.user_id;

  useEffect(() => {
    if (openContactDialog || openPaymentDialog) {
      mapContacts(setContacts, userid);
    }
  }, [openContactDialog, openPaymentDialog, userid]);

  // Sort contacts into members and non-members when contacts change
  useEffect(() => {
    if (contacts?.contacts && Array.isArray(contacts.contacts)) {
      const regular = contacts.contacts.filter(contact => 
        !contact.contact_name?.startsWith('Invited-')
      );
      const invited = contacts.contacts.filter(contact => 
        contact.contact_name?.startsWith('Invited-')
      );
      
      regular.sort((a, b) => (a.contact_name || '').localeCompare(b.contact_name || ''));
      invited.sort((a, b) => (a.contact_name || '').localeCompare(b.contact_name || ''));
      
      setRegularContacts(regular);
      setInvitedContacts(invited);
    }
  }, [contacts]);

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
      icon: <PaymentIcon style={{ color: '#FFFFFF' }} />, 
      name: 'Make Payment',
      onClick: () => {
        setOpenPaymentDialog(true);
        handleClose();
      }
    },
    {
      icon: <ChatIcon style={{ color: '#FFFFFF' }} />,
      name: 'Start Chat',
      onClick: () => {
        setOpenContactDialog(true);
        handleClose();
      }
    },
    { 
      icon: <GroupAddIcon style={{ color: '#FFFFFF' }} />, 
      name: <Link to={`/group/create/${userid}`} className={classes.menuLink}>Create Group</Link>,
    },
    { 
      icon: <AssignmentIcon style={{ color: '#FFFFFF' }} />, 
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
        <AddIcon  />
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
        PaperProps={{
          style: {
            backgroundColor: '#2C2F33', // Dark grey
            color: '#FFFFFF', // White text
          },
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

   
      <Dialog 
        open={openContactDialog} 
        onClose={() => setOpenContactDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          className: classes.dialog,
        }}
      >
        <DialogTitle className={classes.dialogTitle}>Start a Conversation</DialogTitle>
        <DialogContent dividers className={classes.dialogContent}>
      
          {regularContacts.length > 0 && (
            <>
              <Typography className={classes.sectionHeader}>Members</Typography>
              <List>
                {regularContacts.map((contact) => (
                  <ListItem 
                    button 
                    key={contact.contact_id}
                    onClick={() => handleStartConversation(contact.contact_id)}
                    className={classes.listItem}
                  >
                    <ListItemAvatar>
                      <Avatar className={classes.avatar}>
                        {contact.contact_initial}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={contact.contact_name}
                      secondary={contact.contact_email}
                      primaryTypographyProps={{ style: { color: '#FFFFFF' } }}
                      secondaryTypographyProps={{ style: { color: '#B9BBBE' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

      
          {invitedContacts.length > 0 && (
            <>
              <Typography className={classes.sectionHeader}>Pending Members</Typography>
              <List>
                {invitedContacts.map((contact) => (
                  <ListItem 
                    button 
                    key={contact.contact_id}
                    onClick={() => handleStartConversation(contact.contact_id)}
                    className={`${classes.listItem} ${classes.fadedItem}`}
                  >
                    <ListItemAvatar>
                      <Avatar className={classes.avatar}>
                        {contact.contact_initial}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={contact.contact_name.replace('Invited-', '')}
                      secondary={contact.contact_email}
                      primaryTypographyProps={{ style: { color: '#B9BBBE' } }}
                      secondaryTypographyProps={{ style: { color: '#72767D' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {regularContacts.length === 0 && invitedContacts.length === 0 && (
            <Typography align="center" style={{ padding: '16px', color: '#B9BBBE' }}>
              No contacts found
            </Typography>
          )}
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#23272A' }}>
          <Button onClick={() => setOpenContactDialog(false)} className={classes.button}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    
      <Dialog 
        open={openPaymentDialog} 
        onClose={() => setOpenPaymentDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          className: classes.dialog,
        }}
      >
        <DialogTitle className={classes.dialogTitle}>Make a Payment</DialogTitle>
        <DialogContent dividers className={classes.dialogContent}>
  
          {regularContacts.length > 0 && (
            <>
              <Typography className={classes.sectionHeader}>Members</Typography>
              <List>
                {regularContacts.map((contact) => (
                  <ListItem 
                    button 
                    key={contact.contact_id}
                    onClick={() => handleMakePayment(contact.contact_id)}
                    className={classes.listItem}
                  >
                    <ListItemAvatar>
                      <Avatar className={classes.avatar}>
                        {contact.contact_initial}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={contact.contact_name}
                      secondary={contact.contact_email}
                      primaryTypographyProps={{ style: { color: '#FFFFFF' } }}
                      secondaryTypographyProps={{ style: { color: '#B9BBBE' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {/* Non-Members Section */}
          {invitedContacts.length > 0 && (
            <>
              <Typography className={classes.sectionHeader}>Pending Members</Typography>
              <List>
                {invitedContacts.map((contact) => (
                  <ListItem 
                    button 
                    key={contact.contact_id}
                    onClick={() => handleMakePayment(contact.contact_id)}
                    className={`${classes.listItem} ${classes.fadedItem}`}
                  >
                    <ListItemAvatar>
                      <Avatar className={classes.avatar}>
                        {contact.contact_initial}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={contact.contact_name.replace('Invited-', '')}
                      secondary={contact.contact_email}
                      primaryTypographyProps={{ style: { color: '#B9BBBE' } }}
                      secondaryTypographyProps={{ style: { color: '#72767D' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {regularContacts.length === 0 && invitedContacts.length === 0 && (
            <Typography align="center" style={{ padding: '16px', color: '#B9BBBE' }}>
              No contacts found
            </Typography>
          )}
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#23272A' }}>
          <Button onClick={() => setOpenPaymentDialog(false)} className={classes.button}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}