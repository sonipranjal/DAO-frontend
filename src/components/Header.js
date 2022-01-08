import React from 'react';
import PopOverMenu from './PopOverMenu';
import { FaUserAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Blockies from 'react-blockies';
import Link from 'next/link';

const Header = () => {
  const centralUser = useSelector((state) => state.user.value);

  return (
    <nav className="bg-white shadow ">
      <div className="px-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center ">
            <Link href="/">
              <a className="flex-shrink-0 text-xl font-bold">DAO Dashboard</a>
            </Link>
          </div>
          <div className="block">
            <div className="flex items-center ml-4 md:ml-6">
              <div className="mr-1 font-mono">{centralUser?.name}</div>
              <a
                href={`/users/${centralUser?._id}`}
                className="p-1 text-gray-400 rounded-full focus:outline-none hover:text-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">View profile</span>

                {centralUser && (
                  <Blockies
                    className="w-8 h-8 cursor-pointer"
                    seed={centralUser?.publicAddress}
                  />
                )}
              </a>
              <div className="ml-4">
                <PopOverMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
