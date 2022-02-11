
import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import api from "../../../services/api";
import validate from "validate.js";
import {
    TableContainer,
    TableBody, Paper, Table, TableHead, TableRow,
    TableCell, Tooltip,
    IconButton, Typography, TextField, Grid, Button
} from '@material-ui/core';
import Swal from "sweetalert2";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FindInPage from "@material-ui/icons/SearchSharp";

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

const RegisteredMeals = props =>{
    const { className, history, ...rest } = props;
    const [mealsAll, setMealsALl] = React.useState([]);
    const [mealSearch, setMealSearch] = React.useState([]);
    const [dateSearch, setDateSearch] = React.useState([]);
    const [qtdMeals, setQtdMeals] = React.useState([]);

    const [formState, setFormState] = useState({
        isValid: false,
        values: {},
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

    async function loadRegisteredMeals(page){
        const date = dateSearch;
        const meal_id = mealSearch;
        const data = {
            date,
            meal_id,
        }
        try {
            let url = 'confirm-meals/registered';
            const response = await api.post(url, data);

            if (response.status === 202) {
                if(response.data.message){
                  loadAlert('error', response.data.message);
                }
            }
            else {
                setQtdMeals(response.data);
                loadAlert('success', 'Consulta efetuada.');
              }
        } catch (error) {
            loadAlert('error', 'Erro de conexão.');
        }
    }

    async function loadMealAll(){
        try {
            let url = 'meal/all';
            const response = await api.get(url);
            setMealsALl(response.data);
            if (response.status === 202) {
                if(response.data.message){
                  loadAlert('error', response.data.message);
                }
            } 
        } catch (error) {
            loadAlert('error', 'Erro de conexão.');
        }
    }

    useEffect(() => {
        loadMealAll();
    }, []);


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
        loadRegisteredMeals();
    };


    return (
        <div>
            <div className={classes.contentHeader}>
                <IconButton onClick={handleBack}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" className={classes.title}>{'Quantidade de refeições solicitadas'}</Typography>
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
                 
                <div className={classes.content}>
                <Paper variant="outlined" style={{marginBottom: '10px'}}>
                    <Typography align="center" variant="body1" color="textPrimary" component="p"
                                style={{margin: '15px', fontWeight: 'bold'}}>
                                 Quantidade de registros
                    </Typography>
                </Paper>
                <Paper variant="outlined" style={{marginBottom: '10px'}}>
                    <Typography align="center" variant="body1" color="textPrimary" component="p"
                                style={{margin: '15px', fontWeight: 'bold'}}>
                                  {qtdMeals === 0 ? "Sem registro" : qtdMeals}
                    </Typography>
                </Paper>
                 </div>
                 
        </div>
    )
}

RegisteredMeals.propTypes = {
    history: PropTypes.object
  };

export default RegisteredMeals;