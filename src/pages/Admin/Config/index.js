import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import FooterAdmin from "../../../components/FooterAdmin";
import HeaderAdmin from "../../../components/HeaderAdmin";
import HeaderTitle from "../../../components/HeaderTitle";
import api from "../../../services/api";


class Config extends Component{

    render(){
        return(
            <div className={'container'} height={100}>
                <HeaderAdmin>            
                </HeaderAdmin>

                <HeaderTitle>
                </HeaderTitle>
                <div className="content" >
                    <div className="container">
                        <div className="row">
                        <div className="col-lg-6">
                                <div className="card card-primary card-outline">
                                    <div className="card-header">
                                        <h5 className="card-title m-0">Configurações</h5>
                                    </div>
                                    <div className="card-body">
                                       

                                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <FooterAdmin>
                </FooterAdmin>
            </div>
        );
    }
};


export default (Config);