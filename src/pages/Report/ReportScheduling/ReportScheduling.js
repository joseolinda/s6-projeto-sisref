import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    TableContainer, Tooltip,
    TableBody, Paper, Table, TableHead, TableRow,
    TableCell,
    IconButton, Typography, TablePagination, TextField, Grid, Button
} from '@material-ui/core';
import api from "../../../services/api";
import Swal from "sweetalert2";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FindInPage from "@material-ui/icons/SearchSharp";
import PrintIcon from '@material-ui/icons/Print';
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
    },
}));

const ReportScheduling = props => {
    const { className, history, ...rest } = props;
    const [meals, setMeals] = useState([]);
    const [course, setCourse] = useState([]);
    const [course_id, setCourseId] = useState('2020-05-20');
    const [mealsAll, setMealsALl] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalWasPresent, setTotalWasPresent] = useState(0);
    const [dateSearch, setDateSearch] = React.useState('2020-05-20');
    const [mealSearch, setMealSearch] = React.useState('2020-05-20');
    const [situationSearch, setSituationSearch] = React.useState(0);
    const level_user = localStorage.getItem("@rucedro-acess-level-user");
    
    const situations = [
        {
            value: 'A',
            label: 'Ausentes'
        },
        {
            value: 'J',
            label: 'Justificados'
        },
        {
            value: 'P',
            label: 'Presentes'
        }
    ];

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

    async function loadMeals(page){
        try {
            let url = 'report/list-scheduling?page='+page+'&date='+dateSearch;
            if(mealSearch > 0){
                url += '&meal_id='+mealSearch;
            }
            if(situationSearch != 0  && situationSearch != '' && situationSearch != null){
                url += '&situation='+situationSearch;
            }
            if(course_id > 0){
                url += '&course_id='+course_id;
            }
            const response = await api.get(url);
            if (response.status === 200) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                }
                setMeals([]);
                setMeals(response.data[0].data);
                setTotal(response.data[0].total);
                setTotalWasPresent(response.data[1].qtdWasPresent);
            }
        } catch (error) {
            console.log(error);
            loadAlert('error', getErrorMessage (error));
        }
    }

    async function loadMealAll(){
        try {
            let url = 'report/all-meal';
            const response = await api.get(url);
            setMealsALl(response.data);
        } catch (error) {
            loadAlert('error', getErrorMessage (error));
        }
    }

    async function loadCourseAll(){
        try {
            let url = 'report/all-course';
            const response = await api.get(url);
            setCourse(response.data);
        } catch (error) {
            loadAlert('error', getErrorMessage (error));
        }
    }

    const handlePageChange = (event, page) => {
        loadMeals(page+1)
        setPage(page);
    };

    const handleRowsPerPageChange = event => {
        setRowsPerPage(event.target.value);
    };


    useEffect(() => {
        loadMealAll();
        loadCourseAll();

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
        loadMeals(1);

    }, []);

    const handleBack = () => {
        history.goBack();
    };

    const handleDateChange = (event) => {
        setDateSearch(event.target.value);
    };

    const handleChangeMeal = (event) => {
        setMealSearch(event.target.value);
    };

    const handleChangeSituaiton= (event) => {
        setSituationSearch(event.target.value);
    };

    const handleChangeCourse= (event) => {
        setCourseId(event.target.value);
    };

    const onClickSearch = (event) => {
        loadMeals(page);
    };

    const onClickPrint = (event) => {
        //history.push('/report-print');
        let url = '';
        if(level_user === 'NUTRI'){
            url = '/report-prints?date='+dateSearch;
        }
        else{
            url = '/report-print?date='+dateSearch;
        }
       
        if(mealSearch > 0){
            url += '&meal_id='+mealSearch;
        }
        if(situationSearch != 0  && situationSearch != '' && situationSearch != null){
            url += '&situation='+situationSearch;
        }
        if(course_id > 0){
            url += '&course_id='+course_id;
        }
        let newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    };
    
    return (
        <div>
            <div className={classes.contentHeader}>
            
                <IconButton onClick={handleBack}>
                    <ArrowBackIcon />
                </IconButton>
            <div className={classes.row}>
                <Typography variant="h5" className={classes.title}>{'Relatório de refeições'}</Typography>
            </div>
            </div>
            <br/>
            <Grid
                container
                spacing={3}
                style={{marginBottom: '10px'}}>
                <Grid
                    item
                    md={3}
                    xs={10}>
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
                    md={2}
                    xs={10}>
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
                    md={2}
                    xs={10}>
                    <TextField
                        fullWidth
                        label="Situação"
                        margin="dense"
                        name="situation"
                        value={situationSearch}
                        onChange={handleChangeSituaiton}
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        variant="outlined">
                        <option value={null} ></option>
                        {situations.map(result => (
                            <option
                                key={result.value}
                                value={result.value}>
                                {result.label}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid
                    item
                    md={2}
                    xs={10}>
                    <TextField
                        fullWidth
                        label="Curso"
                        margin="dense"
                        name="course_id"
                        value={course_id}
                        onChange={handleChangeCourse}
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        variant="outlined">
                        <option value={null} ></option>
                        {course.map(result => (
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
                    md={1}
                    xs={10}>
                    <Tooltip title="Pesquisar">
                        <Button
                            onClick={onClickSearch}>
                            <FindInPage fontSize="large"/>
                        </Button>
                    </Tooltip>
                </Grid>
                {
                    meals != "" && meals != null && level_user != 'RECEPCAO'? 
                    <Grid
                        item
                        md={2}
                        xs={12}>
                        <Tooltip title="Imprimir">
                            <Button
                                onClick={()=>onClickPrint()}>
                                <PrintIcon fontSize="large"/>
                            </Button>
                        </Tooltip>
                    </Grid>
                    :
                    null
                }
                
            </Grid>
            <div className={classes.contentHeader}>
                <Paper variant="outlined" style={{marginBottom: '10px'}}>
                    <Typography align="center" variant="body1" color="textPrimary" component="p"
                                style={{margin: '15px', fontWeight: 'bold'}}>
                        { total == 0 ?  "Sem dados." : total < 2 ?
                            total + " refeição. " + totalWasPresent + " presente(s). " + (total - totalWasPresent)  + " ausente(s)."
                            :  total + " refeições. " + totalWasPresent + " presente(s). " + (total - totalWasPresent)  + " ausente(s)."}

                    </Typography>
                </Paper>
            </div>
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
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Date/Hora</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Cód.</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Estudante</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Curso</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Refeição</TableCell>
                            <TableCell align="center" style={{fontWeight: 'bold'}}>Situação</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {meals ? meals.map((result) => (
                            <TableRow key={result.id}>
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
                    </TableBody>
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
    );
};

ReportScheduling.propTypes = {
    className: PropTypes.string,
};

export default ReportScheduling;
