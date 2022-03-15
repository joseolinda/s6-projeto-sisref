import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
//import moment from 'moment';
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
import {DialogQuestione} from "../../../../components";
import Swal from "sweetalert2";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import MenuToolbar from "./components/MenuToolbar";
import {getErrorMessage} from "../../../../helpers/error";
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

const TableMenu = props => {
  const { className, history } = props;

  const [menus, setMenus] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [idMenuDelete, setIdMenuDelete] = React.useState(0);

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

  async function loadMenu(page){
    setLoading(true);
    try {
      let url = 'menu?page='+page;
      if(searchText !== ''){
        url += '&date='+searchText;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setMenus(response.data.data);
    } catch (error) {
      console.log(error);
      loadAlert('error', getErrorMessage (error));
    }
    setLoading(false);
  }

  useEffect(() => {
    let data = new Date();

    let day = data.getDate();
    let month = data.getMonth();
    let year = data.getFullYear();
    let dateString = '';
    if(month<10){
      dateString = year+'-0'+(month+1)+'-'+day;
    } else {
      dateString = year+'-'+(month+1)+'-'+day;
    }
    
    loadMenu(1);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadMenu(1);
  }

  const handlePageChange = (event, page) => {
    loadMenu(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const onClickOpenDialog = (id) => {
    setIdMenuDelete(id);
    setOpen(true);
  }

  const onClickCloseDialog = () => {
    setOpen(false);
    setIdMenuDelete(0);
  }


  async function onDeleteObject(){
    try {
      let url = 'menu/'+idMenuDelete;
      const response = await api.delete(url);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        loadAlert('success', 'Cardápio excluído.');
        loadMenu(page+1);
      }
    } catch (error) {
      console.log(error);
      loadAlert('error', getErrorMessage (error));
    }
    setOpen(false);
  }

  const onClickEdit = (id) => {
    history.push('/menu-details/'+id);
  }

  return (
    <div>
      <div className={classes.root}>
      <MenuToolbar
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
                    :menus == '' ?
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
                          <TableCell style={{fontWeight: 'bold'}} className={classes.headTable}>Data </TableCell>
                          <TableCell style={{fontWeight: 'bold'}} className={classes.headTable}>Descrição</TableCell>
                          <TableCell style={{fontWeight: 'bold'}} className={classes.headTable}>Refeição</TableCell>
                          <TableCell className={classes.headTable}></TableCell>
                          <TableCell className={classes.headTable}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {menus.map(result => (
                          <TableRow key={result.id}>
                            <TableCell className={classes.headTable}>{result.date.toString().substr(0, 10).split('-').reverse().join('/')}</TableCell>
                            <TableCell className={classes.headTable}>{result.description}</TableCell>
                            <TableCell className={classes.headTable}>{result.meal.description}</TableCell>
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
          mesage={'Deseja excluir o cadápio selecionado?'}
          title={'Excluir turno'}/>
      </div>
    </div>
    </div>
  );
};

TableMenu.propTypes = {
  history: PropTypes.object
};

export default withRouter(TableMenu);

