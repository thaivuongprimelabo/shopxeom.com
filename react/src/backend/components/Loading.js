import React, { Component } from 'react'

import * as types from '../redux/types/index';

import { connect } from 'react-redux';

class Loading extends Component {

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
        var color = this.props.color !== undefined ? this.props.color : '#888888';
        var render = <i className="fa fa-circle-o-notch fa-spin" style={{color: color}}></i>;
        if(Object.keys(this.props.lang).length) {
            render = this.props.children;
        }
        return (
            <div>
                {render}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Loading);