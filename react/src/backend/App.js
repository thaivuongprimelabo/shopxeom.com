import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

class App extends Component {

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
                <Router basename="/backend">
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route path="/login" component={Login} />
                        <Route path="/dashboard" component={Dashboard} />
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default App;