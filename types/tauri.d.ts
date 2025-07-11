// Tauri v2 API types
declare global {
  interface Window {
    __TAURI__?: {
      core: {
        invoke: (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;
      };
      fs: {
        readTextFile: (path: string) => Promise<string>;
        writeTextFile: (path: string, contents: string) => Promise<void>;
        exists: (path: string) => Promise<boolean>;
        metadata: (path: string) => Promise<{
          size: number;
          isDir: boolean;
          isFile: boolean;
          modified?: number;
          created?: number;
        }>;
      };
      path: {
        join: (...paths: string[]) => Promise<string>;
        dirname: (path: string) => Promise<string>;
        basename: (path: string) => Promise<string>;
      };
      dialog: {
        open: (options?: {
          multiple?: boolean;
          directory?: boolean;
          filters?: Array<{ name: string; extensions: string[] }>;
        }) => Promise<string | string[] | null>;
        save: (options?: {
          filters?: Array<{ name: string; extensions: string[] }>;
        }) => Promise<string | null>;
      };
    };
    
    // File System Access API types
    showSaveFilePicker?: (options?: {
      suggestedName?: string;
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<FileSystemFileHandle>;
    
    showOpenFilePicker?: (options?: {
      multiple?: boolean;
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<FileSystemFileHandle[]>;
  }
  
  interface FileSystemFileHandle {
    getFile(): Promise<File>;
    createWritable(): Promise<FileSystemWritableFileStream>;
  }
  
  interface FileSystemWritableFileStream extends WritableStream {
    write(data: string | BufferSource | Blob): Promise<void>;
    close(): Promise<void>;
  }
}

export {};
