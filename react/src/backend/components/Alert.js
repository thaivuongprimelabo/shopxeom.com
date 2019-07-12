import React, { Component } from 'react'

import * as types from '../redux/types/index';

import { connect } from 'react-redux';

class Alert extends Component {

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

        var message = this.props.alert.message;
        var cssClass = this.props.alert.cssClass;

        var render;
        if(message.length) {
            render = <div className={ cssClass }>
                        <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                        { message }
                    </div>
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
        progress: state.progress,
        alert: state.alert
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Alert);