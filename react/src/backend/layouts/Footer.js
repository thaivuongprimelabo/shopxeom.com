import React, { Component } from 'react'

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
                    <div className="pull-right hidden-xs">
                    <b>Version</b> 2.4.0
                    </div>
                    <strong>Copyright &copy; 2014-2016 <a href="https://adminlte.io">Almsaeed Studio</a>.</strong> All rights
                    reserved.
                </footer>
            </div>
        )
    }
}

export default Footer;