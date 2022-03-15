import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
  TablePagination, Tooltip, Button
} from '@material-ui/core';
import api from '../../../../services/api';
import CampusToolbar from "./components/CampusToolbar";
import {DialogQuestione} from "../../../../components";
import Swal from "sweetalert2";
//import UsersToolbar from "./components/QuestionToolbar";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import { getErrorMessage } from '../../../../helpers/error';
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

const TableCampus = props => {
  const { className, history } = props;

  const [campus, setCampus] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [idCampusDelete, setIdCampusDelete] = React.useState(0);
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

  async function loadCampus(page){
    setLoading(true);
    try {
      let url = 'campus?page='+page;
      if(searchText != ''){
        url += '&description='+searchText;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setCampus(response.data.data);
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCampus(1);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadCampus(1);
  }

  const handlePageChange = (event, page) => {
    loadCampus(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const onClickOpenDialog = (id) => {
    setIdCampusDelete(id);
    setOpen(true);
  }

  const onClickCloseDialog = () => {
    setOpen(false);
    setIdCampusDelete(0);
  }

  async function onDeleteObject(){
    try {
      let url = 'campus/'+idCampusDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        loadAlert('success', 'Campus excluído.');
        loadCampus(page+1);
      }
    } catch (error) {
      loadAlert('error', getErrorMessage (error));
    }
    setOpen(false);
  }

  const onClickEdit = (id) => {
    history.push('/campus-details/'+id);
  }

  return (
    <div>
      <div className={classes.root}>
      <CampusToolbar
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
                :campus == '' ?
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
                      <TableCell style={{fontWeight: 'bold'}} className={classes.headTable}>Descrição</TableCell>
                      <TableCell style={{fontWeight: 'bold'}} className={classes.headTable}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campus.map(result => (
                      <TableRow key={result.id}>
                        <TableCell className={classes.headTable}>{result.description}</TableCell>
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
          mesage={'Deseja excluir o campus selecionado?'}
          title={'Excluir Campus'}/>
      </div>
    </div>
    </div>
  );
};

TableCampus.propTypes = {
  history: PropTypes.object
};

export default withRouter(TableCampus);

