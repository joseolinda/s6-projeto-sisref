import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid, Switch,
  Button, Checkbox, FormControlLabel,
  TextField, IconButton, Tooltip, FormGroup,
  InputLabel, MenuItem, FormControl, Select
} from '@material-ui/core';
import api from "../../../../services/api";
import Swal from "sweetalert2";
import validate from "validate.js";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { getErrorMessage } from '../../../../helpers/error';

const schema = {
    name: {
      presence: { allowEmpty: false,  message: 'O nome é obrigatório.'},
      length: {
        minimum: 4,
        maximum: 100,
        message: 'A nome deve conter no mínimo 4 e no máximo 100 caracteres.'
      }
    },
    email: {
        presence: { allowEmpty: false,  message: 'o email é obrigatória.'},
        email: true,
        length: {
          minimum: 4,
          maximum: 100,
          message: 'A descrição deve conter no mínimo 9 e no máximo 100 caracteres.'
        }
      },
    type: {
        presence: { allowEmpty: false,  message: 'O tipo de usuário é obrigatório.'},
      },
    campus_id: {
        presence: { allowEmpty: false,  message: 'O Campus é obrigatório.'},
        numericality: {
          onlyInteger: true,
          greaterThan: 0,
          message: 'Escolha um tipo.',
        }

      },
  };

  const useStyles = makeStyles((theme) => ({
    root: {},
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

const UserDetails = props => {
    const { className, history, ...rest } = props;
    const { idUser } = props.match.params;
    const [campus, setCampus] = React.useState([]);
    const classes = useStyles();

    const [formState, setFormState] = useState({
        isValid: false,
        values: {
            'active': false
        },
        touched: {},
        errors: {}
    });


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

  async function loadCampus(){
    try {
      let url = 'campus/all';
      const response = await api.get(url);
      setCampus(response.data);
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
  }

    async function findAUser(id){
        try {
            const response = await api.get('user/show/'+id);
            if (response.status === 202) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                }
            } else {
                setFormState(formState => ({
                    values: {
                        'name': response.data.name,
                        'email': response.data.email,
                        'campus_id': response.data.campus_id,
                        'type': response.data[0].type
                    },
                    touched: {
                        ...formState.touched,
                    }
                }));
            }
        } catch (error) {
            loadAlert('error', getErrorMessage (error));
        }
    }

  useEffect(() => {
    loadCampus();
      if(idUser){
          findAUser(idUser);
      }
  }, []);

  const types = [
    {
      value: 'NUTRI',
      label: 'Nutricionista'
    },
    {
      value: 'ASSIS_ESTU',
      label: 'Assitencia Estudantil'
    },
    {
      value: 'RECEPCAO',
      label: 'Recepção'
    }
  ];


  async function saveUserDetails(){
    try {
        const name = formState.values.name;
        const email = formState.values.email;
        const type = formState.values.type;
        const campus_id = formState.values.campus_id;
        const active = formState.values.active == "" ? false : true;
        const password = 123456;
        const data = {
            name,
            email,
            password,
            type,
            campus_id,
            active
        }
        let response= {};
        let acao = "";
        if(!idUser) {
          response = await api.post('register', data);
          acao = "cadastrado";
        } else {
          response = await api.put('user/'+idUser, data);
          acao = "atualizado";
        }
        if (response.status === 200) {
          loadAlert('success', 'Usuário '+acao+'.');
          history.push('/user');
        } else {
          if(response.data.message){
            loadAlert('error', response.data.message);
          }
          else if(response.data.errors[0].description){
            loadAlert('error', response.data.errors.description);
          }

        }

      } catch (error) {

        loadAlert('error', getErrorMessage (error));
      }
  }

  async function findAUser(){
    try {
      const response = await api.get('user/show/'+idUser);
      if (response.status === 200) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
        setFormState(formState => ({
          values: {
            'id': response.data[0].id,
            'name': response.data[0].name,
            'email': response.data[0].email,
            'type': response.data[0].type,
            'campus_id': response.data[0].campus_id,
            'active': response.data[0].active  == 1 ? true : false,
          },
          touched: {
            ...formState.touched,
          }
        }));
      }
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
  }

  useEffect(() => {
    if(idUser){
      findAUser();
    }
    formState.values.active = true;

  }, []);

  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState(formState => ({
      ...formState,
      isValid: (errors || formState.values.campus_id==0 || formState.values.type==0) ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {

    if(formState.values.active == null)
        setFormState(formState => ({
          values:{
            'active': true,
          }
        }));
    setFormState({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.checked ? event.target.checked : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    });
  };

  const hasError = field =>
      formState.touched[field] && formState.errors[field] ? true : false;

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Card
        {...rest}
        className={clsx(classes.root, className)}>
      <form
          autoComplete="off">
        <div className={classes.contentHeader}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <CardHeader
            subheader=""
            title="Usuário"/>
        <Divider />
        <CardContent>
          {idUser!=null ?
          <FormControlLabel
                control={
                  <Switch
                    checked={formState.values.active}
                    onChange={handleChange}
                    name="active"
                    color="primary"
                  />
                }
                label="Ativo"
              />
           : null }
          <Grid
              container
              spacing={3}>
            <Grid
                item
                md={6}
                xs={12}>
              <TextField
                  fullWidth
                  error={hasError('name')}
                  helperText={
                    hasError('name') ? formState.errors.name[0] : null
                  }
                  label="Nome"
                  margin="dense"
                  name="name"
                  onChange={handleChange}
                  value={formState.values.name || ''}
                  variant="outlined"
              />
            </Grid>
            <Grid
                item
                md={6}
                xs={12}>
              <TextField
                  fullWidth
                  error={hasError('email')}
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  type="email"
                  label="E-mail"
                  margin="dense"
                  name="email"
                  onChange={handleChange}
                  value={formState.values.email || ''}
                  variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={3}
              xs={12}>
              <TextField
                fullWidth
                error={hasError('campus_id')}
                helperText={
                  hasError('campus') ? formState.errors.campus_id[0] : null
                }
                InputLabelProps={{
                  shrink: true,
                }}
                label="Campus"
                margin="dense"
                name="campus_id"
                onChange={handleChange}
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={formState.values.campus_id}
                variant="outlined">
                <option value={null} ></option>
                {campus.map(result => (
                  <option
                    key={result.id}
                    value={result.id}>
                    {result.description}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}>
              <TextField
                fullWidth
                error={hasError('type')}
                helperText={
                  hasError('type') ? formState.errors.type[0] : null
                }
                InputLabelProps={{
                  shrink: true,
                }}
                label="Tipo"
                margin="dense"
                name="type"
                onChange={handleChange}
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={formState.values.type}
                variant="outlined">
                <option value={null} ></option>
                {types.map(result => (
                  <option
                    key={result.value}
                    value={result.value}>
                    {result.label}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>

        </CardContent>
        <Divider />
        <CardActions>
          <Tooltip title="Clique aqui para salvar os dados" aria-label="add">
            <Button
                color="primary"
                variant="outlined"
                name="Ativo"
                disabled={!formState.isValid}
                onClick={saveUserDetails}>
              Salvar
            </Button>
          </Tooltip>
        </CardActions>
      </form>
    </Card>
  );
};

UserDetails.propTypes = {
    className: PropTypes.string,
};

export default UserDetails;
