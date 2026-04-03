import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { IdeasPage } from './pages/IdeasPage';
import { IdeaPostPage } from './pages/IdeaPostPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/ideas/:issueNumber" element={<IdeaPostPage />} />
        <Route path="/ideas" element={<IdeasPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
