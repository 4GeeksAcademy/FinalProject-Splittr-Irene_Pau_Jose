import React, { useState, useEffect } from 'react';
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
import Chart from '../Dashboard/Chart.jsx';
import Deposits from '../Dashboard/Deposits.jsx';
import Orders from '../Dashboard/Orders.jsx';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import ContactCard from './IndividualViews/ContactCard.jsx';
import { Link as MuiLink } from "@material-ui/core";
import { Home } from '../Home.jsx';

import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../store/appContext.js';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { mapContacts, addUserContactByEmail, sendInvitation } from '../../component/callToApi.js';
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

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Splittr
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
  
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: { width: theme.spacing(9) },
   
  },

  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(4),
  },
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contactGrid: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
   
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
  footer: {
    padding: theme.spacing(2),
    textAlign: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  }
}));

export default function ListOfContacts() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const { store, actions } = useContext(Context);

  const [contacts, setContacts] = useState([]);
  const [regularContacts, setRegularContacts] = useState([]);
  const [invitedContacts, setInvitedContacts] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [invitationDialog, setInvitationDialog] = useState(false);
  const [invitationEmail, setInvitationEmail] = useState('');

  const { userid } = useParams();

  useEffect(() => {
    let isMounted = true;
    const fetchContacts = async () => {
      await mapContacts(setContacts, userid);
    };

    if (isMounted) {
      fetchContacts();
    }

    return () => {
      isMounted = false;
    };
  }, []);

 
  useEffect(() => {
    if (contacts?.contacts && Array.isArray(contacts.contacts)) {
      console.log("Original contacts:", contacts.contacts);
      
 
      const regular = contacts.contacts.filter(contact => 
        !contact.contact_name?.startsWith('Invited-')
      );
      
      const invited = contacts.contacts.filter(contact => 
        contact.contact_name?.startsWith('Invited-')
      );
      
      console.log("Regular contacts before sort:", regular);
      console.log("Invited contacts before sort:", invited);
      
     
      regular.sort((a, b) => {
        const nameA = a.contact_name?.toUpperCase() || '';
        const nameB = b.contact_name?.toUpperCase() || '';
        return nameA.localeCompare(nameB);
      });
      
    
      invited.sort((a, b) => {
        const nameA = a.contact_name?.toUpperCase() || '';
        const nameB = b.contact_name?.toUpperCase() || '';
        return nameA.localeCompare(nameB);
      });
      
      console.log("Regular contacts after sort:", regular);
      console.log("Invited contacts after sort:", invited);
      
      setRegularContacts(regular);
      setInvitedContacts(invited);
    }
  }, [contacts]);

  const handleSendInvitation = async () => {
    try {
      const response = await sendInvitation(invitationEmail);
      if (response.msg === "Invitation sent successfully") {
        alert("Invitation sent successfully!");
     
        setInvitationDialog(false);
        setOpenAddDialog(false);
        setInvitationEmail("");
        setEmail("");

        await mapContacts(setContacts, userid);
      } else {
        alert(response.msg || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("Failed to send invitation. Please try again.");
    }
  };

  const handleAddContact = async () => {
    console.log('Adding contact with email:', email);

    try {
      const response = await addUserContactByEmail(email);
      console.log("Response from API:", response);

      if (response.msg === "Contact added successfully") {
        await mapContacts(setContacts, userid);
        alert("The contact was successfully added to your contact list!");
        setEmail("");
        setOpenAddDialog(false);
      } else if (response.msg === "Contact not found") {
        
        setInvitationEmail(email);
        setOpenAddDialog(false);
        setInvitationDialog(true);
      } else if (response.msg === "User is already a contact") {
        alert("This contact is already in your list of contacts.");
      } else if (response.msg === "A user cannot add themselves as a contact") {
        alert("You cannot add yourself as a contact.");
      } else {
        alert(response.msg || "There was a problem adding this contact.");
      }
    } catch (error) {
      console.error("There was a problem adding this contact:", error);
      alert("There was a problem adding this contact. Try again.");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={clsx(classes.appBar, open && classes.appBarShift)}>
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
        <div style={{ display: 'flex', width: '100%', marginTop: 70 }}>
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open}
            style={{ height: 'calc(100vh - 70px)', position: 'fixed' }}
          >
            <Divider />
            <List>
              <MainListItems user={store.userInfo} />
            </List>
            <Divider />
            <List>
              <SecondaryListItems user={store.userInfo} />
            </List>
          </Drawer>
          <main className={classes.content} style={{ marginLeft: open ? drawerWidth : 64, width: '100%' }}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3} className={classes.contactGrid}>
                {regularContacts.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" className={classes.categoryTitle}>
                      Contacts
                    </Typography>
                    <Paper className={classes.paper} >
                      {regularContacts.map((contact) => (
                        <ContactCard key={contact.id} contact={contact} />
                      ))}
                    </Paper>
                  </Grid>
                )}
                
                {invitedContacts.length > 0 && (
                  <Grid item xs={12}>
                    {regularContacts.length > 0 && <Divider className={classes.categoryDivider} />}
                    <Typography variant="h6" className={classes.categoryTitle}>
                      Pending Invitations
                    </Typography>
                    <Paper className={classes.paper}>
                      {invitedContacts.map((contact) => (
                        <ContactCard key={contact.id} contact={contact} />
                      ))}
                    </Paper>
                  </Grid>
                )}
                
                {(!contacts || !contacts.contacts) && (
                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <Typography variant="body1" align="center">
                        Loading contacts...
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                
                {contacts && contacts.contacts && contacts.contacts.length === 0 && (
                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <Typography variant="body1" align="center">
                        No contacts found. Add a contact using the + button.
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
              <Box className={classes.footer}>
    <Copyright />
  </Box>
            </Container>
          </main>
        </div>
        <Fab color="primary" className={classes.fabButton} onClick={() => setOpenAddDialog(true)}>
          <AddIcon />
        </Fab>


        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Add Contact</DialogTitle>
          <DialogContent>
          <TextField
  autoFocus
  margin="dense"
  id="email"
  label="Email Address"
  type="email"
  fullWidth
  variant="outlined"
  value={email}
  onChange={(e) => setEmail(e.target.value.toLowerCase())} 
/>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddContact} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={invitationDialog} onClose={() => {
          setInvitationDialog(false);
          setInvitationEmail("");
          setEmail("");
        }}>
          <DialogTitle>Invite Contact</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              This user doesn't exist in SPLTTR. Would you like to invite them to join?
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Email: {invitationEmail}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setInvitationDialog(false);
              setInvitationEmail("");
              setEmail("");
            }} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSendInvitation} color="primary">
              Send Invitation
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}