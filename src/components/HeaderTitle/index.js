import React, { Component } from 'react';


export class HeaderTitle extends Component {
    render(){
        return(
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h3 className="m-0 text-dark"> IFCE - Campus Cedro</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HeaderTitle;
