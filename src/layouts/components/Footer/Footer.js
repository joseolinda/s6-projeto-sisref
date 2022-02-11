import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
  }
}));

const Footer = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div align="center"
      {...rest}
      className={clsx(classes.root, className)}>
        <div className={classes.logoImage}>
            <img
                alt="Logo"
                src="/images/leds.png"/>
            <Link
                component="a"
                href="https://ifce.edu.br/cedro/campus_cedro/grupos-de-pesquisa/gipea/"
                target="_blank">
                <img
                    alt="Logo"
                    src="/images/GIPEA.png" style={{marginLeft: '15px'}}/>
            </Link>
            <Link
                component="a"
                href="https://www.ifce.edu.br/"
                target="_blank">
                <img
                    alt="Logo"
                    src="/images/ifce.png" style={{marginLeft: '15px'}}/>
            </Link>
        </div>
      <Typography variant="body1">
          &copy;{' '}
          <Link
              component="a"
              href="https://www.ifce.edu.br/"
              target="_blank">
              Instituto Federal do Ceará
          </Link>
          . {new Date().getFullYear()}
      </Typography>
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string
};

export default Footer;
