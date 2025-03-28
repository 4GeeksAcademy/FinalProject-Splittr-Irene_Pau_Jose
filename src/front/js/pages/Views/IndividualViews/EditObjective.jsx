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

export default function EditObjective() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const user_id = sessionStorage.getItem("user_id")
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
 
  const handleChange = (event) => {
    setSingleObjective({...singleObjective, [event.target.name]: event.target.value})
  };
  const { store, actions } = useContext(Context);
  const { objectiveid } = useParams();
  const[singleObjective, setSingleObjective]= useState({});

  useEffect(()=>{

    getInfoSharedObjective(setSingleObjective, objectiveid)
  },[])
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
          <List><MainListItems user={store.userInfo}/></List>
          <Divider />
          <List><SecondaryListItems user={store.userInfo} /></List>
        </Drawer>
        <Box
          sx={{
            width: "50%",
            padding: "0 16px",
            marginTop: "80px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",

          }}
        >
          <Box sx={{ marginBottom: "20px" }}>
            <h3>Modify Objective</h3>


            <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                id="outlined-textarea"
                variant="outlined"
                fullWidth
                placeholder="Current name"
                value={singleObjective.name}
                onChange={handleChange}
                name='name'

              />{objectiveid.name}
              <Box sx={{ marginLeft: "40px" }}>
              <Button onClick={() => handleUpdate("name")}>Change</Button>
              </Box>
            </Box>
            <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                id="outlined-textarea"
                variant="outlined"
                fullWidth
                placeholder="Current amount"
                value={singleObjective.target_amount}
                onChange={handleChange}
                name='target_amount'
              />
              <Box sx={{ marginLeft: "40px" }}>
                <Button onClick={() => handleUpdate("target_amount")}>Change</Button>
              </Box>
              
            </Box>            
            <Box sx={{ marginBottom: "20px", marginTop: "60px", display: "flex", justifyContent: "center", gap: 2 }}>
              
              <Button variant="outlined" color="secondary" onClick={handleDelete} >Delete Objective</Button>
            </Box>



          </Box>
        </Box>



      </div>
    </ThemeProvider>
  );
}

