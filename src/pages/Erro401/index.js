import React from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import { Body } from "./styles";
  
const Page401 = props => {
    const { className, history, ...rest } = props;
    const handleBack = () => {
        history.goBack();
     };
    return(
        <Body>
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="error-template">
                        <h1>Oops!</h1>
                        <h2>401 Unauthorized</h2>
                    <div class="error-details">Desculpe, esse recurso é indisponível para você! </div>
                    <div class="error-actions">
                        <button className={'btn btn-primary btn-lg'} onClick={handleBack}>Voltar a página anterior</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </Body>
    ) 
}
Page401.propTypes = {
    className: PropTypes.string,
  };
  
export default withRouter(Page401);