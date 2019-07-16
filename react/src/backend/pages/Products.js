import React, { Component } from 'react'

import { connect } from 'react-redux';

import TableList from '../components/TableList';


class Products extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log('Products:componentWillMount');
    }

    componentWillReceiveProps(nextProps) {

    } 

    componentDidMount() {
        console.log('Products:componentDidMount');
    }

    render() {


        return (
            <TableList moduleName={this.props.moduleName} />
        )
    }
}

const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = (dispatch, props) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);