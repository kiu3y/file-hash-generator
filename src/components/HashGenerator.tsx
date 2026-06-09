import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { HashType, HashGeneratorProps } from '../types';

const HashGenerator: React.FC<HashGeneratorProps> = ({ type }) => {
  const [selectedHash, setSelectedHash] = useState<HashType>('SHA256');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [generatedHash, setGeneratedHash] = useState('');
  const [error, setError] = useState<string>('');

  const hashTypes: HashType[] = ['MD5', 'SHA1', 'SHA256', 'SHA512', 'RIPEMD160'];

  const getAcceptedFileTypes = () => {
    switch (type) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'file':
        return '*';
      default:
        return undefined;
    }
  };

  const generateHash = async () => {
    try {
      setError('');
      if (type === 'text') {
        if (!text.trim()) {
          setError('Please enter some text');
          return;
        }
        const hash = CryptoJS[selectedHash](text).toString();
        setGeneratedHash(hash);
      } else {
        if (!file) {
          setError('Please select a file');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as ArrayBuffer;
            const wordArray = CryptoJS.lib.WordArray.create(content);
            const hash = CryptoJS[selectedHash](wordArray).toString();
            setGeneratedHash(hash);
          } catch (err) {
            setError('Error processing file');
          }
        };
        reader.onerror = () => setError('Error reading file');
        reader.readAsArrayBuffer(file);
      }
    } catch (err) {
      setError('An error occurred while generating the hash');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (type === 'image' && !selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (type === 'video' && !selectedFile.type.startsWith('video/')) {
        setError('Please select a video file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {type === 'text' ? 'Text' : type.charAt(0).toUpperCase() + type.slice(1)} Hash Generator
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Hash Algorithm
          </label>
          <select
            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedHash}
            onChange={(e) => setSelectedHash(e.target.value as HashType)}
          >
            {hashTypes.map((hash) => (
              <option key={hash} value={hash}>
                {hash}
              </option>
            ))}
          </select>
        </div>

        {type === 'text' ? (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Enter Text
            </label>
            <textarea
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Type or paste your text here..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept={getAcceptedFileTypes()}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-blue-500 mb-3" />
                <span className="text-gray-600 mb-2">Click to upload or drag and drop</span>
                <span className="text-sm text-gray-500">
                  {type === 'image' ? 'PNG, JPG, GIF up to 10MB' :
                   type === 'video' ? 'MP4, WebM, MOV up to 100MB' :
                   'Any file type up to 100MB'}
                </span>
              </label>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={generateHash}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generate Hash
        </button>

        {generatedHash && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Generated Hash ({selectedHash})
            </label>
            <div className="bg-gray-50 p-4 rounded-lg break-all font-mono text-sm">
              {generatedHash}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HashGenerator;