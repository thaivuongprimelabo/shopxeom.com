import React, { Component } from 'react'

import TableList from '../components/TableList';

class Categories extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log('Categories:componentWillMount');
    }

    componentWillReceiveProps(nextProps) {

    } 

    componentDidMount() {
        console.log('Categories:componentDidMount');
    }

    render() {
        return (
            <TableList moduleName={this.props.moduleName} />
        )
    }
}

export default Categories;