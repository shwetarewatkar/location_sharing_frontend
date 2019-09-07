import React, { Component } from 'react';
import Service from '../Services/service';
import CryptoJS from 'crypto-js';
import alertify from 'alertifyjs';

export default class Auth extends React.Component {

    constructor(props) {
        super(props);

        this.services = new Service();

    }

    authantication() {

        let decryptedData_uid = localStorage.getItem('uid');
        if (decryptedData_uid) {
            var bytes_uid = CryptoJS.AES.decrypt(decryptedData_uid.toString(), 'Location-Sharing');
            var uid = JSON.parse(bytes_uid.toString(CryptoJS.enc.Utf8));
        }


        let decryptedData_email = localStorage.getItem('email');
        if (decryptedData_email) {
            var bytes_email = CryptoJS.AES.decrypt(decryptedData_email.toString(), 'Location-Sharing');
            var email = JSON.parse(bytes_email.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_username = localStorage.getItem('username');
        if (decryptedData_username) {
            var bytes_username = CryptoJS.AES.decrypt(decryptedData_username.toString(), 'Location-Sharing');
            var username = JSON.parse(bytes_username.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_longitude = localStorage.getItem('longitude');
        if (decryptedData_longitude) {
            var bytes_longitude = CryptoJS.AES.decrypt(decryptedData_longitude.toString(), 'Location-Sharing');
            var latchar = JSON.parse(bytes_longitude.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_latitude = localStorage.getItem('latitude');
        if (decryptedData_latitude) {
            var bytes_latitude = CryptoJS.AES.decrypt(decryptedData_latitude.toString(), 'Location-Sharing');
            var longchar = JSON.parse(bytes_latitude.toString(CryptoJS.enc.Utf8));
        }


        var data = {
            uid: uid,
            email: email,
            username: username,
            latitude: decryptedData_longitude,
            longitude: decryptedData_latitude,
            // latitude: longchar,
            // longitude: latchar
        }

        this.services.senddata('Auth', data);
        this.services.getdata().subscribe((res) => {
            switch (res.event) {
                case 'Auth_Status':
                    // alertify.success("Login Suuccessfully");
                    break;
            }
        });
    }

}