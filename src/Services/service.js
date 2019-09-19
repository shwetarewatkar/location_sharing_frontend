// Import require modules

import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import CryptoJS from 'crypto-js';
import { Observable, Observer } from 'rxjs';

// Connection URL of socket server 

const socket = socketIOClient("https://ls.shwetarewatkar.com:3001");

export default class Service extends Component {

    // Connection URL of node server  

    apiURL = "https://ls.shwetarewatkar.com:3000";

    // Globlly Declared invite link

    domail = "https://ls.shwetarewatkar.com/invite?id=";

    // Reconnection of socket server

    reconnect(e, Data) {

        if (socket == null) {
            return socket.on('connect', () => {
                socket.emit('req', { event: e, data: Data });
            });
        }
        
    }

    // Node server api for registration

    postdata(data) {
        return axios.post(`${this.apiURL}/location/add`, data);
    }

    // Send request on socket server 

    senddata(e, Data) {
        return socket.emit('req', { event: e, data: Data });
    }

    // Recieved response from socket server

    getdata() {
        return Observable.create((observer) => {
            socket.on('res', (data) => {
                observer.next(data);
            });
        });
    }

    // OFF all socket server event

    offsocket() {
        return socket.off('res');
    }

    // Disconnect socket

    disconnect() {
        return socket.on('disconnect', (reason) => {
            console.log("disconnected:- ", reason);
        });
    }

}
