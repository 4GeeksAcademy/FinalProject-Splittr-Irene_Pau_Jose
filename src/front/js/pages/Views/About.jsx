import React, { useState, useContext } from 'react';
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
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { MainListItems, SecondaryListItems } from '../Dashboard/listitems.jsx';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Context } from '../../store/appContext.js';
import { SplittrLogo } from '../../component/SplittrLogo.jsx';
import LogoutButton from '../../component/LogOutButton.jsx';

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
  appBarSpacer: {
    minHeight: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
    overflow: 'auto',
    width: '100%',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
  },
  aboutTitle: {
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    paddingBottom: theme.spacing(1),
  },
  featureList: {
    paddingLeft: theme.spacing(2),
  },
  featureItem: {
    marginBottom: theme.spacing(1),
  },
  creatorsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: theme.spacing(3),
  },
  creatorCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    backgroundColor: theme.palette.grey[700],
    marginBottom: theme.spacing(1),
    fontSize: '1.5rem',
  },
  creatorName: {
    marginTop: theme.spacing(1),
    marginBottom: 0,
  },
  creatorRole: {
    color: theme.palette.text.secondary,
  },
}));

export default function About() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const { store, actions } = useContext(Context);

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
              Welcome, {store.userInfo?.name || 'User'}!
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
          <main className={classes.content} style={{ marginLeft: open ? drawerWidth : 64, width: '100%' }}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Typography component="h1" variant="h4" className={classes.aboutTitle}>
                About Splittr
              </Typography>

              <Paper className={classes.paper}>
                <Typography variant="h6" className={classes.sectionTitle}>
                  Our Mission
                </Typography>
                <Typography variant="body1" paragraph>
                  Splittr was born from a simple idea: make sharing expenses with friends, family, and colleagues
                  as easy and stress-free as possible. We believe that money matters shouldn't get in the way of
                  relationships, which is why we've created a comprehensive platform that helps you manage shared
                  expenses effortlessly.
                </Typography>
              </Paper>

              <Paper className={classes.paper}>
                <Typography variant="h6" className={classes.sectionTitle}>
                  Key Features
                </Typography>
                <ul className={classes.featureList}>
                  <li className={classes.featureItem}>
                    <Typography variant="body1">
                      <strong>Split Bills Effortlessly</strong> - Divide expenses equally or customize splits based on individual contributions.
                    </Typography>
                  </li>
                  <li className={classes.featureItem}>
                    <Typography variant="body1">
                      <strong>Direct Payments</strong> - Send and receive payments directly through the app between users in your contacts.
                    </Typography>
                  </li>
                  <li className={classes.featureItem}>
                    <Typography variant="body1">
                      <strong>Create and Manage Groups</strong> - Organize expenses by creating groups for roommates, trips, events, or any shared spending situation.
                    </Typography>
                  </li>
                  <li className={classes.featureItem}>
                    <Typography variant="body1">
                      <strong>Set Shared Objectives</strong> - Create financial goals with friends and track progress towards them together.
                    </Typography>
                  </li>
                  <li className={classes.featureItem}>
                    <Typography variant="body1">
                      <strong>Expense History</strong> - Keep track of all shared expenses and payments in one place.
                    </Typography>
                  </li>
                </ul>
              </Paper>

              <Paper className={classes.paper}>
                <Typography variant="h6" className={classes.sectionTitle}>
                  The Team Behind Splittr
                </Typography>
                <Typography variant="body1" paragraph>
                  Splittr was created by two passionate developers committed to solving everyday financial challenges through technology.
                </Typography>

                <div className={classes.creatorsContainer}>
                  <div className={classes.creatorCard}>
                    <Avatar className={classes.avatar}>JR</Avatar>
                    <Typography variant="h6" className={classes.creatorName}>
                      José Riobó Cicero
                    </Typography>
                    <Typography variant="body2" className={classes.creatorRole}>
                      Co-Founder & Lead Developer
                    </Typography>
                  </div>

                  <div className={classes.creatorCard}>
                    <Avatar className={classes.avatar}>IB</Avatar>
                    <Typography variant="h6" className={classes.creatorName}>
                      Irene Batlle Mola
                    </Typography>
                    <Typography variant="body2" className={classes.creatorRole}>
                      Co-Founder & UX Designer
                    </Typography>
                  </div>
                </div>
              </Paper>

              <Box pt={4}>
                <Copyright />
              </Box>
            </Container>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}