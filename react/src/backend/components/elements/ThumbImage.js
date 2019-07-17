import React, { Component } from 'react'

import { connect } from 'react-redux';

class ThumbImage extends Component {

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
            <a href={this.props.src} target="_block"><img src={this.props.src} className="img-responsive img-thumbnail" alt={this.props.src} /></a>
        )
    }
}


export default (ThumbImage);