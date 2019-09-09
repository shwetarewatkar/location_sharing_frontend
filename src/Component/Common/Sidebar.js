import React from 'react';
import { Link } from 'react-router-dom';

export default class Sidebar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (

            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion collapse show" id="accordionSidebar">

                <Link className="sidebar-brand d-flex align-items-center justify-content-center" to={'/user'}>
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-compass"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3 dashboard-text">
                        Location Share
                    </div>
                </Link>

                <hr className="sidebar-divider my-0" />

                <li className="nav-item">
                    <Link className="nav-link" to={'/user'}>
                        <i className="fas fa-plus"></i>
                        <span> Add New User</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to={'/people'}>
                        <i className="fas fa-user"></i>
                        <span> People</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to={'/groups'}>
                        <i className="fas fa-users"></i>
                        <span> Groups</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to={'/setting'}>
                        <i className="fas fa-cog"></i>
                        <span> Settings</span>
                    </Link>
                </li>

                <hr className="sidebar-divider" />

                <li className="nav-item">
                    <Link className="nav-link" to={'/'}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span> Logout</span>
                    </Link>
                </li>

            </ul>

        );
    }

}