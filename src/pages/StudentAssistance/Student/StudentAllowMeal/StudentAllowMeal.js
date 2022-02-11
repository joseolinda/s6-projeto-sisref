import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  TableContainer,
  TableBody, Paper, Table, TableHead, TableRow,
  TableCell,
  IconButton, Button, Grid, Typography, Tooltip, Dialog,
  AppBar, Toolbar, FormControlLabel, Checkbox, TextField
} from '@material-ui/core';
import api from "../../../../services/api";
import Swal from "sweetalert2";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Done, Close } from "@material-ui/icons";
import Edit from "@material-ui/icons/Edit";
import CloseIcon from '@material-ui/icons/Close';
import Delete from "@material-ui/icons/Delete";

const useStyles = makeStyles(() => ({
  root: {},
  allow: {
    width: '90.0px',
    backgroundColor: '#5DE2A5',
    //display: 'inline-block',
    color: '#393A68',
    textAlign: 'center',
    height: '70px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  notAllow: {
    width: '90.0px',
    backgroundColor: '#F14D76',
    //display: 'inline-block',
    color: '#393A68',
    textAlign: 'center',
    height: '70px',
    boxSizing: 'border-box',
    border: '1px solid #F2F2F2',
    minWidth: '80px',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: 5,
    flex: 1,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const StudentAllowMeal = props => {
  const { className, history, ...rest } = props;
  const { idStudent } = props.match.params;
  const [allowMeals, setAllowMeals] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [meals, setMeals] = React.useState([]);

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      'id': null,
      'student_id': idStudent,
      'meal_id': null,
      'monday': false,
      'tuesday': false,
      'wednesday': false,
      'thursday': false,
      'friday': false,
      'saturday': false,

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

  async function loadAllowMeal(page){
    try {
      const url = 'allowstudenmealday?student_id='+idStudent;
      const response = await api.get(url);
      if (response.status === 200) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
        setAllowMeals(response.data);
      }
    } catch (error) {
      console.log(error);
      loadAlert('error', 'Erro de conexão.');
    }
  }

  async function loadMeal(){
    try {
      let url = 'allowstudenmealday/all-meal';
      const response = await api.get(url);
      setMeals(response.data);
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
  }

  useEffect(() => {
    if(idStudent){
      loadAllowMeal();
      loadMeal();
    }
  }, []);

  const handleBack = () => {
    history.goBack();
  };

  const handleClickOpen = () => {
    setFormState({
          ...formState,
          values: {
            'id': null,
            'student_id': idStudent,
            'meal_id': null,
            'monday': false,
            'tuesday': false,
            'wednesday': false,
            'thursday': false,
            'friday': false,
            'saturday': false,

          },
        }
    );
    setOpen(true);
  };

  const handleEditAllowMeal = (id) => {
    allowMeals.forEach(function logArrayElements(element, index, array) {
      if(element.id == id){
        setFormState({
              ...formState,
              values: {
                'id': element.id,
                'student_id': idStudent,
                'meal_id': element.meal_id,
                'monday': element.monday,
                'tuesday': element.tuesday,
                'wednesday': element.wednesday,
                'thursday': element.thursday,
                'friday': element.friday,
                'saturday': element.saturday,

              },
            }
        );
        return ;
      }
    });
    setOpen(true);
  };

  async  function saveAllowMeal(){
    try {

      const id = formState.values.id;
      const student_id = formState.values.student_id;
      const meal_id = formState.values.meal_id;
      const monday = formState.values.monday ? true : false;
      const tuesday = formState.values.tuesday ? true : false;
      const wednesday = formState.values.wednesday ? true : false;
      const thursday = formState.values.thursday ? true : false;
      const friday = formState.values.friday ? true : false;
      const saturday = formState.values.saturday ? true : false;
      const data = {
        student_id,
        meal_id,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
      }
      let response= {};
      let acao = "";
      if(id == null) {
        response = await api.post('allowstudenmealday', data);
        acao = "cadastrada";
      } else {
        response = await api.put('allowstudenmealday/'+id, data);
        acao = "atualizada";
      }
      if (response.status === 200) {
        loadAllowMeal();
        loadAlert('success', 'Permissão '+acao+'.');
      } else {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      }
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
  }

  async function onDeleteAllowMeal(id){
    try {
      let url = 'allowstudenmealday/'+id;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        loadAlert('success', 'Permissão excluída.');
        loadAllowMeal();
      }
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
    setOpen(false);
  }

  const onClickDelete = (id) => {
    onDeleteAllowMeal(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveAllowMeal = () => {
    setOpen(false);
    if(formState.values.meal_id == null){
      loadAlert('error', 'Informe a refeição.');
      return ;
    }
    saveAllowMeal();

  };

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

  return (
      <div>
        <div className={classes.contentHeader}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
              style={{marginBottom: '10px'}}>
            <Button variant="contained" color="primary"
                    onClick={handleClickOpen}>Nova permissão</Button>
          </Grid>

          <Paper variant="outlined" style={{marginBottom: '10px'}}>
            <Typography variant="body1" color="textPrimary" component="p" style={{margin: '5px'}}>
              { allowMeals[0] ? "Estudante: " + allowMeals[0].student.name :  "Estudante não definido"}
            </Typography>
            <Typography variant="body1" color="textPrimary" component="p" style={{margin: '5px'}}>
              { allowMeals[0] ? "Matrícula: " + allowMeals[0].student.mat :  ""}
            </Typography>
            <Typography variant="body1" color="textPrimary" component="p" style={{margin: '5px'}}>
              { allowMeals[0] ? "Curso: " + allowMeals[0].student.course.description :  ""}
            </Typography>
          </Paper>
        </div>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{fontWeight: 'bold'}}>Refeição</TableCell>
                <TableCell align="center" style={{fontWeight: 'bold'}}></TableCell>
                <TableCell align="center" style={{fontWeight: 'bold'}}>Segunda</TableCell>
                <TableCell align="center" style={{fontWeight: 'bold'}}>Terça</TableCell>
                <TableCell align="center" style={{fontWeight: 'bold'}}>Quarta</TableCell>
                <TableCell align="center" style={{fontWeight: 'bold'}}>Quinta</TableCell>
                <TableCell align="center" style={{fontWeight: 'bold'}}>Sexta</TableCell>
                <TableCell align="center" style={{fontWeight: 'bold'}}>Sábado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allowMeals.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell align="center" component="th" scope="row">
                      {result.meal.description}
                    </TableCell>
                    <TableCell  className={classes.row} align="center" component="th" scope="row">
                      <Tooltip title="Deletar permissão">
                        <Button
                            onClick={() => onClickDelete(result.id)}>
                          <Delete fontSize="medium"/>
                        </Button>
                      </Tooltip>
                      <Tooltip title="Editar permissão">
                        <Button
                            onClick={() => handleEditAllowMeal(result.id)}>
                          <Edit fontSize="medium"/>
                        </Button>
                      </Tooltip>
                    </TableCell>

                    { result.monday == 1 ?
                    <TableCell align="center" className={classes.allow}>
                      <Done />
                    </TableCell> :
                    <TableCell align="center" className={classes.notAllow}>
                      <Close />
                    </TableCell> }

                    { result.tuesday == 1 ?
                        <TableCell align="center" className={classes.allow}>
                          <Done />
                        </TableCell> :
                        <TableCell align="center" className={classes.notAllow}>
                          <Close />
                        </TableCell> }

                    { result.wednesday == 1 ?
                        <TableCell align="center" className={classes.allow}>
                          <Done />
                        </TableCell> :
                        <TableCell align="center" className={classes.notAllow}>
                          <Close />
                        </TableCell> }

                    { result.thursday == 1 ?
                        <TableCell align="center" className={classes.allow}>
                          <Done />
                        </TableCell> :
                        <TableCell align="center" className={classes.notAllow}>
                          <Close />
                        </TableCell> }

                    { result.friday == 1 ?
                        <TableCell align="center" className={classes.allow}>
                          <Done />
                        </TableCell> :
                        <TableCell align="center" className={classes.notAllow}>
                          <Close />
                        </TableCell> }

                    { result.saturday == 1 ?
                        <TableCell align="center" className={classes.allow}>
                          <Done />
                        </TableCell> :
                        <TableCell align="center" className={classes.notAllow}>
                          <Close />
                        </TableCell> }

                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/*DIALOG*/}
        <Dialog fullScreen open={open} onClose={handleClose}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Permissão para refeição
              </Typography>
              <Button autoFocus color="inherit" onClick={handleSaveAllowMeal}>
                Salvar
              </Button>
            </Toolbar>
          </AppBar>
          <TextField
              style={{marginTop: '20px'}}
              fullWidth
              label="Refeição"
              margin="dense"
              name="meal_id"
              value={formState.values.meal_id}
              onChange={handleChange}
              select
              // eslint-disable-next-line react/jsx-sort-props
              SelectProps={{ native: true }}
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
          <FormControlLabel
              control={
                <Checkbox
                    checked={formState.values.monday}
                    name="monday"
                    color="primary"
                    onChange={handleChange}
                />
              }
              label="Segunda-feira"
          />
          <FormControlLabel
              control={
                <Checkbox
                    checked={formState.values.tuesday}
                    name="tuesday"
                    color="primary"
                    onChange={handleChange}
                />
              }
              label="Terça-feira"
          />
          <FormControlLabel
              control={
                <Checkbox
                    checked={formState.values.wednesday}
                    name="wednesday"
                    color="primary"
                    onChange={handleChange}
                />
              }
              label="Quarta-feira"
          />
          <FormControlLabel
              control={
                <Checkbox
                    checked={formState.values.thursday}
                    name="thursday"
                    color="primary"
                    onChange={handleChange}
                />
              }
              label="Quinta-feira"
          />
          <FormControlLabel
              control={
                <Checkbox
                    checked={formState.values.friday}
                    name="friday"
                    color="primary"
                    onChange={handleChange}
                />
              }
              label="Sexta-feira"
          />
          <FormControlLabel
              control={
                <Checkbox
                    checked={formState.values.saturday}
                    name="saturday"
                    color="primary"
                    onChange={handleChange}
                />
              }
              label="Sábado"
          />
        </Dialog>
      </div>
  );
};

StudentAllowMeal.propTypes = {
  className: PropTypes.string,
};

export default StudentAllowMeal;
