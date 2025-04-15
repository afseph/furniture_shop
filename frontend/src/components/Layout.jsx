import React, { useEffect } from 'react'
import {Outlet} from 'react-router-dom'
import Header from './Header.jsx'
import { connect } from 'react-redux';

import { load_user } from '../actions/profile.js';

const Layout = ({ load_user }) => {

    useEffect(() => {
        load_user();
    },[]);
    
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default connect(null, {load_user})(Layout);