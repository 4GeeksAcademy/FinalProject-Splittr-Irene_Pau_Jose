import React, { useState, useEffect, useContext } from 'react';
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
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications'; // Import NotificationsIcon
import { MainListItems, SecondaryListItems } from '../Dashboard/listitems.jsx';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Context } from '../../store/appContext.js';
import { updateUser } from '../../component/callToApi.js';
import { SplittrLogo } from '../../component/SplittrLogo.jsx';
import LogoutButton from '../../component/LogOutButton.jsx';
import Container from '@material-ui/core/Container';
import Badge from '@material-ui/core/Badge'; // Import Badge



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
        MuiTypography: {
            root: { color: '#ffffff' },
            h4: {
                fontSize: '2.125rem',
                '@media (max-width:600px)': {
                    fontSize: '1.25rem',
                }
            },
            h6: {
                fontSize: '1rem',
                '@media (max-width:600px)': {
                    fontSize: '1rem',
                }
            }
        },
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
    menuButton: {
        marginRight: 36,
        [theme.breakpoints.down('sm')]: {
            marginRight: 12,  // Reduce spacing on mobile
        },
    },
    menuButtonHidden: { display: 'none' },
    title: {
        flexGrow: 1,
        [theme.breakpoints.down('xs')]: {  // Extra small screens
            '&:last-child': {  // Target the welcome message specifically
                display: 'none',  // Hide welcome message on very small screens
            },
        },
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
    appBarSpacer: {
        minHeight: theme.spacing(4),
    },
    content: {
        flexGrow: 1,
        overflow: 'auto',
        width: '100%',
    },
    container: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(4),
    },
    settingsContainer: {
        width: '100%',
        maxWidth: 600,
        margin: '0 auto',
        padding: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
        },
    },
    settingsTitle: {
        marginBottom: theme.spacing(4),
        '@media (max-width:600px)': {
            marginBottom: theme.spacing(2),
        }
    },
    settingField: {
        marginBottom: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    },
    textField: {
        flexGrow: 1,
        marginBottom: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            marginBottom: 0,
            marginRight: theme.spacing(2),
        },
    },
    actionButton: {
        minWidth: 120,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
}));

export default function Settings() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const { store, actions } = useContext(Context);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        birthday: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', isError: false });

    useEffect(() => {
        if (store.userInfo) {
            setFormData({
                name: store.userInfo.name || '',
                email: store.userInfo.email || '',
                password: '',
                birthday: store.userInfo.birthday || ''
            });
        }
    }, [store.userInfo]);

    const handleFieldChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleUpdateField = async (field) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage({ text: "Please login again", isError: true });
            return;
        }

        if (!formData[field] && field !== 'birthday') {
            setMessage({ text: `${field} cannot be empty`, isError: true });
            return;
        }

        setLoading(true);
        setMessage({ text: '', isError: false });

        try {
            const updatePayload = { [field]: formData[field] };
            const result = await updateUser(updatePayload, token);

            if (result.error) {
                setMessage({ text: result.error, isError: true });
            } else {
                setMessage({ text: `${field} updated successfully!`, isError: false });
                if (field === 'password') {
                    setFormData({ ...formData, password: '' });
                }
                await actions.getUser();
            }
        } catch (error) {
            setMessage({ text: "Failed to update. Please try again.", isError: true });
        } finally {
            setLoading(false);
        }
    };

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
                            <div className={classes.settingsContainer}>
                                <Typography variant="h4" className={classes.settingsTitle}>User Settings</Typography>

                                <div className={classes.settingField}>
                                    <TextField
                                        className={classes.textField}
                                        label="Name"
                                        variant="outlined"
                                        fullWidth
                                        value={formData.name}
                                        onChange={handleFieldChange('name')}
                                    />
                                    <Button
                                        className={classes.actionButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleUpdateField('name')}
                                        disabled={loading}
                                    >
                                        Update
                                    </Button>
                                </div>

                                <div className={classes.settingField}>
                                    <TextField
                                        className={classes.textField}
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        value={formData.email}
                                        onChange={handleFieldChange('email')}
                                    />
                                    <Button
                                        className={classes.actionButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleUpdateField('email')}
                                        disabled={loading}
                                    >
                                        Update
                                    </Button>
                                </div>

                                <div className={classes.settingField}>
                                    <TextField
                                        className={classes.textField}
                                        label="New Password"
                                        type="password"
                                        variant="outlined"
                                        fullWidth
                                        value={formData.password}
                                        onChange={handleFieldChange('password')}
                                    />
                                    <Button
                                        className={classes.actionButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleUpdateField('password')}
                                        disabled={loading}
                                    >
                                        Update
                                    </Button>
                                </div>

                                <div className={classes.settingField}>
                                    <TextField
                                        className={classes.textField}
                                        label="Birthday"
                                        type="date"
                                        variant="outlined"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={formData.birthday}
                                        onChange={handleFieldChange('birthday')}
                                    />
                                    <Button
                                        className={classes.actionButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleUpdateField('birthday')}
                                        disabled={loading}
                                    >
                                        Update
                                    </Button>
                                </div>

                                {message.text && (
                                    <Typography
                                        color={message.isError ? "error" : "primary"}
                                        style={{ marginTop: 16 }}
                                    >
                                        {message.text}
                                    </Typography>
                                )}
                            </div>
                        </Container>
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
}