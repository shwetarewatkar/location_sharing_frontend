import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import { Observable, Observer } from 'rxjs';

const socket = socketIOClient("https://location.artoon.in:3001");

export default class Service extends Component {

    apiURL = "https://location.artoon.in:3000";

    domail = "https://location.artoon.in/invite?id=";

    postdata(data) {
        return axios.post(`${this.apiURL}/location/add`, data);
    }

    senddata(e, Data) {
        // console.log("req:- ", { event: e, data: Data });
        return socket.emit('req', { event: e, data: Data });
    }

    getdata() {
        return Observable.create((observer) => {
            socket.on('res', (data) => {
                // console.log("service all:- ", data);
                observer.next(data);
            });
        });
    }

    offsocket(){
        return socket.off('res');
    }

}
