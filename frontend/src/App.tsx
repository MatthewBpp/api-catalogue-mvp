import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ApiListPage from './pages/ApiListPage'
import ApiFormPage from './pages/ApiFormPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/apis" element={<ApiListPage />} />
      <Route path="/apis/new" element={<ApiFormPage mode="create" />} />
      <Route path="/apis/:id/edit" element={<ApiFormPage mode="edit" />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
