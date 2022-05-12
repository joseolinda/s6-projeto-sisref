import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { logout } from "../../services/auth";
import Swal from "sweetalert2";
import WatchLater from '@material-ui/icons/WatchLater';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { spacing } from '@material-ui/system';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined'
import { teal } from '@material-ui/core/colors';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({
  secondaryBar: {
    zIndex: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
});

function Header(props) {
  const { classes, onDrawerToggle, history } = props;

  const [dateState, setDateState] = useState(new Date());

  useEffect(() => {
		setInterval(() => {
			setDateState(new Date());
		}, 30000);
	}, []);

  const handleLogout = e => Swal.fire({
    title: 'Deseja Sair ?',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não'
  }).then((result) => {
    if (result.value) {
      logout();
      history.push("/");
    }
  })

  return (
    <React.Fragment>
      <AppBar  style={{backgroundColor: '#4caf50' }} position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Hidden smUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Hidden>
            <span className='realTimeClock'>
              <WatchLater fontSize="medium" style={{ marginRight: "10px", animation: 'spin 20s infinite linear'  }} />
              <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .realTimeClock {
                      background: rgba(255,255,255,0.2);
                      padding: 6px 60px 6px 10px;
                      border-radius: 4px;
                      font-size: 1.1rem;
                      margin-left: -10px;
                    }
                    .realTimeClock span {
                      display: inline-block;
                      position: absolute  ;
                      margin-top: 3px;
                    }
                `}
              </style>
              <span>
                {dateState.toLocaleString('pt-br', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </span>
        </span>
            <Grid item xs />
            <Grid item>
            <Tooltip title="Sair" >
              <IconButton onClick={handleLogout} 
                name={"Sair"}
                className={classes.buttonAdd}
                >
                <ExitToAppIcon fontSize="medium" style={{ color: "#fff" }}/>
              </IconButton>
            </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
  history: PropTypes.object 
};

export default withRouter(withStyles(styles)(Header));
