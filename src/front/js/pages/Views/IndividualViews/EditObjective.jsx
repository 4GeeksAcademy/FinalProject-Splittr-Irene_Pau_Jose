import React, { useState, useEffect } from 'react';
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
import { getInfoSharedObjective, deleteObjective, updateObjective } from '../../../component/callToApi.js'; 
import { useNavigate } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { mapContacts } from '../../../component/callToApi.js';
import { getObjectiveMembers } from '../../../component/callToApi.js';
import { getNonObjectiveMembers} from '../../../component/callToApi.js';
import AddContactCardInEditObjective from './AddContactCardInEditObjective.jsx';

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

export default function EditObjective() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const user_id = sessionStorage.getItem("user_id")
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
 
  const handleChange = (event) => {
    setSingleObjective({...singleObjective, [event.target.name]: event.target.value})
  };
  const { store, actions } = useContext(Context);
  const { objectiveid } = useParams();
  const[singleObjective, setSingleObjective]= useState({});
  const [contacts, setContacts] = useState({ contacts: [] });
  const userid = sessionStorage.getItem("user_id");
  const [allContacts, setAllContacts] = useState([]);
  const [objectiveMembers, setObjectiveMembers] = useState([]);
    const [members, setMembers] = useState([]);
    const [nonObjectiveMembers, setNonObjectiveMembers] = useState([]);
    const [objective, setObjective] = useState(null);

    const fetchObjectiveDetails = async () => {
      try {
        const response = await fetch(urlBackend + `/objectives/${objectiveid}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
        const data = await response.json();
        setObjective(data);
      } catch (error) {
        console.error("Error fetching objective details:", error);
      }
    };

    useEffect(() => {
      if (objectiveid) {
          getInfoSharedObjective(setObjective, objectiveid);
      }
  }, [objectiveid]);
  
  

    useEffect(() => {
      if (userid) {
        mapContacts(setAllContacts, userid);
        console.log("Contactos obtenidos:", allContacts);
      }
    }, [userid]);
  
  useEffect(() => {
    if (!objectiveid) return;
    getInfoSharedObjective(setSingleObjective, objectiveid)
      .then(objectiveData => {
        console.log("Datos del objetivo recibidos:", objectiveData);
        if (objectiveData && Array.isArray(objectiveData.members)) {
          setObjectiveMembers(objectiveData.members);
        } else if (objectiveData) {
          console.error("Error: La propiedad 'members' no es un array:", objectiveData);
          setObjectiveMembers([]);
        } else {
          console.error("Error: No se pudo obtener la información del objetivo o no hay datos.");
          setObjectiveMembers([]);
        }
      })
      .catch(error => {
        console.error("Error fetching objective info:", error);
        setObjectiveMembers([]);
      });
  }, [objectiveid]);

  useEffect(() => {
    fetchObjectiveDetails();
  }, [objectiveid]);


  console.log(singleObjective);
  const handleUpdate = async (field) => {
    try {
      const updatedData = { [field]: singleObjective[field] };
      await updateObjective(objectiveid, updatedData);
      alert("Objective updated successfully!");
    } catch (error) {
      alert("Failed to update objective.");
    }
  };

  const handleDelete = async () => {
   
    
    if (window.confirm("Are you sure you want to delete this objective?")) {
      try {
        await deleteObjective(objectiveid);
        alert("Objective deleted successfully!");
        navigate(`/objective/user/${user_id}`);
      } catch (error) {
        alert("Failed to delete objective.");
      }
    }
  };

    const handleUpdateObjective = async (field) => {
      try {
        let updatedData = {};
  
        switch (field) {
          case 'objective_name':
            updatedData = { objective_name: singleObjective.objective_name };
            break;
          case 'target_amount':
            updatedData = { total_amount: singleObjective.target_amount };
            break;
  
        }
  
        await updateObjective(objectiveid, updatedData);
        alert("Objective updated successfully!");
      } catch (error) {
        console.error("Error updating Objective:", error);
        alert("Error updating Objective : ${error.message}");
      }
    };

      const handleMemberRemoved = () => {
    
        if (objectiveid) {
          getInfoSharedObjective(setSingleObjective, objectiveid)
            .then(objectiveData => {
              if (objectiveData && Array.isArray(objectiveData.members)) {
                setObjectiveMembers(objectiveData.members);
              } else {
                setObjectiveMembers([]);
                console.error("Error al actualizar la lista de miembros después de la eliminación.");
              }
            })
            .catch(error => {
              console.error("Error al obtener la información del objetivo después de la eliminación:", error);
            });
        }
      };

  useEffect(() => {
    if (objectiveid) {
      getObjectiveMembers(objectiveid)
        .then(members => {
          console.log("Miembros del objetivo recibidos:", members);
          if (Array.isArray(members)) {
            setObjectiveMembers(members);
          } else if (members && Array.isArray(members.members)) {
            setObjectiveMembers(members.members);
          } else {
            console.error("Error: miembros del objetivo no son un array:", members);
            setObjectiveMembers([]);
          }
        })
        .catch(error => {
          console.error("Error al obtener miembros del objetivo:", error);
          setObjectiveMembers([]);
        });
    }
  }, [objectiveid]);

    useEffect(() => {
      console.log("allContacts antes del filtrado:", allContacts);
      console.log("objectiveMembers antes del filtrado:", objectiveMembers);
  
      if (allContacts.contacts && allContacts.contacts.length > 0 && objectiveMembers.length > 0) {
        const filteredNonMembers = allContacts.contacts.filter(contact => {
          console.log("Comparando contacto:", contact, "con miembros:", objectiveMembers);
          return !objectiveMembers.some(member => member.id === contact.id);
        });
        console.log("nonObjectiveMembers después del filtrado:", filteredNonMembers);
        setNonObjectiveMembers(filteredNonMembers);
      } else {
        console.log("No se realiza el filtrado porque allContacts.contacts o ObjectiveMembers están vacíos.");
        setNonObjectiveMembers([]);
      }
    }, [allContacts, objectiveMembers]);

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
          <List><MainListItems user={store.userInfo}/></List>
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
            <h3>Modify Objective</h3>


            <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                id="outlined-textarea"
                variant="outlined"
                fullWidth
                placeholder="Current name"
                value={singleObjective.name}
                onChange={handleChange}
                name='name'

              />{objectiveid.name}
              <Box sx={{ marginLeft: "40px" }}>
              <Button onClick={() => handleUpdate("name")}>Change</Button>
              </Box>
            </Box>
            <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                id="outlined-textarea"
                variant="outlined"
                fullWidth
                placeholder="Current amount"
                value={singleObjective.target_amount}
                onChange={handleChange}
                name='target_amount'
              />
              <Box sx={{ marginLeft: "40px" }}>
                <Button onClick={() => handleUpdate("target_amount")}>Change</Button>
              </Box>
              
            </Box>            
            
            <Box sx={{ marginTop: "20px" }}>
                <h3>Members</h3>
                {objectiveMembers.length === 0 ? (
                  <Typography>No members in this objective yet.</Typography>
                ) : (
                  <Grid container spacing={2}>
                    {objectiveMembers.map((member) => (
                      <Grid item xs={12} sm={6} md={4} key={member.id}>
                        <MemberCard
                          member={member}
                          obectiveid={obectiveid}
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
              {nonObjectiveMembers.length === 0 && objectiveMembers.length > 0 ? (
                <Typography>No contacts available to add.</Typography>
              ) : nonObjectiveMembers.length === 0 && objectiveMembers.length === 0 ? (
                <Typography>Loading contacts...</Typography>
              ) : (
                nonObjectiveMembers.map((contact) => (
                  <Grid item xs={12} sm={6} md={4} key={contact.contact_id}>
                    <AddContactCardInEditObjective
                      contact={{
                        ...contact,
                        user_id: contact.contact_id,
                      }}
                      objectiveId={objectiveid}
                      onAddContact={updateContactsAfterAddingMember} 
                    />
                  </Grid>
                ))
              )}
            </Grid>

            
            <Box sx={{ marginBottom: "20px", marginTop: "60px", display: "flex", justifyContent: "center", gap: 2 }}>
            
              <Button variant="outlined" color="secondary" onClick={handleDelete} >Delete Objective</Button>
            </Box>



          </Box>
        </Box>



      </div>
    </ThemeProvider>
  );
}

