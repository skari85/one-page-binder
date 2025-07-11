'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { isTauri } from '@/lib/tauri-api';
import { HardDrive, AlertCircle } from 'lucide-react';

export function TauriNativeFS() {
  const [content, setContent] = useState<string>('');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  // Check if we're running in a Tauri environment
  const [isTauriEnv, setIsTauriEnv] = useState(false);

  useEffect(() => {
    setIsTauriEnv(isTauri());
  }, []);

  const handleSaveFile = async () => {
    if (!isTauriEnv) {
      setError('This feature requires the Tauri desktop app');
      return;
    }

    try {
      setStatus('Selecting save location...');
      setError(null);

      // Use Tauri's dialog API to get a save path
      // @ts-ignore - Tauri types may not be available
      const savePath = await window.__TAURI__.dialog.save({
        filters: [
          { name: 'Text Files', extensions: ['txt'] },
          { name: 'Markdown Files', extensions: ['md'] }
        ]
      });

      if (!savePath) {
        setStatus('Save operation cancelled');
        return;
      }

      setStatus(`Saving to ${savePath}...`);
      
      // Use our custom Rust command to write the file
      // @ts-ignore - Tauri types may not be available
      await window.__TAURI__.invoke('write_file_content', { 
        path: savePath, 
        content 
      });
      
      setFilePath(savePath);
      setStatus(`File saved to: ${savePath}`);
      
      // Get file metadata
      await fetchMetadata(savePath);
    } catch (err) {
      console.error('Error saving file:', err);
      setError(`Error saving file: ${err instanceof Error ? err.message : String(err)}`);
      setStatus('Failed to save file');
    }
  };

  const handleOpenFile = async () => {
    if (!isTauriEnv) {
      setError('This feature requires the Tauri desktop app');
      return;
    }

    try {
      setStatus('Selecting file to open...');
      setError(null);

      // Use Tauri's dialog API to get a file path
      // @ts-ignore - Tauri types may not be available
      const selected = await window.__TAURI__.dialog.open({
        multiple: false,
        filters: [
          { name: 'Text Files', extensions: ['txt'] },
          { name: 'Markdown Files', extensions: ['md'] }
        ]
      });

      if (!selected) {
        setStatus('Open operation cancelled');
        return;
      }

      const openPath = selected as string;
      setStatus(`Opening ${openPath}...`);
      
      // Use our custom Rust command to read the file
      // @ts-ignore - Tauri types may not be available
      const fileContent = await window.__TAURI__.invoke('read_file_content', { 
        path: openPath 
      });
      
      setContent(fileContent as string);
      setFilePath(openPath);
      setStatus(`File opened from: ${openPath}`);
      
      // Get file metadata
      await fetchMetadata(openPath);
    } catch (err) {
      console.error('Error opening file:', err);
      setError(`Error opening file: ${err instanceof Error ? err.message : String(err)}`);
      setStatus('Failed to open file');
    }
  };

  const fetchMetadata = async (path: string) => {
    if (!isTauriEnv) return;
    
    try {
      // @ts-ignore - Tauri types may not be available
      const meta = await window.__TAURI__.invoke('get_file_metadata', { path });
      setMetadata(meta);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (!isTauriEnv) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive className="w-5 h-5 mr-2" />
            Tauri Native File System
          </CardTitle>
          <CardDescription>
            This feature is only available in the Tauri desktop application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 rounded-md">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p>Please run the Tauri desktop application to use native file system features.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <HardDrive className="w-5 h-5 mr-2" />
            Tauri Native File System
          </div>
          <Badge variant="default">Native API</Badge>
        </CardTitle>
        <CardDescription>
          Using direct Tauri commands for file operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter text to save to a file..."
            className="min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          {filePath && (
            <div className="text-sm text-muted-foreground">
              Current file: <span className="font-mono">{filePath}</span>
            </div>
          )}
          
          {status && (
            <div className="text-sm font-medium">
              Status: {status}
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {metadata && (
            <div className="p-3 bg-muted/50 rounded-md text-sm space-y-1">
              <div className="font-medium">File Metadata:</div>
              <div>Size: {formatSize(metadata.size)}</div>
              {metadata.modified && <div>Modified: {formatDate(metadata.modified)}</div>}
              {metadata.created && <div>Created: {formatDate(metadata.created)}</div>}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleOpenFile}>
          Open File (Native)
        </Button>
        <Button onClick={handleSaveFile} disabled={!content}>
          Save File (Native)
        </Button>
      </CardFooter>
    </Card>
  );
}