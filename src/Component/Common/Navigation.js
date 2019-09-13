// Import require modules

import React from 'react';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';

export default class Navigation extends React.Component {

    // Declare constructor 

    constructor(props) {
        super(props);

        // Declare state variable and use that on this page

        this.state = {
            username: ''
        }

    }

    // Declare componentDidMount method 

    componentDidMount() {
        this.userDetails();
    }

    // Declare userDetails method for get username

    userDetails() {

        let decryptedData_username = localStorage.getItem('username');
        if (decryptedData_username) {
            var bytes_username = CryptoJS.AES.decrypt(decryptedData_username.toString(), 'Location-Sharing');
            var username = JSON.parse(bytes_username.toString(CryptoJS.enc.Utf8));

            this.setState({
                username: username
            })
        }


    }

    // Render HTML page and return it

    render() {

        return (

            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                <button className="btn btn-link d-md-none rounded-circle mr-3" type="button" data-toggle="collapse" data-target="#accordionSidebar" aria-controls="#accordionSidebar" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="fa fa-bars"></i>
                </button>

                <ul className="navbar-nav ml-auto">

                    <li className="nav-item">
                        <Link className="nav-link" to={'/user'} style={{ fontSize: '80%', fontWeight: '400', color: '#858796' }}>
                            Hello, {this.state.username}
                            &nbsp;&nbsp;
                            <img className="img-profile rounded-circle" src="img/user.png" />
                        </Link>
                    </li>

                </ul>

            </nav>

        );
    }

}