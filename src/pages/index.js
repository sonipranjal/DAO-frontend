import Layout from '@/components/Layout';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Login from '../components/Login';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from 'src/auth/authSlice';
import { setUser } from 'src/user/userSlice';

const LS_KEY = 'login-with-metamask:auth';

export default function App() {
  const [state, setState] = useState({});

  const authState = useSelector((state) => state.authState.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const ls = localStorage.getItem(LS_KEY);
    const auth = ls && JSON.parse(ls);
    if (!auth) {
      return;
    }
    dispatch(setAuth(auth.accessToken));
    setState({ auth });
  }, []);

  const handleLoggedIn = (auth) => {
    localStorage.setItem(LS_KEY, JSON.stringify(auth));
    setState({ auth });
  };

  const handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    setState({ auth: undefined });
  };

  useEffect(() => {
    if (!authState) {
      return;
    }
    const accessToken = authState;

    const {
      payload: { id },
    } = jwtDecode(accessToken);

    const fetchUser = async () => {
      try {
        const res = await axios({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        dispatch(setUser(res.data));
      } catch (error) {
        console.error('not authorized', error);
      }
    };
    fetchUser();
  }, [authState]);

  const { auth } = state;
  return (
    <div className="App">
      {authState ? (
        <Layout auth={auth} onLoggedOut={handleLoggedOut} />
      ) : (
        <Login onLoggedIn={handleLoggedIn} />
      )}
    </div>
  );
}
