import React, { useState } from 'react';
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
import Avatar from '@material-ui/core/Avatar';
import { Box, TextField, InputAdornment } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { Card, CardContent } from '@material-ui/core';

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
    toolbar: { paddingRight: 20, minHeight: 70 },
    toolbarIcon: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 8px' },
    appBar: { zIndex: theme.zIndex.drawer + 1, transition: theme.transitions.create(['width', 'margin'], { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen }), backgroundColor: '#000000', color: theme.palette.text.primary },
    appBarShift: { marginLeft: drawerWidth, width: `calc(100% - ${drawerWidth}px)`, transition: theme.transitions.create(['width', 'margin'], { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }), backgroundColor: '#000000', color: theme.palette.text.primary },
    menuButton: { marginRight: 36 },
    title: { flexGrow: 1 },
    drawerPaper: { position: 'relative', whiteSpace: 'nowrap', width: drawerWidth, transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }), top: 30 },
    drawerPaperClose: { overflowX: 'hidden', transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen }), width: theme.spacing(7), [theme.breakpoints.up('sm')]: { width: theme.spacing(9) }, top: 30 },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100vh',
    },
    card: {
        width: "90%",
        maxWidth: "1200px",
        height: "90vh",
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
    },
    cardContent: { display: 'flex', flexDirection: 'column', flexGrow: 1 },
    avatar: { width: 60, height: 60, fontSize: '2rem' },
    messages: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflowY: 'auto',
        padding: theme.spacing(2),
        gap: theme.spacing(1),
    },
    messageBubble: { padding: theme.spacing(1), borderRadius: '10px', marginBottom: theme.spacing(1) },
    sent: {
        alignSelf: 'flex-end',
        backgroundColor: '#36393F',
        marginLeft: 'auto',
    },
    received: {
        alignSelf: 'flex-start',
        backgroundColor: '#424549',
    },

    messageInput: { padding: theme.spacing(2), borderTop: `1px solid ${theme.palette.divider}` },
}));
export default function TextMessages() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [messages, setMessages] = useState([
        { text: "Hola, ¿cómo estás? Me debes 100 euros", sender: 'me' },
        { text: "Perdón, mañana te hago el bizum", sender: 'other' },
        { text: "De acuerd, no te preocupes, moroso", sender: 'me' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { text: newMessage, sender: 'me' }]);
            setNewMessage('');
        }
    };


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
                    <List><MainListItems /></List>
                    <Divider />
                    <List>{secondaryListItems}</List>
                </Drawer>

                <div className={classes.container}>
                    <Card className={classes.card} variant="outlined">
                        <CardContent className={classes.cardContent}>
                            <Box display="flex" alignItems="center" marginBottom={2}>
                                <Avatar className={classes.avatar}>PP</Avatar>
                                <Box ml={2}>
                                    <Typography variant="h6">Pepito Pepe</Typography>
                                </Box>
                            </Box>
                            <div className={classes.messages}>
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={clsx(
                                            classes.messageBubble,
                                            message.sender === 'me' ? classes.sent : classes.received
                                        )}
                                    >
                                        <Typography>{message.text}</Typography>
                                    </div>
                                ))}
                            </div>
                            <div className={classes.messageInput}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Escribe un mensaje..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleSendMessage}>
                                                    <SendIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ThemeProvider>
    );
}