import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Paper, Input, TextField, Grid } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  root: {
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary
  },
 
}));

const SearchInputMenu = props => {
  const { className, onChange, value, style, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
      style={style}>
      {/*<SearchIcon className={classes.icon} /> */}
            <TextField
              key="dateSearch"
              fullWidth
              type="date"
              label="Pesquisa por Data"
              margin="dense"
              name="dateSearch"
              onChange={onChange}
              InputLabelProps={{
                shrink: true,
              }}
              value={value}
              variant="outlined"
            />
    </div>
  );
};

SearchInputMenu.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
  value: PropTypes.object
};

export default SearchInputMenu;