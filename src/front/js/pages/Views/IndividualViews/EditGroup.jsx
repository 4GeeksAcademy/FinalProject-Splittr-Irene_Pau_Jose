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
import { getInfoGroup, updateGroup, mapContacts, getGroupMembers } from '../../../component/callToApi.js';
import MemberCard from './MemberCard.jsx';
import AddContactCardInEditGroup from './AddContactCardInEditGroup.jsx';
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
  contactGrid: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  addMembersTitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}));

export default function EditGroup() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setSingleGroup({ ...singleGroup, [event.target.name]: event.target.value });
  };

  const { store, actions } = useContext(Context);
  const { groupid } = useParams();
  const [singleGroup, setSingleGroup] = useState({});
  const [allContacts, setAllContacts] = useState([]);
  const userid = sessionStorage.getItem("user_id");
  const [groupMembers, setGroupMembers] = useState([]);
  const [nonGroupMembers, setNonGroupMembers] = useState([]);

  useEffect(() => {
    getInfoGroup(setSingleGroup, groupid);
  }, [groupid]);

  useEffect(() => {
    if (userid) {
      mapContacts(setAllContacts, userid);
    }
  }, [userid]);

  useEffect(() => {
    if (!groupid) return;
    getInfoGroup(setSingleGroup, groupid)
      .then(groupData => {
        if (groupData && Array.isArray(groupData.members)) {
          setGroupMembers(groupData.members);
        } else if (groupData) {
          console.error("Error: La propiedad 'members' no es un array:", groupData);
          setGroupMembers([]);
        } else {
          console.error("Error: No se pudo obtener la información del grupo o no hay datos.");
          setGroupMembers([]);
        }
      })
      .catch(error => {
        console.error("Error fetching group info:", error);
        setGroupMembers([]);
      });
  }, [groupid]);

  const handleUpdateGroup = async (field) => {
    try {
      let updatedData = {};
      switch (field) {
        case 'group_name':
          updatedData = { group_name: singleGroup.group_name };
          break;
        case 'total_amount':
          updatedData = { total_amount: singleGroup.total_amount };
          break;
        default:
          break;
      }
      await updateGroup(groupid, updatedData);
      alert("Group updated successfully!");
    } catch (error) {
      console.error("Error updating Group:", error);
      alert(`Error updating Group : ${error.message}`);
    }
  };

  const handleMemberRemoved = () => {
    if (groupid) {
      getInfoGroup(setSingleGroup, groupid)
        .then(groupData => {
          if (groupData && Array.isArray(groupData.members)) {
            setGroupMembers(groupData.members);
          } else {
            setGroupMembers([]);
            console.error("Error al actualizar la lista de miembros después de la eliminación.");
          }
        })
        .catch(error => {
          console.error("Error al obtener la información del grupo después de la eliminación:", error);
        });
    }
  };

  useEffect(() => {
    if (groupid) {
      getGroupMembers(groupid)
        .then(members => {
          if (Array.isArray(members)) {
            setGroupMembers(members);
          } else if (members && Array.isArray(members.members)) {
            setGroupMembers(members.members);
          } else {
            console.error("Error: miembros del grupo no son un array:", members);
            setGroupMembers([]);
          }
        })
        .catch(error => {
          console.error("Error al obtener miembros del grupo:", error);
          setGroupMembers([]);
        });
    }
  }, [groupid]);

  useEffect(() => {
    if (allContacts.contacts && allContacts.contacts.length > 0 && groupMembers.length > 0) {
      const filteredNonMembers = allContacts.contacts.filter(contact => {
        return !groupMembers.some(member => member.id === contact.id);
      });
      setNonGroupMembers(filteredNonMembers);
    } else {
      setNonGroupMembers([]);
    }
  }, [allContacts, groupMembers]);

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
            <Box
              sx={{
                width: "50%",
                padding: "0 16px",
                marginTop: "20px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ marginBottom: "20px" }}>
                <h3>Modify Group</h3>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TextField
                      id="outlined-textarea"
                      variant="outlined"
                      fullWidth
                      placeholder="Current name"
                      value={singleGroup.group_name || ""}
                      onChange={handleChange}
                      name="group_name"
                    />
                    <Box sx={{ marginLeft: "40px" }}>
                      <Button variant="contained" color="primary" onClick={() => handleUpdateGroup("group_name")}>Change</Button>
                    </Box>
                  </Box>
                  <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2 }}>
                    <TextField
                      id="outlined-textarea"
                      variant="outlined"
                      fullWidth
                      placeholder="Current amount"
                      value={singleGroup.total_amount || ""}
                      onChange={handleChange}
                      name="total_amount"
                    />
                    <Box sx={{ marginLeft: "40px" }}>
                      <Button variant="contained" color="primary" onClick={() => handleUpdateGroup("total_amount")}>Change</Button>
                    </Box>
                  </Box>
                  <Box sx={{ marginTop: "20px" }}>
                    <h3>Members</h3>
                    {groupMembers.length === 0 ? (
                      <Typography>No members in this group yet.</Typography>
                    ) : (
                      <Grid container spacing={2}>
                        {groupMembers.map((member) => (
                          <Grid item xs={12} sm={6} md={4} key={member.id}>
                            <MemberCard
                              member={member}
                              groupId={groupid}
                              onMemberRemoved={handleMemberRemoved}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                  <Typography variant="h6" className={classes.addMembersTitle}>
                    Add members
                  </Typography>
                  <Grid container spacing={2} className={classes.contactGrid}>
                    {allContacts.length === 0 && groupMembers.length > 0 ? (
                      <Typography>No contacts available to add.</Typography>
                    ) : allContacts.length === 0 && groupMembers.length === 0 ? (
                      <Typography>Loading contacts...</Typography>
                    ) : (
                      nonGroupMembers.map((contact) => (
                        <Grid item xs={12} sm={6} md={4} key={contact.contact_id}>
                          <AddContactCardInEditGroup
                            contact={{
                              ...contact,
                              user_id: contact.contact_id
                            }}
                            groupId={groupid}
                          />
                        </Grid>
                      ))
                    )}
                  </Grid>
                  <Box sx={{ marginBottom: "20px", marginTop: "60px", display: "flex", justifyContent: "center", gap: 2 }}>
                    <Button variant="outlined" color="secondary">Delete Group</Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}