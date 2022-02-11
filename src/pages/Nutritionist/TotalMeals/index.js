import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import FooterAdmin from "../../../components/FooterAdmin";
import HeaderNutri from "../../../components/HeaderNutri";
import { Form, Col, Button} from "react-bootstrap";
import api from "../../../services/api";
import SweetAlert from 'react-bootstrap-sweetalert';

class TotalMealsNutri extends Component{
    render(){
        return(
            <div className={'container'} height={100}>
                
                <HeaderNutri>
                </HeaderNutri>
                <nav className="navbar navbar-light justify-content-between">
                    <a className="navbar-brand mb-0 h1"> Total de refeições </a>
                </nav>
                <div id='center'>
                    <Form >
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Data Inicial *</Form.Label>
                                <input class="form-control" type="date"  id="example-date-input"></input>
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>Data Final *</Form.Label>
                                <input class="form-control" type="date" id="example-date-input"></input>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </div>
                <Button variant="success" type="submit">
                       Imprimir
                    </Button>
                <FooterAdmin>
                </FooterAdmin>
                
            </div>  
        );
    }
}

export default withRouter(TotalMealsNutri);