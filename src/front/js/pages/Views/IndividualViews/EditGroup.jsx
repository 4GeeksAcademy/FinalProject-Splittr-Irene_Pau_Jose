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
import { MainListItems, SecondaryListItems } from '../../Dashboard/listitems.jsx';
import { useParams } from 'react-router-dom';
import AddContactCard from './AddContactCard.jsx';
import Deposits from '../../Dashboard/Deposits.jsx';
import Orders from '../../Dashboard/Orders.jsx';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { getNonGroupMembers } from '../../../component/callToApi.js';

import { Link as MuiLink } from "@material-ui/core";
import { Home } from '../../Home.jsx';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Icon from '@material-ui/core/Icon';
import SendIcon from '@material-ui/icons/Save';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import { useContext } from 'react';
import { Context } from '../../../store/appContext.js';
import { getInfoGroup } from '../../../component/callToApi.js';
import { LibraryMusic } from '@material-ui/icons';
import { updateGroup } from '../../../component/callToApi.js';
import { mapContacts } from '../../../component/callToApi.js';
import { getGroupMembers } from '../../../component/callToApi.js';
import MemberCard from './MemberCard.jsx';
import AddContactCardInEditGroup from './AddContactCardInEditGroup.jsx';


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

export default function EditGroup() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const handleChange = (event) => {
    setSingleGroup({ ...singleGroup, [event.target.name]: event.target.value })
  };


  const { store, actions } = useContext(Context);
  const { groupid } = useParams();
  const [singleGroup, setSingleGroup] = useState({});
  const [contacts, setContacts] = useState({ contacts: [] });
  const userid = sessionStorage.getItem("user_id");
  const [allContacts, setAllContacts] = useState([]);

  console.log(userid)

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(urlBackend + `/groups/${groupId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setGroup(data);
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };


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

  useEffect(() => {
    fetchGroupDetails();
  }, [groupid]);


  const [members, setMembers] = useState([]);
  const [nonGroupMembers, setNonGroupMembers] = useState([]);

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

      }

      await updateGroup(groupid, updatedData);
      alert("Group updated successfully!");
    } catch (error) {
      console.error("Error updating Group:", error);
      alert("Error updating Group : ${error.message}");
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

  const [groupMembers, setGroupMembers] = useState([]);

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
    console.log("allContacts antes del filtrado:", allContacts);
    console.log("groupMembers antes del filtrado:", groupMembers);

    if (allContacts.contacts && allContacts.contacts.length > 0 && groupMembers.length > 0) {
      const filteredNonMembers = allContacts.contacts.filter(contact => {
        console.log("Comparando contacto:", contact, "con miembros:", groupMembers);
        return !groupMembers.some(member => member.id === contact.id);
      });
      console.log("nonGroupMembers después del filtrado:", filteredNonMembers);
      setNonGroupMembers(filteredNonMembers);
    } else {
      console.log("No se realiza el filtrado porque allContacts.contacts o groupMembers están vacíos.");
      setNonGroupMembers([]);
    }
  }, [allContacts, groupMembers]);

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
          <List><MainListItems user={store.userInfo} /></List>
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
                  <Button onClick={() => handleUpdateGroup("group_name")}>Change</Button>
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
                  <Button onClick={() => handleUpdateGroup("total_amount")}>Change</Button>
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
      </div>
    </ThemeProvider>
  );
}

