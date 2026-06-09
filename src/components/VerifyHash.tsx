import React, { useState } from 'react';
import { Upload, Check, X, AlertCircle } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { HashType } from '../types';

const VerifyHash: React.FC = () => {
  const [selectedHash, setSelectedHash] = useState<HashType>('SHA256');
  const [referenceHash, setReferenceHash] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'any' | 'image' | 'video'>('any');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');

  const hashTypes: HashType[] = ['MD5', 'SHA1', 'SHA256', 'SHA512', 'RIPEMD160'];
  const fileTypes = [
    { value: 'any', label: 'Any File' },
    { value: 'image', label: 'Image File' },
    { value: 'video', label: 'Video File' }
  ];

  const getAcceptedFileTypes = () => {
    switch (fileType) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      default:
        return '*';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (fileType === 'image' && !selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (fileType === 'video' && !selectedFile.type.startsWith('video/')) {
        setError('Please select a video file');
        return;
      }
      setFile(selectedFile);
      setError('');
      setVerificationResult(null);
    }
  };

  const verifyHash = async () => {
    try {
      setError('');
      if (!file) {
        setError('Please select a file');
        return;
      }
      if (!referenceHash.trim()) {
        setError('Please enter a reference hash');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as ArrayBuffer;
          const wordArray = CryptoJS.lib.WordArray.create(content);
          const generatedHash = CryptoJS[selectedHash](wordArray).toString();
          setVerificationResult(generatedHash.toLowerCase() === referenceHash.toLowerCase());
        } catch (err) {
          setError('Error processing file');
        }
      };
      reader.onerror = () => setError('Error reading file');
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('An error occurred during verification');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Verify File Hash</h2>

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

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select File Type
          </label>
          <select
            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fileType}
            onChange={(e) => setFileType(e.target.value as 'any' | 'image' | 'video')}
          >
            {fileTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Reference Hash
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={referenceHash}
            onChange={(e) => setReferenceHash(e.target.value)}
            placeholder="Enter the hash to verify against"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Upload File to Verify
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept={getAcceptedFileTypes()}
              onChange={handleFileChange}
              className="hidden"
              id="verify-file-upload"
            />
            <label
              htmlFor="verify-file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-blue-500 mb-3" />
              <span className="text-gray-600 mb-2">Click to upload or drag and drop</span>
              <span className="text-sm text-gray-500">
                {fileType === 'image' ? 'PNG, JPG, GIF up to 10MB' :
                 fileType === 'video' ? 'MP4, WebM, MOV up to 100MB' :
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

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={verifyHash}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Verify Hash
        </button>

        {verificationResult !== null && !error && (
          <div className={`p-4 rounded-lg ${verificationResult ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center gap-3">
              {verificationResult ? (
                <>
                  <Check className="w-6 h-6 text-green-600" />
                  <span className="text-green-700 font-medium">Hash verification successful! The file matches the reference hash.</span>
                </>
              ) : (
                <>
                  <X className="w-6 h-6 text-red-600" />
                  <span className="text-red-700 font-medium">Hash verification failed! The file does not match the reference hash.</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyHash;