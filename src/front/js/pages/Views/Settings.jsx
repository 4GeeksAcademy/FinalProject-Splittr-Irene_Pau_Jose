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
import { MainListItems, SecondaryListItems } from '../Dashboard/listitems.jsx';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { Home } from '../Home.jsx';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Context } from '../../store/appContext.js';
import { updateUser } from '../../component/callToApi.js';
import { useParams } from 'react-router-dom';

// Copyright component
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

// Dark theme configuration
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

// Styles
const useStyles = makeStyles((theme) => ({
  root: { display: 'flex' },
  toolbar: {
    paddingRight: 20,
    minHeight: 70,
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
    marginLeft: 240,
    width: `calc(100% - 240px)`,
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
    width: 240,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    top: 30,
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(4),
  },
}));

export default function Settings() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [state, setState] = useState({ Language: 'English' });

  // Added missing states to fix the error
  const { store, actions } = useContext(Context);
  const [user, setUser] = useState(store.userInfo);
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState(""); 
  const updatedData = { birthday: user.birthday };
  
  useEffect(() => {
    const getUser = async () => {
        const data = await actions.getUser();
        if (data) setUser(data); 
    };
    getUser();
}, []);

  console.log(user);

  const handleUpdateUser = async () => {
    setLoading(true);
    setMessage("");

    const updatedData = {
        name: user.name,
        email: user.email,
        password: user.password,
        birthday: user.birthday
    };

    const result = await updateUser(updatedData, store.token);  

    if (result.error) {
        setMessage("Failed to update user");
    } else {
        setMessage("User updated successfully!");
        actions.getUser();  
    }

    setLoading(false);
};

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton edge="start" color="inherit" aria-label="toggle drawer" onClick={() => setOpen(!open)} className={classes.menuButton}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
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
        <Drawer variant="permanent" classes={{ paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose) }} open={open}>
          <Divider />
          <List><MainListItems user={store.userInfo} /></List>
          <Divider />
          <List><SecondaryListItems user={store.userInfo} /></List>
        </Drawer>


        <Box sx={{ width: "50%", padding: "0 16px", marginTop: "80px", margin: "0 auto", display: "flex", flexDirection: "column" }}>
          <h3>Settings</h3>
          <h5>User</h5>

          <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              label="Change Name"
              variant="outlined"
              fullWidth
              value={user?.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            <Box sx={{ marginLeft: "40px" }}>
              <Button onClick={handleUpdateUser} disabled={loading}>
                {loading ? "Updating..." : "Change"}
              </Button>
            </Box>
          </Box>

          <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2 }}>
            <TextField label="Change email" variant="outlined" fullWidth value={user?.email || ""} onChange={(e) => setUser({ ...user, email: e.target.value })} />
            <Box sx={{ marginLeft: "40px" }}>
              <Button onClick={handleUpdateUser} disabled={loading}>
                {loading ? "Updating..." : "Change"}
              </Button>
            </Box>
          </Box>

          <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              label="Change Password"
              type="password"
              variant="outlined"
              fullWidth
              value={user?.password || ""}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <Box sx={{ marginLeft: "40px" }}>
              <Button onClick={handleUpdateUser} disabled={loading}>
                {loading ? "Updating..." : "Change"}
              </Button>
            </Box>
          </Box>

          <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              label="Birthday"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={user?.birthday || ""}
              onChange={(e) => setUser({ ...user, birthday: e.target.value })}
            />
            <Box sx={{ marginLeft: "40px" }}>
              <Button onClick={handleUpdateUser} disabled={loading}>
                {loading ? "Updating..." : "Change"}
              </Button>
            </Box>
          </Box>

          {message && <Typography color={message.includes("Failed") ? "error" : "primary"}>{message}</Typography>}
        </Box>
      </div>
    </ThemeProvider>
  );
}
