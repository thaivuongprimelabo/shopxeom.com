import React, { Component } from 'react'

import { connect } from 'react-redux';

class EditButton extends Component {

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
            <a href="javascript:void(0)" className="edit-row" title="Sửa"><i className="fa fa-edit" aria-hidden="true" style={{'fontSize': '20px'}}></i></a>
        )
    }
}


export default (EditButton);