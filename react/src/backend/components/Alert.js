import React, { Component } from 'react'

import {withRouter} from 'react-router-dom';

class Alert extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cssClass: 'alert alert-danger alert-dismissible',
            message: ''
        }
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.message !== this.props.message) {
            this.setState({
                message: nextProps.message
            })
        }
    } 

    componentDidMount() {
    }

    render() {

        var render;
        if(this.state.message.length) {
            render = <div className={ this.state.cssClass }>
                        <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                        { this.state.message }
                    </div>
        }
        return (
            <div>
            {render}
            </div>
        )
    }
}

export default withRouter(Alert);