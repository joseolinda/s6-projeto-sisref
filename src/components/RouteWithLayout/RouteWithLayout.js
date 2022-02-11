import React, { useEffect } from 'react';
import {Redirect, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import {isAuthenticated} from "./../../services/auth";
import validate from "validate.js";


const RouteWithLayout = props => {
  const { layout: Layout, typeUser, component: Component, needToBeLogged, ...rest } = props;

  const typeStorage = localStorage.getItem('@rucedro-acess-level-user');

  useEffect(()=>{

  },[typeStorage]);

  return (
    <Route
      {...rest}
      render={matchProps => (
          needToBeLogged ? (
               isAuthenticated() ? (

                typeUser==typeStorage ?
                  <Layout>
                      <Component {...matchProps} />
                  </Layout>
                  :
                    <Redirect to={{ pathname: "/Unauthorized", state: { from: props.location } }} />

              ) : (
                  <Redirect to={{ pathname: "/sign-in", state: { from: props.location } }} />
              )

          ) : (
              <Layout>
                  <Component {...matchProps} />
              </Layout>
          )
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  needToBeLogged: PropTypes.any.isRequired,
  path: PropTypes.string,
  typeUser: PropTypes.string
};

export default RouteWithLayout;
