import React, {useEffect, useState} from "react";
import clsx from 'clsx';
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import PerfectScrollbar from 'react-perfect-scrollbar';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import FormLabel from '@material-ui/core/FormLabel';
import api from '../../../services/api';
import {DialogQuestione} from "../../../components";
import Swal from "sweetalert2";
import * as moment from 'moment';
import 'moment/locale/pt-br';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import ScheduleIcon from '@material-ui/icons/Schedule';
import FindInPage from '@material-ui/icons/SearchSharp';
import {green } from '@material-ui/core/colors';


import {
    Card, Grid,TextField,
    CardActions,
    CardContent,
    LinearProgress,
    Table, IconButton,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination, Tooltip, Button
  } from '@material-ui/core';

  const useStyles = makeStyles((theme) => ({
    root: {},
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    grupButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
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
    justification: {
      width: '90.0px',
      backgroundColor: '#009be5',
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
    notPresent: {
      width: '90.0px',
      backgroundColor: '#F5A623',
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


const Ticket = props => {
    const { className, history } = props;
    const classes = useStyles();
    const [value, setValue] = React.useState('to-use');
    const [schedulingsMeal, setSchedulingsMeal] = useState([]);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dateMel, setDateMeal] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [idMealCanceled, setIdMealCanceled] = React.useState(0);

    //configuration alert
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 5000,
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

    async function loadschedulingsMeal(page){
        setLoading(true);
        try {
          let url = 'student/schedulings';
          if(value === 'to-use'){
            url += '/to-use?page='+page;
          }
          else if(value === 'used'){
            url += '/used?page='+page;
          }
          else if(value === 'no-used'){
            url += '/not-used?page='+page;
          }
          else if(value === 'canceled'){
            url += '/canceled?page='+page;
          }
          const response = await api.get(url);
          setTotal(response.data.total);
          setSchedulingsMeal(response.data.data);
        } catch (error) {
          console.log('erro função', error);
          loadAlert('error', 'Erro de conexão.');
        }
        setLoading(false);
    }

    async function handleMealCancel (){
        const meal_id = idMealCanceled;
        const date = dateMel;
        const data = {
          meal_id, date
        }
        let response= {};
        try {
          response = await api.put('student/schedulings/cancel', data);
          if (response.status === 202) {
            if(response.data.message){
              loadAlert('error', response.data.message);
            }
          } else {
            loadAlert('success', 'Reserva cancelada.');
          }
        } catch (error) {
          console.log(error);
          loadAlert('error', 'Erro de conexão.');
        }
        setOpen(false);
        loadschedulingsMeal(1);
    }

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handlePageChange = (event, page) => {
        loadschedulingsMeal(page+1)
        setPage(page);
      };

      const handleRowsPerPageChange = event => {
        setRowsPerPage(event.target.value);
      };

      const onClickOpenDialog = (id,date) => {
        setIdMealCanceled(id);
        setDateMeal(date);
        setOpen(true);
      }

      const onClickCloseDialog = () => {
        setOpen(false);
        setIdMealCanceled(0);
      }

      useEffect(() => {
        loadschedulingsMeal(1);
      }, [value]);
    
    return(
        <div>
            <div className={classes.root}>
                <div className={classes.grupButton}>
                <ButtonGroup
                    size="large"
                    orientation="horizontal"
                    color="primary"
                    variant="contained"
                    aria-label=" outlined primary button group">
                    <Tooltip title="É listado os Tickets que ainda não foram utilizados e não venceram.">
                      <Button onClick={(event, newValue) => {
                                setValue('to-use');
                            }} >A ser usados</Button>
                    </Tooltip>
                    <Tooltip title="É listado os Tickets das refeições que o estudante esteve presente.">
                        <Button onClick={(event, newValue) => {
                                setValue('used');
                             }}>Usados</Button>
                    </Tooltip>
                     <Tooltip title="É listado os Tickets que o estudante não utilizou e se venceram ou que foram justificados.">
                        <Button onClick={(event, newValue) => {
                                setValue('no-used');
                            }}>Não usados</Button>
                      </Tooltip>
                      <Tooltip title="É listado os Tickets que foram cancelados pelo estudante.">
                        <Button onClick={(event, newValue) => {
                                setValue('canceled');
                            }}>Cancelados</Button>
                      </Tooltip>
                </ButtonGroup>
                </div>

            <div className={classes.content}>
                <Card
                    className={clsx(classes.root, className)}>
                <CardContent className={classes.content}>
                    <PerfectScrollbar>
                        <div className={classes.inner}>
                            {loading === true ?
                            <LinearProgress/>
                            :setSchedulingsMeal == '' ?
                            <Table>
                            <TableBody>
                                <TableRow key={0}>
                                    <TableCell align="center" colSpan={9} className={classes.headTable}> Nenhum dado foi encontrado para a pesquisa realizada!</TableCell>
                                </TableRow>
                            </TableBody>
                            </Table>
                            :
                            <Table>
                            <TableHead>
                                <TableRow>
                                <TableCell className={classes.headTable}>Data </TableCell>
                                <TableCell className={classes.headTable}>Refeição</TableCell>
                                <TableCell className={classes.headTable}>Cardápio</TableCell>
                                <TableCell className={classes.headTable}> - </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {value === 'to-use' ?
                                  schedulingsMeal.map(result => (
                                  <TableRow key={result.id}>
                                      <TableCell className={classes.headTable}>{result.date.toString().substr(0, 10).split('-').reverse().join('/')}</TableCell>
                                      <TableCell className={classes.headTable}>{result.menu ? result.menu.description : "Não Encontrado" }</TableCell>
                                      <TableCell className={classes.headTable}>{result.meal.description}</TableCell>
                                      <TableCell className={classes.row}>
                                        <Tooltip title="Cancelar reserva">
                                            <IconButton aria-label="Cancelar"
                                            onClick={() => onClickOpenDialog(result.meal.id, result.date)}
                                            >
                                                <HighlightOffIcon  color="error" fontSize="large"/>
                                            </IconButton>
                                        </Tooltip>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                  :value === 'used' ?
                                    schedulingsMeal.map(result => (
                                      <TableRow key={result.id}>
                                          <TableCell className={classes.headTable}>{result.date.toString().substr(0, 10).split('-').reverse().join('/')}</TableCell>
                                          <TableCell className={classes.headTable}>{result.menu ? result.menu.description : "Não Encontrado" }</TableCell>
                                          <TableCell className={classes.headTable}>{result.meal.description}</TableCell>
                                          <TableCell align="center" className={classes.allow}>
                                            Utilizado
                                          </TableCell>
                                        </TableRow>
                                      ))
                                  : value === 'no-used' ?
                                  schedulingsMeal.map(result => (
                                    <TableRow key={result.id}>
                                        <TableCell className={classes.headTable}>{result.date.toString().substr(0, 10).split('-').reverse().join('/')}</TableCell>
                                        <TableCell className={classes.headTable}>{result.menu ? result.menu.description : "Não Encontrado" }</TableCell>
                                        <TableCell className={classes.headTable}>{result.meal.description}</TableCell>
                                        {
                                          result.absenceJustification !== null ?
                                          <TableCell className={classes.justification}>
                                            Justificado
                                          </TableCell>
                                          :
                                          <TableCell className={classes.notPresent}>
                                            Não utilizado
                                          </TableCell>
                                        }
                                        
                                      </TableRow>
                                    ))
                                    :schedulingsMeal.map(result => (
                                      <TableRow key={result.id}>
                                          <TableCell className={classes.headTable}>{result.date.toString().substr(0, 10).split('-').reverse().join('/')}</TableCell>
                                          <TableCell className={classes.headTable}>{result.menu ? result.menu.description : "Não Encontrado" }</TableCell>
                                          <TableCell className={classes.headTable}>{result.meal.description}</TableCell>
                                          <TableCell className={classes.notAllow}>
                                            Cancelado
                                          </TableCell>
                                        </TableRow>
                                      ))
                                }
                            </TableBody>
                            </Table>
                            }
                        </div>
                    </PerfectScrollbar>
                </CardContent>
                <CardActions className={classes.actions}>
                    <TablePagination
                        component="div"
                        count={total}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleRowsPerPageChange}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[10]}
                    />
                </CardActions>
                </Card>
                <DialogQuestione handleClose={onClickCloseDialog}
                open={open}
                onClickAgree={handleMealCancel}
                onClickDisagree={onClickCloseDialog}
                mesage={'Deseja realmente cancelar a reserva ? Uma vez cancelada não poderá mais solicitar'}
              title={'Cancelar reserva'}/>
            </div>
            </div>
        </div>
    )
}
Ticket.propTypes = {
    className: PropTypes.string,
    history: PropTypes.object
  };

export default withRouter(Ticket);
