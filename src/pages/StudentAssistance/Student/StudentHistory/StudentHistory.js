import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  TablePagination,
  TableBody, Typography, Table, Button, Tooltip, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions, DialogContentText,
  IconButton,
  FormControl, InputLabel, Select, MenuItem,
  Hidden
} from '@material-ui/core';
import {DialogQuestione} from "../../../../components";
import api from "../../../../services/api";
import Swal from "sweetalert2";
import AddComment from '@material-ui/icons/AddComment';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Delete from "@material-ui/icons/Delete";
import { getErrorMessage } from '../../../../helpers/error';
const useStyles = makeStyles(() => ({
  root: {},
  infoRed: {
    backgroundColor: '#EC0B43',
    display: 'block',
    margin: '8px',
    padding: '0 4px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  infoOrange: {
    backgroundColor: '#F5A623',
    display: 'block',
    margin: '8px',
    padding: '0 4px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  infoGreen: {
    backgroundColor: '#5DE2A5',
    display: 'block',
    margin: '8px',
    padding: '0 4px',
    textAlign: 'center',
    color: '#fff',
    borderRadius: 4
  },
  infoNull: {
    backgroundColor: '#90a4ae',
    color: '#fff',
    display: 'block',
    margin: '8px',
    padding: '0 4px',
    textAlign: 'center',
    borderRadius: 4
  },
  head: {
    '& > *': { maxWidth: '100%' }
  }
}));

