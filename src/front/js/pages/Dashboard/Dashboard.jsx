import React, { useEffect, useState } from 'react';
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

import { MainListItems, SecondaryListItems } from './listitems.jsx';
import Chart from './Chart.jsx';
import Deposits from './Deposits.jsx';
import Orders from './Orders.jsx';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { useContext } from 'react';
import { Context } from '../../store/appContext.js';
import { useParams } from 'react-router-dom';
import { mapTransactions } from '../../component/callToApi.js';

import FloatingActionButtonMenu from '../../component/FloatingActionButtonMenu.jsx';
import FinancialDashboard from '../../component/FinancialDashboard.jsx';
import LogoutButton from '../../component/LogOutButton.jsx';
import { SplittrLogo } from '../../component/SplittrLogo.jsx';


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
  rIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    patoolbadding: '0 8px',
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {  
      '&:last-child': { 
        display: 'none',
      },
    },
  },
  logoTitle: {
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem',  
    },
  },
  menuButton: {
    marginRight: 36,
    [theme.breakpoints.down('sm')]: {
      marginRight: 12,  
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
    paddingBottom: theme.spacing(4)

  },
  contactGrid: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
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


export default function Dashboard() {
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
  const [user, setUser] = useState(store.userInfo);

  const [transactions, setTransactions] = useState([]);
  const { userid } = useParams();

  useEffect(() => {
    const getUser = async () => {
      const data = await actions.getUser()
      setUser(data)
      console.log(data);
    }
    getUser();
  }, [])

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
              Welcome, {user?.name}!
            </Typography>
            <IconButton color="inherit">
              <LogoutButton />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div style={{ display: 'flex', width: '100%', marginTop: 70 }}> {/* Added marginTop to account for AppBar height */}
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open}
            style={{ height: 'calc(100vh - 70px)', position: 'fixed' }} // Set fixed height accounting for AppBar
          >
            <Divider />
            <List><MainListItems user={user} /> </List>
            <Divider />
            <List><SecondaryListItems user={store.userInfo} /></List>
          </Drawer>
          <main className={classes.content} style={{ marginLeft: open ? drawerWidth : 64, width: '100%' }}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                <Grid item xs={12} style={{ display: "flex", width: "100%" }}>
                  <Paper className={fixedHeightPaper}>
                    <FinancialDashboard />
                  </Paper>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                  <Paper className={classes.paper} style={{ flexGrow: 1 }}>
                    <Orders />
                  </Paper>
                </Grid>
              </Grid>

            </Container>
            <Box classname={classes.footer}>
                <Copyright />
              </Box>
          </main>

        </div>
        <FloatingActionButtonMenu />
      </div>
    </ThemeProvider>
  );
}