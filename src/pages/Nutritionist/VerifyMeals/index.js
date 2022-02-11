import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import HeaderNutri from "../../../components/HeaderNutri";
import HeaderTitle from "../../../components/HeaderTitle";
import FooterAdmin from "../../../components/FooterAdmin";
import api from "../../../services/api";
import SweetAlert from 'react-bootstrap-sweetalert';
import { Form, Col, Button, Table} from "react-bootstrap";
import {ScrollBar} from "../VerifyMeals/styles";

class VerifyMeal extends Component{
    state = {
        meal:[],
    }

    //Requisitar os dados 
    async componentDidMount(){

        const response = await api.get('/api/meal');

        this.setState({meal: response.data});

    }
    render(){
        const { meal } = this.state;
        return(
            <div className={'container'} height={100}>
                <HeaderNutri>
                </HeaderNutri>
                <nav className="navbar navbar-light bg-light justify-content-between">
                    <a className="navbar-brand"> Verificar Refeições </a>
                </nav>
                <div>
                    <Form >
                        <Form.Row>
                            <Form.Group as={Col}  md="2">
                                <Form.Label>Data:</Form.Label>
                                <Form.Control type={"date"}
                                onChange={e => this.setState({ date: e.target.value })}/>
                            </Form.Group>
                            
                            <Form.Group as={Col}  md="2">
                                <Form.Label>Refeição:</Form.Label>
                                <Form.Control as="select" 
                                onChange={e => this.setState({ meal_id: e.target.value })}>
                                {meal.map(meal =>( 
                                    <option  value={meal.id}> {meal.description}</option>
                                ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} md="2" >
                                <Form.Label>Tipo: </Form.Label>
                                <Form.Control as="select" 
                                onChange={e => this.setState({ type: e.target.value })}>
                                <option value="TODOS">TODOS</option>
                                <option value="PRESENTES">PRESENTES</option>
                                <option value="AUSENTES">AUSENTES</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col}  md="6">
                                <Form.Label>Nome:</Form.Label>
                                <Form.Control 
                                onChange={e => this.setState({ description: e.target.value })}
                                placeholder="Digite o nome" />
                            </Form.Group>
                        </Form.Row>
                        <Button variant="success" type="submit">
                           Pesquisar 
                        </Button>
                    </Form>
                </div>
                <ScrollBar> 
                    <Table responsive hover borderless size>
                        <thead>
                            <tr>
                                <th>#Id Ref</th>
                                <th>Cód Est</th>
                                <th>Estudante</th>
                                <th>Curso</th>
                                <th>Refeição </th>
                                <th>Data</th>
                                <th>Situação </th>
                            </tr>
                        </thead> 
                    </Table>
                </ScrollBar>
                <FooterAdmin>
                </FooterAdmin>
            </div>
        );
    }
}

export default withRouter(VerifyMeal);