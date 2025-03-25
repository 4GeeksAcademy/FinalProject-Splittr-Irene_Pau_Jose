import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import { MainListItems } from '../../Dashboard/listitems.jsx';
import { SecondaryListItems } from '../../Dashboard/listitems.jsx';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { deepPurple } from '@material-ui/core/colors';
import MailIcon from '@material-ui/icons/Mail';
import CloseIcon from '@material-ui/icons/Close';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getContactInfo } from '../../../component/callToApi.js';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../../store/appContext.js';
import { createMuiTheme } from '@material-ui/core/styles';


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
  },
);


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: { display: 'flex' },
  toolbar: { paddingRight: 20, minHeight: 70 },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: { marginRight: 36 },
  title: { flexGrow: 1 },
  drawerPaper: { width: drawerWidth, transition: theme.transitions.create('width') },
  drawerPaperClose: {
    overflowX: 'hidden',
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: { width: theme.spacing(9) },
  },
  container: {
    paddingTop: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100vh',
  },
  card: {
    width: "30%", 
    maxWidth: "500px", 
    padding: theme.spacing(0.5),
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(0.5), 
    boxShadow: theme.shadows[2], 
    borderRadius: theme.shape.borderRadius, 
    maxHeight:"30%",
  },
  
  
  avatar: {
    backgroundColor: deepPurple[500],
    width: 120,
    height: 120,
    fontSize: '3rem',
  },
}));

export default function SingleContact() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const {store, actions} = useContext(Context); 
  const [contact, setContact] = useState([]);
  const { contactid } = useParams();
  console.log(contact)

  useEffect(() => {
      getContactInfo(setContact, contactid);
  }, []);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleDeleteClick = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);
  const handleConfirmDelete = () => {
    setOpenDeleteDialog(false);
    // Código para eliminar contacto
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton color="inherit" onClick={open ? handleDrawerClose : handleDrawerOpen}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap className={classes.title} style={{ color: darkTheme.palette.text.primary }}>
  Welcome, Pepito!
</Typography>

            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} classes={{ paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose) }}>
          <Divider />
          <List><MainListItems user={store.userInfo}/></List>
          <Divider />
          <List><SecondaryListItems user={store.userInfo} /></List>
        </Drawer>
        <div className={classes.container}>
          {contact ? (
            <Card className={classes.card} variant="outlined">
              <CardContent style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar className={classes.avatar}>
                  {contact.contact_initial}
                </Avatar>
                <Typography variant="h5">{contact.contact_name}</Typography>
                <Typography color="textSecondary">{contact.contact_email}</Typography>
              </CardContent>
              <CardActions>
                <Button><MailIcon /></Button>
                <Button color="secondary" onClick={handleDeleteClick}><CloseIcon /></Button>
              </CardActions>
            </Card>
          ) : (
            <Typography variant="h6" color="textSecondary">Cargando contacto...</Typography>
          )}
        </div>
      </div>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete contact</DialogTitle>
        <DialogContent>Are you sure you want to delete this contact?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
