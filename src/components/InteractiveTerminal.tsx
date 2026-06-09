import React, { useState, useRef, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { Command, HashType } from '../types';

const InteractiveTerminal: React.FC = () => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [os, setOS] = useState<'linux' | 'windows'>('linux');
  const [currentPath, setCurrentPath] = useState(os === 'linux' ? '~' : 'C:\\Users\\user');
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const helpText = `
Comandos disponibles:
  help                          Muestra esta ayuda
  clear                         Limpia la terminal
  ls                           Lista archivos subidos
  cd <dir>                     Cambia directorio
  pwd                          Muestra directorio actual
  os <linux|windows>           Cambia el sistema operativo
  upload                       Sube un archivo
  hash <tipo> <archivo|texto>  Genera hash (MD5, SHA1, SHA256, SHA512)
  verify <tipo> <archivo> <hash> Verifica un hash
  rm <archivo>                 Elimina un archivo subido
  cat <archivo>                Muestra el contenido de un archivo de texto
  
Ejemplos:
  hash md5 archivo.txt         Genera hash MD5 de un archivo
  hash sha256 "mi texto"       Genera hash SHA256 de un texto
  verify sha256 archivo.txt abc123...  Verifica hash de un archivo
  rm archivo.txt              Elimina archivo.txt
  cat archivo.txt             Muestra el contenido de archivo.txt
`;

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const getPrompt = () => {
    return os === 'linux' ? `user@localhost:${currentPath}$ ` : `${currentPath}> `;
  };

  const addCommand = (command: string, output: string, isError = false) => {
    setCommands(prev => [...prev, { command, output, isError }]);
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFiles(prev => ({ ...prev, [file.name]: file }));
    addCommand('upload', `Archivo subido: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
  };

  const generateHash = async (hashType: string, input: string, isFile = false) => {
    try {
      if (isFile) {
        const file = uploadedFiles[input];
        if (!file) {
          throw new Error(`Archivo no encontrado: ${input}`);
        }
        const buffer = await file.arrayBuffer();
        const wordArray = CryptoJS.lib.WordArray.create(buffer);
        return CryptoJS[hashType.toUpperCase()](wordArray).toString();
      } else {
        return CryptoJS[hashType.toUpperCase()](input).toString();
      }
    } catch (error) {
      throw new Error(`Error generando hash: ${error.message}`);
    }
  };

  const readFileContent = async (fileName: string): Promise<string> => {
    const file = uploadedFiles[fileName];
    if (!file) {
      throw new Error(`Archivo no encontrado: ${fileName}`);
    }
    
    if (!file.type.startsWith('text/')) {
      throw new Error('Solo se pueden mostrar archivos de texto');
    }

    return await file.text();
  };

  const handleCommand = async (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();

    try {
      switch (command) {
        case 'help':
          addCommand(cmd, helpText);
          break;

        case 'clear':
          setCommands([]);
          break;

        case 'ls':
          const files = Object.keys(uploadedFiles)
            .map(name => `${name} (${(uploadedFiles[name].size / 1024).toFixed(2)} KB)`)
            .join('\n');
          addCommand(cmd, files || 'No hay archivos subidos');
          break;

        case 'cd':
          const newPath = args[1] || '~';
          setCurrentPath(newPath);
          addCommand(cmd, '');
          break;

        case 'pwd':
          addCommand(cmd, currentPath);
          break;

        case 'os':
          if (args[1] === 'linux' || args[1] === 'windows') {
            setOS(args[1]);
            setCurrentPath(args[1] === 'linux' ? '~' : 'C:\\Users\\user');
            addCommand(cmd, `Cambiado a ${args[1]}`);
          } else {
            addCommand(cmd, 'Sistema operativo no válido. Use "linux" o "windows"', true);
          }
          break;

        case 'upload':
          fileInputRef.current?.click();
          break;

        case 'rm':
          if (!args[1]) {
            throw new Error('Uso: rm <archivo>');
          }
          if (uploadedFiles[args[1]]) {
            const { [args[1]]: removed, ...rest } = uploadedFiles;
            setUploadedFiles(rest);
            addCommand(cmd, `Archivo eliminado: ${args[1]}`);
          } else {
            throw new Error(`Archivo no encontrado: ${args[1]}`);
          }
          break;

        case 'cat':
          if (!args[1]) {
            throw new Error('Uso: cat <archivo>');
          }
          const content = await readFileContent(args[1]);
          addCommand(cmd, content);
          break;

        case 'hash':
          if (args.length < 3) {
            throw new Error('Uso: hash <tipo> <archivo|texto>');
          }
          const hashType = args[1].toUpperCase();
          const input = args.slice(2).join(' ');
          const isFile = Object.keys(uploadedFiles).includes(input);
          const hash = await generateHash(hashType, input, isFile);
          addCommand(cmd, `${hashType}: ${hash}`);
          break;

        case 'verify':
          if (args.length < 4) {
            throw new Error('Uso: verify <tipo> <archivo> <hash>');
          }
          const vHashType = args[1].toUpperCase();
          const vFileName = args[2];
          const vHash = args[3];
          const generatedHash = await generateHash(vHashType, vFileName, true);
          const matches = generatedHash.toLowerCase() === vHash.toLowerCase();
          addCommand(cmd, matches ? '✓ Hash verificado correctamente' : '✗ Hash no coincide');
          break;

        default:
          addCommand(cmd, `Comando no reconocido: ${command}`, true);
      }
    } catch (error) {
      addCommand(cmd, error.message, true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg w-full max-w-4xl font-mono">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setOS('linux')}
          className={`px-4 py-2 rounded ${os === 'linux' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Linux
        </button>
        <button
          onClick={() => setOS('windows')}
          className={`px-4 py-2 rounded ${os === 'windows' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Windows
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
        >
          Subir Archivo
        </button>
      </div>

      <div
        ref={terminalRef}
        className="bg-black p-4 rounded h-[500px] overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="mb-4 text-green-400">
          Terminal Interactiva - Escribe 'help' para ver los comandos disponibles
        </div>
        
        {commands.map((cmd, i) => (
          <div key={i} className="mb-2">
            <div className="text-blue-400">{getPrompt()}{cmd.command}</div>
            <pre className={`whitespace-pre-wrap ${cmd.isError ? 'text-red-400' : 'text-gray-300'}`}>
              {cmd.output}
            </pre>
          </div>
        ))}

        <div className="flex">
          <span className="text-blue-400">{getPrompt()}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none ml-2"
            autoFocus
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
      />

      <div className="mt-4 text-sm text-gray-400">
        <p>Comandos útiles:</p>
        <ul className="list-disc list-inside">
          <li>Usa 'upload' o el botón para subir archivos</li>
          <li>Usa 'ls' para ver los archivos subidos</li>
          <li>Usa 'hash' para generar hashes de archivos o texto</li>
          <li>Usa 'verify' para verificar hashes</li>
        </ul>
      </div>
    </div>
  );
};

export default InteractiveTerminal;