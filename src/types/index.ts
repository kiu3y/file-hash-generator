export type HashType = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512' | 'RIPEMD160';

export interface HashGeneratorProps {
  type: 'file' | 'text' | 'image' | 'video';
}

export interface VerifyHashProps {
  referenceHash: string;
  selectedHash: HashType;
}

export interface Command {
  command: string;
  output: string;
  isError?: boolean;
}

export interface UploadedFile {
  file: File;
  hash?: string;
  hashType?: HashType;
}