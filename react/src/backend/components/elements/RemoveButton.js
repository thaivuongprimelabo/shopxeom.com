import React, { Component } from 'react'

import { connect } from 'react-redux';

class RemoveButton extends Component {

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

        return (
            <a href="javascript:void(0)" className="remove-row" title="Xóa"><i className="fa fa-trash" aria-hidden="true" style={{'fontSize': '20px'}}></i></a>
        )
    }
}


export default (RemoveButton);