import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser'; 

import {withRouter} from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import { connect } from 'react-redux';
import * as types from '../redux/types/index';

class ButtonSubmit extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidUpdate(prevProps) {
    }

    componentDidMount() {
    }

    onButtonClick= () => {
        this.props.onButtonClick();
    }

    render() {
        return (
            <Button
                variant="primary btn-block btn-flat"
                disabled={this.props.progress.status}
                onClick={ this.onButtonClick }
            >
                {this.props.progress.status ? 'Loading...' : this.props.text}
            </Button>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        progress: state.progress
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(ButtonSubmit);