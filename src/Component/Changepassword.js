import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import Service from '../Services/service';
import alertify from 'alertifyjs';
import CryptoJS from 'crypto-js';



export default class Changepass extends Component {

    constructor(props) {
        super(props);

        this.services = new Service();
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeRepassword = this.onChangeRepassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            password: '',
            errpass: true,
            repassword: '',
            errrepass: true
        }

        var config = {
            apiKey: "AIzaSyBLE5yO7ozj753lTC22A94OuTsLYvZGnpE",
            authDomain: "location-sharing-31142.firebaseapp.com",
            databaseURL: "https://location-sharing-31142.firebaseio.com",
            projectId: "location-sharing-31142",
            storageBucket: "gs://location-sharing-31142.appspot.com/"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }

    }

    componentDidMount() {
        // this.removeLocalstorage();
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    removeLocalstorage() {
        localStorage.removeItem("uid");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("invitecode");
        localStorage.removeItem("latitude");
        localStorage.removeItem("longitude");
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangeRepassword(e) {
        this.setState({
            repassword: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        if (this.state.password == '') {
            this.setState({
                errpass: false
            });
            this.state.errpass = false;
        } else {
            this.setState({
                errpass: true
            });
            this.state.errpass = true;
        }

        if (this.state.repassword == '') {
            this.setState({
                errrepass: false
            });
            this.state.errrepass = false;
        } else {

            if (this.state.repassword == this.state.password) {
                this.setState({
                    errrepass: true
                });
                this.state.errrepass = true;
            } else {
                this.setState({
                    errrepass: false
                });
                this.state.errrepass = false;
            }

        }

        var user = firebase.auth().currentUser;

        if (this.state.errpass == true && this.state.errrepass == true) {

            var newPassword = this.state.password;

            user.updatePassword(newPassword).then(() => {
                this.props.history.push('/');
                console.log("Update Password");
            }).catch(function (error) {
                console.log(error);
            });

        }

    }

    render() {
        return (
            <div className="container">

                <div className="row justify-content-center">

                    <div className="col-xl-10 col-lg-12 col-md-9">

                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">Forgot Password</h1>
                                            </div>
                                            <form className="user" onSubmit={this.onSubmit}>
                                                <div className="form-group">
                                                    {
                                                        (this.state.errpass) ?
                                                            <input type="password" value={this.state.password} onChange={this.onChangePassword} className="form-control form-control-user" id="exampleInputPassword" placeholder="Password" />
                                                            :
                                                            <input type="password" style={{ border: '1px solid red' }} value={this.state.password} onChange={this.onChangePassword} className="form-control form-control-user" id="exampleInputPassword" placeholder="Password" />
                                                    }

                                                </div>
                                                <div className="form-group">
                                                    {
                                                        (this.state.errrepass) ?
                                                            <input type="password" value={this.state.repassword} onChange={this.onChangeRepassword} className="form-control form-control-user" id="exampleRepeatPassword" placeholder="Repeat Password" />
                                                            :

                                                            <input type="password" style={{ border: '1px solid red' }} value={this.state.repassword} onChange={this.onChangeRepassword} className="form-control form-control-user" id="exampleRepeatPassword" placeholder="Repeat Password" />
                                                    }

                                                </div>
                                                <button type="submit" className="btn btn-primary btn-user btn-block" style={{ color: 'white' }}>
                                                    Done
                                                </button>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        );
    }

}
