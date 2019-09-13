// Import require modules

import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Common/Sidebar';
import Navigation from '../Common/Navigation';
import Footer from '../Common/Footer';
import Service from '../../Services/service';
import Auth from '../../Authantication/Auth';
import alertify from 'alertifyjs';
import CryptoJS from 'crypto-js';

// Declare globle variables to use this page

var map, marker, infoWindow, bounds;
var pos = []
var markers = [];
var userGroupids = "";
var currentGroupid = "";
var lastWindow = null;

export default class User extends React.Component {

    // Declare constructor 

    constructor(props) {
        super(props);

        // Declare state variables, methods and class objects for use this page

        this.services = new Service();
        this.auth = new Auth();

        this.onChangeShareLink = this.onChangeShareLink.bind(this);
        this.onChangeGroup = this.onChangeGroup.bind(this);
        this.onChangeInvite = this.onChangeInvite.bind(this);
        this.onAddDefault = this.onAddDefault.bind(this);
        this.defaultLocData = this.defaultLocData.bind(this);

        this.state = {
            map: {},
            sharelink: '',
            groups: [],
            members: [],
            latlong: [],
            invite: '',
            errinvite: true,
            a: '',
            showMenu: true,
            latitude: '',
            longitude: ''
        }

        // this interval set 10 minutes and trace current location of login user

        setInterval(() => {

            let decryptedData_uid = localStorage.getItem('uid');
            if (!decryptedData_uid) {
                return false;
            }

            var bytes_uid = CryptoJS.AES.decrypt(decryptedData_uid.toString(), 'Location-Sharing');
            var userid = JSON.parse(bytes_uid.toString(CryptoJS.enc.Utf8));


            let decryptedData_latitude = localStorage.getItem('latitude');

            var bytes_latitude = CryptoJS.AES.decrypt(decryptedData_latitude.toString(), 'Location-Sharing');
            var current_latchar = JSON.parse(bytes_latitude.toString(CryptoJS.enc.Utf8));

            let decryptedData_longitude = localStorage.getItem('longitude');
            var bytes_longitude = CryptoJS.AES.decrypt(decryptedData_longitude.toString(), 'Location-Sharing');
            var current_longchar = JSON.parse(bytes_longitude.toString(CryptoJS.enc.Utf8));

            const location = window.navigator && window.navigator.geolocation

            if (location) {

                location.getCurrentPosition((position) => {

                    this.setState({
                        latitude: position.coords.longitude.toString(),
                        longitude: position.coords.latitude.toString(),
                    })

                    if (this.state.latitude == current_latchar) {
                        console.log("not event");
                    } else {

                        var latitude = CryptoJS.AES.encrypt(JSON.stringify(this.state.latitude), 'Location-Sharing');
                        localStorage.setItem("latitude", latitude.toString());

                        var longitude = CryptoJS.AES.encrypt(JSON.stringify(this.state.longitude), 'Location-Sharing');
                        localStorage.setItem("longitude", longitude.toString());

                        var data = {
                            uid: userid,
                            latitude: latitude.toString(),
                            longitude: longitude.toString()
                        }

                        this.services.senddata('UpdateLocation', data);
                    }


                }, (error) => {
                    console.log("Update Location error:- ", error)
                })
            } else {

                this.handleLocationError(false, infoWindow, map.getCenter());
            }

        }, 600000)

    }

    // Declare componentDidMount method for mount some data and methods on load this page

