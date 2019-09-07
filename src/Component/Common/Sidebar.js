import React from 'react';
import { Link } from 'react-router-dom';

export default class Sidebar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (

            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

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

                {/* <li className="nav-item active">
                    <a className="nav-link" href="/dashboard">
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Dashboard</span></a>
                </li>

                <hr className="sidebar-divider" />

                <div className="sidebar-heading">
                    Interface
                </div>

                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true"
                        aria-controls="collapseTwo">
                        <i className="fas fa-fw fa-cog"></i>
                        <span>Components</span>
                    </a>
                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Custom Components:</h6>
                            <a className="collapse-item" href="buttons.html">Buttons</a>
                            <a className="collapse-item" href="cards.html">Cards</a>
                        </div>
                    </div>
                </li>

                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities"
                        aria-expanded="true" aria-controls="collapseUtilities">
                        <i className="fas fa-fw fa-wrench"></i>
                        <span>Utilities</span>
                    </a>
                    <div id="collapseUtilities" className="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Custom Utilities:</h6>
                            <a className="collapse-item" href="utilities-color.html">Colors</a>
                            <a className="collapse-item" href="utilities-border.html">Borders</a>
                            <a className="collapse-item" href="utilities-animation.html">Animations</a>
                            <a className="collapse-item" href="utilities-other.html">Other</a>
                        </div>
                    </div>
                </li>

                <hr className="sidebar-divider" />

                <div className="sidebar-heading">
                    Addons
                </div>

                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages" aria-expanded="true"
                        aria-controls="collapsePages">
                        <i className="fas fa-fw fa-folder"></i>
                        <span>Pages</span>
                    </a>
                    <div id="collapsePages" className="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Login Screens:</h6>
                            <a className="collapse-item" href="login.html">Login</a>
                            <a className="collapse-item" href="register.html">Register</a>
                            <a className="collapse-item" href="forgot-password.html">Forgot Password</a>
                            <div className="collapse-divider"></div>
                            <h6 className="collapse-header">Other Pages:</h6>
                            <a className="collapse-item" href="404.html">404 Page</a>
                            <a className="collapse-item" href="blank.html">Blank Page</a>
                        </div>
                    </div>
                </li>

                <li className="nav-item">
                    <a className="nav-link" href="charts.html">
                        <i className="fas fa-fw fa-chart-area"></i>
                        <span>Charts</span></a>
                </li>

                <li className="nav-item">
                    <a className="nav-link" href="tables.html">
                        <i className="fas fa-fw fa-table"></i>
                        <span>Tables</span></a>
                </li> */}

                {/* <hr className="sidebar-divider d-none d-md-block" />

                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle"></button>
                </div> */}

            </ul>

        );
    }

}