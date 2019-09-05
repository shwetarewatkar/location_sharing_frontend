import React from 'react';
import { Link } from 'react-router-dom';

export default class Footer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (

            <footer className="sticky-footer bg-white">
                <div className="container my-auto">
                    <div className="copyright text-center my-auto">
                        <span>Copyright &copy; Your Website 2019</span>
                    </div>
                </div>
            </footer>

        );
    }

}