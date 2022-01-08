import AllUsers from './AllUsers';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="fixed w-screen h-screen">
      <Header />
      <div className="flex flex-row items-center justify-center h-screen">
        <Sidebar />
        <AllUsers />
      </div>
    </div>
  );
};

export default Layout;
