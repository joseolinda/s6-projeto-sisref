import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Done, Close } from "@material-ui/icons";
import {
  Card,
  CardHeader,
  TableContainer,
  TableBody, Paper, Table, TableHead, TableRow,
  TableCell,
  Divider,
  Grid,
  FormControlLabel, Switch,
  TextField, IconButton,
  Button, Typography, Tooltip
} from '@material-ui/core';
import Swal from "sweetalert2";
import api from '../../../services/api';
import { ID_USER } from "../../../services/auth";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

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
  }));

const InformationStudent = props => {
    const { className, history, ...rest } = props;
    const classes = useStyles();
    const [formState, setFormState] = useState({
        isValid: false,
        values: {},
        touched: {},
        errors: {}
      });
    const [allowMeals, setAllowMeals] = useState([]);
    const idStudent = localStorage.getItem("@rucedro-id-user");
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
      const url = 'student/schedulings/allows-meal-by-day';
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

  async function findAStudent(){
    try {
        const response = await api.get('all/show-student/'+idStudent);
        const response2 = await api.get('all/show-user/'+idStudent);
        if (response.status === 200) {
          if(response.data.message){
            loadAlert('error', response.data.message);
          }
          setFormState(formState => ({
            values: {
              'id': response.data.id,
              'name': response.data.name,
              'mat':response.data.mat,
              'course': response.data.course.description,
              'dateValid': response.data.dateValid,
              'email': response2.data.email,
            },
            touched: {
              ...formState.touched,
            }
          }));
        }
      } catch (error) {
        loadAlert('error', 'Erro de conexão.');
      }
  }
  useEffect(() => {
    findAStudent();
    loadAllowMeal();
  }, []);

  const handleBack = () => {
    history.goBack();
  };

  return(
    <div>
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
              title="INFORMAÇÕES ACADÊMICAS"/>
               <div style={{padding:"0px 15px 15px 15px"}}>
              <Grid
                container
                spacing={2}>
                <Grid
                  item
                  md={3}
                  xs={12}>
                <TextField
                    fullWidth
                    disabled
                    label="PIN / RU Code"
                    margin="dense"
                    name="id"
                    value={formState.values.id || ''}
                    variant="outlined"
                />
              </Grid>
              <Grid
                  item
                  md={5}
                  xs={12}>
                <TextField
                    fullWidth
                    disabled
                    label="Nome"
                    margin="dense"
                    name="name"
                    value={formState.values.name || ''}
                    variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={4}
                xs={12}>
                <TextField
                  fullWidth
                  disabled
                  type="number"
                  label="Matricula"
                  margin="dense"
                  name="mat"
                  value={formState.values.mat || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                  item
                  md={5}
                  xs={12}>
                <TextField
                    fullWidth
                    disabled
                    label="Email"
                    margin="dense"
                    name="email"
                    type="email"
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
                  disabled
                  type="date"
                  label="Data de validade"
                  margin="dense"
                  name="dateValid"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formState.values.dateValid || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
              item
              md={4}
              xs={12}>
                <TextField
                  fullWidth
                  disabled
                  label="Curso"
                  margin="dense"
                  name="course"
                  value={formState.values.course || ''}
                  variant="outlined">
                </TextField>
              </Grid>
            </Grid>
            </div>
          <Divider />
        </form>
    </Card>
    <br></br>
    <TableContainer component={Paper}>
    <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{fontWeight: 'bold'}}>Refeição</TableCell>
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
    </div>
  )
}

InformationStudent.propTypes = {
    className: PropTypes.string,
  };
export default InformationStudent;