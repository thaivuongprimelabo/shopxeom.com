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
        var icon = this.props.icon !== undefined ? <i className={this.props.icon} aria-hidden="true" /> : ''
        var cssClass = this.props.cssClass !== undefined ? this.props.cssClass : 'primary btn-block btn-flat'

        return (
            <Button
                variant={cssClass}
                disabled={this.props.progress.status}
                onClick={ this.onButtonClick }
            >
                {icon} {this.props.progress.status ? 'Loading...' : this.props.text}
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