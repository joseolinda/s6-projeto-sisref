import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
//import moment from 'moment';
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
import {DialogQuestione} from "../../../../components";
import Swal from "sweetalert2";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import History from "@material-ui/icons/History";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import MealToolbar from "./components/MealToolbar";
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

const TableMeal = props => {
  const { className, history } = props;

  const [meals, setMeals] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [idMealDelete, setIdMealDelete] = React.useState(0);
  const [loading, setLoading] = useState(false);

  //configuration alert
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 4000,
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

  async function loadMeal(page){
    setLoading(true);
    try {
      let url = 'meal?page='+page;
      if(searchText != ''){
        url += '&description='+searchText;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setMeals(response.data.data);
    } catch (error) {
      console.log(error);
      loadAlert('error', getErrorMessage (error));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadMeal(1);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadMeal(1);
  }

  const handlePageChange = (event, page) => {
    loadMeal(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const onClickOpenDialog = (id) => {
    setIdMealDelete(id);
    setOpen(true);
  }

  const onClickCloseDialog = () => {
    setOpen(false);
    setIdMealDelete(0);
  }


  async function onDeleteObject(){
    try {
      let url = 'meal/'+idMealDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        loadAlert('success', 'Refeição excluída.');
        loadMeal(page+1);
      }
    } catch (error) {
      console.log(error);
      loadAlert('error', getErrorMessage (error));
    }
    setOpen(false);
  }

  const onClickEdit = (id) => {
    history.push('/meal-details/'+id);
  }

  return (
    <div>
      <div className={classes.root}>
      <MealToolbar
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
                    :meals == '' ?
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
                          <TableCell style={{fontWeight: 'bold'}} className={classes.headTable}>Hora inicio</TableCell>
                          <TableCell style={{fontWeight: 'bold'}} className={classes.headTable}>Hora fim</TableCell>
                          <TableCell style={{fontWeight: 'bold'}} className={classes.headTable}>Qtr Hr Reserva (inicio)</TableCell>
                          <TableCell style={{fontWeight: 'bold'}} className={classes.headTable}>Qtr Hr Reserva (fim)</TableCell>
                          <TableCell className={classes.headTable}></TableCell>
                          <TableCell className={classes.headTable}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {meals.map(result => (
                          <TableRow key={result.id}>
                            <TableCell className={classes.headTable}>{result.description}</TableCell>
                            <TableCell className={classes.headTable}>{result.timeStart}</TableCell>
                            <TableCell className={classes.headTable}>{result.timeEnd}</TableCell>
                            <TableCell className={classes.headTable}>{result.qtdTimeReservationStart}</TableCell>
                            <TableCell className={classes.headTable}>{result.qtdTimeReservationEnd}</TableCell>
                            <TableCell className={classes.row}>
                            </TableCell>
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
          mesage={'Deseja excluir a refeição selecionada?'}
          title={'Excluir refeição'}/>
      </div>
    </div>
    </div>
  );
};

TableMeal.propTypes = {
  history: PropTypes.object
};

export default withRouter(TableMeal);

