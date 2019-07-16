import React, { Component } from 'react'

class Products extends Component {

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
                <section className="content-header">
                    <h1>
                        Products page
                        <small>it all starts here</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="#">Examples</a></li>
                        <li className="active">Blank page</li>
                    </ol>
                </section>
        )
    }
}

export default Products;