import React from 'react';
import { Link } from 'react-router-dom';

export default class Sidebar extends React.Component {

    constructor(props) {
        super(props);

        this.Class = this.Class.bind(this);

        this.state = {
            setuser: false,
            setpeople: false,
            setgroup: false,
            setsetting: false
        }

    }


    Class(path) {
        localStorage.setItem('ActiveTab', path);
        if (path == 'user') {
            this.setState({
                setuser: true,
                setpeople: false,
                setgroup: false,
                setsetting: false
            })
        } else if (path == 'people') {
            this.setState({
                setuser: false,
                setpeople: true,
                setgroup: false,
                setsetting: false
            })
        } else if (path == 'groups') {
            this.setState({
                setuser: false,
                setpeople: false,
                setgroup: true,
                setsetting: false
            })
        } else if (path == 'setting') {
            this.setState({
                setuser: false,
                setpeople: false,
                setgroup: false,
                setsetting: true
            })
        }
    }

    render() {
        return (

            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion  " id="accordionSidebar">

                <Link className="sidebar-brand d-flex align-items-center justify-content-center" to={'/user'}>
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-compass"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3 dashboard-text">
                        Location Share
                    </div>
                </Link>

                <hr className="sidebar-divider my-0" />

                <li className={(this.state.setuser) ? 'nav-item active' : 'nav-item'}>
                    <Link className="nav-link " to={'/user'} data-tab="user" onClick={this.Class.bind(this, 'user')}>
                        <i className="fas fa-plus"></i>
                        <span> Add New User</span>
                    </Link>
                </li>

                <li className={(this.state.setpeople) ? 'nav-item active' : 'nav-item'}>
                    <Link className="nav-link" to={'/people'} data-tab="people" onClick={this.Class.bind(this, 'people')}>
                        <i className="fas fa-user"></i>
                        <span> People</span>
                    </Link>
                </li>

                <li className={(this.state.setgroup) ? 'nav-item active' : 'nav-item'}>
                    <Link className="nav-link" to={'/groups'} data-tab="groups" onClick={this.Class.bind(this, 'groups')}>
                        <i className="fas fa-users"></i>
                        <span> Groups</span>
                    </Link>
                </li>

                <li className={(this.state.setsetting) ? 'nav-item active' : 'nav-item'}>
                    <Link className="nav-link" to={'/setting'} data-tab="setting" onClick={this.Class.bind(this, 'setting')}>
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