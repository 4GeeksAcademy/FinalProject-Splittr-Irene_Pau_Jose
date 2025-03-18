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
import { MainListItems } from '../../Dashboard/listitems.jsx';
import { secondaryListItems } from '../../Dashboard/listitems.jsx';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import MailIcon from '@material-ui/icons/Mail';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import { Box } from '@material-ui/core';
import { useMediaQuery } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100vh',
    marginTop: "10%",
  },
  card: {
    width: "40%",
    maxWidth: "700px",
    height: "50%",
    maxHeight: "800px",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: deepPurple[500],
    width: 200,
    height: 200,
    fontSize: '4rem',
    transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out, font-size 0.3s ease-in-out',
    '@media (max-width:900px)': {
      width: 160,
      height: 160,
      fontSize: '3.5rem',
    },
    '@media (max-width:600px)': {
      width: 120,
      height: 120,
      fontSize: '3rem',
    },
    '@media (max-width:400px)': {
      width: 80,
      height: 80,
      fontSize: '2rem',
    }
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
}));

export default function ListOfContacts() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = () => {
    setOpenDeleteDialog(false);
    // aquí el código para eliminar el contacto
  };

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
        <Drawer variant="permanent" classes={{ paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose) }} open={open}>
          <Divider />
          <List><MainListItems /></List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>

        <div className={classes.container}>
          <Card className={classes.card} variant="outlined">
            <CardContent className={classes.cardContent}>
              <Avatar className={classes.avatar}>PP</Avatar>
              <Box sx={{ marginTop: "10px" }}>
                <Typography variant="h5" component="h2">
                  Pepito Pepe
                </Typography>
                <Typography color="textSecondary">pepitopepe@gmail.com</Typography>
              </Box>
              <Box sx={{ marginTop: "10px" }}>
                <Typography variant="body2" component="p">
                  Mutual groups:
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" gap={1} marginTop={1}>
                  <Avatar style={{ backgroundColor: "#b19cd9", marginRight: 5 }}>P</Avatar>
                  <Avatar style={{ backgroundColor: "#b19cd9", marginRight: 5 }}>P</Avatar>
                  <Avatar style={{ backgroundColor: "#b19cd9", marginRight: 5 }}>P</Avatar>

                  <Typography>+4 more</Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button><MailIcon fontSize="large" /></Button>
              <Button color="secondary" onClick={handleDeleteClick}>
                <CloseIcon fontSize="large" />
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete contact</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this contact?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
