import React, { Component } from 'react'

import { Link } from 'react-router-dom';

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

    onEdit = () => {
        this.props.onEdit();
    }

    render() {

        return (
            <a href="javascript:void(0)" title="Sửa" onClick={this.onEdit}><i className="fa fa-edit" aria-hidden="true" style={{'fontSize': '20px'}}></i></a>
        )
    }
}


export default (EditButton);