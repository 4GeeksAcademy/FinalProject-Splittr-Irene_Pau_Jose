import React from 'react';
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
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { MainListItems } from '../../Dashboard/listitems.jsx';
import { SecondaryListItems } from '../../Dashboard/listitems.jsx';
import { useMemo } from 'react';
import Button from '@material-ui/core/Button';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Card, Box } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { PieChart, Pie, Cell, Label } from "recharts";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInfoSharedObjective } from '../../../component/callToApi.js';
import { useContext } from 'react';
import { Context } from '../../../store/appContext.js';
import { formatDate } from '../../../utilities/formatDate.js';
import { getObjectiveContributions } from '../../../component/callToApi.js';
import FloatingMenuObjective from '../../../component/FloatingMenuObjective.jsx';
import LogoutButton from '../../../component/LogOutButton.jsx';
import { SplittrLogo } from '../../../component/SplittrLogo.jsx';

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
  scrollableTable: {
    maxHeight: '200px',
    overflowY: 'auto',
  },
}));

function createData(id, date, name, amount) {
  return { id, date, name, amount };
}

function preventDefault(event) {
  event.preventDefault();
}

export default function SingleObjective() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { store, actions } = useContext(Context);

  const [singleObjectiveInfo, setSingleObjectiveInfo] = useState([]);
  const [objectiveContributions, setObjectiveContributions] = useState([]);
  const { objectiveid } = useParams();
  console.log(objectiveid);


  const price = singleObjectiveInfo.target_amount
  const totalPriceEur = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);

  const groupedContributions = useMemo(() => {
    const userContributions = {};

    (objectiveContributions || []).forEach((contribution) => {
      if (userContributions[contribution.user_name]) {
        userContributions[contribution.user_name] += contribution.amount_contributed;
      } else {
        userContributions[contribution.user_name] = contribution.amount_contributed;
      }
    });

    return Object.keys(userContributions)
      .map((userName) => ({
        user_name: userName,
        total_contributed: userContributions[userName],
      }))
      .sort((a, b) => b.total_contributed - a.total_contributed);
  }, [objectiveContributions]);

  useEffect(() => {
    getObjectiveContributions(setObjectiveContributions, objectiveid);
    getInfoSharedObjective(setSingleObjectiveInfo, objectiveid);
  }, [objectiveid]);


  const totalAmount = singleObjectiveInfo.target_amount || 0;
  const contributedAmount = singleObjectiveInfo.total_contributed || 0;
  const remainingAmount = singleObjectiveInfo.remaining_amount || totalAmount;

  const percentageCompleted =
    totalAmount > 0 ? ((contributedAmount / totalAmount) * 100).toFixed(1) : 0;



  const totalAmountFormatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(totalAmount);

  const remainingAmountFormatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(remainingAmount);

  const contributedAmountFormatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(contributedAmount);


  const pieData = [
    { name: "Completed", value: contributedAmount, fill: "#6a89cc" },
    { name: "Remaining", value: remainingAmount, fill: "#2C2F33" },
  ];


  const sortedContributions = useMemo(() =>
    [...objectiveContributions].sort((a, b) => new Date(b.contributed_at) - new Date(a.contributed_at)), [objectiveContributions]
  );

  const [currentPage, setCurrentPage] = useState(0);
  const recentContributionsPerPage = 4;
  const totalPages = Math.ceil(sortedContributions.length / recentContributionsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : 0));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 >= 0 ? prev - 1 : totalPages - 1));
  };

  const paginatedContributions = sortedContributions.slice(
    currentPage * recentContributionsPerPage,
    (currentPage + 1) * recentContributionsPerPage
  );

  const [groupedCurrentPage, setGroupedCurrentPage] = useState(0);
  const contributionsPerPage = 4;
  const groupedTotalPages = Math.ceil(groupedContributions.length / contributionsPerPage);

  const handleNextGroupedPage = () => {
    setGroupedCurrentPage((prev) => (prev + 1 < groupedTotalPages ? prev + 1 : 0));
  };

  const handlePrevGroupedPage = () => {
    setGroupedCurrentPage((prev) => (prev - 1 >= 0 ? prev - 1 : groupedTotalPages - 1));
  };

  const paginatedGroupedContributions = groupedContributions.slice(
    groupedCurrentPage * contributionsPerPage,
    (groupedCurrentPage + 1) * contributionsPerPage
  );
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
            <Container maxWidth="lg" className={classes.container} style={{ overflow: 'visible' }}>
              <Card style={{ backgroundColor: "#2C2F33", color: "#fff", padding: 16, textAlign: "center", borderRadius: 10, width: "700px", minWidth: "250px" }}>
                <div className="title" style={{ display: "flex", alignItems: "center" }}>
                  <Link href={`/objective/update/${singleObjectiveInfo.id}`}>
                    <IconButton>
                      <Edit style={{ color: "#fff" }} />
                    </IconButton>
                  </Link>
                  <Typography variant="h6" style={{ marginLeft: 5 }}> {singleObjectiveInfo.name} </Typography>
                </div>
                <Box display="flex" justifyContent="space-around" gap={2}>
                  <Box width={120} alignContent="center" >
                    <Typography variant="body2" style={{ marginTop: 10 }}>Total: {totalPriceEur}</Typography>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <PieChart width={150} height={150}>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          innerRadius={50}
                          outerRadius={60}
                          startAngle={90}
                          endAngle={-270}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                          <Label
                            value={`${percentageCompleted}%`}
                            position="center"
                            fill="white"
                            fontSize={18}
                            fontWeight="bold"
                          />
                        </Pie>
                      </PieChart>
                    </Box>
                    <Typography variant="body2" style={{ marginTop: 30 }}>Description: </Typography>
                    <Typography variant="body2" style={{ marginTop: 30 }}>Already contributed: {contributedAmountFormatted} </Typography>

                    <Typography variant="body2" style={{ marginTop: 30 }}>Created at: {formatDate(singleObjectiveInfo.created_at)} </Typography>
                  </Box>
                  <Box display="block" justifyContent="center" alignItems="center"  >
                    <Typography gap={2}>Recent Contributions</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedContributions.map((contribution, index) => (
                            <TableRow key={index}>
                              <TableCell>{formatDate(contribution.contributed_at)}</TableCell>
                              <TableCell>{contribution.user_name}</TableCell>
                              <TableCell align="right">
                                {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(contribution.amount_contributed)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box display="flex" justifyContent="center" alignItems="center" marginTop={2}>
                      <Button onClick={handlePrevPage} variant="outlined" style={{ marginRight: 10 }}>Previous</Button>
                      <Typography>{currentPage + 1} / {totalPages}</Typography>
                      <Button onClick={handleNextPage} variant="outlined" style={{ marginLeft: 10 }}>Next</Button>
                    </Box>
                    <Typography variant="body2" style={{ marginTop: 30 }}>Already contributed:</Typography>

                    <Table size="small" style={{ marginTop: '16px' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Total amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedGroupedContributions.map((contribution, index) => (
                          <TableRow key={contribution.id || index}>
                            <TableCell>{contribution.user_name}</TableCell>
                            <TableCell align="right">
                              {new Intl.NumberFormat("de-DE", {
                                style: "currency",
                                currency: "EUR",
                              }).format(contribution.total_contributed)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {groupedContributions.length > contributionsPerPage && (
                      <Box display="flex" justifyContent="center" alignItems="center" marginTop={2}>
                        <Button onClick={handlePrevGroupedPage} variant="outlined" style={{ marginRight: 10 }}>Previous</Button>
                        <Typography>{groupedCurrentPage + 1} / {groupedTotalPages}</Typography>
                        <Button onClick={handleNextGroupedPage} variant="outlined" style={{ marginLeft: 10 }}>Next</Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Card>
              <FloatingMenuObjective objectiveid={objectiveid} />
            </Container>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}