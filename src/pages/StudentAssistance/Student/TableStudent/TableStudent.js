import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination, Hidden
} from '@material-ui/core';
import api from '../../../../services/api';
import {DialogQuestione} from "../../../../components";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import StudentToolbar from "./components/StudentToolbar";
import StudentRow from "./components/StudentRow";

const useStyles = makeStyles(theme => ({
  container: {
    [theme.breakpoints.down('sm')]: { 
      marginBlock: theme.spacing(-6),
      marginInline: theme.spacing(-4)
    }
  },
  root: {
    padding: theme.spacing(2),
  },
  content: {
    padding: 0,
    marginTop: theme.spacing(2)
  },
  inner: {
    minWidth: "100%"
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  headTable: {
    fontWeight: "bold"
  },
  actions: {
    justifyContent: 'flex-end'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const TableStudent = props => {
  const { className, history } = props;

  const [students, setStudents] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState(() => {
    return new URLSearchParams(history.location.search).get('query') ?? "";
  });
  const [open, setOpen] = React.useState(false);
  const [idStudentDelete, setIdStudentDelete] = React.useState(0);
  const [loading, setLoading] = useState(false);

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

  async function loadStudent(page){
    setLoading(true);
    try {
      let url = 'student?page='+page;
      if(searchText != ''){
        url += '&name='+searchText;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setStudents(response.data.data);
    } catch (error) {
      console.log(error);
      loadAlert('error', 'Erro de conexão.');
    }
    setLoading(false);
  }

  useEffect(() => {
    setSearchText(searchText => new URLSearchParams(history.location.search).get('query') ?? searchText);
    
    loadStudent(1);
  }, [history.location.search]);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    history.push(history.location.pathname + (searchText ? '?query=' + searchText : ''));
    
    setPage(0);
    loadStudent(1);
  }

  const handlePageChange = (event, page) => {
    loadStudent(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const onClickOpenDialog = (id) => {
    setIdStudentDelete(id);
    setOpen(true);
  }

  const onClickCloseDialog = () => {
    setOpen(false);
    setIdStudentDelete(0);
  }

  const onClickVerifyHistory = (id) => {
    history.push('/student-history/'+id);
  }

  const onClickVerifyAllowMeal = (id) => {
    history.push('/student-allow-meal/'+id);
  }

  async function onDeleteObject(){
    try {
      let url = 'student/'+idStudentDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        loadAlert('success', 'Estudante excluído.');
        loadStudent(page+1);
      }
    } catch (error) {
      console.log(error);
      loadAlert('error', 'Erro de conexão.');
    }
    setOpen(false);
  }

  const onClickEdit = (id) => {
    history.push('/student-details/'+id);
  }

  return (
    <div className={classes.container}>
      <div className={classes.root}>
        <StudentToolbar
          onChangeSearch={updateSearch.bind(this)}
          searchText={searchText}
          onClickSearch={onClickSearch}
        />
        <div className={classes.content}>
          <Card className={clsx(classes.root, className)}>
            <CardContent className={classes.content}>
              <div className={classes.inner}>
                {loading === true ? (
                  <LinearProgress />
                ) : students == "" ? (
                  <Table>
                    <TableBody>
                      <TableRow key={0}>
                        <TableCell
                          align="center"
                          colSpan={9}
                          className={classes.headTable}
                        >
                          {" "}
                          Nenhum dado foi encontrado para a pesquisa realizada!
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Cód.
                        </TableCell>
                        <Hidden smDown>
                          <TableCell style={{ fontWeight: "bold" }}>
                            Matrícula
                          </TableCell>
                          <TableCell style={{ fontWeight: "bold" }}>
                            Nome
                          </TableCell>
                          <TableCell style={{ fontWeight: "bold" }}>
                            Email
                          </TableCell>
                          <TableCell style={{ fontWeight: "bold" }}>
                            Curso
                          </TableCell>
                          <TableCell style={{ fontWeight: "bold" }}>
                            Validade
                          </TableCell>
                          <TableCell className={classes.headTable}></TableCell>
                          <TableCell className={classes.headTable}></TableCell>
                          <TableCell className={classes.headTable}></TableCell>
                        </Hidden>
                        <Hidden mdUp>
                          <TableCell style={{ fontWeight: "bold" }}>
                            Nome
                          </TableCell>
                          <TableCell></TableCell>
                        </Hidden>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((result) => (
                        <StudentRow
                          key={result.id}
                          student={result}
                          onVerifyHistory={() =>
                            onClickVerifyHistory(result.id)
                          }
                          onVerifyPermissions={() =>
                            onClickVerifyAllowMeal(result.id)
                          }
                          onDelete={() => onClickOpenDialog(result.id)}
                          onEdit={() => onClickEdit(result.id)}
                        />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
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
          <DialogQuestione
            handleClose={onClickCloseDialog}
            open={open}
            onClickAgree={onDeleteObject}
            onClickDisagree={onClickCloseDialog}
            mesage={"Deseja excluir o aluno selecionado?"}
            title={"Excluir turno"}
          />
        </div>
      </div>
    </div>
  );
};

TableStudent.propTypes = {
  history: PropTypes.object
};

export default withRouter(TableStudent);

