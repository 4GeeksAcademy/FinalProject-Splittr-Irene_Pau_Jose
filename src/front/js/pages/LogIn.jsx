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
import { useNavigate } from "react-router-dom";
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
    marginBottom: theme.spacing(2), 
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
    marginTop: theme.spacing(2), 
    marginBottom: theme.spacing(2), 
    '&:hover': { backgroundColor: '#dddddd' },
  },
  title: {
    marginBottom: theme.spacing(4), 
  },
  checkbox: {
    marginTop: theme.spacing(1), 
  },
}));

export const LogIn = () => {
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

  const navigate = useNavigate();
  const [data, setData] = useState({
    "email": "",
    "password": "",
  });
  const [displayPassword, setDisplayPassword] = useState("");
  const [passwordTimeout, setPasswordTimeout] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "password") {
   
      setData({
        ...data, 
        [e.target.name]: e.target.value
      });
      
     
      if (passwordTimeout) {
        clearTimeout(passwordTimeout);
      }
      
     
      setDisplayPassword(e.target.value);
  
      const timeout = setTimeout(() => {
        setDisplayPassword('•'.repeat(e.target.value.length));
      }, 500);
      
      setPasswordTimeout(timeout);
    } else {
      setData({
        ...data, 
        [e.target.name]: e.target.value
      });
    }
  };


  useEffect(() => {
    return () => {
      if (passwordTimeout) {
        clearTimeout(passwordTimeout);
      }
    };
  }, [passwordTimeout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        }
      }) 
      if (!response.ok) {
        alert("Incorrect login details");
        return;
      }
      const responseData = await response.json();
      localStorage.setItem("token", responseData.token);
      sessionStorage.setItem("user_id", responseData.user_id);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const classes = useStyles();

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
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              className={classes.input}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
              value={data.email}
            />
            <TextField
              className={classes.input}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password" 
              autoComplete="current-password"
              onChange={handleChange}
              value={displayPassword}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container spacing={2}> 
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
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
};