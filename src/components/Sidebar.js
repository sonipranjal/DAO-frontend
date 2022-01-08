import React from 'react';

const sideBarNavigation = [
  {
    navigationName: 'Home',
    link: '/',
  },
  {
    navigationName: 'Members directory',
    link: '/',
  },
  {
    navigationName: 'Projects and ideas',
    link: '/',
  },
  {
    navigationName: 'Events',
    link: '/',
  },
  {
    navigationName: 'Agents',
    link: '/',
  },
  {
    navigationName: 'Resources',
    link: '/',
  },
  {
    navigationName: 'Settings',
    link: '/',
  },
  {
    navigationName: 'Subscription',
    link: '/',
  },
];

const Sidebar = () => {
  return (
    <div className="hidden h-screen my-4 ml-4 shadow-lg lg:block w-80">
      <div className="h-full bg-white rounded-2xl ">
        <nav className="mt-20">
          <div>
            {sideBarNavigation.map((item, idx) => {
              return (
                <a
                  className="flex items-center justify-start w-full p-4 my-2 font-thin text-blue-500 uppercase transition-colors duration-200 border-r-4 border-blue-500 bg-gradient-to-r from-white to-blue-100 "
                  href="#"
                  key={idx}
                >
                  <span className="mx-4 text-lg font-medium">
                    {item.navigationName}
                  </span>
                </a>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
