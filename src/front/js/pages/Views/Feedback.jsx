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

import { Link as MuiLink } from "@material-ui/core";
import { Home } from '../Home.jsx';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { Context } from '../../store/appContext.js';
import { submitFeedback } from '../../component/callToApi.js';


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
    paddingBottom: theme.spacing(4)

  },
  contactGrid: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}));

export default function Feedback() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const { store, actions } = useContext(Context);
  const [user, setUser] = useState(store.userInfo);
  const updatedData = { email: user.email};
  
    useEffect(() => {
      const getUser = async () => {
          const data = await actions.getUser();
          if (data) setUser(data); 
      };
      getUser();
  }, []);

  const handleSendFeedback = async () => {
    const email = document.getElementById("feedback-email").value;
    const message = document.getElementById("feedback-message").value;

    if (!email || !message) {
      alert("Please fill in both fields.");
      return;
    }

    const response = await submitFeedback(email, message);

    if (response.msg) {
      alert("Feedback sent successfully!");
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
            {/* Show MenuIcon when the drawer is closed */}
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

            {/* Show ChevronLeftIcon when the drawer is open */}
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
              Welcome, Pepito!
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
        <Box
          sx={{
            width: "100%",
            maxWidth: "600px",
            padding: "0 16px",
            marginTop: "80px",
            margin: "0 auto",
          }}
        >
          <Box sx={{ marginBottom: "20px" }}>
            <h3>We'd love to hear from you!</h3>
            <TextField id="feedback-email" label="Email" variant="outlined" fullWidth value={user?.email || ""} onChange={(e) => setUser({ ...user, email: e.target.value })} />
          </Box>

          <Box sx={{ marginBottom: "20px" }}>
            <TextField
              id="feedback-message"
              label="Feedback"
              variant="outlined"
              multiline
              rows={8}
              fullWidth
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSendFeedback}
          >
            Send
          </Button>
        </Box>

      </div>
    </ThemeProvider>
  );
}

