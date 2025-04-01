import React, { useState, useEffect, useContext } from 'react';
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
import { MainListItems } from '../Dashboard/listitems.jsx';
import { SecondaryListItems } from '../Dashboard/listitems.jsx';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { deepPurple } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import { useParams } from 'react-router-dom';

import { Context } from '../../store/appContext.js';
import { createMuiTheme } from '@material-ui/core/styles';
import { getContactInfo } from '../../component/callToApi.js';
import { createPayment } from '../../component/callToApi.js';
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

  container: ({ open }) => ({
    paddingTop: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    minHeight: 'calc(100vh - 70px)',
    transition: 'margin 0.3s ease',
    marginLeft: open ? drawerWidth : theme.spacing(9),
  }),
  
  card: {
    width: "40%", 
    maxWidth: "600px", 
    padding: theme.spacing(2), 
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2), 
    boxShadow: theme.shadows[4], 
    borderRadius: theme.shape.borderRadius,
    maxHeight: "50%", 
 
  },
  avatar: {
    backgroundColor: deepPurple[500],
    width: 60,
    height: 60,
    fontSize: '3rem',
  },
  paymentButton: {
    marginTop: theme.spacing(2),
    width: '30%',
  }
}));

export default function MakePayment() {

  const [open, setOpen] = React.useState(false);
  const { store } = useContext(Context);
  const { contactid } = useParams();
  const [contact, setContact] = useState(null);
  const [amount, setAmount] = useState('');
  const user_id = sessionStorage.getItem("user_id");
  const classes = useStyles({ open });



  useEffect(() => {
    getContactInfo(setContact, contactid);
  }, [contactid]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log("Current contactid:", contactid); 
    if (contactid) {
        getContactInfo(setContact, contactid);
    }
}, [contactid]);

const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

    const handlePayment = async () => {
      // Validate amount
      if (!amount || parseFloat(amount) <= 0) {
        alert('Please enter a valid amount');
        return;
      }
  
      // Validate contact exists
      if (!contact) {
        alert('No contact selected');
        return;
      }
  
      // Validate user_id exists
      if (!user_id) {
        alert('User not logged in');
        return;
      }
  
      setIsLoading(true);
      setError(null);
  
      try {
        const paymentResult = await createPayment(
          amount, 
          user_id, 
          contactid  // Using contactid directly from useParams
        );
  
        // Show success message
        alert(paymentResult.msg || 'Payment successful');
        
        // Reset amount
        setAmount('');
      } catch (error) {
        // Handle payment error
        setError(error.message || 'Payment failed');
        alert(error.message || 'Payment failed');
      } finally {
        setIsLoading(false);
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
                            Make Payment
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
          <List><MainListItems user={store.userInfo} /></List>
          <Divider />
          <List><SecondaryListItems user={store.userInfo} /></List>
        </Drawer>
      
        <div className={classes.container}>
          {contact ? (
            <Card className={classes.card} variant="outlined">
              <CardContent style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar className={classes.avatar}>
                  {contact.contact_initial}
                </Avatar>
                <Typography variant="h5">{contact.contact_name}</Typography>
                <Typography color="textSecondary">{contact.contact_email}</Typography>
                <TextField
                  label="Enter Amount"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ marginTop: '16px' }}
                  InputProps={{
                    endAdornment: '€'
                  }}
                />
              </CardContent>
              <CardActions style={{ width: '100%', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          className={classes.paymentButton}
          onClick={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Send Payment'}
        </Button>
      </CardActions>
            </Card>
          ) : (
            <Typography variant="h6" color="textSecondary">Loading contact...</Typography>
          )}
        </div>
        </div>
      </div>
    </ThemeProvider>
  );
}