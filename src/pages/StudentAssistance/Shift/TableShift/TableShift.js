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
  Typography,
  TablePagination, Tooltip, Button
} from '@material-ui/core';
import api from '../../../../services/api';
import {DialogQuestione} from "../../../../components";
import Swal from "sweetalert2";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import ShiftToolbar from "./components/ShiftToolbar";
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

const TableShift = props => {
  const { className, history } = props;

  const [shifts, setShifts] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [idShiftDelete, setIdShiftDelete] = React.useState(0);
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

  async function loadShift(page){
    setLoading(true);
    try {
      let url = 'shift?page='+page;
      if(searchText != ''){
        url += '&description='+searchText;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setShifts(response.data.data);
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
    setLoading(false);
  }

  useEffect(() => {
    loadShift(1);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadShift(1);
  }

  const handlePageChange = (event, page) => {
    loadShift(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const onClickOpenDialog = (id) => {
    setIdShiftDelete(id);
    setOpen(true);
  }

  const onClickCloseDialog = () => {
    setOpen(false);
    setIdShiftDelete(0);
  }

  async function onDeleteObject(){
    try {
      let url = 'shift/'+idShiftDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        loadAlert('success', 'Turno excluído.');
        loadShift(page+1);
      }
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
    setOpen(false);
  }

  const onClickEdit = (id) => {
    history.push('/shift-details/'+id);
  }

  return (
    <div>
      <div className={classes.root}>
      <ShiftToolbar
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
                :shifts == '' ?
                <Table>
                  <TableBody>
                      <TableRow key={0}>
                          <TableCell align="center" colSpan={2} className={classes.headTable}> Nenhum dado foi encontrado para a pesquisa realizada!</TableCell>
                      </TableRow>
                  </TableBody>
                </Table>
                :
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{fontWeight: 'bold'}}className={classes.headTable}>Descrição</TableCell>
                      <TableCell className={classes.headTable}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shifts.map(result => (
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
          mesage={'Deseja excluir o turno selecionado?'}
          title={'Excluir turno'}/>
      </div>
    </div>
    </div>
  );
};

TableShift.propTypes = {
  history: PropTypes.object
};

export default withRouter(TableShift);

