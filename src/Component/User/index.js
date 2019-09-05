import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Common/Sidebar';
import Navigation from '../Common/Navigation';
import Footer from '../Common/Footer';
import CryptoJS from 'crypto-js';


var map, marker, infoWindow, bounds;
var pos = []
var markers = [];

export default class User extends React.Component {

    constructor(props) {
        super(props);


        this.onChangeShareLink = this.onChangeShareLink.bind(this);

        this.state = {
            map: {},
            sharelink: ''
        }

    }

    componentDidMount() {
        setTimeout(() => {
            map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 11
            });
            bounds = new window.google.maps.LatLngBounds();
            this.getAllLocations()
        }, 1000)

        let decryptedData_code = localStorage.getItem('invitecode');
        var bytes_code = CryptoJS.AES.decrypt(decryptedData_code.toString(), 'Location-Sharing');
        var code = JSON.parse(bytes_code.toString(CryptoJS.enc.Utf8));

        this.setState({
            sharelink: "http://localhost:3000/invite/" + code
        })

    }

    onChangeShareLink(e) {
        this.setState({
            sharelink: e.target.value
        });
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

                var locs = [["21.1702", "72.8311"], ["23.0225", "72.5714"], ["22.3072", "73.1812"]]
                locs.forEach((item) => {
                    var uluru = { lat: parseFloat(item[0]), lng: parseFloat(item[1]) };
                    marker = new window.google.maps.Marker({
                        position: uluru,
                        map: map
                    })

                    markers.push(marker)
                })


            }, function (error) {
                console.log("error", error)
                this.handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            this.handleLocationError(false, infoWindow, map.getCenter());
        }
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
                                            <form>
                                                <div className="row">
                                                    <div className="col-xl-3">
                                                        <label>Invite Friends</label>
                                                        <div className="input-group">
                                                            <input type="text" className="form-control" placeholder="Invite Your Friends" />
                                                            <div className="input-group-append">
                                                                <button className="btn btn-primary" type="button">
                                                                    ADD
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-3">
                                                        <label>Share With Friends Url</label>
                                                        <div className="input-group">
                                                            <input type="text" value={this.state.sharelink} onChange={this.onChangeShareLink} className="form-control" placeholder="Invite Your Friends" />
                                                            <div className="input-group-append">
                                                                <button className="btn btn-success" type="button">
                                                                    Share Link
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card shadow mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Map</h6>
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