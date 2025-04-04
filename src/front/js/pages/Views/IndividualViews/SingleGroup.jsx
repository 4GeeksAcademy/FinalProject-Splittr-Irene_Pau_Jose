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
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { MainListItems } from '../../Dashboard/listitems.jsx';
import { SecondaryListItems } from '../../Dashboard/listitems.jsx';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Card, Avatar } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { PieChart, Pie } from "recharts";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { getGroupDebts, getInfoGroup } from '../../../component/callToApi.js';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../../store/appContext.js';
import { formatDate } from '../../../utilities/formatDate.js';
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
    display: 'flex',
    justifyContent: 'center',
    width: 'auto',
    marginTop: "40px",
  },
  contactGrid: {
    display: 'flex',
  },
}));

function preventDefault(event) {
  event.preventDefault();
}

export default function SingleGroup() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { store, actions } = useContext(Context);

  const [singleGroupInfo, setSingleGroupInfo] = useState([]);
  const [groupDebts, setGroupDebts] = useState([]);
  const { groupid } = useParams();

  const price = singleGroupInfo.total_amount;
  const totalPriceEur = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);

  useEffect(() => {
    getInfoGroup(setSingleGroupInfo, groupid);
    getGroupDebts(setGroupDebts, groupid);
  }, [groupid]);


  const participants = singleGroupInfo.members || [];
  const visibleParticipants = participants.slice(0, 5);
  const remainingCount = Math.max(0, participants.length - 5);

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
            <Container maxWidth="lg" className={classes.container}>
              <Card style={{ backgroundColor: "#2C2F33", color: "#fff", padding: 16, textAlign: "center", borderRadius: 10, width: "700px", minWidth: "250px" }}>
                <div className="title" style={{ display: "flex", alignItems: "center" }}>
                  <Link href={`/group/update/${singleGroupInfo.group_id}`}>
                    <IconButton>
                      <Edit style={{ color: "#fff" }} />
                    </IconButton>
                  </Link>
                  <Typography variant="h6" style={{ marginLeft: 5 }}>{singleGroupInfo.group_name} </Typography>
                </div>
                <Box display="flex" justifyContent="space-around" gap={2}>
                  <Box width={120} alignContent="center" >
                    <Typography variant="body2" style={{ marginTop: 10 }}>Total: {totalPriceEur} </Typography>
                    <PieChart width={120} height={120} style={{ marginTop: 50 }}>
                      <Pie data={[{ name: "Completed", value: 70, fill: "#6a89cc" }, { name: "Remaining", value: 30, fill: "#2C2F33" }]} dataKey="value" innerRadius={40} outerRadius={50} />
                    </PieChart>
                    <Typography variant="body2" style={{ marginTop: 30 }}>Remaining amount: </Typography>
                    <Typography variant="body2" style={{ marginTop: 30 }}>Created at: {formatDate(singleGroupInfo.created_at)} </Typography>
                  </Box>
                  <Box display="block" justifyContent="center" alignItems="center" gap={3} >
                    <Typography gap={4}>Still to pay</Typography>
                    <Table size="small" style={{ marginTop: '16px' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Debtor</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Creditor</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(groupDebts) ? (
                          groupDebts.map((debt) => (
                            <TableRow key={debt.id}>
                              <TableCell>{debt.debtor_name}</TableCell>
                              <TableCell>{debt.amount}</TableCell>
                              <TableCell>{debt.creditor_name}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3}>There are no debts!</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <div className={classes.seeMore} style={{ marginTop: '16px' }} >
                      <Link color="primary" href="#" onClick={preventDefault} >
                        See more
                      </Link>
                    </div>
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1} marginTop={4}>
                      {visibleParticipants.map((participant, index) => (
                        <Avatar
                          key={participant.id || index}
                          style={{ backgroundColor: "#b19cd9", marginRight: 5 }}
                        >
                          {participant.initial || "?"}
                        </Avatar>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Container>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}