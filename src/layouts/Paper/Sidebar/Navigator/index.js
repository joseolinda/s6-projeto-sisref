import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

function Navigator(props) {
  const { classes, category, ...other } = props;

  return (
          <React.Fragment key={category.id}>
            <Link href={category.href} component="a">
              <ListItem className={classes.categoryHeader}>
                <ListItemText
                  classes={{
                    primary: classes.categoryHeaderPrimary,
                  }}>
                  {category.id}
                </ListItemText>
              </ListItem>
            </Link>
            {category.children.map(({ id: childId, href, icon, active }) => (
                childId == "Sobre" ? 
                <Link target="_blank" href={href}>  <ListItem
                  key={childId}
                  button
                  className={clsx(classes.item, active && classes.itemActiveItem)}
                  as={Link} to={href}>
                    <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                    <ListItemText
                      classes={{
                        primary: classes.itemPrimary,
                      }}>
                      {childId}
                    </ListItemText>
                  </ListItem>
                </Link>
                : 
                <Link href={href}>
                  <ListItem
                    key={childId}
                    button
                    className={clsx(classes.item, active && classes.itemActiveItem)}
                    as={Link} to={href}>
                    <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                    <ListItemText
                      classes={{
                        primary: classes.itemPrimary,
                      }}>
                      {childId}
                    </ListItemText>
                  </ListItem>
                </Link>
            ))}

            <Divider className={classes.divider} />
          </React.Fragment>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Navigator));
