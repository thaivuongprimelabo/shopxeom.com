import React, { Component } from 'react'

import * as types from '../redux/types/index';

import { connect } from 'react-redux';

class Spinner extends Component {

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
            <div className="box"><div className="box-header text-center"><i className="fa fa-circle-o-notch fa-spin"></i> {this.props.lang.is_progress}</div></div>
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


export default connect(mapStateToProps, mapDispatchToProps)(Spinner);