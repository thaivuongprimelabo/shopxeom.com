import React, { Component } from 'react'

import * as types from '../redux/types/index';

import { connect } from 'react-redux';

class TableRow extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
       
    }

    componentDidUpdate(prevProps) {
    } 

    componentDidMount() {
    }

    render() {
        var render = Object.keys(this.props.header).map((item, index) => {
            return <td key={index}>{this.props.row[item]}</td>
        });
        
        return (
            <tr>
                <td><input type="checkbox" /></td>
                {render}
            </tr>
        )
    }
}

const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = (dispatch, props) => {
    return {}
};


export default connect(mapStateToProps, mapDispatchToProps)(TableRow);