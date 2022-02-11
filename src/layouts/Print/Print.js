import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: 64,
    height: '100%'
  },
  content: {
    height: '100%'
  }
}));

const Print = props => {
  const { children } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <main className={classes.content}>{children}</main>
    </div>
  );
};

Print.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Print;
