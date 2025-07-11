/**
 * Tauri API Integration
 * 
 * This module provides a unified interface for accessing Tauri APIs
 * with fallbacks to web APIs when running in a browser environment.
 */

// Check if we're running in a Tauri environment
export const isTauri = (): boolean => {
  return typeof window !== 'undefined' && window.__TAURI__ !== undefined;
};

// Lazy-load Tauri APIs to avoid issues in web environments
const getTauriApis = async () => {
  if (isTauri()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      
      return {
        invoke,
        // Use custom commands since plugins may not be available
        fs: {
          readTextFile: async (path: string) => invoke('read_file_content', { path }),
          writeTextFile: async (path: string, contents: string) => invoke('write_file_content', { path, content: contents }),
        },
      };
    } catch (error) {
      console.error('Error loading Tauri APIs:', error);
    }
  }
  return null;
};

// File System APIs
export const fileSystem = {
  /**
   * Save content to a file
   * @param content Content to save
   * @param options File save options
   * @returns Promise resolving to the file path or null if canceled
   */
  saveFile: async (
    content: string, 
    options?: { 
      defaultPath?: string, 
      filters?: { name: string, extensions: string[] }[] 
    }
  ): Promise<string | null> => {
    if (isTauri()) {
      const apis = await getTauriApis();
      if (!apis) return null;
      
      try {
        // For now, use a simple approach - save to a default location
        // In a real implementation, you'd want to use a file dialog
        const defaultPath = options?.defaultPath || 'document.txt';
        await apis.fs.writeTextFile(defaultPath, content);
        return defaultPath;
      } catch (error) {
        console.error('Error saving file:', error);
      }
      
      return null;
    } else {
      // Web fallback using File System Access API if available
      if (window.showSaveFilePicker) {
        try {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: options?.defaultPath?.split('/').pop() || 'document.txt',
            types: options?.filters?.map(filter => ({
              description: filter.name,
              accept: { 'text/plain': filter.extensions.map(ext => `.${ext}`) }
            })) || [
              {
                description: 'Text Documents',
                accept: { 'text/plain': ['.txt'] }
              }
            ]
          });
          
          const writable = await fileHandle.createWritable();
          await writable.write(content);
          await writable.close();
          
          return fileHandle.name;
        } catch (error) {
          // User cancelled or API not supported
          console.error('Error using web file save:', error);
          return null;
        }
      } else {
        // Fallback to download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = options?.defaultPath?.split('/').pop() || 'document.txt';
        a.click();
        URL.revokeObjectURL(url);
        return a.download;
      }
    }
  },
  
  /**
   * Open and read a file
   * @param options File open options
   * @returns Promise resolving to the file content or null if canceled
   */
  openFile: async (
    options?: { 
      filters?: { name: string, extensions: string[] }[] 
    }
  ): Promise<{ path: string, content: string } | null> => {
    if (isTauri()) {
      const apis = await getTauriApis();
      if (!apis) return null;
      
      try {
        // For now, try to read a default file
        // In a real implementation, you'd want to use a file dialog
        const defaultPath = 'document.txt';
        const content = await apis.fs.readTextFile(defaultPath) as string;
        return { path: defaultPath, content };
      } catch (error) {
        console.error('Error opening file:', error);
      }
      
      return null;
    } else {
      // Web fallback using File System Access API if available
      if (window.showOpenFilePicker) {
        try {
          const [fileHandle] = await window.showOpenFilePicker({
            multiple: false,
            types: options?.filters?.map(filter => ({
              description: filter.name,
              accept: { 'text/plain': filter.extensions.map(ext => `.${ext}`) }
            })) || [
              {
                description: 'Text Documents',
                accept: { 'text/plain': ['.txt'] }
              }
            ]
          });
          
          const file = await fileHandle.getFile();
          const content = await file.text();
          
          return { path: file.name, content };
        } catch (error) {
          // User cancelled or API not supported
          console.error('Error using web file open:', error);
          return null;
        }
      } else {
        // Fallback to input element
        return new Promise((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = options?.filters?.flatMap(filter => 
            filter.extensions.map(ext => `.${ext}`)
          ).join(',') || '.txt';
          
          input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
              const content = await file.text();
              resolve({ path: file.name, content });
            } else {
              resolve(null);
            }
          };
          
          input.click();
        });
      }
    }
  }
};

// Clipboard APIs
export const clipboard = {
  /**
   * Write text to clipboard
   * @param text Text to copy
   * @returns Promise resolving when complete
   */
  writeText: async (text: string): Promise<void> => {
    if (isTauri()) {
      // Fallback to web clipboard for now
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  },
  
  /**
   * Read text from clipboard
   * @returns Promise resolving to clipboard text
   */
  readText: async (): Promise<string> => {
    if (isTauri()) {
      // Fallback to web clipboard for now
      if (navigator.clipboard) {
        try {
          return await navigator.clipboard.readText();
        } catch (error) {
          console.error('Error reading from clipboard:', error);
          return '';
        }
      }
      return '';
    } else {
      try {
        return await navigator.clipboard.readText();
      } catch (error) {
        console.error('Error reading from clipboard:', error);
        return '';
      }
    }
  }
};

// Shell/External APIs
export const shell = {
  /**
   * Open a URL in the default browser
   * @param url URL to open
   * @returns Promise resolving when complete
   */
  openExternal: async (url: string): Promise<void> => {
    if (isTauri()) {
      // Fallback to window.open for now
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
};
