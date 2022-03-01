import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {Button, Typography, Tooltip, Hidden, IconButton} from '@material-ui/core';
import FindInPage from '@material-ui/icons/SearchSharp';
import AddStudent from '@material-ui/icons/PersonAdd';

import { SearchInput } from '../../../../../components';
import {withRouter} from "react-router-dom";

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

const StudentToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, history, ...rest } = props;

  const classes = useStyles();

  const onClickHandleCampus = () => {
    history.push('/student-details');
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <Typography variant="h5" className={classes.title}>{'Lista de Estudantes'}</Typography>
        <span className={classes.spacer} />
        <Hidden smDown>
          <Button variant="contained" color="primary" className={classes.exportButton}
            onClick={onClickHandleCampus}>
                Novo estudante
          </Button>
        </Hidden>
        <Hidden smUp>
          <Tooltip title="Novo estudante">
            <Button variant="contained" color="primary" className={classes.exportButton}
              onClick={onClickHandleCampus}>
                <AddStudent />
            </Button>
          </Tooltip>
        </Hidden>
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Pesquisar por nome, matrícula ou código"
          onChange={onChangeSearch}
          value={searchText}
        />
        <Tooltip title="Pesquisar">
          <Button
              onClick={onClickSearch}>
            <FindInPage fontSize="large"/>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

StudentToolbar.propTypes = {
  className: PropTypes.string,
  onChangeSearch: PropTypes.func,
  onClickSearch: PropTypes.func,
  searchText: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(StudentToolbar);
