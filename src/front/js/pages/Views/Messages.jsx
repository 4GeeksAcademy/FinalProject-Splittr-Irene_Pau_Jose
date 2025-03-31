import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { MainListItems, SecondaryListItems } from '../Dashboard/listitems.jsx';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import MessageCard from './IndividualViews/MessageCard.jsx';
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
import { SplittrLogo } from '../../component/SplittrLogo.jsx';
import LogoutButton from '../../component/LogOutButton.jsx';

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

const useStyles = makeStyles((theme) => ({
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
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#000000',
    color: theme.palette.text.primary,
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#000000',
    color: theme.palette.text.primary,
  },
  menuButton: { marginRight: 36 },
  menuButtonHidden: { display: 'none' },
  title: { flexGrow: 1 },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    top: 30,
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: { width: theme.spacing(9) },
    top: 30,
  },
  appBarSpacer: {
    minHeight: theme.spacing(4),
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
    overflow: 'auto',
    width: '100%',
  },
  contactGrid: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(1),
  },
  fabButton: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
  },
  categoryDivider: {
    width: '100%',
    margin: theme.spacing(2, 0),
  },
  categoryTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  sectionHeader: {
    padding: '8px 16px',
    fontWeight: 'bold',
    backgroundColor: '#2C2F33',
    color: '#7289DA',
    borderBottom: '1px solid #23272A',
  },
  fadedItem: {
    opacity: 0.7,
    color: '#B9BBBE',
    '&:hover': {
      backgroundColor: '#36393F',
    },
  },
  dialog: {
    backgroundColor: '#2C2F33',
    color: '#FFFFFF',
  },
  dialogTitle: {
    backgroundColor: '#23272A',
    color: '#FFFFFF',
    borderBottom: '1px solid #36393F',
    padding: theme.spacing(2),
  },
  dialogContent: {
    backgroundColor: '#2C2F33',
    padding: 0,
  },
  listItem: {
    color: '#FFFFFF',
    backgroundColor: '#2C2F33',
    '&:hover': {
      backgroundColor: '#36393F',
    },
  },
  avatar: {
    backgroundColor: '#7289DA',
    color: '#FFFFFF',
  },
  button: {
    color: '#7289DA',
    '&:hover': {
      backgroundColor: 'rgba(114, 137, 218, 0.1)',
    },
  },
}));

export default function Messages() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const { store, actions } = useContext(Context);
  const [mappedConversations, setMappedConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [regularContacts, setRegularContacts] = useState([]);
  const [invitedContacts, setInvitedContacts] = useState([]);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regularConversations, setRegularConversations] = useState([]);
  const [invitedConversations, setInvitedConversations] = useState([]);

  const { userid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
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

  // Separate conversations into regular and invited when data is loaded
  useEffect(() => {
    if (mappedConversations.length > 0) {
      const regular = [];
      const invited = [];
      
      mappedConversations.forEach(userConvos => {
        userConvos.conversations.forEach(convo => {
          const conversation = {
            from_user_id: userConvos.user_id,
            from_user_name: userConvos.username,
            from_user_initial: userConvos.username ? userConvos.username[0] : '',
            message: convo.last_message,
            sent_at: convo.last_message_timestamp
          };
          
          if (userConvos.username?.startsWith('Invited-')) {
            invited.push(conversation);
          } else {
            regular.push(conversation);
          }
        });
      });

      const sortByDate = (a, b) => {
        const dateA = new Date(a.sent_at).getTime();
        const dateB = new Date(b.sent_at).getTime();
        return dateB - dateA;
      };

      setRegularConversations(regular.sort(sortByDate));
      setInvitedConversations(invited.sort(sortByDate));
    }
  }, [mappedConversations]);

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

  const handleStartConversation = (contactId) => {
    navigate(`/message/conversation/${contactId}`);
    setOpenContactDialog(false);
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
              <SplittrLogo />
            </Typography>
            <Typography component="h1" variant="h6" noWrap className={classes.title}>
              Welcome, {store.userInfo?.name || 'User'}!
            </Typography>

            <IconButton color="inherit">
              <LogoutButton />
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
            <Grid container spacing={2} className={classes.contactGrid}>
              {loading ? (
                <Typography variant="body1" align="center" style={{ marginTop: '2rem' }}>
                  Loading conversations...
                </Typography>
              ) : error ? (
                <Typography variant="body1" align="center" style={{ marginTop: '2rem' }}>
                  Error: {error}
                </Typography>
              ) : (
                <>
                  {regularConversations.length > 0 && (
                    <>
                      <Typography variant="h6" className={classes.categoryTitle}>
                        Active Conversations
                      </Typography>
                      {regularConversations.map((conversation, index) => (
                        <MessageCard
                          key={`regular-${conversation.from_user_id}-${index}`}
                          message={conversation}
                        />
                      ))}
                    </>
                  )}
                  
                  {invitedConversations.length > 0 && (
                    <>
                      {regularConversations.length > 0 && <Divider className={classes.categoryDivider} />}
                      <Typography variant="h6" className={classes.categoryTitle}>
                        Pending Invitations
                      </Typography>
                      {invitedConversations.map((conversation, index) => (
                        <MessageCard
                          key={`invited-${conversation.from_user_id}-${index}`}
                          message={conversation}
                        />
                      ))}
                    </>
                  )}
                  
                  {regularConversations.length === 0 && invitedConversations.length === 0 && !loading && !error && (
                    <Typography variant="body1" align="center" style={{ marginTop: '2rem' }}>
                      No conversations found. Start a conversation using the + button.
                    </Typography>
                  )}
                </>
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
                <Avatar className={classes.avatar}>{contact.contact_initial}</Avatar>
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
                <Avatar className={classes.avatar}>{contact.contact_initial}</Avatar>
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
      </div>
    </ThemeProvider>
  );
}