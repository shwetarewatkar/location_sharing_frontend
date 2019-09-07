import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import Service from '../Services/service';
import alertify from 'alertifyjs';
import CryptoJS from 'crypto-js';

var map, marker, infoWindow, bounds;
var pos = []
var markers = [];

class Login extends Component {

    constructor(props) {
        super(props);

        this.services = new Service();
        this.Google_Login = this.Google_Login.bind(this);
        this.getMyLocation = this.getMyLocation.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            latitude: '',
            longitude: '',
            email: '',
            erremail: true,
            password: '',
            errpass: true,
            showAlert: false
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
        this.getMyLocation();
        this.removeLocalstorage();
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
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

    handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

    getMyLocation() {

        const location = window.navigator && window.navigator.geolocation

        if (location) {
            this.setState({ showAlert: false })
            location.getCurrentPosition((position) => {
                this.setState({
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString(),
                })

            }, (error) => {
                this.setState({ showAlert: true });
            })
        } else {
            this.setState({ showAlert: true });
            this.handleLocationError(false, infoWindow, map.getCenter());
        }

    }

    Google_Login = () => {

        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(result => {

            // var token = result.credential.accessToken;
            var user = result.user;

            var alllatchar = this.state.latitude.split('.');
            var latchar = alllatchar[0] + "." + alllatchar[1].substring(0, 4);

            var alllongchar = this.state.longitude.split('.');
            var longchar = alllongchar[0] + "." + alllongchar[1].substring(0, 4);

            var latitude = CryptoJS.AES.encrypt(JSON.stringify(this.state.latitude), 'Location-Sharing');
            localStorage.setItem("latitude", latitude.toString());

            var longitude = CryptoJS.AES.encrypt(JSON.stringify(this.state.longitude), 'Location-Sharing');
            localStorage.setItem("longitude", longitude.toString());

            var data = {
                keyword: "googlelogin",
                uid: user.uid,
                email: user.email,
                username: user.username,
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                // lat: latchar,
                // long: longchar
            }

            this.services.postdata(data).then(res => {
                if (res.data.status) {
                    alertify.success(res.data.message);

                    var uid = CryptoJS.AES.encrypt(JSON.stringify(res.data.userdata[0].uid), 'Location-Sharing');
                    localStorage.setItem("uid", uid.toString());

                    var email = CryptoJS.AES.encrypt(JSON.stringify(res.data.userdata[0].email), 'Location-Sharing');
                    localStorage.setItem("email", email.toString());

                    var username = CryptoJS.AES.encrypt(JSON.stringify(res.data.userdata[0].username), 'Location-Sharing');
                    localStorage.setItem("username", username.toString());

                    var invitecode = CryptoJS.AES.encrypt(JSON.stringify(res.data.userdata[0].invitecode), 'Location-Sharing');
                    localStorage.setItem("invitecode", invitecode.toString());

                    // var latitude = CryptoJS.AES.encrypt(JSON.stringify(res.data.userdata[0].latitude), 'Location-Sharing');
                    // localStorage.setItem("latitude", latitude.toString());

                    // var longitude = CryptoJS.AES.encrypt(JSON.stringify(res.data.userdata[0].longitude), 'Location-Sharing');
                    // localStorage.setItem("longitude", longitude.toString());

                    this.props.history.push('/user');
                } else {
                    alertify.success(res.data.message);

                    var uid = CryptoJS.AES.encrypt(JSON.stringify(res.data.userdata[0].uid), 'Location-Sharing');
                    localStorage.setItem("uid", uid.toString());

                    var email = CryptoJS.AES.encrypt(JSON.stringify(res.data.userdata[0].email), 'Location-Sharing');
                    localStorage.setItem("email", email.toString());

                    var username = CryptoJS.AES.encrypt(JSON.stringify(res.data.userdata[0].username), 'Location-Sharing');
                    localStorage.setItem("username", username.toString());

                    var invitecode = CryptoJS.AES.encrypt(JSON.stringify(res.data.userdata[0].invitecode), 'Location-Sharing');
                    localStorage.setItem("invitecode", invitecode.toString());

                    // var latitude = CryptoJS.AES.encrypt(JSON.stringify(res.data.userdata[0].latitude), 'Location-Sharing');
                    // localStorage.setItem("latitude", latitude.toString());

                    // var longitude = CryptoJS.AES.encrypt(JSON.stringify(res.data.userdata[0].longitude), 'Location-Sharing');
                    // localStorage.setItem("longitude", longitude.toString());

                    this.props.history.push('/user');
                }
            });


        }).catch(error => {
            alertify.error(error.message);
        });


    }

    onSubmit(e) {
        e.preventDefault();

        if (this.state.email == '') {
            this.setState({
                erremail: false
            });
            this.state.erremail = false;
        } else {
            this.setState({
                erremail: true
            });
            this.state.erremail = true;
        }

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

        if (this.state.erremail == true && this.state.errpass == true) {

            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(result => {

                var user = result.user;

                var alllatchar = this.state.latitude.split('.');
                var latchar = alllatchar[0] + "." + alllatchar[1].substring(0, 4);

                var alllongchar = this.state.longitude.split('.');
                var longchar = alllongchar[0] + "." + alllongchar[1].substring(0, 4);

                var latitude = CryptoJS.AES.encrypt(JSON.stringify(this.state.latitude), 'Location-Sharing');
                localStorage.setItem("latitude", latitude.toString());

                var longitude = CryptoJS.AES.encrypt(JSON.stringify(this.state.longitude), 'Location-Sharing');
                localStorage.setItem("longitude", longitude.toString());

                var data = {
                    uid: user.uid,
                    email: user.email,
                    username: user.username,
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                    // latitude: latchar,
                    // longitude: longchar
                }
                this.services.senddata('Auth', data);
                this.services.getdata().subscribe((res) => {

                    switch (res.event) {
                        case 'Auth_Status':

                            if (res.data.user_status) {

                                var uid = CryptoJS.AES.encrypt(JSON.stringify(user.uid), 'Location-Sharing');
                                localStorage.setItem("uid", uid.toString());

                                var email = CryptoJS.AES.encrypt(JSON.stringify(res.data.user_details.email), 'Location-Sharing');
                                localStorage.setItem("email", email.toString());

                                var username = CryptoJS.AES.encrypt(JSON.stringify(res.data.user_details.username), 'Location-Sharing');
                                localStorage.setItem("username", username.toString());

                                var invitecode = CryptoJS.AES.encrypt(JSON.stringify(res.data.user_details.invitecode), 'Location-Sharing');
                                localStorage.setItem("invitecode", invitecode.toString());

                                // var latitude = CryptoJS.AES.encrypt(JSON.stringify(res.data.user_details.latitude), 'Location-Sharing');
                                // localStorage.setItem("latitude", latitude.toString());

                                // var longitude = CryptoJS.AES.encrypt(JSON.stringify(res.data.user_details.longitude), 'Location-Sharing');
                                // localStorage.setItem("longitude", longitude.toString());

                                this.props.history.push('/user');

                            } else {
                                alertify.error("User does not exist!");
                            }

                            break;
                    }
                });



            }).catch(error => {
                alertify.error(error.message);
            });

        }

    }

    render() {
        return (

            <div className="container">

                {
                    this.state.showAlert === true ?
                        <div className="alertNavigator">
                            <div className="maErrorBlock">
                                <i class="fas fa-exclamation-triangle" style={{color: 'rgb(234, 67, 53)', fontSize: '50px'}}></i>
                                <h2>Please allow location permission</h2>
                                <h2>from your site settings.</h2>
                            </div>
                        </div>
                        :
                        ''
                }

                <div className="row justify-content-center">

                    <div className="col-xl-10 col-lg-12 col-md-9">

                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">Location Sharing</h1>
                                            </div>
                                            <form className="user" onSubmit={this.onSubmit}>
                                                <div className="form-group">
                                                    {
                                                        (this.state.erremail) ?
                                                            <input type="email" value={this.state.email} onChange={this.onChangeEmail} className="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address..." />
                                                            :
                                                            <input type="email" style={{ border: '1px solid red' }} value={this.state.email} onChange={this.onChangeEmail} className="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address..." />
                                                    }
                                                </div>
                                                <div className="form-group">
                                                    {
                                                        (this.state.errpass) ?
                                                            <input type="password" value={this.state.password} onChange={this.onChangePassword} className="form-control form-control-user" id="exampleInputPassword" placeholder="Password" />
                                                            :
                                                            <input type="password" style={{ border: '1px solid red' }} value={this.state.password} onChange={this.onChangePassword} className="form-control form-control-user" id="exampleInputPassword" placeholder="Password" />
                                                    }
                                                </div>

                                                <button type="submit" className="btn btn-primary btn-user btn-block" style={{ color: 'white' }}>
                                                    Login
                                                </button>
                                                <br />
                                                <div className="row">
                                                    <div className="col-md-6 text-left">
                                                        <Link className="small" to={'/registration'}>Create an Account!</Link>
                                                    </div>
                                                    <div className="col-md-6 text-right">
                                                        <Link className="small" to={'/confirm'}>Forgot Password</Link>
                                                    </div>
                                                </div>

                                                <hr />
                                                <button onClick={this.Google_Login} type="button" className="btn btn-google btn-user btn-block" style={{ background: '#ea4335', color: 'white' }}>
                                                    <i className="fab fa-google fa-fw"></i> Login with Google
                                                </button>
                                                {/* <button type="button" className="btn btn-facebook btn-user btn-block" style={{ background: '#3b5998', color: 'white' }}>
                                                    <i className="fab fa-facebook-f fa-fw"></i> Login with Facebook
                                                </button> */}
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

export default Login;