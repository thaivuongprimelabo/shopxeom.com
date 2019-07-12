import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser';

import { connect } from 'react-redux';

class Footer extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {

    } 

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <footer className="main-footer">
                    { ReactHtmlParser(this.props.config.footer_text) }
                </footer>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        config: state.config
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);