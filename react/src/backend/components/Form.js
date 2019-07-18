import React, { Component } from 'react'

import ReactHtmlParser from 'react-html-parser';

import { connect } from 'react-redux';

import { getData } from '../redux/actions/index';

import TableRow from '../components/TableRow';
import Checkbox from '../components/elements/Checkbox';
import Spinner from '../components/Spinner';
import { Button } from 'react-bootstrap';

import * as types from '../redux/types/index';

class Form extends Component {

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
        
        var render;


        return (
            <div>{render}</div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        progress: state.progress
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Form);