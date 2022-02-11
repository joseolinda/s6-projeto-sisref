import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar, LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination, Tooltip, Button
} from '@material-ui/core';
import api from '../../../../services/api';
import UserToolbar from "./components/UserToolbar";
import {DialogQuestione} from "../../../../components";
import Swal from "sweetalert2";
//import UsersToolbar from "./components/QuestionToolbar";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
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

const TableUser = props => {
  const { className, history } = props;

  const [user, setUser] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [idUserDelete, setIdUserDelete] = React.useState(0);
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

  async function loadUser(page){
    setLoading(true);
    try {
      let url = 'user?page='+page;
      if(searchText != ''){
        url += '&name='+searchText;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setUser(response.data.data);
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
    setLoading(false);
  }

  useEffect(() => {
    loadUser(1);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadUser(1);
  }

  const handlePageChange = (event, page) => {
    loadUser(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const onClickOpenDialog = (id) => {
    setIdUserDelete(id);
    setOpen(true);
  }

  const onClickCloseDialog = () => {
    setOpen(false);
    setIdUserDelete(0);
  }

  async function onDeleteObject(){
    try {
      let url = 'user/'+idUserDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        loadAlert('success', 'Usuário excluído.');
        loadUser(page+1);
      }
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
    setOpen(false);
  }
  
  const onClickEdit = (id) => {
    history.push('/user-details/'+id);
  }

  return (
    <div>
      <div className={classes.root}>
      <UserToolbar
          onChangeSearch={updateSearch.bind(this)}
          searchText={searchText}
          onClickSearch={onClickSearch}/>
      <div className={classes.content}>
        <Card
            className={clsx(classes.root, className)}>
          <CardContent className={classes.content}>
          <PerfectScrollbar>
              <div className={classes.inner}>
                {loading === true ?
                  <LinearProgress/>
                :user == '' ?
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
                      <TableCell style={{fontWeight: 'bold'}} className={classes.headTable}>Nome</TableCell>
                      <TableCell style={{fontWeight: 'bold'}} className={classes.headTable}>Email</TableCell>
                      <TableCell style={{fontWeight: 'bold'}} className={classes.headTable}>Tipo</TableCell>
                      <TableCell style={{fontWeight: 'bold'}} className={classes.headTable}>Campus</TableCell>
                      <TableCell className={classes.headTable}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.map(result => (
                      <TableRow key={result.id}>
                        <TableCell className={classes.headTable}>{result.name}</TableCell>
                        <TableCell className={classes.headTable}>{result.email}</TableCell>
                        <TableCell className={classes.headTable}>{result.type}</TableCell>
                        <TableCell className={classes.headTable}>{result.campus.description}</TableCell>
                        <TableCell className={classes.row}>
                            <Tooltip title="Deletar">
                              <Button
                                  className={classes.buttonDelete}
                                  onClick={() => onClickOpenDialog(result.id)}>
                                <Delete fontSize="medium"/>
                              </Button>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <Button
                                  className={classes.buttonEdit}
                                  onClick={() => onClickEdit(result.id)}>
                                <Edit fontSize="medium"/>
                              </Button>
                            </Tooltip>
                          </TableCell>
                      </TableRow>
                    ))}
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
          onClickAgree={onDeleteObject}
          onClickDisagree={onClickCloseDialog}
          mesage={'Deseja excluir o Usuário selecionado?'}
          title={'Excluir Usuário'}/>
      </div>
    </div>
    </div>
  );
};

TableUser.propTypes = {
  history: PropTypes.object
};

export default withRouter(TableUser);

