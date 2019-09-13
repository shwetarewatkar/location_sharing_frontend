// Import require modules

import React, { Component } from 'react';
import { Route, Router, Link } from 'react-router-dom';
import history from './History';
import Login from './Component/Login';
import Registration from './Component/Registration';
import User from './Component/User/index';
import People from './Component/User/people';
import Groups from './Component/Group/index';
import Setting from './Component/Settings/index';
import Invite from './Component/Invite/index';
import Forgot from './Component/Forgotpassword';

class Routers extends Component {

    // Render All Web Application Routs to call pages

    render() {
        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/confirm" component={Forgot} />
                    <Route exact path="/registration" component={Registration} />
                    <Route exact path="/user" component={User} />
                    <Route exact path="/people" component={People} />
                    <Route exact path="/groups" component={Groups} />
                    <Route exact path="/setting" component={Setting} />
                    <Route exact path="/invite" component={Invite} />
                </div>
            </Router>
        )
    }
}

export default Routers;