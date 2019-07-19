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
        var render;

        if(this.props.alert.message.length > 0) {

            setTimeout(function(){ 
                $('.alert').fadeOut();
            }, 4000);
            
            var message = this.props.alert.message;
            var cssClass = this.props.alert.cssClass;
            render = <div id="message">
                        <div style={{ padding: '5px' }}>
                            <div id="inner-message" className={ cssClass }>
                                <i className="fa fa-check fa-2x"></i> { message }
                            </div>
                        </div>
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