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
import { useState } from 'react';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
      Splittr      </Link>{' '}
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

  const navigate = useNavigate()
  const[data,setData]= useState({
      "email":"",
      "password":"",
  })

  const handleChange = (e) => {
    setData({
        ...data, [e.target.name]: e.target.value
    })
}
const handleSubmit = async (e) =>{
    e.preventDefault()
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                

            }
        }) 
        if (!response.ok){
            alert("Incorrect login details")
            return
        }
        const responseData = await response.json()
        localStorage.setItem("token", responseData.token)
        navigate("/dashboard")

    } catch (error) {
        console.log(error);
        

    }
        
}

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

          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
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
              className={classes.form}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              autoComplete="password"
              autoFocus
              onChange={handleChange}
              value={data.password}
              
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
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
            <Grid container>
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