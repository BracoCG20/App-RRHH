import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './modules/dashboard/pages/Dashboard';

// IMPORTS CRÍTICOS (Asegúrate de que las rutas sean correctas)
import Login from './modules/auth/pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Asistencia from './modules/asistencia/pages/Asistencia';
import Colaboradores from './modules/colaboradores/pages/Colaboradores';
import Remuneraciones from './modules/remuneraciones/pages/Remuneraciones';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login'
          element={<Login />}
        />

        <Route
          path='/'
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Dashboard />}
          />
          <Route
            path='asistencia'
            element={<Asistencia />}
          />
          <Route
            path='colaboradores'
            element={<Colaboradores />}
          />
          <Route
            path='remuneraciones'
            element={<Remuneraciones />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
