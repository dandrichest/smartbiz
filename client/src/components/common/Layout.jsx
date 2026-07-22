import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAppContext } from '../../context/AppContext';
import '../../styles/Layout.css';

const Layout = () => {
    const { sidebarOpen } = useAppContext();

    return (
        <div className="app-layout">
            <Sidebar />
            <div className={`main-wrapper ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <Header />
                <main className="main-content">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;