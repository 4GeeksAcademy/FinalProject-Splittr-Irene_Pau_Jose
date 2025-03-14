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
import { mainListItems } from '../../Dashboard/listitems.jsx';
import { secondaryListItems } from '../../Dashboard/listitems.jsx';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Card, Avatar, Tooltip } from "@material-ui/core";
import { Star, Mail, Edit, Close } from "@material-ui/icons";
import { PieChart, Pie } from "recharts";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { useParams } from 'react-router-dom';
import { getInfoGroup } from '../../../component/callToApi.js';

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

function createData(id, date, name, amount) {
  return { id, date, name, amount };
}

const rows = [
  createData(0,'Elvis Presley', 312.44),
  createData(1,'Paul McCartney', 866.99),
  createData(2,'Tom Scholz', 100.81),
  createData(3,'Michael Jackson', 654.39),
  createData(4,'Bruce Springsteen', 212.79),
];

function preventDefault(event) {
  event.preventDefault();
}

export default function SingleGroup() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const[singleGroupInfo, setSingleGroupInfo] = useState([]);
  const { idgroup } = useParams();
  console.log(singleGroupInfo);
  
  const precio = singleGroupInfo.total_amount
    const totalPrecioEur = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
    }).format(precio);

  useEffect(()=>{
    getInfoGroup(setSingleGroupInfo, idgroup);
  }, [])

  
  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
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
          <List>{mainListItems}</List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>

        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>


          <Card style={{ backgroundColor: "#2C2F33", color: "#fff", padding: 16, textAlign: "center", borderRadius: 10, width: "700px", minWidth: "250px" }}>
            <div className="title" style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Favorite">
                <IconButton>
                  <Star style={{ color: "#fff" }} />
                </IconButton>
              </Tooltip>
              <Typography variant="h6" style={{ marginLeft: 5 }}>{singleGroupInfo.name} </Typography>
            </div>
            <Box display="flex" justifyContent="space-around" gap={2}>
              <Box width={120} alignContent="center" >
                <Typography variant="body2" style={{ marginTop: 10 }}>Total: {totalPrecioEur} </Typography>
                <PieChart width={120} height={120} style={{ marginTop: 50 }}>
                  <Pie data={[{ name: "Completed", value: 70, fill: "#6a89cc" }, { name: "Remaining", value: 30, fill: "#2C2F33" }]} dataKey="value" innerRadius={40} outerRadius={50} />
                </PieChart>
                <Typography variant="body2" style={{ marginTop: 30 }}>Remaining amount: </Typography>
                <Typography variant="body2" style={{ marginTop: 30 }}>Created at: {singleGroupInfo.created_at} </Typography>
              </Box>
              <Box display="block" justifyContent="center" alignItems="center" gap={3} >
                <Typography gap={4}>Still to pay</Typography>
                <Table size="small" style={{ marginTop: '16px' }}>
                  <TableHead >
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell align="right">{row.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className={classes.seeMore} style={{ marginTop: '16px' }} >
                  <Link color="primary" href="#" onClick={preventDefault} >
                    See more 
                  </Link>
                </div>
                <Box display="flex" justifyContent="center" alignItems="center" gap={1} marginTop={4}>
                  <Avatar style={{ backgroundColor: "#b19cd9", marginRight: 5 }}>P</Avatar>
                  <Avatar style={{ backgroundColor: "#b19cd9", marginRight: 5 }}>P</Avatar>
                  <Avatar style={{ backgroundColor: "#b19cd9", marginRight: 5 }}>P</Avatar>

                  <Typography>+4 more</Typography>
                </Box>
              </Box>
            </Box>

            <Box display="flex" justifyContent="center" marginTop={2}>
              <Tooltip title="Edit"><IconButton><Edit style={{ color: "#fff" }} /></IconButton></Tooltip>
              <Tooltip title="Delete"><IconButton><Close style={{ color: "#ff4d4d" }} /></IconButton></Tooltip>
            </Box>
          </Card>

        </Container>

      </div>
    </ThemeProvider>
  );
};
