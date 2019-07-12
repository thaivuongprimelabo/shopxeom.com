import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';

 // Routes
import * as Routes from './constants/routes';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Actions
import { loadLang, loadConfig } from './redux/actions/index';

// Redux
import { connect } from 'react-redux';

class App extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.props.loadLang();
        this.props.loadConfig();
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
    return {};
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadLang: () => {
            dispatch(loadLang());
        },
        loadConfig: () => {
            dispatch(loadConfig());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);