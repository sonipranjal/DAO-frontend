import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { BiLogOut } from 'react-icons/bi';
import { FaUserEdit } from 'react-icons/fa';
import { setUser } from '../user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from 'src/auth/authSlice';
import PropTypes from 'prop-types';
import { BsFilter } from 'react-icons/bs';
import { useRouter } from 'next/router';

const PopOverMenu = ({ isFilterMenu, sortByName, sortByDate }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('login-with-metamask:auth');
    dispatch(setUser(null));
    dispatch(setAuth(null));
  };

  return (
    <div className="text-right ">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-md bg-violet-600 hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            {isFilterMenu ? 'Sort by' : 'Options'}
            {isFilterMenu ? (
              <BsFilter className="w-5 h-5 ml-2" />
            ) : (
              <HiChevronDown
                className="w-5 h-5 ml-2 -mr-1 text-blue-200 hover:text-blue-100"
                aria-hidden="true"
              />
            )}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {isFilterMenu ? (
              <div>
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={sortByName}
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        Name
                      </button>
                    )}
                  </Menu.Item>
                </div>

                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={sortByDate}
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        Date
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </div>
            ) : (
              <div>
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => router.push(`/users/${user?._id}`)}
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <FaUserEdit className="w-5 h-5 mr-2 " />
                        Edit Profile
                      </button>
                    )}
                  </Menu.Item>
                </div>

                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <BiLogOut className="w-5 h-5 mr-2 " />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </div>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default PopOverMenu;

PopOverMenu.propsTypes = {
  isFilterMenu: PropTypes.bool,
  sortByDate: PropTypes.func,
  sortByName: PropTypes.func,
};
