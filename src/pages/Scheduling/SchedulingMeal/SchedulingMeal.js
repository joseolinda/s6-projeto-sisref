import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import api from "../../../services/api";
import validate from "validate.js";
import {
    TableContainer, Card,
    TableBody, Paper, Table, TableHead, TableRow,
    TableCell, CardHeader, Tooltip,
    IconButton, Typography, TablePagination, TextField, Grid, Button
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab/';
import Swal from "sweetalert2";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';
import FindInPage from "@material-ui/icons/SearchSharp";
import { teal,green } from '@material-ui/core/colors';
import {getErrorMessage} from "../../../helpers/error";

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
        marginBottom: '1em',
    },
}));

const SchedulingMeal = props =>{

    const { className, history, ...rest } = props;
    const [student, setStudent] = useState([]);
    const [mealsAll, setMealsALl] = React.useState([]);
    const [mealSearch, setMealSearch] = React.useState([]);
    const [dateSearch, setDateSearch] = React.useState('2020-05-20');
    const [students, setStudents] = useState([]);
    const [open, setOpen] = React.useState(false);

    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);

    const [formState, setFormState] = useState({
        isValid: false,
        values: {

        },
        touched: {},
        errors: {}
      });

    const classes = useStyles();

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

    async function loadStudentsSchedulingMeal(page){
        const date = dateSearch;
        if(!date){
            date = handleData();
        }
        try {
            let url = 'scheduling/list-by-date?page='+page+'&date='+date;
            const response = await api.get(url);
            setStudents(response.data.data);
            if (response.status === 202) {
                if(response.data.message){
                  loadAlert('error', response.data.message);
                }
            }
        } catch (error) {
            loadAlert('error', getErrorMessage (error));
        }
    }

    async function loadMealAll(){
        try {
            let url = 'all/meals';
            const response = await api.get(url);
            setMealsALl(response.data);
            if (response.status === 202) {
                if(response.data.message){
                  loadAlert('error', response.data.message);
                }
            }
        } catch (error) {
            loadAlert('error', getErrorMessage (error));
        }
    }

    async function loadStudent(){
        const mat = formState.values.mat;
        try {
            let url = 'all/students-by-mat-or-cod?mat='+mat;
            const response = await api.get(url);
            setStudent(response.data);
            if (response.status === 202) {
                if(response.data.message){
                  loadAlert('error', response.data.message);
                }
            }
        } catch (error) {
            loadAlert('error', getErrorMessage (error));
        }
    }

    async function onSchedunlingObject(){
        const date = dateSearch;
        const student_id = student.id;
        const meal_id = mealSearch;
        try {
            const data = {
                date,
                student_id,
                meal_id,
            }

          let url = 'scheduling';
          const response = await api.post(url, data);

          if (response.status === 202) {
            if(response.data.message){
              loadAlert('error', response.data.message);
            }
          } else {
            loadAlert('success', 'Agendamento do aluno registrado.');
            loadStudentsSchedulingMeal(page+1);
          }
        } catch (error) {
          loadAlert('error', getErrorMessage (error));
        }
        setOpen(false);
      }

      useEffect(() => {
        loadMealAll();

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

        setDateSearch(dateString);

        loadStudentsSchedulingMeal(1);
    }, []);


    const handlePageChange = (event, page) => {
        loadStudentsSchedulingMeal(page+1)
        setPage(page);
    };

    const handleRowsPerPageChange = event => {
        setRowsPerPage(event.target.value);
    };

    useEffect(() => {
        const errors = validate(formState.values);

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

    function handleData(){
        let data=new Date()
        let dia=data.getDate();
        let mes=data.getMonth();
        let ano=data.getFullYear();
        data = dia + '/' + (mes++) + '/' + ano;
        let split = data.split('/');
        let novadata = split[1] + "/" +split[0]+"/"+split[2];
        let data_americana = new Date(novadata);
        return data_americana;
    }

    const handleBack = () => {
        history.goBack();
    };

    const handleChangeMeal = (event) => {
        setMealSearch(event.target.value);
    };

    const handleDateChange = (event) => {
        setDateSearch(event.target.value);
    };

    const onClickSearch = (event) => {
        loadStudent();
    };

    return(
        <div>
            <div className={classes.contentHeader}>
                <IconButton onClick={handleBack}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h2" className={classes.title}>{'Agendamento das Refeições'}</Typography>
            </div>
            <div className={classes.row}>
                <Card>
                    <Alert   severity="info">
                    No agendamento das refeições realizadas por um usuário da Assistência Estudantil, o sistema apenas verifica a inatividade e data de atualização cadastral do aluno. Nesta funcionalidade, não são verificadas as permissões para refeições concedidas ao aluno.
                    </Alert>         
                </Card>
            </div>
            <br></br>
            <Grid
                container
                spacing={4}
                style={{marginBottom: '10px'}}>
                 <Grid
                    item
                    md={3}
                    xs={12}>
                    <TextField
                        key="dateSearch"
                        fullWidth
                        type="date"
                        label="Data"
                        margin="dense"
                        name="dateSearch"
                        onChange={handleDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={dateSearch}
                        variant="outlined"
                    />
                </Grid>
                <Grid
                    item
                    md={3}
                    xs={12}>
                    <TextField
                        fullWidth
                        label="Refeição"
                        margin="dense"
                        name="meal_id"
                        value={mealSearch}
                        onChange={handleChangeMeal}
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        variant="outlined">
                        <option value={null} ></option>
                        {mealsAll.map(result => (
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
                        type="number"
                        label="Código ou matrícula"
                        margin="dense"
                        name="mat"
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formState.values.mat || ""}
                        variant="outlined"
                    />
                </Grid>
                <Grid
                    item
                    md={2}
                    xs={12}>
                    <Tooltip title="Pesquisar" >
                        <Button
                            onClick={onClickSearch}>
                            <FindInPage fontSize="large"/>
                        </Button>
                    </Tooltip>
                </Grid>
            </Grid>
                 <Grid
                    container
                    spacing={1}>
                    <Grid
                        item
                        md={12}
                        xs={12}>
                            <Table>
                                <TableBody>
                                    <Card key={student.id}
                                        style={{marginTop: '10px'}}>
                                            {student == ""  ?
                                                <CardHeader
                                                className={classes.head}
                                                avatar={
                                                <div>
                                                    <Typography variant="body1" color="textPrimary" >
                                                        {'Matrícula : '}
                                                    </Typography>
                                                    <Typography variant="body1" color="textPrimary" >
                                                        {'Nome:'}
                                                    </Typography>
                                                    <Typography variant="body1" color="textPrimary" >
                                                        {'Data da próxima atualização cadastral: '}
                                                    </Typography>
                                                </div>
                                                }
                                                />
                                                :
                                                <CardHeader
                                                className={classes.head}
                                                avatar={
                                                    <div>
                                                    <Typography variant="body1" color="textPrimary" >
                                                        {'Matrícula: '}
                                                        {student.mat == null ? " ---" : student.mat}
                                                    </Typography>
                                                    <Typography variant="body1" color="textPrimary" >
                                                        {'Nome: '}
                                                        {student.name == null ? "---" : student.name}
                                                    </Typography>
                                                    <Typography variant="body1" color="textPrimary" >
                                                        {'Data da próxima atualização cadastral: '}
                                                        {student.dateValid  == null ? "--" : student.dateValid.split('-').reverse().join('/') }
                                                    </Typography>
                                                    </div>
                                                }
                                                action={
                                                <div>
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        justify="flex-end"
                                                        alignItems="center">
                                                        <Tooltip title="Confirmar" >
                                                            <IconButton
                                                                style={{backgroundColor: green[400], }}
                                                                className={classes.buttonAdd}
                                                                onClick={onSchedunlingObject}>
                                                                    <AddIcon fontSize="medium" style={{color: "#fff", }}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                </div>
                                                }
                                                />
                                            }

                                    </Card>
                                </TableBody>
                            </Table>
                    </Grid>
                </Grid>
                <br></br>
                <div className={classes.content}>

                 <TableContainer component={Paper}>
                <TablePagination
                    component="div"
                    count={total}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[20]}
                />
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Id Ref</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Cód Estudante</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Nome</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Curso</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Refeição</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Data</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Situação</TableCell>
                        </TableRow>
                    </TableHead>
                        {students == null ?
                        <TableBody>
                            <TableRow key={0}>
                                <TableCell align="center" colSpan={7} className={classes.headTable}> Sem registro</TableCell>
                            </TableRow>
                        </TableBody>
                        :
                            <TableBody>
                            {students.map(result => (
                                <TableRow key={result.id}>
                                    <TableCell align="center"  className={classes.headTable}>{result.id}</TableCell>
                                    <TableCell align="center"  className={classes.headTable}>{result.student.id}</TableCell>
                                    <TableCell align="center" className={classes.headTable}>{result.student.name}</TableCell>
                                    <TableCell align="center" className={classes.headTable}>{result.student.course.description}</TableCell>
                                    <TableCell align="center" className={classes.headTable}>{result.meal.description}</TableCell>
                                    <TableCell align="center" className={classes.headTable}>{result.date}</TableCell>
                                    <TableCell align="center" className={classes.headTable}>{result.student.active == 1 ?"Ativo": "Inativo"}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        }

                </Table>
                    <TablePagination
                        component="div"
                        count={total}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleRowsPerPageChange}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[20]}
                    />
                </TableContainer>
                 </div>
        </div>
    )
}
SchedulingMeal.propTypes = {
    history: PropTypes.object
  };

export default SchedulingMeal;
