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
        // if(prevProps.exception.code !== this.props.exception.code) {
        //     if(this.props.exception.code !== 0) {
        //         this.setState({
        //             isLoading: false
        //         })
        //     }
        // }
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
                disabled={this.props.progress}
                onClick={ this.onButtonClick }
            >
                {this.props.progress ? 'Loading...' : this.props.text}
            </Button>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        exception: state.exception,
        progress: state.progress
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(ButtonSubmit);