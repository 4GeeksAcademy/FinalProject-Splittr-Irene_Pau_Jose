import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 700,
    letterSpacing: 1,
  },
  firstLetter: {
    fontSize: '1.5em',
    marginRight: '2px'
  },
  restOfLogo: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 0.9
  }
}));

export const SplittrLogo = () => {
  const classes = useStyles();
  
  return (
    <div className={classes.logoContainer}>
      <span className={classes.firstLetter}>S</span>
      <div className={classes.restOfLogo}>
        <span>PLI</span>
        <span>TTR</span>
      </div>
    </div>
  );
};