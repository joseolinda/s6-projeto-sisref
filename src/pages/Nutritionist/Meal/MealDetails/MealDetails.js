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

  timeStart: {
    presence: { allowEmpty: false,  message: 'O horário de inicio é obrigatório.'},
  },

  timeEnd: {
    presence: { allowEmpty: false,  message: 'O horário de fim é obrigatório.'},
  },
  
  qtdTimeReservationStart: {
    presence: { allowEmpty: false,  message: 'A quantidade de horas de inicio é obrigatório.'},
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: 'Escolha uma quantidade.',
    }
  },

  qtdTimeReservationEnd: {
    presence: { allowEmpty: false,  message: 'A quantidade de horas de fim é obrigatório.'},
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: 'Escolha uma quantidade.',
    }
  },
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const MealDetails = props => {
  const { className, history, ...rest } = props;
  const { idMeal } = props.match.params;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
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


  async  function saveMealDetails(){
    try {
      const description = formState.values.description;
      const timeStart = formState.values.timeStart;
      const timeEnd = formState.values.timeEnd;
      const qtdTimeReservationStart = formState.values.qtdTimeReservationStart;
      const qtdTimeReservationEnd = formState.values.qtdTimeReservationEnd;

      const data = {
        description,
        timeStart,
        timeEnd,
        qtdTimeReservationStart,
        qtdTimeReservationEnd
      }
      let response= {};
      let acao = "";
      if(!idMeal) {
        response = await api.post('meal', data);
        acao = "cadastrada";
      } else {
        response = await api.put('meal/'+idMeal, data);
        acao = "atualizada";
      }
      if (response.status === 200) {
        loadAlert('success', 'Refeição '+acao+'.');
        history.push('/meal');
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

  async function findAMeal(){
    try {
      const response = await api.get('meal/show/'+idMeal);
      if (response.status === 200) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
        setFormState(formState => ({
          values: {
            'description': response.data.description,
            'timeStart':response.data.timeStart,
            'timeEnd': response.data.timeEnd,
            'qtdTimeReservationStart':response.data.qtdTimeReservationStart,
            'qtdTimeReservationEnd': response.data.qtdTimeReservationEnd,
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
    if(idMeal){
      findAMeal();
    }
  }, []);


  useEffect(() => {
    const errors = validate(formState.values, schema);

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
              title="Refeição"/>
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
                md={6}
                xs={12}>
                <TextField
                  fullWidth
                  error={hasError('timeStart')}
                  helperText={
                    hasError('timeStart') ? formState.errors.timeStart[0] : null
                  }
                  type="time"
                  label="Hora inicio"
                  margin="dense"
                  name="timeStart"
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formState.values.timeStart || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}>
                <TextField
                  fullWidth
                  error={hasError('timeEnd')}
                  helperText={
                    hasError('timeEnd') ? formState.errors.timeEnd[0] : null
                  }
                  type="time"
                  label="Hora fim"
                  margin="dense"
                  name="timeEnd"
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formState.values.timeEnd || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={3}
                xs={12}>
                <TextField
                  fullWidth
                  error={hasError('qtdTimeReservationStart')}
                  helperText={
                    hasError('qtdTimeReservationStart') ? formState.errors.qtdTimeReservationStart[0] : null
                  }
                  type="number"
                  label="Qtd Hr Reserva (inicio)"
                  margin="dense"
                  name="qtdTimeReservationStart"
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formState.values.qtdTimeReservationStart || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={3}
                xs={12}>
                <TextField
                  fullWidth
                  error={hasError('qtdTimeReservationEnd')}
                  helperText={
                    hasError('qtdTimeReservationEnd') ? formState.errors.qtdTimeReservationEnd[0] : null
                  }
                  type="number"
                  label="Qtd Hr Reserva (fim)"
                  margin="dense"
                  name="qtdTimeReservationEnd"
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formState.values.qtdTimeReservationEnd || ''}
                  variant="outlined"
                />
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
                  onClick={saveMealDetails}>
                Salvar
              </Button>
            </Tooltip>
          </CardActions>
        </form>
      </Card>
  );
};

MealDetails.propTypes = {
  className: PropTypes.string,
};

export default MealDetails;
