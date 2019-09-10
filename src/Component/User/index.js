import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Common/Sidebar';
import Navigation from '../Common/Navigation';
import Footer from '../Common/Footer';
import Service from '../../Services/service';
import Auth from '../../Authantication/Auth';
import alertify from 'alertifyjs';
import CryptoJS from 'crypto-js';


var map, marker, infoWindow, bounds;
var pos = []
var markers = [];
var userGroupids = "";
var currentGroupid = "";

export default class User extends React.Component {

    constructor(props) {
        super(props);

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
            showMenu: true
        }



    }

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
                                                infowindow.setContent(content);
                                                infowindow.open(map, marker);
                                                map.setCenter(marker.getPosition());
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

                                            window.google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                                                return function () {
                                                    infowindow.setContent(content);
                                                    infowindow.open(map, marker);
                                                    map.setCenter(marker.getPosition());
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

    onChangeShareLink(e) {
        this.setState({
            sharelink: e.target.value
        });
    }

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
                                infowindow.setContent(content);
                                infowindow.open(map, marker);
                                map.setCenter(marker.getPosition());
                            };
                        })(marker, content, infowindow));


                        markers.push(marker)
                    })

                    break;
            }
        });

    }

    onChangeInvite(e) {
        this.setState({
            invite: e.target.value
        });
    }

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
                            this.setState({
                                invite: ''
                            });
                            alertify.success(res.data.message);
                        } else {
                            this.setState({
                                invite: ''
                            });
                            alertify.error(res.data.message);
                        }

                        break;
                }
            });
        }

    }

    handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

    getAllLocations() {

        // let self = this


        infoWindow = new window.google.maps.InfoWindow();
        if (navigator && navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(function (position) {
                pos = [position.coords.latitude, position.coords.longitude]
                let centerpos = { "lat": position.coords.latitude, "lng": position.coords.longitude }
                map.setCenter(centerpos);

                // var locs = [["21.2111", "72.8630"], ["21.1418", "72.7709"], ["21.2300", "72.9009"]]

                // locs.forEach((item) => {

                //     var uluru = { lat: parseFloat(item[0]), lng: parseFloat(item[1]) };
                //     marker = new window.google.maps.Marker({
                //         position: uluru,
                //         map: map,
                //         label: 'H'
                //     })

                //     markers.push(marker)
                // })


            }, function (error) {
                console.log("error", error)
                this.handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            this.handleLocationError(false, infoWindow, map.getCenter());
        }
    }

    copyToClipboard(link) {

        var textField = document.createElement('textarea')
        textField.innerText = link
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
        alertify.success("Copied!");

    }

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
                                            {/* <form> */}
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
                                                <div className="col-xl-4">
                                                    <label>Share With Friends Url</label>
                                                    <div className="input-group">
                                                        <input type="text" value={this.state.sharelink} onChange={this.onChangeShareLink} className="form-control" placeholder="Invite Your Friends" />
                                                        <div className="input-group-append">
                                                            <button className="btn btn-success" type="button" onClick={this.copyToClipboard.bind(this, this.state.sharelink)}>
                                                                Share Link
                                                                </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* </form> */}
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
                                                    {/* <option value="">Select Group</option> */}
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