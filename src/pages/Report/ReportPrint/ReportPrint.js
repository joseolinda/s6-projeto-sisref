import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useLocation} from 'react-router-dom';
import { makeStyles} from '@material-ui/styles';
import Swal from "sweetalert2";
import api from "../../../services/api";
import {
    TableContainer, Container, Divider,
    TableBody, Paper, Table, TableHead, TableRow,
    TableCell, CircularProgress,
    IconButton, Typography, TablePagination, TextField, Grid, Button
} from '@material-ui/core';
import {getErrorMessage} from "../../../helpers/error";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '12px',
        fontSize: '12px',
    },
    contaier: {
        height: '80%',
        width: '100%',
        fontSize: '12px',
    },
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 10,
    },
    cell:{
        fontSize: 12,
    },
    noprint: {
        '@media print' : {
            display: 'none',
          }
    },
    title: {
        marginLeft: 5,
        flex: 1,
    },
    row: {
        border: '1px solid #000',
        display: 'flex',
        alignItems: 'center',
    },
}));

const ReportPrint = props => {
    const { className, history, ...rest } = props;
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const date =  searchParams.get('date');
    const meal_id =  searchParams.get('meal_id');
    const situation =  searchParams.get('situation');
    const [results, setResults] = useState([]);
    const [meal, setMeal] = useState([]);
    const [course, setCourse] = useState([]);
    const name_user = localStorage.getItem("@rucedro-name-user");

    if(searchParams.get('course_id')){
        var course_id =  searchParams.get('course_id');
        //console.log(date, meal_id, situation, course_id);
    }

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

    const classes = useStyles();

    async function loadMeals(page){
        try {
            let url = 'report/list-scheduling-print?date='+date;
            if(meal_id > 0){
                url += '&meal_id='+meal_id;
            }
            if(situation != 0  && situation != '' && situation != null){
                url += '&situation='+situation;
            }
            if(course_id > 0){
                url += '&course_id='+course_id;
            }
            const response = await api.get(url);
            if (response.status === 200) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                }
                setResults(response.data[0]);
            }
        } catch (error) {
            console.log(error);
            loadAlert('error', getErrorMessage (error));
        }
    }

    async function loadMeal(){
        try {
            let url = 'meal/show/'+meal_id;
            const response = await api.get(url);
            setMeal(response.data);
        } catch (error) {
            loadAlert('error', getErrorMessage (error));
        }
    }

    async function loadCourse(){
        try {
            let url = 'course/show/'+course_id;
            const response = await api.get(url);

            setCourse(response.data);
        } catch (error) {
            loadAlert('error', getErrorMessage (error));
        }
    }

    useEffect(() => {
        loadMeals();
        loadMeal();
        if(course_id){
            loadCourse();
        }
        
    }, []);

    return(
        <div className={classes.root}>
        <Container maxWidth="lg">
            <div className={classes.noprint}>
                <Button variant="contained" color="primary" onClick={() => window.print()}> Imprimir</Button>
            </div>
            <br></br>
            <div className={classes.contentHeader}>
                <Paper variant="outlined" style={{marginBottom: '10px'}}>
                    <Typography align="center" variant="body1" color="textPrimary" component="p"
                        style={{margin: '15px', fontWeight: 'bold'}}>
                       Relatório de refeições {results.meal_description}  
                    </Typography>
                </Paper>
                <Paper variant="outlined" style={{marginBottom: '10px'}}>
                    <Table className={classes.table} aria-label="a dense table">
                        <TableRow >
                            <TableCell >
                                <img
                                    height="30px"
                                    alt="Logo"
                                    src="/images/ifce.png"
                                />
                            </TableCell>
                            <TableCell style={{fontWeight: 'bold'}} align="center" >Usuário: {name_user}</TableCell>
                            <TableCell style={{fontWeight: 'bold'}} align="right" >Data: {date.split('-').reverse().join('/')}</TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell style={{fontWeight: 'bold'}}  >Refeição: {meal.description}</TableCell>
                        {course != 0?  <TableCell align="center" style={{fontWeight: 'bold'}}  >Curso: {course.description}</TableCell> 
                        :<TableCell style={{fontWeight: 'bold'}} align="center" ></TableCell>}
                        <TableCell style={{fontWeight: 'bold'}} align="center" ></TableCell>
                        </TableRow>
                    </Table> 
                </Paper>
                <TableContainer >
                     
                 </TableContainer>
            </div>
           
            <TableContainer size="small" component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableRow>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Data/Hora</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Cód.</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Estudante</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Curso</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Refeição</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Situação</TableCell>
                        </TableRow>
                        {results ? results.map((result) => (
                            <TableRow border={1} className={classes.cell}key={result.id}>
                                <TableCell align="center" component="th" scope="row">
                                    {result.date.split('-').reverse().join('/') + ' / ' + result.time }
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    {
                                        result.id < 10 ? '00000' + result.id :
                                            result.id < 100 ? '0000' + result.id :
                                                result.id < 1000 ? '000' + result.id :
                                                    result.id < 10000 ? '00' + result.id :
                                                        result.id < 100000 ? '0' + result.id :
                                                            result.id
                                    }
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    { result.name}
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    { result.description}
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    {result.meal_description}
                                </TableCell>

                                { result.wasPresent == 1 ?
                                    <TableCell align="center" className={classes.allow}>
                                        Presente
                                    </TableCell> :
                                    result.absenceJustification != null &&
                                    result.absenceJustification != null ?
                                        <TableCell align="center">
                                            Justificado
                                        </TableCell> :
                                        <TableCell align="center" className={classes.notAllow}>
                                            Ausente
                                        </TableCell>}
                            </TableRow>
                        )): null}
                </Table>
            </TableContainer>
            </Container>
            </div>
    )
}

ReportPrint.propTypes = {
    className: PropTypes.string,
    result: PropTypes.object
};


export default ReportPrint;