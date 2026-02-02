import { useState } from 'react'; // Importamos el hook para el estado
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  CreditCard,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import styles from './MainLayout.module.scss';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/asistencia', name: 'Asistencia', icon: <Clock size={20} /> },
    { path: '/nomina', name: 'Remuneraciones', icon: <CreditCard size={20} /> },
    {
      path: '/colaboradores',
      name: 'Colaboradores',
      icon: <Users size={20} />,
    },
    { path: '/documentos', name: 'Documentos', icon: <FileText size={20} /> },
  ];

  return (
    <div className={styles.container}>
      {/* Overlay para móviles */}
      {isMenuOpen && (
        <div
          className={styles.overlay}
          onClick={closeMenu}
        />
      )}

      <aside className={`${styles.sidebar} ${isMenuOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoText}>BRACO</span>
            <span className={styles.logoDot}>.</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={closeMenu}
          >
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu} // Cerramos el menú al navegar
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <button
              className={styles.menuBtn}
              onClick={toggleMenu}
            >
              <Menu size={24} />
            </button>
            <h2>
              {menuItems.find((i) => i.path === location.pathname)?.name ||
                'Sistema'}
            </h2>
          </div>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>JD</div>
          </div>
        </header>

        <section className={styles.pageContent}>
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default MainLayout;
