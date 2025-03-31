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
import { MainListItems, SecondaryListItems } from '../Dashboard/listitems.jsx';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Context } from '../../store/appContext.js';
import { updateUser } from '../../component/callToApi.js';
import { SplittrLogo } from '../../component/SplittrLogo.jsx';
import LogoutButton from '../../component/LogOutButton.jsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

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
      h4: {
        fontSize: '2.125rem',
        '@media (max-width:600px)': {
          fontSize: '1.25rem',
        }
      },
      h6: {
        fontSize: '1rem',
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
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: 70,
    '@media (max-width:600px)': {
      padding: theme.spacing(2),
      marginTop: 56,
    }
  },
  settingsContainer: {
    width: '100%',
    maxWidth: 600,
    margin: '0 auto',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  settingsTitle: {
    marginBottom: theme.spacing(4),
    '@media (max-width:600px)': {
      marginBottom: theme.spacing(2),
    }
  },
  settingField: {
    marginBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  textField: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginBottom: 0,
      marginRight: theme.spacing(2),
    },
  },
  actionButton: {
    minWidth: 120,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

export default function Settings() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { store, actions } = useContext(Context);
  const [user, setUser] = useState(store.userInfo);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const data = await actions.getUser();
      if (data) setUser(data);
    };
    getUser();
  }, []);

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
            <IconButton
              edge="start"
              color="inherit"
              aria-label="toggle drawer"
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
        <main className={classes.content}>
          <Box className={classes.settingsContainer}>
            <Typography variant="h4" className={classes.settingsTitle}>User Settings</Typography>

            <Box className={classes.settingField}>
              <TextField
                className={classes.textField}
                label="Change Name"
                variant="outlined"
                fullWidth
                value={user?.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
              <Button
                className={classes.actionButton}
                variant="contained"
                onClick={handleUpdateUser}
                disabled={loading}
              >
                {loading ? "Updating..." : "Change"}
              </Button>
            </Box>

            <Box className={classes.settingField}>
              <TextField
                className={classes.textField}
                label="Change Email"
                variant="outlined"
                fullWidth
                value={user?.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <Button
                className={classes.actionButton}
                variant="contained"
                onClick={handleUpdateUser}
                disabled={loading}
              >
                {loading ? "Updating..." : "Change"}
              </Button>
            </Box>

            <Box className={classes.settingField}>
              <TextField
                className={classes.textField}
                label="Change Password"
                type="password"
                variant="outlined"
                fullWidth
                value={user?.password || ""}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <Button
                className={classes.actionButton}
                variant="contained"
                onClick={handleUpdateUser}
                disabled={loading}
              >
                {loading ? "Updating..." : "Change"}
              </Button>
            </Box>

            <Box className={classes.settingField}>
              <TextField
                className={classes.textField}
                label="Birthday"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={user?.birthday || ""}
                onChange={(e) => setUser({ ...user, birthday: e.target.value })}
              />
              <Button
                className={classes.actionButton}
                variant="contained"
                onClick={handleUpdateUser}
                disabled={loading}
              >
                {loading ? "Updating..." : "Change"}
              </Button>
            </Box>

            {message && (
              <Typography 
                color={message.includes("Failed") ? "error" : "primary"}
                style={{ marginTop: 16 }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </main>
      </div>
    </ThemeProvider>
  );
}