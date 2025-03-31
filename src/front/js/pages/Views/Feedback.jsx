import React, { useState, useEffect, useContext } from 'react';
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
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { MainListItems, SecondaryListItems } from '../Dashboard/listitems.jsx';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Context } from '../../store/appContext.js';
import { submitFeedback } from '../../component/callToApi.js';
import { SplittrLogo } from '../../component/SplittrLogo.jsx';
import LogoutButton from '../../component/LogOutButton.jsx';

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
    MuiTypography: { 
      root: { color: '#ffffff' },
      h6: {
        fontSize: '1.25rem',
        '@media (max-width:600px)': {
          fontSize: '1rem',
        }
      }
    },
    MuiIconButton: { root: { color: '#ffffff !important' } },
  },
});

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: { display: 'flex' },
  toolbar: {
    paddingRight: 20,
    minHeight: 70,
    '@media (max-width:600px)': {
      minHeight: 56,
    }
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
  title: { 
    flexGrow: 1,
    '@media (max-width:960px)': {
      display: 'none' // Hide welcome message on smaller screens
    }
  },
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
  feedbackContainer: {
    width: '100%',
    maxWidth: 600,
    padding: theme.spacing(3),
    marginTop: 70,
    marginLeft: 'auto',
    marginRight: 'auto',
    '@media (max-width:600px)': {
      padding: theme.spacing(2),
      marginTop: 56,
    }
  },
  feedbackTitle: {
    marginBottom: theme.spacing(4),
    fontSize: '1.5rem',
    '@media (max-width:600px)': {
      fontSize: '1.25rem',
      marginBottom: theme.spacing(2),
    }
  },
  inputField: {
    marginBottom: theme.spacing(3),
    '@media (max-width:600px)': {
      marginBottom: theme.spacing(2),
    }
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: '100%',
    '@media (min-width:600px)': {
      width: 'auto',
    }
  }
}));

export default function Feedback() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { store, actions } = useContext(Context);
  const [user, setUser] = useState(store.userInfo);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const data = await actions.getUser();
      if (data) setUser(data);
    };
    getUser();
  }, []);

  const handleSendFeedback = async () => {
    const email = user?.email || '';
    const feedbackMessage = message.trim();

    if (!email || !feedbackMessage) {
      alert("Please fill in both fields.");
      return;
    }

    const response = await submitFeedback(email, feedbackMessage);

    if (response.msg) {
      alert("Feedback sent successfully!");
      setMessage('');
    } else {
      alert("Error sending feedback.");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label={open ? "close drawer" : "open drawer"}
              onClick={() => setOpen(!open)}
              className={classes.menuButton}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
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
        <main className={classes.feedbackContainer}>
          <Typography variant="h4" className={classes.feedbackTitle}>
            We'd love to hear from you!
          </Typography>
          
          <div className={classes.inputField}>
            <TextField
              id="feedback-email"
              label="Email"
              variant="outlined"
              fullWidth
              value={user?.email || ""}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          <div className={classes.inputField}>
            <TextField
              id="feedback-message"
              label="Your Feedback"
              variant="outlined"
              multiline
              rows={6}
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button
            className={classes.submitButton}
            variant="contained"
            color="primary"
            onClick={handleSendFeedback}
          >
            Send Feedback
          </Button>
        </main>
      </div>
    </ThemeProvider>
  );
}