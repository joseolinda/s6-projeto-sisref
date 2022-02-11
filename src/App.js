import React, {Component} from "react";
import Routes from "./routes";
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import 'react-perfect-scrollbar/dist/css/styles.css';
///import "./styles/global";
import './styles/global.css';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';

const browserHistory = createBrowserHistory();

const generateClassName = createGenerateClassName({
    seed: 'App1',
});

const App = () =>(
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={theme}>
            <Router history={browserHistory}>
                  <Routes history={browserHistory}/>
            </Router>
      </ThemeProvider>
    </StylesProvider>

)
export default App;
