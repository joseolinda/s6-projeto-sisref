import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Table, FormControlLabel, Switch,
  TableBody,
  TableCell,  Dialog,
  DialogTitle, DialogContent, TextField, DialogActions, DialogContentText,
  TableHead, Grid, CircularProgress,
  TableRow, Collapse, LinearProgress,
  Typography, IconButton,
  TablePagination, Tooltip, Button, CardHeader
} from '@material-ui/core';
import api from '../../../../services/api';

import Swal from "sweetalert2";
import Delete from "@material-ui/icons/Delete";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShareIcon from '@material-ui/icons/Share';
import Edit from "@material-ui/icons/Edit";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import RepublicToolbar from "./components/RepublicToolbar";
import StudentsRepublic from "./components/StudentsRepublic";

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

const TableRepublic = props => {
  const { className, history } = props;

  const [republics, setRepublics] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState([]);
  const [loading, setLoading] = useState(false);

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

  async function loadRepublic(page){
    setLoading(true);
    try {
      let url = 'republic?page='+page;
      if(searchText != ''){
        url += '&description='+searchText;
      }
      const response = await api.get(url);
      setTotal(response.data.total);
      setRepublics(response.data.data);
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRepublic(1);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadRepublic(1);
  }

  const handlePageChange = (event, page) => {
    loadRepublic(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };  


  return (
    <div>
      <div className={classes.root}>
      <RepublicToolbar
          onChangeSearch={updateSearch.bind(this)}
          searchText={searchText}
          onClickSearch={onClickSearch}/>
      <div className={classes.content}>
        <Card
            className={clsx(classes.root, className)}>
          <CardContent className={classes.content}>
              <Grid
                container
                spacing={1}>
                <Grid
                  item
                  md={12}
                  xs={12}>
                    <Table>
                        <TableBody>
                          {loading === true ?
                            <LinearProgress/>
                          :republics == '' ?
                          <Table>
                            <TableBody>
                                <TableRow key={0}>
                                    <TableCell align="center" colSpan={9} className={classes.headTable}> Nenhum dado foi encontrado para a pesquisa realizada!</TableCell>
                                </TableRow>
                            </TableBody>
                          </Table>
                          :
                          republics.map(result => (
                            <StudentsRepublic result={result}> </StudentsRepublic>
                          ))}
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
        
      </div>
    </div>
    </div>
  );
};

TableRepublic.propTypes = {
  history: PropTypes.object
};

export default withRouter(TableRepublic);

