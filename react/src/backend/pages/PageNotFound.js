import React, { Component } from 'react'

class PageNotFound extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {

    } 

    componentDidMount() {
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="error-template">
                            <h1>Oops!</h1>

                            <h2>Page Not Found</h2>

                            <div className="error-details">Sorry, an error has occured, Requested page not found!</div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default PageNotFound;