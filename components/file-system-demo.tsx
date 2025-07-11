'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { fileSystem, isTauri } from '@/lib/tauri-api';
import { Badge } from './ui/badge';

export function FileSystemDemo() {
  const [content, setContent] = useState<string>('');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleSaveFile = async () => {
    try {
      setStatus('Saving file...');
      const path = await fileSystem.saveFile(content, {
        filters: [
          { name: 'Text Files', extensions: ['txt'] },
          { name: 'Markdown Files', extensions: ['md'] },
        ],
      });
      
      if (path) {
        setFilePath(path);
        setStatus(`File saved to: ${path}`);
      } else {
        setStatus('Save operation cancelled');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      setStatus(`Error saving file: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleOpenFile = async () => {
    try {
      setStatus('Opening file...');
      const result = await fileSystem.openFile({
        filters: [
          { name: 'Text Files', extensions: ['txt'] },
          { name: 'Markdown Files', extensions: ['md'] },
        ],
      });
      
      if (result) {
        setContent(result.content);
        setFilePath(result.path);
        setStatus(`File opened from: ${result.path}`);
      } else {
        setStatus('Open operation cancelled');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      setStatus(`Error opening file: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          File System Operations
          <Badge variant={isTauri() ? "default" : "outline"}>
            {isTauri() ? "Tauri Native" : "Web Browser"}
          </Badge>
        </CardTitle>
        <CardDescription>
          {isTauri() 
            ? "Using native file system capabilities through Tauri" 
            : "Using web file system APIs with fallbacks"}
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleOpenFile}>
          Open File
        </Button>
        <Button onClick={handleSaveFile} disabled={!content}>
          Save File
        </Button>
      </CardFooter>
    </Card>
  );
}