import {
  Card,
  CardHeader, Divider,
  Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, useMediaQuery
} from '@material-ui/core';
import { Close, Done } from "@material-ui/icons";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import Padding from '../../../components/Padding';
import api from '../../../services/api';
import { getErrorMessage } from '../../../helpers/error';

const useStyles = makeStyles((theme) => ({
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
    mealCell: {
      backgroundColor: '#fafafa',
      border: '1px solid #F2F2F2',
    }
  }));

const WEEK_DAYS = [
  { day: 'monday', label: 'Segunda' },
  { day: 'tuesday', label: 'Terça' },
  { day: 'wednesday', label: 'Quarta' },
  { day: 'thursday', label: 'Quinta' },
  { day: 'friday', label: 'Sexta' },
  { day: 'saturday', label: 'Sábado' },
];

const InformationStudent = props => {
    const mediumScreen = useMediaQuery((theme) => theme.breakpoints.up('sm'));
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
      loadAlert('error', getErrorMessage (error));
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
        loadAlert('error', getErrorMessage (error));
      }
  }
  useEffect(() => {
    findAStudent();
    loadAllowMeal();
  }, []);

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Padding sx={{ px: [2, null, 0] }}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off">
          <div className={classes.contentHeader}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
          </div>
          <CardHeader subheader="" title="INFORMAÇÕES ACADÊMICAS" />
          <div style={{ padding: "0px 15px 15px 15px" }}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  disabled
                  label="PIN / RU Code"
                  margin="dense"
                  name="id"
                  value={formState.values.id || ""}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  disabled
                  label="Nome"
                  margin="dense"
                  name="name"
                  value={formState.values.name || ""}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  disabled
                  type="number"
                  label="Matricula"
                  margin="dense"
                  name="mat"
                  value={formState.values.mat || ""}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  disabled
                  label="Email"
                  margin="dense"
                  name="email"
                  type="email"
                  value={formState.values.email || ""}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={3} xs={12}>
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
                  value={formState.values.dateValid || ""}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  disabled
                  label="Curso"
                  margin="dense"
                  name="course"
                  value={formState.values.course || ""}
                  variant="outlined"
                ></TextField>
              </Grid>
            </Grid>
          </div>
          <Divider />
        </form>
      </Card>
      <br></br>
      <TableContainer component={Paper}>
        {mediumScreen ? (
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Refeição
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Segunda
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Terça
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Quarta
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Quinta
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Sexta
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Sábado
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allowMeals.map((result) => (
                <TableRow key={result.id}>
                  <TableCell align="center" component="th" scope="row">
                    {result.meal.description}
                  </TableCell>
                  {result.monday == 1 ? (
                    <TableCell align="center" className={classes.allow}>
                      <Done />
                    </TableCell>
                  ) : (
                    <TableCell align="center" className={classes.notAllow}>
                      <Close />
                    </TableCell>
                  )}

                  {result.tuesday == 1 ? (
                    <TableCell align="center" className={classes.allow}>
                      <Done />
                    </TableCell>
                  ) : (
                    <TableCell align="center" className={classes.notAllow}>
                      <Close />
                    </TableCell>
                  )}

                  {result.wednesday == 1 ? (
                    <TableCell align="center" className={classes.allow}>
                      <Done />
                    </TableCell>
                  ) : (
                    <TableCell align="center" className={classes.notAllow}>
                      <Close />
                    </TableCell>
                  )}

                  {result.thursday == 1 ? (
                    <TableCell align="center" className={classes.allow}>
                      <Done />
                    </TableCell>
                  ) : (
                    <TableCell align="center" className={classes.notAllow}>
                      <Close />
                    </TableCell>
                  )}

                  {result.friday == 1 ? (
                    <TableCell align="center" className={classes.allow}>
                      <Done />
                    </TableCell>
                  ) : (
                    <TableCell align="center" className={classes.notAllow}>
                      <Close />
                    </TableCell>
                  )}

                  {result.saturday == 1 ? (
                    <TableCell align="center" className={classes.allow}>
                      <Done />
                    </TableCell>
                  ) : (
                    <TableCell align="center" className={classes.notAllow}>
                      <Close />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  component="th"
                  style={{ fontWeight: "bold" }}
                >
                  Refeição
                </TableCell>
                {allowMeals.map((result) => (
                  <TableCell className={classes.mealCell}>
                    {result.meal.description}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {WEEK_DAYS.map((day) => (
                <TableRow key={day.day}>
                  <TableCell
                    align="center"
                    component="th"
                    style={{ fontWeight: "bold" }}
                    variant="head"
                  >
                    {day.label}
                  </TableCell>
                  {allowMeals.map((result) =>
                    result[day.day] == 1 ? (
                      <TableCell align="center" className={classes.allow}>
                        <Done />
                      </TableCell>
                    ) : (
                      <TableCell align="center" className={classes.notAllow}>
                        <Close />
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Padding>
  );
}

InformationStudent.propTypes = {
    className: PropTypes.string,
  };
export default InformationStudent;