import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';

 // Routes
import * as Routes from './constants/routes';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Actions
import { loadLang } from './redux/actions/index';

// Redux
import { connect } from 'react-redux';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            lang: {}
        }
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.lang !== this.props.lang) {
        }
    } 

    componentDidMount() {
        this.props.loadLang();
    }

    render() {
        return (
            <div>
                <Router basename={Routes.BASENAME}>
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route path={Routes.LOGIN} component={Login} />
                        <Route path={Routes.DASHBOARD} component={Dashboard} />
                    </Switch>
                </Router>
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
        loadLang: () => {
            dispatch(loadLang());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);