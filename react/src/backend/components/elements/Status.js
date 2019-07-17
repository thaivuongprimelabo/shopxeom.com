import React, { Component } from 'react'

import { connect } from 'react-redux';

class Status extends Component {

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

        var split = this.props.status.split(',');

        return (
            <a href="javascript:void(0)" target="_block"><span className={split[1]}>{split[0]}</span></a>
        )
    }
}


export default (Status);