import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import {
    Link
} from "react-router-dom";
import { logout } from '../redux/authSlice';
import { Redirect, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Form, NavDropdown } from 'react-bootstrap';
import { signOut } from '../pages/Home/Home.service';
import useAxios from '../useAxios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import CustomSpinner from './Spinner';
import { clearToken } from '../authHelper';
import { search } from '../redux/todoSlice';

const NavBar = () => {
    const {isLoggedIn} = useSelector(store => store.authReducer);
    const {userDetails} = useSelector(store => store.authReducer);
    const {searchText} = useSelector(store => store.todoReducer);
    const dispatch = useDispatch();
    const [signOutRes, error, loading, fetchSignOut, seterror] = useAxios();
    const [searchTxt, setSearchTxt] = useState('');
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
      setSearchTxt(searchText)
      if (userDetails) {
        setUser(JSON.parse(userDetails))
      }
    }, [isLoggedIn, searchText])

    useEffect(() => {
      if(signOutRes?.success){
        dispatch(logout());
        clearToken();
      }
    }, [signOutRes])

    const handleSignout = async () => {
        fetchSignOut(signOut())
    }

    const searchHandler = (e) => {
      e.preventDefault();
      dispatch(search(searchTxt.trim()));
    }
  return (<>
    {
      loading &&  <CustomSpinner />
    }
    {!loading && <Navbar bg="primary" data-bs-theme="dark">
        <Container>
            {isLoggedIn && 
            <Nav>
                <Link className="navbar-brand text-light" to="/home">To Do</Link>
            </Nav>}
            {isLoggedIn && location.pathname === '/home' && <Form className="d-flex" onSubmit={searchHandler}>
                <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchTxt}
                onChange={e => {
                  e.preventDefault();
                  setSearchTxt(e.target.value)
                }}
                style={{backgroundColor: '#fff', border: 'none'}}
                />
            </Form>}
          <Nav>
            { isLoggedIn && <NavDropdown title={user?.firstname} id="basic-nav-dropdown">
              <NavDropdown.Item>
                <Link className="navbar-brand text-light"
                   to='/my-profile'>My Profile</Link>
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleSignout}>
                Sign Out
              </NavDropdown.Item>
            </NavDropdown>}
            {!isLoggedIn  && <Link className="nav-link text-light" to="/signin">Sign In</Link>}
            {!isLoggedIn && <Link className="nav-link text-light" to="/signup">Sign Up</Link>}
          </Nav>
        </Container>
    </Navbar>}
    </>
  )
}

export default NavBar