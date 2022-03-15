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
  Grid,
  Button,
  TextField, IconButton, Tooltip
} from '@material-ui/core';
import api from "../../../../services/api";
import Swal from "sweetalert2";
import validate from "validate.js";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { getErrorMessage } from '../../../../helpers/error';

const schema = {
  description: {
    presence: { allowEmpty: false,  message: 'A descrição é obrigatória.'},
    length: {
      minimum: 4,
      maximum: 200,
      message: 'A descrição deve conter no mínimo 4 e no máximo 100 caracteres.'
    }
  },

  date: {
    presence: { allowEmpty: false,  message: 'A data é obrigatório.'},
  },
 

  meal_id: {
    presence: { allowEmpty: false,  message: 'A refeição é obrigatória.'},
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: 'Escolha uma Refeição.',
    }
  },
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const MenuDetails = props => {
  const { className, history, ...rest } = props;
  const { idMenu } = props.match.params;
  const [ meals, setMeals ] = useState([]);

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      'date': handleData()
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

  async function loadMeal(){
    try {
      let url = 'meal/all';
      const response = await api.get(url);
      setMeals(response.data);
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
  }

  async  function saveMenuDetails(){
    try {
      const description = formState.values.description;
      const date = formState.values.date;
      const meal_id = formState.values.meal_id;
      
      const data = {
        description,
        date,
        meal_id
      }

      let response= {};
      let acao = "";
      if(!idMenu) {
        response = await api.post('menu', data);
        acao = "cadastrado";
      } else {
        response = await api.put('menu/'+idMenu, data);
        acao = "atualizado";
      }
      if (response.status === 200) {
        loadAlert('success', 'Cardápio '+acao+'.');
        history.push('/menu');
      } else {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      }
      console.log("Erros: "+formState.errors);
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
  }


  async function findAMenu(){
    try {
      const response = await api.get('menu/show/'+idMenu);
      if (response.status === 200) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
        setFormState(formState => ({
          values: {
            'description': response.data.description,
            'date':response.data.date,
            'meal_id': response.data.meal_id
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
    loadMeal();
    if(idMenu){
      findAMenu(idMenu);
    }
  }, []);

  useEffect(() => {
    if(idMenu){
      findAMenu();
    }
  }, []);


  function handleData(){
    let data = new Date();

    let day = data.getDate();
    let month = data.getMonth();
    let year = data.getFullYear();
    let dateString = '';
    if(month<10){
      dateString = year+'-0'+(month+1)+'-'+day;
    } else {
      dateString = year+'-'+(month+1)+'-'+day;
    }
    return dateString;
}

  useEffect(() => {
    const errors = validate(formState.values, schema);
    handleData();
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
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
              title="Cardápio"/>
          <Divider />
          <CardContent>
            <Grid
                container
                spacing={3}>
              <Grid
                  item
                  md={6}
                  xs={12}>
                <TextField
                    fullWidth
                    error={hasError('description')}
                    helperText={
                      hasError('description') ? formState.errors.description[0] : null
                    }
                    label="Descrição"
                    margin="dense"
                    name="description"
                    onChange={handleChange}
                    value={formState.values.description || ''}
                    variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={3}
                xs={12}>
                <TextField
                  fullWidth
                  error={hasError('date')}
                  helperText={
                    hasError('timeStart') ? formState.errors.date[0] : null
                  }
                  type="date"
                  label="Data"
                  margin="dense"
                  name="date"
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formState.values.date || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
              item
              md={3}
              xs={12}>
                <TextField
                  fullWidth
                  error={hasError('meal_id')}
                  helperText={
                    hasError('meal_id') ? formState.errors.meal_id[0] : null
                  }
                  label="Refeição"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="dense"
                  name="meal_id"
                  onChange={handleChange}
                  select

                  SelectProps={{ native: true }}
                  value={formState.values.meal_id}
                  variant="outlined">
                  <option value={null} ></option>
                  {meals.map(result => (
                    <option
                      key={result.id}
                      value={result.id}>
                      {result.description}
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
                  disabled={!formState.isValid}
                  onClick={saveMenuDetails}>
                Salvar
              </Button>
            </Tooltip>
          </CardActions>
        </form>
      </Card>
  );
};

MenuDetails.propTypes = {
  className: PropTypes.string,
};

export default MenuDetails;
