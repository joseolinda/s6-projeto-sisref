import React, { useState, useEffect, useRef } from 'react';
import api from "../../services/api";
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { loginToken } from "../../services/auth";
import { Link as RouterLink, withRouter } from "react-router-dom";
import Swal from 'sweetalert2';
import Alert from '@material-ui/lab/Alert';
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
import {getErrorMessage} from "../../helpers/error";


const schema = {
  email: {
    presence: { allowEmpty: false, message: 'O e-mail é obrigatório.'  },
    email: true,
    length: {
      maximum: 64,
      message: 'O e-mail deve conter no máximo 64 caracteres.'
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'A senha é obrigatória.'  },
    length: {

    }
  }
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  infoRedefinicao: {
    marginTop: theme.spacing(3),
  }
}));

const SignIn = props => {
  const { history } = props;
  const timer = React.useRef();
  const [showMessage, setShowMessage] = useState(() => localStorage.getItem('redefinition_alert') === null);
  const classes = useStyles();
  const campoSenha = useRef();


  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  },[formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  //configuration alert
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  function loadAlert(icon, message) {
    Toast.fire({
      icon: icon,
      title: message
    });
  }

  async function handleSignIn(event) {
    event.preventDefault();
    try {
      const email = formState.values.email;
      const password = formState.values.password;

      const data = {
        email, password
      };

      const response = await api.post('login', data);
      if(response.status == 200){
        loginToken(response.data.access_token, response.data.name,
          response.data.classfication, response.data.active,
          response.data.campus, response.data.id);

        if(response.data.classfication == "ADMIN"){
          history.push('/user');
        } else if(response.data.classfication == "ASSIS_ESTU"){
          history.push('/student');
        } else if(response.data.classfication == "RECEPCAO"){
          history.push('/confirm-meals');
        } else if(response.data.classfication == "NUTRI"){
          history.push('/menu');
        }else{
          history.push('/page-student');
        }
      }else {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      }
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
  }

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  function onPressEnter (event){
    if (event.key == "Enter"){
      if  (campoSenha.current){
        campoSenha.current.focus ();
      }
    }
  }

  const handleCloseRedefinitionAlert = () => {
    setShowMessage(false);
    localStorage.setItem('redefinition_alert', '1');
  };

    return (
      <Container maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
        <img
            alt="Logo"
            src={process.env.PUBLIC_URL + "/images/SISREF01.png"}
          />
          {showMessage && (
            <Alert
              severity="info"
              className={classes.infoRedefinicao}
              onClose = {handleCloseRedefinitionAlert} 
            >
              Você agora pode definir uma senha própria! Basta acessar "Redefina aqui".
            </Alert>
          )}
          <form onSubmit={handleSignIn} className={classes.form} noValidate>
          <TextField
              className={classes.textField}
              error={hasError('email')}
              fullWidth
              helperText={
                hasError('email') ? formState.errors.email[0] : null
              }
              label="Email"
              name="email"
              onChange={handleChange}
              onKeyPress={onPressEnter}
              type="text"
              value={formState.values.email || ''}
              variant="outlined"
              margin="normal"
              autoFocus
            />
            <TextField
              className={classes.textField}
              error={hasError('password')}
              fullWidth
              helperText={
                hasError('password') ? formState.errors.password[0] : null
              }
              label="Senha"
              name="password"
              onChange={handleChange}
              type="password"
              value={formState.values.password || ''}
              variant="outlined"
              margin="normal"
              inputRef={campoSenha}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Lembre-me"
            />
            <Button
              disabled={!formState.isValid}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Entrar
            </Button>
            <Typography
              color="textSecondary"
              variant="body1">
              Esqueceu sua senha?{' '}
              <Link
                component={RouterLink}
                to="/redefine-password"
                variant="p">
                Redefina aqui.
              </Link>
            </Typography>
          </form>
        </div>
      </Container>
    );
};

SignIn.propTypes = {
  history: PropTypes.object
};


export default withRouter(SignIn);

