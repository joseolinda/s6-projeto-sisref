import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavDropdown, Button,Dropdown} from "react-bootstrap";

import { logout } from "../../services/auth";

export class HeaderNutri extends Component {
    handleLogout = e => {
        //const response = await api.post("/api/logout");
        logout();
        this.props.history.push("/");
    }

    render(){
        const name = localStorage.getItem('@user');
        return(
            <Navbar bg="light" expand="lg">
                <Link to="/nutritionist">
                <i className={"fas fa-utensils"}></i>
                    <Navbar.Brand>
                    SIS-RES
                    </Navbar.Brand>
                </Link>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <NavDropdown title="Cadastros" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to={"/nutritionist/meal"}>Refeições</NavDropdown.Item>
                                <Dropdown.Divider />
                                <NavDropdown.Item as={Link} to={"/nutritionist/menu"}>Cardápio</NavDropdown.Item>
                                <Dropdown.Divider />
                                <NavDropdown.Item as={Link} to={"/nutritionist/verify"}>Verificar Refeições</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Relatórios" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to={"/nutritionist/reports"}>Total de Refeições</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Outros" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to={"/nutritionist"}>Mudar a senha</NavDropdown.Item>
                            </NavDropdown>
                            
                        </Nav>
                    </Navbar.Collapse>
                        <Navbar.Brand>
                        <span className="navbar-brand" href="#">Olá, {name}</span>
                        </Navbar.Brand>
                        <Navbar.Brand>
                            <Button variant="light" className="btn btn-primary" data-toggle="modal" data-target="#myModal" > Sair </Button>
                        </Navbar.Brand>
                        

                        <div className="modal fade" id="myModal">
                            <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Tem certeza de que deseja Sair ?</h5>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-footer">
                                    <button onClick={this.handleLogout} type="button" className="btn btn-danger" data-dismiss="modal">Sim</button>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Não</button>
                                </div>
                            </div>
                            </div>
                        </div>
                </Navbar>
        );
    }
}

export default withRouter(HeaderNutri);