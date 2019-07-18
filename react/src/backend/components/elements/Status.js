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
        var cssClass = 'label label-danger';
        var statusText = '';
        var status = this.props.status;
        if(status) {
            cssClass = 'label label-success';
        }

        if(this.props.type === 'status') {
            var statusText = this.props.lang.status.unactive;
            if(status) {
                statusText = this.props.lang.status.active;
            }
        }

        if(this.props.type === 'avail_flg') {
            var statusText = this.props.lang.status.out_of_stock;
            if(status) {
                statusText = this.props.lang.status.available;
            }
        }

        if(this.props.type === 'order_status') {
            statusText = this.props.lang.status.order_cancel;
            if(status === 0) {
                cssClass = 'label label-primary';
                statusText = this.props.lang.status.order_new;
            }

            if(status === 1) {
                cssClass = 'label label-warning';
                statusText = this.props.lang.status.order_shipping;
            }

            if(status === 2) {
                cssClass = 'label label-success';
                statusText = this.props.lang.status.order_done;
            }
        }

        if(this.props.type === 'contact_status') {
            cssClass = 'label label-primary';
            var statusText = this.props.lang.status.contact_new;
            if(status) {
                cssClass = 'label label-success';
                statusText = this.props.lang.status.contact_replied;
            }
        }
        
        return (
            <a href="javascript:void(0)" target="_block"><span className={cssClass}>{statusText}</span></a>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {}
};


export default connect(mapStateToProps, mapDispatchToProps)(Status);