const StudentHistory = props => {
  const { className, history, ...rest } = props;
  const { idStudent } = props.match.params;
  const [historyStudent, setHistoryStudent] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [idDelete, setIdDelete] = React.useState(0);
  const [scheduleSelect, setScheduleSelect] = React.useState({
                          id : 0,
                          absenceJustification: ''
                        });

  const [filtroHistorico, setFiltroHistorico] = useState('all');

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

  async function loadHistoryStudent(page){
    try {
      const url = 'student/history/'+idStudent+'?page='+page+'&filter=' + filtroHistorico;
      const response = await api.get(url);
      if (response.status === 200) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
        setHistoryStudent(response.data.data);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.log(error);
      loadAlert('error', getErrorMessage (error));
    }
  }

  useEffect(() => {
    if(idStudent){
      loadHistoryStudent();
    }
  }, [filtroHistorico]);


  const handleBack = () => {
    history.goBack();
  };

  const handlePageChange = (event, page) => {
    loadHistoryStudent(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const handleClickOpen = (idSchedule) => {
    historyStudent.forEach(function logArrayElements(element, index, array) {
      if(element.id == idSchedule ){
        setScheduleSelect(
            {
              id : element.id,
              absenceJustification: element.absenceJustification
            }
        )
      }
    });
    setOpen(true);
  };

  async function saveJustification(){
    try {
      let url = 'scheduling/justification/'+scheduleSelect.id;
      const absenceJustification = scheduleSelect.absenceJustification;
      const data = {
        absenceJustification
      }
      const response = await api.post(url, data);
      if(response.status == 200){
        loadAlert('success', 'Justificativa salva.');
        loadHistoryStudent(page+1);
      }
    } catch (error) {
      console.log(error);
      loadAlert('error', getErrorMessage (error));
    }
  }

  const handleSaveJustification = () => {
    if(scheduleSelect.id == 0){
      loadAlert('error', 'Nenhum agendamento foi selecionado.')
    } else if(scheduleSelect.absenceJustification == '' || scheduleSelect.absenceJustification == null){
      loadAlert('error', 'Não foi informada a justificativa.');
    } else {
      saveJustification();
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setScheduleSelect({
          id: 0,
        absenceJustification: ''
      });
  };

  const handleChangeAbsenceJustification = (event) => {
    setScheduleSelect({
      ...scheduleSelect,
        absenceJustification: event.target.value
      });
  };

  const onClickOpenDialog = (id) => {
    setIdDelete(id);
    setOpen2(true);
  }

  const onClickCloseDialog = () => {
    setOpen2(false);
    setIdDelete(0);
  }

  async function onDeleteObject(){
    try {
      //Colocar a rota da API
      let url = 'scheduling/'+idDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        loadAlert('success', 'Agendamento excluído.');
        loadHistoryStudent(page+1);
      }
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
    setOpen2(false);
  }

  return (
      <div>
        <div className={classes.contentHeader}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <Card
            className={clsx(classes.root, className)}>
          <CardHeader
              avatar={
                <FormControl variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">Filtro</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={filtroHistorico}
                    onChange={(event) => setFiltroHistorico(event.target.value)}
                    label="Filtro"
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="present">Presente</MenuItem>
                    <MenuItem value="justified">Justificado</MenuItem>
                    <MenuItem value="absent">Ausente</MenuItem>
                  </Select>
                </FormControl>
              }
              action={
                <TablePagination
                    component="div"
                    count={total}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                />

              }/>
          <CardContent>
            <Grid
                container
                spacing={1}>
              <Grid
                  item
                  md={12}
                  xs={12}>
                <Table>
                  <TableBody>
                    {historyStudent ? historyStudent.map(result => (
                        <Card
                            {...rest}
                            style={{marginTop: '20px'}}>
                          <CardHeader
                              className={classes.head}
                              avatar={
                                <div>
                                  <Typography variant="caption" color="textPrimary" >
                                    {'Código do agendamento: '+result.id }
                                  </Typography>
                                  <Typography variant="body1" color="textPrimary">
                                    {'Aluno: '+result.student.mat+' - '+ result.student.name}
                                  </Typography>
                                  <Typography variant="body1" color="textPrimary" >
                                    {'Refeição: '+result.meal.description }
                                  </Typography>
                                  <Typography variant="body2" color="textPrimary" >
                                    {'Data: '+ result.dateInsert}
                                  </Typography>
                                </div>
                              }
                              action={
                                <Hidden smDown>
                                  <Grid
                                      container
                                      direction="row"
                                      justify="center"
                                      alignItems="center">
                                       <Tooltip title="Excluir">
                                       <Button
                                          className={classes.buttonDelete}
                                          onClick={() => onClickOpenDialog(result.id)}>
                                          <Delete fontSize="medium"/>
                                        </Button>
                                      </Tooltip>
                                    { result.wasPresent != 1 &&
                                    result.canceled_by_student == 0 ?
                                      <Tooltip title="Justificar a ausência do estudante">
                                        <Button
                                          onClick={() => handleClickOpen(result.id)}>
                                          <AddComment fontSize="medium"/>
                                        </Button>
                                      </Tooltip>
                                    : null }
                                    { result.canceled_by_student ==1 ?
                                        <span className={classes.infoNull}>Cancelado</span>
                                        :
                                        result.wasPresent == 1 ?
                                            <span className={classes.infoGreen}>Presente</span>
                                            : result.absenceJustification != null ?
                                              <span className={classes.infoOrange}>Justificado</span>
                                            : <span className={classes.infoRed}>Ausente</span>
                                        }
                                  </Grid>
                                </Hidden>
                              }/>
                              <Hidden mdUp>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="center">
                                      <Tooltip title="Excluir">
                                      <Button
                                        className={classes.buttonDelete}
                                        onClick={() => onClickOpenDialog(result.id)}>
                                        <Delete fontSize="medium"/>
                                      </Button>
                                    </Tooltip>
                                  { result.wasPresent != 1 &&
                                  result.canceled_by_student == 0 ?
                                    <Tooltip title="Justificar a ausência do estudante">
                                      <Button
                                        onClick={() => handleClickOpen(result.id)}>
                                        <AddComment fontSize="medium"/>
                                      </Button>
                                    </Tooltip>
                                  : null }
                                  { result.canceled_by_student ==1 ?
                                      <span className={classes.infoNull}>Cancelado</span>
                                      :
                                      result.wasPresent == 1 ?
                                          <span className={classes.infoGreen}>Presente</span>
                                          : result.absenceJustification != null ?
                                            <span className={classes.infoOrange}>Justificado</span>
                                          : <span className={classes.infoRed}>Ausente</span>
                                      }
                                </Grid>
                              </Hidden>
                        </Card>
                    )) : null}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
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
        {/*DIALOG*/}
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Justificativa da Ausência</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Informe o motivo da ausência do estudante.
            </DialogContentText>
            <TextField
                style={{width: '500px'}}
                autoFocus
                value={scheduleSelect.absenceJustification}
                name="absenceJustification"
                onChange={handleChangeAbsenceJustification}
                margin="dense"
                id="name"
                label="Justificativa:"
                fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveJustification} color="primary">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
        <DialogQuestione handleClose={onClickCloseDialog}
          open={open2}
          onClickAgree={onDeleteObject}
          onClickDisagree={onClickCloseDialog}
          mesage={'Deseja excluir o agendamento selecionado?'}
          title={'Excluir agendamento'}/>
      </div>
  );
};

StudentHistory.propTypes = {
  className: PropTypes.string,
};

export default StudentHistory;
