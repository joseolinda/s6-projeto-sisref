import React, { Component } from 'react';


export class HomeNutri extends Component {
    render(){
        return(
                <div className="content" >
                    <div className="container">
                        <div className="row">
                        <div className="col-lg-6">
                                <div className="card card-primary card-outline">
                                    <div className="card-header">
                                        <h5 className="card-title m-0">Refeições do dia anterior</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>                                       
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="card card-primary card-outline">
                                    <div className="card-header">
                                        <h5 className="card-title m-0">Cardápio do dia</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}


export default HomeNutri;

