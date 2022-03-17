import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {Button, Typography, Tooltip} from '@material-ui/core';
import FindInPage from '@material-ui/icons/SearchSharp';

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

const RepublicToolbar = props => {
  const { className, onClickSearch, onChangeSearch, searchText, history, ...rest } = props;

  const classes = useStyles();

  const onClickHandleRepublic = () => {
    history.push('/republic-details');
  }

  function onPressEnter (event){
    if (event.key == "Enter"){
      onClickSearch ();
    }
   }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <Typography variant="h5" className={classes.title}>{'Lista de Repúblicas'}</Typography>
        <span className={classes.spacer} />
        <Button variant="contained" color="primary" className={classes.exportButton}
          onClick={onClickHandleRepublic}>Nova república</Button>
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Pesquisar"
          onChange={onChangeSearch}
          value={searchText}
          onKeyPress={onPressEnter}
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

RepublicToolbar.propTypes = {
  className: PropTypes.string,
  onChangeSearch: PropTypes.func,
  onClickSearch: PropTypes.func,
  searchText: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(RepublicToolbar);
