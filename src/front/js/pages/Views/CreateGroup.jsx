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
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { MainListItems } from '../Dashboard/listitems.jsx';
import { SecondaryListItems } from '../Dashboard/listitems.jsx';
import Chart from '../Dashboard/Chart.jsx';
import Deposits from '../Dashboard/Deposits.jsx';
import Orders from '../Dashboard/Orders.jsx';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import ContactCard from './IndividualViews/ContactCard.jsx';
import { Link as MuiLink } from "@material-ui/core";
import { Home } from '../Home.jsx';
import TextField from '@material-ui/core/TextField';

import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../store/appContext.js';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';
import { mapContacts } from '../../component/callToApi.js';
import AddContactCard from './IndividualViews/AddContactCard.jsx';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../component/callToApi.js';

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
    },
    content: {
        flexGrow: 1,
        overflow: 'auto',
        width: '100%',
    },
    contactGrid: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: theme.spacing(1),
    },
    fabButton: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(3),
    },
    addMembersTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: theme.spacing(2),
    },
    createGroupButton: {
        marginLeft: theme.spacing(2),
        '&:hover': {
        },
    }
}));

export default function CreateGroup() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleAddMemberToGroup = (contact) => {
        setSelectedMembers((prev) => {
            const isAlreadySelected = prev.some(member => member.contact_id === contact.contact_id);
            return isAlreadySelected
                ? prev.filter(member => member.contact_id !== contact.contact_id)
                : [...prev, { id: contact.id, contact_id: contact.contact_id, contact_name: contact.contact_name }]; // Incluye las propiedades necesarias
        });
    };

    const handleCreateGroup = async () => {
        if (!values.groupName) {
            alert("Please fill in the group name");
            return;
        }

        let groupMembers = selectedMembers.map((member) => member.contact_id);

        const currentUser = store.userInfo;
        let userId = null;
        if (currentUser && typeof currentUser.id !== 'undefined') {
            userId = currentUser.id;
            console.log("Creator ID to send:", userId);
        } else {
            console.warn("User information not available to send creator ID.");
        }

        console.log("Final Group Members to send:", groupMembers);

        try {
            const response = await createGroup(values.groupName, groupMembers, userId);
            alert("Group created successfully!")
            setValues({ groupName: '' });
            setSelectedMembers([]);

        } catch (error) {

        }
    };

    




    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const { store, actions } = useContext(Context);

    const [contacts, setContacts] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [email, setEmail] = useState('');
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [values, setValues] = useState({ groupName: '' });  

    const { userid } = useParams();
    console.log("User ID:", userid);

    const handleGroupNameChange = (event) => {
        setGroupName(event.target.value);
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    useEffect(() => {
        let isMounted = true;

        mapContacts(setContacts, userid).then(() => {
            if (isMounted) {
            }
        });

        return () => {
            isMounted = false;
        };
    }, [userid]);

    return (
        <ThemeProvider theme={darkTheme}>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                    <Toolbar className={classes.toolbar}>
                        {!open && (
                            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} className={classes.menuButton}>
                                <MenuIcon />
                            </IconButton>
                        )}

                        {open && (
                            <IconButton edge="start" color="inherit" aria-label="close drawer" onClick={handleDrawerClose} className={classes.menuButton}>
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

                    <List>
                        <MainListItems user={store.userInfo} />
                    </List>
                    <Divider />
                    <List>
                        <SecondaryListItems user={store.userInfo} />
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                            <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                            <TextField
                    label="Group name"
                    variant="outlined"
                    name="groupName"  
                    value={values.groupName} 
                    onChange={handleInputChange} 
                    fullWidth
                />
                                <Button
                                    className={classes.createGroupButton}
                                    onClick={handleCreateGroup}
                                >
                                    Create Group
                                </Button>
                            </Box>


                        </Box>
                        <Typography variant="h6" className={classes.addMembersTitle}>
                            Add members
                        </Typography>
                        <Grid container spacing={2} className={classes.contactGrid}>
                            {!contacts.contacts ? (
                                <Typography>Loading contacts...</Typography>
                            ) : contacts.contacts.length === 0 ? (
                                <Typography>No contacts found</Typography>
                            ) : (
                                contacts.contacts.map((contact) => (
                                    <Grid item xs={12} sm={6} md={4} key={contact.id}>
                                        <AddContactCard
                                            contact={contact}
                                            onAddContact={handleAddMemberToGroup}
                                            isSelected={selectedMembers.some(
                                                member => member.id === contact.id
                                            )}
                                        />
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </Container>
                </main>
            </div>
        </ThemeProvider>
    );
}
