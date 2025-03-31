import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import { MainListItems } from '../../Dashboard/listitems.jsx';
import { SecondaryListItems } from '../../Dashboard/listitems.jsx';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { deepPurple } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getContactInfo, deleteUserContact } from '../../../component/callToApi.js';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../../store/appContext.js';
import { createMuiTheme } from '@material-ui/core/styles';
import { SplittrLogo } from '../../../component/SplittrLogo.jsx';
import LogoutButton from '../../../component/LogOutButton.jsx';

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
    [theme.breakpoints.down('sm')]: {  // Mobile styles
      paddingRight: 10,
      minHeight: 56,
    },
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {  // Extra small screens
      '&:last-child': {  // Target the welcome message specifically
        display: 'none',  // Hide welcome message on very small screens
      },
    },
  },
  logoTitle: {
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem',  // Reduce logo size on mobile
    },
  },
  menuButton: {
    marginRight: 36,
    [theme.breakpoints.down('sm')]: {
      marginRight: 12,  // Reduce spacing on mobile
    },
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
  menuButtonHidden: { display: 'none' },
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
  appBarSpacer: {
    minHeight: theme.spacing(4),
  },
  container: {
    paddingTop: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: 'calc(100vh - 70px)', // Adjust height for AppBar
    marginTop: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    overflow: 'auto',
    width: '100%',
  },
  card: {
    width: "20%", 
    maxWidth: "300px", 
    maxHeight:"400px",
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
  },
  avatar: {
    backgroundColor: deepPurple[500],
    width: 60,
    height: 60,
    fontSize: '2rem',
  },
}));

export default function SingleContact() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { store, actions } = useContext(Context);
  const [contact, setContact] = useState(null);
  const { contactid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getContactInfo(setContact, contactid);
  }, [contactid]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleDeleteClick = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteUserContact(contactid);
      alert(response.msg || "Contact deleted successfully");
      const userId = store.userInfo?.user_id;
      if (userId) {
        navigate(`/user_contacts/user/${userId}`);
      } else {
        console.error("User ID not found");
        alert("Could not navigate to contacts page");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert(error.message || "Failed to delete contact. Please try again.");
    } finally {
      setOpenDeleteDialog(false);
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
            <Typography component="h1" variant="h6" noWrap className={classes.logoTitle}>
              <SplittrLogo />
            </Typography>
            <Typography component="h1" variant="h6" noWrap className={classes.title}>
              Welcome, {store.userInfo?.name || 'User'}!
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <LogoutButton />
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
            <List><MainListItems user={store.userInfo} /></List>
            <Divider />
            <List><SecondaryListItems user={store.userInfo} /></List>
          </Drawer>
          <main className={classes.content} style={{ marginLeft: open ? drawerWidth : 64, width: '100%' }}>
            <div className={classes.appBarSpacer} />
            <div className={classes.container}>
              {contact ? (
                <Card className={classes.card} variant="outlined">
                  <CardContent style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar className={classes.avatar}>
                      {contact.contact_initial}
                    </Avatar>
                    <Typography variant="h5">{contact.contact_name}</Typography>
                    <Typography color="textSecondary">{contact.contact_email}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button color="secondary" onClick={handleDeleteClick}><CloseIcon /></Button>
                  </CardActions>
                </Card>
              ) : (
                <Typography variant="h6" color="textSecondary">Loading contact...</Typography>
              )}
            </div>
          </main>
        </div>
      </div>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete contact</DialogTitle>
        <DialogContent>Are you sure you want to delete this contact?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}