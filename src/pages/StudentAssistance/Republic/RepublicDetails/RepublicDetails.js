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
      maximum: 100,
      message: 'A descrição deve conter no mínimo 4 e no máximo 100 caracteres.'
    }
  },
  address: {
    presence: { allowEmpty: false,  message: 'O endereço é obrigatório.'},
    length: {
      minimum: 10,
      maximum: 100,
      message: 'O endereço deve conter no mínimo 10 e no máximo 100 caracteres.'
    }
  },
  city: {
    presence: { allowEmpty: false,  message: 'A cidade é obrigatório.'},
    length: {
      minimum: 4,
      maximum: 100,
      message: 'A cidade deve conter no mínimo 4 e no máximo 100 caracteres.'
    }
  },
  neighborhood: {
    presence: { allowEmpty: false,  message: 'O bairro é obrigatório.'},
    length: {
      minimum: 4,
      maximum: 100,
      message: 'O bairro deve conter no mínimo 4 e no máximo 100 caracteres.'
    }
  },
  ownerRepublic: {
    presence: { allowEmpty: false,  message: 'O proprietário é obrigatório.'},
    length: {
      minimum: 4,
      maximum: 100,
      message: 'O proprietário deve conter no mínimo 4 e no máximo 100 caracteres.'
    }
  },valueRepublic: {
    presence: { allowEmpty: false,  message: 'O valor é obrigatório.'},
    length: {
      minimum: 2,
      maximum: 100,
      message: 'O valor deve conter no mínimo 2 e no máximo 100 caracteres.'
    },
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: 'Insira o valor.',
    }
  }
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const RepublicDetails = props => {
  const { className, history, ...rest } = props;
  const { idRepublic } = props.match.params;

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

  async function saveRepublicDetails(){
    try {
      const description = formState.values.description;
      const address = formState.values.address;
      const city = formState.values.city;
      const valueRepublic = formState.values.valueRepublic;
      const neighborhood = formState.values.neighborhood;
      const ownerRepublic = formState.values.ownerRepublic;
      const data = {
        description, city, valueRepublic,
        address, neighborhood, ownerRepublic
      }
      let response= {};
      let acao = "";
      if(!idRepublic) {
        response = await api.post('republic', data);
        acao = "cadastrado";
      } else {
        response = await api.put('republic/'+idRepublic, data);
        acao = "atualizada";
      }
      if (response.status === 200) {
        loadAlert('success', 'República '+acao+'.');
        history.push('/republic');
      } else {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }  else if(response.data.errors[0].description){
          loadAlert('error', response.data.errors.description);
        } else if(response.data.errors[0].city){
          loadAlert('error', response.data.errors.city);
        }else if(response.data.errors[0].valueRepublic){
          loadAlert('error', response.data.errors.valueRepublic);
        } else if(response.data.errors[0].address){
          loadAlert('error', response.data.errors.address);
        }else if(response.data.errors[0].neighborhood){
          loadAlert('error', response.data.errors.neighborhood);
        } else if(response.data.errors[0].ownerRepublic){
          loadAlert('error', response.data.errors.ownerRepublic);
        }

      }

    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
  }

  async function findARepublic(){
    try {
      const response = await api.get('republic/show/'+idRepublic);
      if (response.status === 200) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
        setFormState(formState => ({
          values: {
            'description': response.data.description,
            'city': response.data.city,
            'valueRepublic': response.data.valueRepublic,
            'address': response.data.address,
            'neighborhood': response.data.neighborhood,
            'ownerRepublic': response.data.ownerRepublic
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
    if(idRepublic){
      findARepublic();
    }

  }, []);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: (errors) ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    setFormState({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
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
              title="República"/>
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
                    error={hasError('address')}
                    helperText={
                      hasError('address') ? formState.errors.address[0] : null
                    }
                    label="Endereço"
                    margin="dense"
                    name="address"
                    onChange={handleChange}
                    value={formState.values.address || ''}
                    variant="outlined"
                />
              </Grid>
              <Grid
                  item
                  md={6}
                  xs={12}>
                <TextField
                    fullWidth
                    error={hasError('city')}
                    helperText={
                      hasError('city') ? formState.errors.city[0] : null
                    }
                    label="Cidade"
                    margin="dense"
                    name="city"
                    onChange={handleChange}
                    value={formState.values.city || ''}
                    variant="outlined"
                />
              </Grid>
              <Grid
                  item
                  md={6}
                  xs={12}>
                <TextField
                    fullWidth
                    error={hasError('neighborhood')}
                    helperText={
                      hasError('neighborhood') ? formState.errors.neighborhood[0] : null
                    }
                    label="Bairro"
                    margin="dense"
                    name="neighborhood"
                    onChange={handleChange}
                    value={formState.values.neighborhood || ''}
                    variant="outlined"
                />
              </Grid>
              <Grid
                  item
                  md={6}
                  xs={12}>
                <TextField
                    fullWidth
                    error={hasError('ownerRepublic')}
                    helperText={
                      hasError('ownerRepublic') ? formState.errors.ownerRepublic[0] : null
                    }
                    label="Proprietário"
                    margin="dense"
                    name="ownerRepublic"
                    onChange={handleChange}
                    value={formState.values.ownerRepublic || ''}
                    variant="outlined"
                />
              </Grid>
              <Grid
                  item
                  md={2}
                  xs={12}>
                <TextField
                    fullWidth
                    error={hasError('valueRepublic')}
                    helperText={
                      hasError('valueRepublic') ? formState.errors.valueRepublic[0] : null
                    }
                    label="Valor"
                    type="number"
                    margin="dense"
                    name="valueRepublic"
                    onChange={handleChange}
                    value={formState.values.valueRepublic || ''}
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
                  //disabled={!formState.isValid}
                  onClick={saveRepublicDetails}>
                Salvar
              </Button>
            </Tooltip>
          </CardActions>
        </form>
      </Card>
  );
};

RepublicDetails.propTypes = {
  className: PropTypes.string,
};

export default RepublicDetails;
