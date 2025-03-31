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
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Chip } from '@material-ui/core';
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
import { createObjective } from '../../component/callToApi.js';
import LogoutButton from '../../component/LogOutButton.jsx';
import { SplittrLogo } from '../../component/SplittrLogo.jsx';

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
    container: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(4),
    },
    content: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
}));

export default function CreateObjective() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const user_id = sessionStorage.getItem("user_id")
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleAddMemberToObjective = (contact) => {
        const isAlreadySelected = selectedMembers.some(
            (selectedMember) => selectedMember.id === contact.id
        );

        if (!isAlreadySelected) {
            setSelectedMembers([...selectedMembers, contact]);
        } else {
            setSelectedMembers(
                selectedMembers.filter((selectedMember) => selectedMember.id !== contact.id)
            );
        }
    };

    const handleCreateObjective = async () => {
        if (!values.objectiveName || !values.objectiveTargetAmount) {
            alert("Please fill in all the fields");
            return;
        }

        try {

            const userId = store.userInfo.id;

            const objectiveMembersWithCreator = [...selectedMembers, { id: userId }];

            const response = await createObjective(
                values.objectiveName,
                values.objectiveTargetAmount,
                objectiveMembersWithCreator
            );

            if (response.error) {
                alert(response.error);
            } else {
                alert("Objective created successfully!");
                navigate(`/objective/user/${user_id}`);
                setValues({ objectiveName: '', objectiveTargetAmount: '' });
                setSelectedMembers([]); // Limpiar miembros seleccionados
            }
        } catch (error) {
            console.error("Error creating objective:", error);
            alert("An error occurred while creating the objective.");
        }
    };


    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const { store, actions } = useContext(Context);
    const [values, setValues] = useState({ objectiveName: '', objectiveTargetAmount: '' });
    const [contacts, setContacts] = useState([]);
    const [user, setUser] = useState(store.userInfo);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [email, setEmail] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);

    const { userid } = useParams();
    console.log("User ID:", userid);


    useEffect(() => {
        let isMounted = true;

        const getUser = async () => {
            const data = await actions.getUser()
            setUser(data)
            console.log(data);
        }
        getUser();

        mapContacts(setContacts, userid);

        return () => {
            isMounted = false;
        };
    }, [userid]);


    useEffect(() => {
        console.log("Current Contacts State:", contacts);
    }, [contacts]);


    return (
        <ThemeProvider theme={darkTheme}>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={clsx(classes.appBar, open && classes.appBarShift)}>
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

                        <Typography component="h1" variant="h6" noWrap className={classes.logoTitle}>
                            <SplittrLogo />
                        </Typography>
                        <Typography component="h1" variant="h6" noWrap className={classes.title}>
                            Create Objective
                        </Typography>

                      
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
                        <List>
                            <MainListItems user={store.userInfo} />
                        </List>
                        <Divider />
                        <List>
                            <SecondaryListItems user={store.userInfo} />
                        </List>
                    </Drawer>
                    <main className={classes.content} style={{ marginLeft: open ? drawerWidth : 64, width: '100%' }}>
                        <Container maxWidth="lg" className={classes.container}>
                            <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                                <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                                    <TextField
                                        label="Objective name"
                                        variant="outlined"
                                        fullWidth
                                        style={{ flex: 2 }}
                                        value={values.objectiveName}
                                        onChange={(e) => setValues({ ...values, objectiveName: e.target.value })}
                                    />

                                    <FormControl fullWidth className={classes.margin} variant="outlined" style={{ flex: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Target amount</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            value={values.objectiveTargetAmount}
                                            onChange={(e) => setValues({ ...values, objectiveTargetAmount: e.target.value })}
                                            endAdornment={<InputAdornment position="end">€</InputAdornment>}
                                        />
                                    </FormControl>

                                    <Button
                                        className={classes.createObjectiveButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCreateObjective}
                                    >
                                        Create Objective
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
                                                onAddContact={handleAddMemberToObjective}
                                                isSelected={selectedMembers.some(
                                                    member => member.id === contact.id
                                                )}
                                            />
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                            {selectedMembers.length > 0 && (
                                <Box sx={{ marginTop: "20px" }}>
                                    <Typography variant="h6">Selected Members:</Typography>
                                    {selectedMembers.map((member) => (
                                        <Chip
                                            key={member.id}
                                            label={member.name}
                                            onDelete={() => handleAddMemberToObjective(member)}
                                            color="primary"
                                            variant="outlined"
                                            style={{ margin: "5px" }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Container>
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
}