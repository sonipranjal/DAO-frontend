import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Blockies from 'react-blockies';
import Link from 'next/link';
import { format } from 'date-fns';
import PopOverMenu from './PopOverMenu';

const AllUsers = () => {
  const authToken = useSelector((state) => state.authState.value);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    const fetchAllUsers = async () => {
      const res = await axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/all`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setAllUsers(res.data);
      setLoading(false);
    };
    fetchAllUsers();
  }, [authToken]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSortByName = () => {
    const usersCopy = [...allUsers];
    usersCopy.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    setAllUsers(usersCopy);
  };

  const handleSortByDate = () => {
    const usersCopy = [...allUsers];
    usersCopy.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setAllUsers(usersCopy);
  };

  return (
    <div className="w-full h-screen px-4 mx-auto sm:px-8">
      <div className="py-8">
        <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
          <h2 className="text-2xl leading-tight">Members Directory</h2>
          <div className="text-end">
            <form
              className="flex flex-col justify-center max-w-sm space-y-3 md:flex-row md:w-full md:space-x-3 md:space-y-0"
              onSubmit={handleSubmit}
            >
              <div className="">
                <input
                  type="text"
                  id="filterName"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Search users by name"
                />
              </div>
              <PopOverMenu
                isFilterMenu={true}
                sortByName={handleSortByName}
                sortByDate={handleSortByDate}
              />
            </form>
          </div>
        </div>
        <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
          <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    Discord Username
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    about
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  allUsers
                    .filter((user) => {
                      return user.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());
                    })
                    .map(
                      (
                        {
                          publicAddress,
                          _id,
                          name,
                          createdAt,
                          role,
                          discord_username,
                          about,
                        },
                        idx
                      ) => (
                        <tr key={_id}>
                          <td className="flex flex-row items-center justify-center px-5 py-10 text-sm bg-white border-b border-gray-200">
                            <Blockies seed={publicAddress} />
                            <span className="ml-2 font-medium text-gray-900 uppercase whitespace-no-wrap">
                              {name}
                            </span>
                          </td>
                          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <span className="text-gray-900 whitespace-no-wrap">
                              {discord_username}
                            </span>
                          </td>
                          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <span className="text-gray-900 whitespace-no-wrap">
                              {format(new Date(createdAt), 'PP')}
                            </span>
                          </td>
                          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <span className="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900">
                              <span
                                aria-hidden="true"
                                className="absolute inset-0 bg-green-200 rounded-full opacity-50"
                              ></span>
                              <span className="relative">{role}</span>
                            </span>
                          </td>
                          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <span className="text-gray-900 whitespace-no-wrap">
                              {about}
                            </span>
                          </td>

                          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <Link href={`/users/${_id}`}>
                              <a className="text-indigo-600 hover:text-indigo-900">
                                Edit
                              </a>
                            </Link>
                          </td>
                        </tr>
                      )
                    )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
