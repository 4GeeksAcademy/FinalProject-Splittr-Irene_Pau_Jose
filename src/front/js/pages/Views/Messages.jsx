import React from 'react';
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
import { secondaryListItems } from '../Dashboard/listitems.jsx';
import Chart from '../Dashboard/Chart.jsx';
import Deposits from '../Dashboard/Deposits.jsx';
import Orders from '../Dashboard/Orders.jsx';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { Link as MuiLink } from "@material-ui/core";
import { Home } from '../Home.jsx';
import ContactCard from './IndividualViews/ContactCard.jsx';

import StarIcon from '@material-ui/icons/Star';
import MailIcon from '@material-ui/icons/Mail';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import MessageCard from './IndividualViews/MessageCard.jsx';

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

const useStyles = makeStyles((theme) => {
  const appBarCommon = {
    backgroundColor: '#000000',
    color: theme.palette.text.primary,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  };

  const drawerCommon = {
    position: 'relative',
    whiteSpace: 'nowrap',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    top: 30,
  };

  const responsiveText = {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.875rem',
    },
  };

  const responsiveIcon = {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    },
  };

  const responsiveInitial = {
    [theme.breakpoints.down('sm')]: {
      width: 30,
      height: 30,
      fontSize: '0.8rem',
    },
  };

  return {
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
      ...appBarCommon,
      zIndex: theme.zIndex.drawer + 1,
    },
    appBarShift: {
      ...appBarCommon,
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: { marginRight: 36 },
    menuButtonHidden: { display: 'none' },
    title: { flexGrow: 1 },
    drawerPaper: {
      ...drawerCommon,
      width: drawerWidth,
    },
    drawerPaperClose: {
      ...drawerCommon,
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
    contactGrid: {
      display: 'flex',

    },
    card: {
      display: 'flex',
      width: 500,
      minHeight: 70,
      minWidth: 250,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
      backgroundColor: '#2C2F33',
      margin: theme.spacing(0),
      borderRadius: 4,
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
      },
    },
    iconButton: {
      color: '#ffffff',
      padding: theme.spacing(0.5),
      ...responsiveIcon,
    },
    name: {
      display: 'flex',
      alignItems: 'center',
      color: '#ffffff',
      flexGrow: 1,
      ...responsiveText,
    },
    initial: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: '#6c63ff',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      marginRight: theme.spacing(1),
      ...responsiveInitial,
    },
    container: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(4),
      display: 'flex',
      justifyContent: 'center',



    },
    contactGrid: {
      display: 'flex',
      justifyContent: 'center',


    },
  };
});


export default function Messages() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

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
          <List><MainListItems /></List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>

            <Grid container spacing={3} justifyContent="center" >
              {Array.from({ length: 6 }, (_, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} gap={3} key={i}>
                  <MessageCard />
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>

      </div>
    </ThemeProvider>
  );
}
