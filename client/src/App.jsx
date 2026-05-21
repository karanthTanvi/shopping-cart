import { Routes, Route } from 'react-router-dom';
import Shop from './pages/Shop';

// the app's routes — Login, Register and Admin are added in later chunks
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Shop />} />
    </Routes>
  );
}