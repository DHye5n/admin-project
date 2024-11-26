import React from 'react';
import Header from "layouts/Header";
import Footer from "layouts/Footer";
import { Outlet, useLocation } from "react-router-dom";
import {AUTH_PATH} from "../../constant";

/**
 *  TODO: component: 레이아웃
 * */
export default function Container() {
    /**
     *  TODO:  state: 현재 페이지 path name 상태
     * */
    const { pathname } = useLocation();

    /**
     *  TODO:  render: 레이아웃 렌더링
     * */
    return (
        <>
            <Header />
            <Outlet />
            { pathname !== AUTH_PATH() && <Footer /> }
        </>
    )
}