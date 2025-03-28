import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { MainListItems } from '../Dashboard/listitems.jsx';
import { SecondaryListItems } from '../Dashboard/listitems.jsx';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import MessageCard from './IndividualViews/MessageCard.jsx';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../store/appContext.js';
import { mapMessages, mapContacts, mapConversations } from '../../component/callToApi.js';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: { main: '#ffffff' },
    background: { default: '#23272A', paper: '#2C2F33' },
    text: { primary: '#ffffff', secondary: '#b9bbbe' },
  },
  overrides: {
    MuiAppBar: { colorPrimary: { backgroundColor: '#000000', color: '#ffffff' } },
    MuiToolbar: { root: { color: '#ffffff' } },
    MuiTypography: { root: { color: '#ffffff' } },
    MuiIconButton: { root: { color: '#ffffff !important' } },
    MuiBadge: { colorSecondary: { backgroundColor: '#ff0000' } },
  },
});

const drawerWidth = 240;

const useStyles = makeStyles((theme) => {
  const appBarCommon = {
    backgroundColor: '#000000',
    color: theme.palette.text.primary,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  };

  const drawerCommon = {
    position: 'relative',
    whiteSpace: 'nowrap',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    top: 30,
  };

  const responsiveText = {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.875rem',
    },
  };

  const responsiveIcon = {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    },
  };

  const responsiveInitial = {
    [theme.breakpoints.down('sm')]: {
      width: 30,
      height: 30,
      fontSize: '0.8rem',
    },
  };

  return {
    root: { display: 'flex' },
    toolbar: {
      paddingRight: 20,
      minHeight: 70,
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
    },
    appBar: {
      ...appBarCommon,
      zIndex: theme.zIndex.drawer + 1,
    },
    appBarShift: {
      ...appBarCommon,
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: { marginRight: 36 },
    menuButtonHidden: { display: 'none' },
    title: { flexGrow: 1 },
    drawerPaper: {
      ...drawerCommon,
      width: drawerWidth,
    },
    drawerPaperClose: {
      ...drawerCommon,
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: { width: theme.spacing(9) },
    },
    appBarSpacer: {
      minHeight: theme.spacing(4),
    },

    card: {
      display: 'flex',
      width: 500,
      minHeight: 70,
      minWidth: 250,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
      backgroundColor: '#2C2F33',
      margin: theme.spacing(0),
      borderRadius: 4,
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
      },
    },
    iconButton: {
      color: '#ffffff',
      padding: theme.spacing(0.5),
      ...responsiveIcon,
    },
    name: {
      display: 'flex',
      alignItems: 'center',
      color: '#ffffff',
      flexGrow: 1,
      ...responsiveText,
    },
    initial: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: '#6c63ff',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      marginRight: theme.spacing(1),
      ...responsiveInitial,
    },
    content: {
      flexGrow: 1,
      overflow: 'auto',
      width: '100%',
    },
    container: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      width: '100%',
    },
    contactGrid: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      paddingBottom: theme.spacing(1),

    },
    fabButton: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      borderRadius: '50%',
      width: theme.spacing(7),
      height: theme.spacing(7),
    },

  };
});


export default function Messages() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const { store, actions } = useContext(Context);

  const [mappedConversations, setMappedConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userid } = useParams();
  const navigate = useNavigate();

  // Fetch conversations and contacts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch conversations and contacts
        await Promise.all([
          mapConversations(setMappedConversations, userid),
          mapContacts(setContacts, userid)
        ]);
      } catch (err) {
        console.error("Error in fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userid) {
      fetchData();
    }
  }, [userid]);

  // Handler to start a new conversation
  const handleStartConversation = (contactId) => {
    // Navigate to conversation with selected contact
    navigate(`/message/conversation/${contactId}`);
    setOpenContactDialog(false);
  };

  // Transform mapped conversations for rendering, sorted by most recent message
  const getConversationsList = () => {
    // Flatten conversations and add sorting
    const flattenedConvos = mappedConversations.flatMap(userConvos => 
      userConvos.conversations.map(convo => ({
        from_user_id: userConvos.user_id,
        from_user_name: userConvos.username,
        from_user_initial: userConvos.username ? userConvos.username[0] : '',
        message: convo.last_message,
        sent_at: convo.last_message_timestamp
      }))
    );

    // Sort conversations by sent_at in descending order (most recent first)
    return flattenedConvos.sort((a, b) => {
      // Convert to timestamps for proper comparison
      const dateA = new Date(a.sent_at).getTime();
      const dateB = new Date(b.sent_at).getTime();
      
      // Sort in descending order (most recent first)
      return dateB - dateA;
    });
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            {!open && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
            )}

            {open && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="close drawer"
                onClick={handleDrawerClose}
                className={classes.menuButton}
              >
                <ChevronLeftIcon />
              </IconButton>
            )}

            <Typography component="h1" variant="h6" noWrap className={classes.title}>
              Welcome, {store.userInfo?.name || 'User'}!
            </Typography>

            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <Divider />
          <List><MainListItems user={store.userInfo} /></List>
          <Divider />
          <List><SecondaryListItems user={store.userInfo} /></List>
        </Drawer>
        
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3} justifyContent="center" className={classes.contactGrid}>
              {loading ? (
                <Typography variant="subtitle1" color="textSecondary">
                  Loading conversations...
                </Typography>
              ) : error ? (
                <Typography variant="subtitle1" color="error">
                  Error: {error}
                </Typography>
              ) : mappedConversations.length === 0 ? (
                <Typography variant="subtitle1" color="textSecondary">
                  No conversations found
                </Typography>
              ) : (
                getConversationsList().map((conversation, index) => (
                  <MessageCard
                    key={`conversation-${conversation.from_user_id}-${index}`}
                    message={conversation}
                    className={classes.contactGrid}
                  />
                ))
              )}
            </Grid>
          </Container>
        </main>
        
        <Fab
          color="primary"
          className={classes.fabButton}
          onClick={() => setOpenContactDialog(true)}
        >
          <AddIcon />
        </Fab>

        {/* Dialog to Select Contact */}
        <Dialog
          open={openContactDialog}
          onClose={() => setOpenContactDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Start a Conversation</DialogTitle>
          <DialogContent dividers>
            <List>
              {contacts && contacts.contacts && contacts.contacts.map((contact) => (
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
      </div>
    </ThemeProvider>
  );
}