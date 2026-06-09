import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FileText, Image, Video, File, Shield, Hash, Terminal } from 'lucide-react';
import HashGenerator from './components/HashGenerator';
import VerifyHash from './components/VerifyHash';
import InteractiveTerminal from './components/InteractiveTerminal.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-center">
              <Hash className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">Generador de Hash</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              to="/texto"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <FileText className="w-8 h-8 text-blue-600 mb-3" />
              <h2 className="text-xl font-semibold mb-2">Generar Hash de Texto</h2>
              <p className="text-gray-600">Crear hash desde texto</p>
            </Link>

            <Link
              to="/archivo"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <File className="w-8 h-8 text-green-600 mb-3" />
              <h2 className="text-xl font-semibold mb-2">Generar Hash de Archivo</h2>
              <p className="text-gray-600">Crear hash desde cualquier archivo</p>
            </Link>

            <Link
              to="/imagen"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Image className="w-8 h-8 text-purple-600 mb-3" />
              <h2 className="text-xl font-semibold mb-2">Generar Hash de Imagen</h2>
              <p className="text-gray-600">Crear hash desde imágenes</p>
            </Link>

            <Link
              to="/video"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Video className="w-8 h-8 text-red-600 mb-3" />
              <h2 className="text-xl font-semibold mb-2">Generar Hash de Video</h2>
              <p className="text-gray-600">Crear hash desde videos</p>
            </Link>

            <Link
              to="/verificar"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Shield className="w-8 h-8 text-yellow-600 mb-3" />
              <h2 className="text-xl font-semibold mb-2">Verificar Hash</h2>
              <p className="text-gray-600">Verificar integridad de archivos</p>
            </Link>

            <Link
              to="/terminal"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Terminal className="w-8 h-8 text-gray-600 mb-3" />
              <h2 className="text-xl font-semibold mb-2">Terminal Interactiva</h2>
              <p className="text-gray-600">Usar comandos para generar y verificar hashes</p>
            </Link>
          </div>

          <div className="flex justify-center">
            <Routes>
              <Route path="/texto" element={<HashGenerator type="text" />} />
              <Route path="/archivo" element={<HashGenerator type="file" />} />
              <Route path="/imagen" element={<HashGenerator type="image" />} />
              <Route path="/video" element={<HashGenerator type="video" />} />
              <Route path="/verificar" element={<VerifyHash />} />
              <Route path="/terminal" element={<InteractiveTerminal />} />
              <Route path="/" element={
                <div className="text-center text-gray-600">
                  <h2 className="text-2xl font-semibold mb-4">Bienvenido al Generador de Hash</h2>
                  <p>Selecciona una opción para comenzar</p>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;