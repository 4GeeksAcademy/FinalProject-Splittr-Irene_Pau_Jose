import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Splittr
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: '#111',
    padding: theme.spacing(4),
    borderRadius: '10px',
  },
  input: {
    backgroundColor: '#222',
    color: '#ffffff',
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#555' },
      '&:hover fieldset': { borderColor: '#aaa' },
      '&.Mui-focused fieldset': { borderColor: '#ffffff' },
    },
  },
  submit: {
    backgroundColor: '#ffffff',
    color: '#111',
    '&:hover': { backgroundColor: '#dddddd' },
  },
}));

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#ffffff",
    },
    background: {
      default: "#23272A",
      paper: "#2C2F33",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b9bbbe",
    },
  },
});

export default function SignUp() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="d-flex flex-column justify-content-center align-items-center bg-dark text-white">
        <h1 className="display-3 ">
          <span className="text-white fw-bold">S </span>PLI <br />
          <span className="text-white ms-3">TTR</span>
        </h1>
      </div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5" style={{ marginBottom: "16px" }} >
            Sign up
          </Typography>
          <form className={classes.form} noValidate >
          <Grid container spacing={2}>
              <Grid item xs={12} spacing={2} >
                <TextField
                  className={classes.form}
                  variant="outlined"
                  
                  required
                  fullWidth
                  id="lastName"
                  label="Name"
                  name="Name"
                  autoComplete="lname"
                  InputLabelProps={{ style: { color: '#cccccc' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.form}
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  InputLabelProps={{ style: { color: '#cccccc' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.form}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  InputLabelProps={{ style: { color: '#cccccc' } }}
                />
              </Grid>
              <Grid item xs={12}>
              </Grid>
              </Grid>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