    componentDidMount() {

        this.auth.authantication();

        setTimeout(() => {
            map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 11
            });
            bounds = new window.google.maps.LatLngBounds();
            this.getAllLocations()
            this.defaultLocData();

        }, 1000)

        let decryptedData_code = localStorage.getItem('invitecode');
        var bytes_code = CryptoJS.AES.decrypt(decryptedData_code.toString(), 'Location-Sharing');
        var code = JSON.parse(bytes_code.toString(CryptoJS.enc.Utf8));

        let decryptedData_uid = localStorage.getItem('uid');
        var bytes_uid = CryptoJS.AES.decrypt(decryptedData_uid.toString(), 'Location-Sharing');
        var uid = JSON.parse(bytes_uid.toString(CryptoJS.enc.Utf8));


        this.setState({
            sharelink: this.auth.services.domail + code,
            uid: uid
        })

        this.services.senddata('GetGroupsList', '');
        this.services.getdata().subscribe((res) => {
            switch (res.event) {
                case 'GroupList':
                    this.setState({
                        groups: res.data
                    })
                    break;
            }
        });

        this.services.getdata().subscribe((res) => {
            switch (res.event) {
                case 'UserLocationUpdate':

                    if (userGroupids.indexOf(res.data.uid) > -1) {

                        for (var i = 0; i < markers.length; i++) {
                            markers[i].setMap(null);
                        }

                        var data = {
                            uid: this.state.uid,
                            GroupId: currentGroupid
                        }

                        this.services.senddata('GetMemeberList', data);
                        this.services.getdata().subscribe((res) => {
                            switch (res.event) {
                                case 'GroupMemberList':

                                    userGroupids = "";

                                    userGroupids = res.data.members;

                                    res.data.MemberList.forEach((item, i) => {

                                        // var uluru = { lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) };

                                        let decryptedData_lat = item.latitude;
                                        var bytes_lat = CryptoJS.AES.decrypt(decryptedData_lat.toString(), 'Location-Sharing');
                                        var lat = JSON.parse(bytes_lat.toString(CryptoJS.enc.Utf8));

                                        let decryptedData_long = item.longitude;
                                        var bytes_long = CryptoJS.AES.decrypt(decryptedData_long.toString(), 'Location-Sharing');
                                        var long = JSON.parse(bytes_long.toString(CryptoJS.enc.Utf8));

                                        var uluru = { lat: parseFloat(lat), lng: parseFloat(long) };

                                        marker = new window.google.maps.Marker({
                                            position: uluru,
                                            map: map,
                                            title: item.username
                                        })

                                        var content = '<div id="content">' +
                                            '<h6>' + item.username + '</h6>' +
                                            '</div>';
                                        var infowindow = new window.google.maps.InfoWindow();

                                        window.google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                                            return function () {

                                                if (lastWindow) lastWindow.close();

                                                infowindow.setContent(content);
                                                infowindow.open(map, marker);
                                                map.setCenter(marker.getPosition());

                                                lastWindow = infowindow;
                                            };
                                        })(marker, content, infowindow));


                                        markers.push(marker)
                                    })

                                    break;
                            }
                        });

                    } else {
                        console.log("not inarray", currentGroupid);
                    }

                    break;
            }
        });

    }

    // Declare defaultLocData method for set map of default group member location

    defaultLocData() {

        userGroupids = "";

        this.services.senddata('GetGroupsList', '');
        this.services.getdata().subscribe((res) => {
            switch (res.event) {
                case 'GroupList':

                    res.data.forEach((item, i) => {

                        if (item.default) {

                            userGroupids = item.members;
                            currentGroupid = item._id;

                            var data = {
                                uid: this.state.uid,
                                GroupId: item._id
                            }

                            this.services.senddata('GetMemeberList', data);
                            this.services.getdata().subscribe((res) => {
                                switch (res.event) {
                                    case 'GroupMemberList':

                                        res.data.MemberList.forEach((items, ii) => {

                                            let decryptedData_lat = items.latitude;
                                            var bytes_lat = CryptoJS.AES.decrypt(decryptedData_lat.toString(), 'Location-Sharing');
                                            var lat = JSON.parse(bytes_lat.toString(CryptoJS.enc.Utf8));

                                            let decryptedData_long = items.longitude;
                                            var bytes_long = CryptoJS.AES.decrypt(decryptedData_long.toString(), 'Location-Sharing');
                                            var long = JSON.parse(bytes_long.toString(CryptoJS.enc.Utf8));

                                            var uluru = { lat: parseFloat(lat), lng: parseFloat(long) };

                                            marker = new window.google.maps.Marker({
                                                position: uluru,
                                                map: map,
                                                title: items.username
                                            })

                                            var content = '<div id="content">' +
                                                '<h6>' + items.username + '</h6>' +
                                                '</div>';
                                            var infowindow = new window.google.maps.InfoWindow();

                                            window.google.maps.event.addListener(marker, 'click', ((marker, content, infowindow) => {
                                                return () => {

                                                    if (lastWindow) lastWindow.close();

                                                    infowindow.setContent(content);
                                                    infowindow.open(map, marker);
                                                    map.setCenter(marker.getPosition());

                                                    lastWindow = infowindow;

                                                };
                                            })(marker, content, infowindow));

                                            markers.push(marker)


                                        })

                                        break;
                                }
                            });
                        }
                    })
                    break;
            }
        });

    }

    // Declare onChangeShareLink method for set value of sharelink

    onChangeShareLink(e) {
        this.setState({
            sharelink: e.target.value
        });
    }

    // Declare onChangeInvite method for set calue of invitecode

    onChangeInvite(e) {
        this.setState({
            invite: e.target.value
        });
    }

    // Declare onChangeGroup method for get and set group wise member location on map

    onChangeGroup(e) {

        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }

        var newgid = e.target.value;

        var data = {
            uid: this.state.uid,
            GroupId: e.target.value
        }

        this.services.senddata('GetMemeberList', data);
        this.services.getdata().subscribe((res) => {
            switch (res.event) {
                case 'GroupMemberList':

                    userGroupids = "";
                    // console.log("items:- ", res.data);

                    userGroupids = res.data.members;

                    res.data.MemberList.forEach((item, i) => {

                        currentGroupid = newgid;

                        // var uluru = { lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) };

                        let decryptedData_lat = item.latitude;
                        var bytes_lat = CryptoJS.AES.decrypt(decryptedData_lat.toString(), 'Location-Sharing');
                        var lat = JSON.parse(bytes_lat.toString(CryptoJS.enc.Utf8));

                        let decryptedData_long = item.longitude;
                        var bytes_long = CryptoJS.AES.decrypt(decryptedData_long.toString(), 'Location-Sharing');
                        var long = JSON.parse(bytes_long.toString(CryptoJS.enc.Utf8));

                        var uluru = { lat: parseFloat(lat), lng: parseFloat(long) };

                        marker = new window.google.maps.Marker({
                            position: uluru,
                            map: map,
                            title: item.username
                        })

                        var content = '<div id="content">' +
                            '<h6>' + item.username + '</h6>' +
                            '</div>';
                        var infowindow = new window.google.maps.InfoWindow();

                        window.google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                            return function () {

                                if (lastWindow) lastWindow.close();

                                infowindow.setContent(content);
                                infowindow.open(map, marker);
                                map.setCenter(marker.getPosition());

                                lastWindow = infowindow;

                            };
                        })(marker, content, infowindow));


                        markers.push(marker)
                    })

                    break;
            }
        });

    }

    // Declare onAddDefault method for add member in default group and this added member set location on map

    onAddDefault(e) {
        e.preventDefault();

        if (this.state.invite == '') {
            this.setState({
                errinvite: false
            });
            this.state.errinvite = false;
        } else {
            this.setState({
                errinvite: true
            });
            this.state.errinvite = true;
        }

        if (this.state.errinvite == true) {

            var data = {
                uid: this.state.uid,
                InviteCode: this.state.invite
            }

            this.services.senddata('AddToDefult', data);
            this.services.getdata().subscribe((res) => {

                switch (res.event) {
                    case 'AddDefaultMemebrResp':

                        if (res.data.status == true) {

                            var massage = res.data.message;

                            this.setState({
                                invite: ''
                            });

                            this.services.senddata('GetGroupsList', '');
                            this.services.getdata().subscribe((res) => {
                                switch (res.event) {
                                    case 'GroupList':

                                        for (var i = 0; i < markers.length; i++) {
                                            markers[i].setMap(null);
                                        }

                                        res.data.forEach((item, i) => {

                                            if (item.default) {

                                                for (var i = 0; i < markers.length; i++) {
                                                    markers[i].setMap(null);
                                                }

                                                var data = {
                                                    uid: this.state.uid,
                                                    GroupId: item._id
                                                }

                                                this.services.senddata('GetMemeberList', data);
                                                this.services.getdata().subscribe((res) => {
                                                    switch (res.event) {
                                                        case 'GroupMemberList':

                                                            res.data.MemberList.forEach((items, ii) => {

                                                                let decryptedData_lat = items.latitude;
                                                                var bytes_lat = CryptoJS.AES.decrypt(decryptedData_lat.toString(), 'Location-Sharing');
                                                                var lat = JSON.parse(bytes_lat.toString(CryptoJS.enc.Utf8));

                                                                let decryptedData_long = items.longitude;
                                                                var bytes_long = CryptoJS.AES.decrypt(decryptedData_long.toString(), 'Location-Sharing');
                                                                var long = JSON.parse(bytes_long.toString(CryptoJS.enc.Utf8));

                                                                var uluru = { lat: parseFloat(lat), lng: parseFloat(long) };

                                                                marker = new window.google.maps.Marker({
                                                                    position: uluru,
                                                                    map: map,
                                                                    title: items.username
                                                                })

                                                                var content = '<div id="content">' +
                                                                    '<h6>' + items.username + '</h6>' +
                                                                    '</div>';
                                                                var infowindow = new window.google.maps.InfoWindow();

                                                                window.google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                                                                    return function () {
                                                                        infowindow.setContent(content);
                                                                        infowindow.open(map, marker);
                                                                        map.setCenter(marker.getPosition());
                                                                    };
                                                                })(marker, content, infowindow));


                                                                markers.push(marker)

                                                                this.services.offsocket();

                                                            })

                                                            break;
                                                    }
                                                });
                                                alertify.success(massage);
                                            }
                                        })

                                        break;
                                }
                            });
                        } else {
                            this.setState({
                                invite: ''
                            });
                            alertify.error(res.data.message);
                            this.services.offsocket();
                        }

                        break;
                }
            });

        }

    }

    // Declare handleLocationError method for when any kid of location related error is occur at that time that method handled current location

    handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

    // Declare getAllLocations method for set and render map by default when intialize current page

    getAllLocations() {

        infoWindow = new window.google.maps.InfoWindow();
        if (navigator && navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(function (position) {
                pos = [position.coords.latitude, position.coords.longitude]
                let centerpos = { "lat": position.coords.latitude, "lng": position.coords.longitude }
                map.setCenter(centerpos);

            }, function (error) {
                console.log("error", error)
                this.handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            this.handleLocationError(false, infoWindow, map.getCenter());
        }
    }

    // Declare copyToClipboard method for copy share link click on button

    copyToClipboard(link) {

        var textField = document.createElement('textarea')
        textField.innerText = link
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
        alertify.success("Copied!");

    }

    // Render HTML page and return it

    render() {

        return (

            <div id="wrapper">
                <Sidebar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">

                        <Navigation />

                        <div className="container-fluid">

                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card shadow mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Add New User</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-xl-3">
                                                    <form onSubmit={this.onAddDefault}>
                                                        <label>Invite Friends</label>
                                                        <div className="input-group">
                                                            {
                                                                (this.state.errinvite) ?
                                                                    <input type="text" className="form-control" value={this.state.invite} onChange={this.onChangeInvite} placeholder="Invite Your Friends" />
                                                                    :
                                                                    <input type="text" style={{ border: '1px solid red' }} className="form-control" value={this.state.invite} onChange={this.onChangeInvite} placeholder="Invite Your Friends" />
                                                            }

                                                            <div className="input-group-append">
                                                                <button className="btn btn-primary" type="submit">
                                                                    ADD
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="col-xl-5">
                                                    <label>Share With Your Friends</label>
                                                    <div className="input-group">
                                                        <input type="text" value={this.state.sharelink} onChange={this.onChangeShareLink} className="form-control" placeholder="Invite Your Friends" />
                                                        <div className="input-group-append">
                                                            <button className="btn btn-success" type="button" onClick={this.copyToClipboard.bind(this, this.state.sharelink)}>
                                                                Copy Link
                                                                </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card shadow mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <div style={{ float: 'left' }}>
                                                <h6 className="m-0 font-weight-bold text-primary">Map</h6>
                                            </div>
                                            <div style={{ float: 'right' }}>
                                                <select className="form-control" onChange={this.onChangeGroup}>
                                                    {
                                                        this.state.groups ?
                                                            this.state.groups.map(function (obj, i) {
                                                                return (
                                                                    <option value={obj._id} key={i}>{obj.groupname}</option>
                                                                )
                                                            }, this)
                                                            : ''
                                                    }

                                                </select>
                                            </div>

                                        </div>
                                        <div className="card-body">
                                            <div className="maMap" id="map" style={{ height: '500px' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    <Footer />

                </div>
            </div>

        );
    }

}