import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Body } from "./styles";

class Page404 extends Component{
    render(){
        return(
            <Body>
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="error-template">
                            <h1>Oops!</h1>
                            <h2>404 Not Found</h2>
                        <div class="error-details">Desculpe, ocorreu um erro. Página solicitada não encontrada!</div>
                        <div class="error-actions">
                            <Link className={'btn btn-primary btn-lg'} to="/">Voltar ao inicio.</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Body>
        )   
    }
}
export default withRouter(Page404);
