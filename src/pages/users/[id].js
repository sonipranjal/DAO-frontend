import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from 'src/user/userSlice';
import Blockies from 'react-blockies';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useState } from 'react';
import Header from '@/components/Header';

const UserPage = ({ id }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const centralUser = useSelector((state) => state.user.value);
  const router = useRouter();

  useEffect(() => {
    const ls = localStorage.getItem('login-with-metamask:auth');
    const localAuthObj = ls && JSON.parse(ls);
    const accessToken = localAuthObj?.accessToken;

    if (!accessToken) {
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((user) => dispatch(setUser(user)))
      .catch((err) => {
        window.alert(err);
      });
  }, []);

  const [localuser, setLocalUser] = useState({
    username: '',
    name: '',
    discord_username: '',
    about: '',
    role: '',
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setLocalUser((preValues) => ({
      ...preValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(localuser).some((val) => val === '')) {
      return toast.error('Please fill all the fields!');
    }

    const ls = localStorage.getItem('login-with-metamask:auth');
    const localAuthObj = ls && JSON.parse(ls);
    const accessToken = localAuthObj?.accessToken;

    if (!accessToken) {
      toast.error('You are not authorized');
      router.push('/');
      return;
    }

    if (!centralUser) {
      toast.error(
        'The user id has not been fetched yet. Please try again in 5 seconds.'
      );
      return;
    }

    setLoading(true);

    try {
      const res = await axios({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${centralUser._id}`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: localuser,
      });
      dispatch(setUser(res.data));
      setLoading(false);
      setLocalUser({
        username: '',
        name: '',
        discord_username: '',
        about: '',
        role: '',
      });
      toast.success('Details saved successfully!');
      router.push('/');
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  };

  return (
    <div>
      <Header />
      <section className="h-full mt-10 bg-gray-100 bg-opacity-50">
        <form
          onSubmit={handleSubmit}
          className="container max-w-2xl mx-auto shadow-md md:w-3/4"
        >
          <div className="p-4 bg-gray-100 border-t-2 border-indigo-400 rounded-lg bg-opacity-5">
            <div className="max-w-sm mx-auto md:w-full md:mx-0">
              <div className="inline-flex items-center space-x-4">
                <a href="#" className="relative block">
                  {centralUser && (
                    <Blockies seed={centralUser?.publicAddress} />
                  )}
                </a>
                <h1 className="font-medium text-gray-600 uppercase">
                  {centralUser?.name}
                </h1>
              </div>
            </div>
          </div>
          <div className="space-y-6 bg-white">
            <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
              <h2 className="max-w-sm mx-auto md:w-1/3">username</h2>
              <div className="max-w-sm mx-auto md:w-2/3">
                <div className="relative ">
                  <input
                    type="text"
                    name="username"
                    id="user-info-username"
                    className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Steve123"
                    onChange={handleOnChange}
                    value={localuser.username}
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
              <h2 className="max-w-sm mx-auto md:w-1/3">Personal info</h2>
              <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                <div>
                  <div className="relative ">
                    <input
                      type="text"
                      id="user-info-name"
                      className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Your Name"
                      name="name"
                      onChange={handleOnChange}
                      value={localuser.name}
                    />
                  </div>
                </div>
                <div>
                  <div className="relative ">
                    <input
                      type="text"
                      name="discord_username"
                      id="user-info-username-discord"
                      className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Your Discord Username"
                      value={localuser.discord_username}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
                <div>
                  <div className="relative ">
                    <input
                      type="text"
                      name="about"
                      id="user-info-about"
                      className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Tell us about you in short"
                      value={localuser.about}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
                <div>
                  <div className="relative ">
                    <input
                      type="text"
                      name="role"
                      id="user-info-role"
                      className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Your role"
                      value={localuser.role}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr />

            <div className="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
              <button
                type="submit"
                disabled={loading}
                className="z-10 flex items-center justify-center w-full px-5 py-3 mt-5 text-base font-medium leading-6 transition duration-150 ease-in-out bg-white border-2 border-transparent rounded-md border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white focus:outline-none disabled:bg-violet-900 disabled:text-violet-50 active:scale-95"
              >
                {loading ? 'Loading ...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
        <Toaster />
      </section>
    </div>
  );
};

export default UserPage;

export async function getServerSideProps(context) {
  const { id } = context.query;

  return {
    props: { id },
  };
}
