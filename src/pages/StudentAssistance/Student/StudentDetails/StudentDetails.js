import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button, FormControlLabel, Switch,
  TextField, IconButton, Tooltip
} from '@material-ui/core';
import api from "../../../../services/api";
import Swal from "sweetalert2";
import validate from "validate.js";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { getErrorMessage } from '../../../../helpers/error';

const schema = {
  name: {
    presence: { allowEmpty: false,  message: 'O nome é obrigatória.'},
    length: {
      minimum: 4,
      maximum: 100,
      message: 'O nome deve conter no mínimo 4 e no máximo 100 caracteres.'
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'O e-mail é obrigatório.'  },
    email: true,
    length: {
      maximum: 64,
      message: 'O e-mail deve conter no máximo 64 caracteres.'
    }
  },
  mat: {
    presence: { allowEmpty: false,  message: 'A a matricula é obrigatória.'},
    length: {
      minimum: 14,
      maximum: 100,
      message: 'O nome deve conter no mínimo 14 e no máximo 100 caracteres.'
    },
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: 'Insira a matricula.',
    }
  },
  course_id: {
    presence: { allowEmpty: false,  message: 'O Curso é obrigatório.'},
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: 'Escolha um curso.',
    }
  },
  shift_id: {
    presence: { allowEmpty: false,  message: 'O Turno é obrigatório.'},
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: 'Escolha um turno.',
    }
  },
  dateValid: {
    presence: { allowEmpty: false,  message: 'A data é obrigatória.'},
  },
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const StudentDetails = props => {
  const { className, history, ...rest } = props;
  const { idStudent } = props.match.params;
  const [course, setCourse] = useState([]);
  const [shift, setShift] = useState([]);

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      'active': false
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

  async function loadCourse(){
    try {
      let url = 'course/all';
      const response = await api.get(url);
      setCourse(response.data);
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
  }

  async function loadShift(){
    try {
      let url = 'shift/all';
      const response = await api.get(url);
      setShift(response.data);
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
  }

  async  function saveStudentDetails(){
    try {
      const name = formState.values.name;
      const mat = formState.values.mat;
      const dateValid = formState.values.dateValid;
      const course_id = formState.values.course_id;
      const shift_id = formState.values.shift_id;
      const email  = formState.values.email;
      const active = formState.values.active == "" ? false : true;
      const semRegular = 1;
      const data = {
        name,
        mat,
        dateValid,
        course_id,
        shift_id,
        active,
        semRegular,
        email
      }
      let response= {};
      let acao = "";
      if(!idStudent) {
        response = await api.post('student', data);
        acao = "cadastrado";
      } else {
        response = await api.put('student/'+idStudent, data);
        acao = "atualizado";
      }
      if (response.status === 200) {
        loadAlert('success', 'Estudante '+acao+'.');
        history.push('/student');
      } else {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      }
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
  }

  async function findAStudent(){
    try {
      const response = await api.get('student/show/'+idStudent);
      if (response.status === 200) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
        setFormState(formState => ({
          values: {
            'name': response.data.name,
            'mat':response.data.mat,
            'course_id': response.data.course_id,
            'shift_id':response.data.shift_id,
            'dateValid': response.data.dateValid,
            'email': response.data.user[0] ? response.data.user[0].email : '',
            'active': response.data.active  == 1 ? true : false
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
    loadCourse();
    loadShift();
    if(idStudent){
      findAStudent(idStudent);
    }
  }, []);

  useEffect(() => {
    if(idStudent){
      findAStudent();
    }
    formState.values.active = true;
  }, []);


  useEffect(() => {
    const errors = validate(formState.values, schema);

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

  const hasError = field =>
      formState.touched[field] && formState.errors[field] ? true : false;

  const handleBack = () => {
    history.goBack();
  };

  return (
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
              title="Aluno"/>
          <Divider />
          <CardContent>
          {idStudent!=null ?
          <FormControlLabel
                control={
                  <Switch
                    checked={formState.values.active}
                    onChange={handleChange}
                    name="active"
                    color="primary"
                  />
                }
                label="Ativo"
              />
           : null }
            <Grid
                container
                spacing={3}>
              <Grid
                  item
                  md={6}
                  xs={12}>
                <TextField
                    fullWidth
                    error={hasError('name')}
                    helperText={
                      hasError('name') ? formState.errors.name[0] : null
                    }
                    label="Nome"
                    margin="dense"
                    name="name"
                    onChange={handleChange}
                    value={formState.values.name || ''}
                    variant="outlined"
                />
              </Grid>
              <Grid
                  item
                  md={6}
                  xs={12}>
                <TextField
                    fullWidth
                    error={hasError('email')}
                    helperText={
                      hasError('email') ? formState.errors.email[0] : null
                    }
                    label="Email"
                    margin="dense"
                    name="email"
                    type="email"
                    onChange={handleChange}
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
                  error={hasError('mat')}
                  helperText={
                    hasError('mat') ? formState.errors.mat[0] : null
                  }
                  type="number"
                  label="Matricula"
                  margin="dense"
                  name="mat"
                  onChange={handleChange}
                  value={formState.values.mat || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={3}
                xs={12}>
                <TextField
                  fullWidth
                  error={hasError('dateValid')}
                  helperText={
                    hasError('dateValid') ? formState.errors.dateValid[0] : null
                  }
                  type="date"
                  label="Data de validade"
                  margin="dense"
                  name="dateValid"
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formState.values.dateValid || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
              item
              md={3}
              xs={12}>
                <TextField
                  fullWidth
                  error={hasError('course_id')}
                  helperText={
                    hasError('curso') ? formState.errors.course_id[0] : null
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Curso"
                  margin="dense"
                  name="course_id"
                  onChange={handleChange}
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={formState.values.course_id}
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
              md={3}
              xs={12}>
                <TextField
                  fullWidth
                  error={hasError('shift_id')}
                  helperText={
                    hasError('Turno') ? formState.errors.shift_id[0] : null
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Turno"
                  margin="dense"
                  name="shift_id"
                  onChange={handleChange}
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={formState.values.shift_id}
                  variant="outlined">
                  <option value={null} ></option>
                  {shift.map(result => (
                    <option
                      key={result.id}
                      value={result.id}>
                      {result.description}
                    </option>
                  ))}
                </TextField>
            </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Tooltip title="Clique aqui para salvar os dados" aria-label="add">
              <Button
                  color="primary"
                  variant="outlined"
                  disabled={!formState.isValid}
                  onClick={saveStudentDetails}>
                Salvar
              </Button>
            </Tooltip>
          </CardActions>
        </form>
      </Card>
  );
};

StudentDetails.propTypes = {
  className: PropTypes.string,
};

export default StudentDetails;
