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
import Badge from '@material-ui/core/Badge';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { MainListItems, SecondaryListItems } from '../../Dashboard/listitems.jsx';
import { useParams } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useContext } from 'react';
import { Context } from '../../../store/appContext.js';
import { getInfoSharedObjective, deleteObjective, updateObjective } from '../../../component/callToApi.js';
import { useNavigate } from 'react-router-dom';
import { SplittrLogo } from '../../../component/SplittrLogo.jsx';
import LogoutButton from '../../../component/LogOutButton.jsx';

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
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
    overflow: 'auto',
    width: '100%',
  },
}));

export default function EditObjective() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const user_id = sessionStorage.getItem("user_id");
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setSingleObjective({ ...singleObjective, [event.target.name]: event.target.value });
  };
  const { store, actions } = useContext(Context);
  const { objectiveid } = useParams();
  const [singleObjective, setSingleObjective] = useState({});

  useEffect(() => {
    getInfoSharedObjective(setSingleObjective, objectiveid);
  }, []);
  console.log(singleObjective);
  const handleUpdate = async (field) => {
    try {
      const updatedData = { [field]: singleObjective[field] };
      await updateObjective(objectiveid, updatedData);
      alert("Objective updated successfully!");
    } catch (error) {
      alert("Failed to update objective.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this objective?")) {
      try {
        await deleteObjective(objectiveid);
        alert("Objective deleted successfully!");
        navigate(`/objective/user/${user_id}`);
      } catch (error) {
        alert("Failed to delete objective.");
      }
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
            <div
              style={{
                width: "50%",
                padding: "0 16px",
                marginTop: "20px", // Adjusted marginTop
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <h3>Modify Objective</h3>
                <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2 }}>
                  <TextField
                    id="outlined-textarea"
                    variant="outlined"
                    fullWidth
                    placeholder="Current name"
                    value={singleObjective.name}
                    onChange={handleChange}
                    name='name'
                  />{objectiveid.name}
                  <div style={{ marginLeft: "40px" }}>
                    <Button variant="contained" color="primary" onClick={() => handleUpdate("name")}>Change</Button>
                  </div>
                </div>
                <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2 }}>
                  <TextField
                    id="outlined-textarea"
                    variant="outlined"
                    fullWidth
                    placeholder="Current amount"
                    value={singleObjective.target_amount}
                    onChange={handleChange}
                    name='target_amount'
                  />
                  <div style={{ marginLeft: "40px" }}>
                    <Button variant="contained" color="primary" onClick={() => handleUpdate("target_amount")}>Change</Button>
                  </div>
                </div>
                <div style={{ marginBottom: "20px", marginTop: "60px", display: "flex", justifyContent: "center", gap: 2 }}>
                  <Button variant="outlined" color="secondary" onClick={handleDelete} >Delete Objective</Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}