import React from 'react';
import './App.css';
import Home from '../routes/home/Home';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    body:  {
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column'
    }
}));

const App = () => {
    console.log("%cJUDD 👨‍💻", "font-size: x-large");
    const classes = useStyles();
    return (
        <div className={classes.body}>
          <Home/>
        </div>
    );
};

export default App;
