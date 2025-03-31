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
import { signUpUser } from '../component/callToApi';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
    marginBottom: theme.spacing(3),
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#555' },
      '&:hover fieldset': { borderColor: '#aaa' },
      '&.Mui-focused fieldset': { borderColor: '#ffffff' },
    },
  },
  form: {
    marginTop: theme.spacing(4),
  },
  submit: {
    backgroundColor: '#ffffff',
    color: '#111',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    '&:hover': { backgroundColor: '#dddddd' },
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  checkbox: {
    marginTop: theme.spacing(1),
  },
  message: {
    marginBottom: theme.spacing(2),
    textAlign: 'center',
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
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [displayPassword, setDisplayPassword] = useState("");
  const [passwordTimeout, setPasswordTimeout] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "password") {
      // Update the actual password immediately
      setFormData({
        ...formData, 
        [e.target.name]: e.target.value
      });
      
      // Clear any existing timeout
      if (passwordTimeout) {
        clearTimeout(passwordTimeout);
      }
      
      // Show the actual character briefly before masking
      setDisplayPassword(e.target.value);
      
      // Set a timeout to mask the character after 500ms
      const timeout = setTimeout(() => {
        setDisplayPassword('•'.repeat(e.target.value.length));
      }, 500);
      
      setPasswordTimeout(timeout);
    } else {
      setFormData({
        ...formData, 
        [e.target.name]: e.target.value
      });
    }
  };

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (passwordTimeout) {
        clearTimeout(passwordTimeout);
      }
    };
  }, [passwordTimeout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const response = await signUpUser(formData.name, formData.email, formData.password);

    if (response.error || response.msg === "Email already exists") {
      setError(response.msg || "Something went wrong");
    } else {
      setSuccessMessage("User created successfully!");
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="d-flex flex-column justify-content-center align-items-center bg-dark text-white">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 700,
          letterSpacing: 1,
          fontSize: '2rem',
          marginBottom: '2rem'
        }}>
          <span style={{ fontSize: '3rem', marginRight: '2px' }}>S</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.9 }}>
            <span>PLI</span>
            <span>TTR</span>
          </div>
        </div>
      </div>

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5" className={classes.title} align="center">
            Sign up
          </Typography>
          
          {error && (
            <Typography color="error" className={classes.message}>
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography color="primary" className={classes.message}>
              {successMessage}
            </Typography>
          )}
          
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  className={classes.input}
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.input}
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.input}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password" // This ensures the browser's native password masking doesn't interfere
                  id="password"
                  onChange={handleChange}
                  value={displayPassword}
                  autoComplete="new-password"
                />
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
            
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </ThemeProvider>
  );
}