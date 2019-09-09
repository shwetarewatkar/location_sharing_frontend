import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import { Observable, Observer } from 'rxjs';

const socket = socketIOClient("https://new-dev.artoon.in:6030");

export default class Service extends Component {

    apiURL = "https://new-dev.artoon.in:6029";
    
    domail = "http://ls.artoon.in/invite?id=";
    
    postdata(data) {
        return axios.post(`${this.apiURL}/location/add`, data);
    }

    senddata(e, Data) {
        return socket.emit('req', { event: e, data: Data });
    }

    getdata() {
        return Observable.create((observer) => {
            socket.on('res', (data) => {
                observer.next(data);
            });
        });
    }

}
