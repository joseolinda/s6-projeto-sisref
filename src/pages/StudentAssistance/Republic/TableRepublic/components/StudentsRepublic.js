import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {Button, Typography} from '@material-ui/core';
import FindInPage from '@material-ui/icons/SearchSharp';
import {DialogQuestione} from "../../../../../components";
import api from '../../../../../services/api';
import {withRouter} from "react-router-dom";
import Swal from "sweetalert2";


import {
    Card,
    CardContent,
    FormControlLabel, Switch,
    TableCell,  Dialog,
    DialogTitle, DialogContent, TextField, DialogActions, DialogContentText,
    Grid,
    TableRow, Collapse,
    IconButton,
    Tooltip, CardHeader
  } from '@material-ui/core';


import Delete from "@material-ui/icons/Delete";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShareIcon from '@material-ui/icons/Share';
import Edit from "@material-ui/icons/Edit";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getErrorMessage } from '../../../../../helpers/error';

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  title: {
    fontWeight: 'bold'
  }
}));

const StudentsRepublic = props => {
  const { result, className, onClickSearch, onChangeSearch, searchText, history, ...rest } = props;

  const classes = useStyles();

  const [republics, setRepublics] = useState([]);
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [idItemDelete, setIdItemDelete] = React.useState(0);
  const [total, setTotal] = useState(0);
  const [idRepublicDelete, setIdRepublicDelete] = React.useState(0);
  const [idRepublicAdd, setIdRepublicAdd] = React.useState(0);
  const [students, setStudents] = useState([]);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      'responsability': false
    },
    touched: {},
    errors: {}
  });

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

  //Adcionar aluno a república
  async function loadStudent(){
    try {
      let url = 'republic/students-are-not-republic';
      const response = await api.get(url);
      setStudents(response.data);
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
  }

  async function loadRepublic(page){
    try {
      let url = 'republic?page='+page;
      if(searchText != ''){
        url += '&description='+searchText;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setRepublics(response.data.data);
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
  }

  async function handleSaveStudent () {
    try {
      const student_id = formState.values.student_id;
      const responsability = formState.values.responsability == "" ? false : true;
      const republic_id = idRepublicAdd;
      const data = {
        responsability,
        student_id,
        republic_id
      }
      let response= {};
      let acao = "";

      response = await api.post('republic/item/', data);
      acao = "Cadastrado";
      if (response.status === 200) {
        loadAlert('success', 'Estudante '+acao+'.');
        loadRepublic(page+1);
        loadStudent();
      }else {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
    }
    }catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
    setOpen3(false);
    document.location.reload(true);
  };

  function stateChange() {
    setTimeout(function(){
        document.location.reload(true);
    }, 5000);
  }

  async function onDeleteObject(){
    try {
      let url = 'republic/'+idRepublicDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        loadAlert('success', 'República excluída.');
        loadRepublic(page+1);
      }
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
    setOpen(false);
    stateChange();
  }

  //Deletar  aluno de uma república
  const onClickOpenDialogItem = (id) => {
    setIdItemDelete(id);
    setOpen2(true);
  }

  useEffect(() => {
    loadStudent();
  }, []);
  const onClickCloseDialog = () => {
    setOpen(false);
    setIdRepublicDelete(0);
  }

  const onClickEdit = (id) => {
    history.push('/republic-details/'+id);
  }

  const onClickCloseDialogItem = () => {
    setOpen2(false);
    setIdItemDelete(0);
  }

  const onClickAgreeItemRepublic = () => {
    onDeleteObjectItem(idItemDelete);
    setOpen2(false);
  }

  async function onDeleteObjectItem(idItem){
    try {
      let url = 'republic/item/'+idItem;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        loadAlert('success', 'Aluno excluído.');
        loadRepublic(page+1);
      }
    } catch (error) {
      console.log(error);
      loadAlert('error', getErrorMessage (error));
    }
    setOpen2(false);
    document.location.reload(true);
  }

  
  const onClickOpenDialog = (id) => {
    setIdRepublicDelete(id);
    setOpen(true);
  }

  const handleOpenStudent = (id) => {
    setIdRepublicAdd(id);
    setOpen3(true);
  };


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCloseStudent = () => {
    setOpen3(false);
  };

  const handleChangeStudent = event => {
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

  const hasError = field =>
      formState.touched[field] && formState.errors[field] ? true : false;

    return(
        <div>
            <Card key={result.id}
                style={{marginTop: '20px'}}>
              <CardHeader
                className={classes.head}
                avatar={
                  <div>
                    <Typography variant="caption" color="textPrimary" >
                      {'Código : '+result.id }
                    </Typography>
                    <Typography variant="body1" color="textPrimary" >
                      {'Descrição: '+ result.description}
                    </Typography>
                    <Typography variant="body1" color="textPrimary" >
                      {'Endereço: '+result.address }
                    </Typography>
                  </div>
                }
                action={
                  <div>
                    <Grid
                      container
                      direction="row"
                      justify="flex-end"
                      alignItems="center"
                    >
                      <Tooltip title="Deletar república">
                        <IconButton
                          className={classes.buttonDelete}
                          onClick={() => onClickOpenDialog(result.id)}
                        >
                        <Delete fontSize="medium"/>
                          </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          className={classes.buttonEdit}
                          onClick={() => onClickEdit(result.id)}
                        >
                        <Edit fontSize="medium"/>
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center">
                      <Tooltip title="Adicionar aluno a república">
                          <IconButton
                            className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                            })}
                            onClick={() => handleOpenStudent(result.id)}
                            aria-expanded={expanded}
                          >
                          <AddCircleOutlineOutlinedIcon />
                          </IconButton>
                      </Tooltip>
                      <Tooltip title="Alunos">
                          <IconButton
                            className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                          >
                          <ExpandMoreIcon />
                          </IconButton>
                      </Tooltip>
                    </Grid>
                  </div>
                }
              />
              <Grid>
                <Collapse key={result.id} in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph>Estudantes:</Typography>
                    <TableCell className={classes.headTable}>Nome</TableCell>
                    <TableCell className={classes.headTable}>Responsável</TableCell>
                      {result.itensrepublics.map(result2 => (
                    <TableRow key={result2.id}>
                      <TableCell className={classes.headTable}>{result2.student.name}</TableCell>
                      <TableCell className={classes.headTable}>{result2.responsability==1?"Sim":"Não"}</TableCell>
                      <Tooltip title="Deletar estudante da república">
                        <Button
                          className={classes.buttonDelete}
                          onClick={() => onClickOpenDialogItem(result2.id)}
                        >
                          <DeleteOutlinedIcon fontSize="medium"/>
                        </Button>
                      </Tooltip>
                    </TableRow>
                    ))}
                  </CardContent>
                </Collapse>
              </Grid>
            </Card>

            <DialogQuestione handleClose={onClickCloseDialog}
              open={open}
              onClickAgree={onDeleteObject}
              onClickDisagree={onClickCloseDialog}
              mesage={'Deseja excluir a república selecionada?'}
              title={'Excluir a república'}/>
            <DialogQuestione handleClose={onClickCloseDialogItem}
              open={open2}
              onClickAgree={onClickAgreeItemRepublic}
              onClickDisagree={onClickCloseDialogItem}
              mesage={'Deseja excluir o aluno selecionado?'}
              title={'Excluir aluno'}/>
            {/*DIALOG*/}
        <Dialog open={open3} onClose={handleCloseStudent} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Adcionar estudante a república</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Escolha um estudante.
            </DialogContentText>
            <FormControlLabel
                control={
                  <Switch
                    checked={formState.values.responsability}
                    onChange={handleChangeStudent}
                    name="responsability"
                    color="primary"
                  />
                }
                label="Responsável"
              />
            <Autocomplete
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={hasError('student_id')}
                  helperText={
                    hasError('student_id') ? formState.errors.student_id[0] : null
                  }
                  label="Estudante"
                  margin="dense"
                  name="student_id"
                  variant="outlined"
                />
              )}
              options={students}
              getOptionLabel={(student) => student.name}
              value={formState.values.student_id}
              onChange={(_, student) => handleChangeStudent({ target: { name: 'student_id', value: student.id }})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveStudent} color="primary">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
        </div>
    )
}

StudentsRepublic.propTypes = {
    history: PropTypes.object,
    result: PropTypes.object
  };

export default withRouter(StudentsRepublic);
