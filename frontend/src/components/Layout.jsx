import React, { useEffect } from 'react'
import {Outlet} from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx';
import { connect } from 'react-redux';

import { load_user } from '../actions/profile.js';
import { load_categories } from '../actions/categories.js';
import { checkAdmin } from '../actions/auth.js';

const Layout = ({ load_user, load_categories, checkAdmin }) => {

    useEffect(() => {
        checkAdmin();
        load_user();
        load_categories();
    },[load_user, load_categories, checkAdmin]);
    
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}

export default connect(null, {load_user, load_categories, checkAdmin})(Layout);