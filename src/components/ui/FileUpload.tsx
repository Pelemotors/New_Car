import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video, File } from 'lucide-react';
import { Button } from './Button';
import { uploadFile, getPublicUrl, deleteFile } from '../../utils/supabase';

interface FileUploadProps {
  onFilesChange: (files: string[]) => void;
  existingFiles?: string[];
  maxFiles?: number;
  acceptedTypes?: string[];
  bucket?: string;
  folder?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  existingFiles = [],
  maxFiles = 5,
  acceptedTypes = ['image/*', 'video/*'],
  bucket = 'car-images',
  folder = 'uploads'
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    if (files.length + existingFiles.length > maxFiles) {
      setError(`ניתן להעלות עד ${maxFiles} קבצים`);
      return;
    }

    setUploading(true);
    setError(null);
    const newFileUrls: string[] = [];

    try {
      for (const file of files) {
        // בדיקת סוג קובץ
        if (!acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.slice(0, -1));
          }
          return file.type === type;
        })) {
          setError(`סוג קובץ לא נתמך: ${file.type}`);
          continue;
        }

        // בדיקת גודל קובץ (10MB לתמונות, 100MB לסרטונים)
        const maxSize = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
          setError(`קובץ גדול מדי: ${file.name}`);
          continue;
        }

        // יצירת שם קובץ ייחודי
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.name.split('.').pop();
        const fileName = `${timestamp}-${randomId}.${fileExtension}`;
        const filePath = `${folder}/${fileName}`;

        setUploadProgress(prev => ({ ...prev, [fileName]: 0 }));

        // העלאת קובץ
        const { data, error: uploadError } = await uploadFile(bucket, filePath, file);
        
        if (uploadError) {
          console.error('Upload error:', uploadError);
          setError(`שגיאה בהעלאת ${file.name}: ${uploadError.message}`);
          continue;
        }

        if (data) {
          const publicUrl = getPublicUrl(bucket, filePath);
          newFileUrls.push(publicUrl);
          setUploadProgress(prev => ({ ...prev, [fileName]: 100 }));
        }
      }

      // עדכון רשימת הקבצים
      onFilesChange([...existingFiles, ...newFileUrls]);
      
    } catch (err: any) {
      setError(`שגיאה כללית: ${err.message}`);
    } finally {
      setUploading(false);
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = async (fileUrl: string, index: number) => {
    try {
      // חילוץ נתיב הקובץ מה-URL
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${folder}/${fileName}`;

      // מחיקת קובץ מ-Supabase
      await deleteFile(bucket, filePath);

      // עדכון רשימת הקבצים
      const updatedFiles = existingFiles.filter((_, i) => i !== index);
      onFilesChange(updatedFiles);
    } catch (err) {
      console.error('Error removing file:', err);
      setError('שגיאה במחיקת קובץ');
    }
  };

  const getFileIcon = (fileUrl: string) => {
    if (fileUrl.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl)) {
      return <ImageIcon className="w-4 h-4" />;
    } else if (fileUrl.includes('video') || /\.(mp4|avi|mov|wmv|flv)$/i.test(fileUrl)) {
      return <Video className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const isImage = (fileUrl: string) => {
    return fileUrl.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
  };

  return (
    <div className="space-y-4">
      {/* אזור העלאה */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="space-y-2">
          <Upload className="w-12 h-12 mx-auto text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-700">
              {uploading ? 'מעלה קבצים...' : 'העלה תמונות וסרטונים'}
            </p>
            <p className="text-sm text-gray-500">
              עד {maxFiles} קבצים • תמונות עד 10MB • סרטונים עד 100MB
            </p>
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || existingFiles.length >= maxFiles}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'מעלה...' : 'בחר קבצים'}
          </Button>
        </div>
      </div>

      {/* הודעות שגיאה */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* התקדמות העלאה */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{fileName}</span>
                <span className="text-gray-500">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* תצוגת קבצים קיימים */}
      {existingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">קבצים מועלים:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {existingFiles.map((fileUrl, index) => (
              <div key={index} className="relative group">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {isImage(fileUrl) ? (
                    <img
                      src={fileUrl}
                      alt={`תמונה ${index + 1}`}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/200x128/E53935/FFFFFF/png?text=Error';
                      }}
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  {/* כפתור מחיקה */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(fileUrl, index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  {/* אייקון סוג קובץ */}
                  <div className="absolute bottom-2 left-2 p-1 bg-black bg-opacity-50 text-white rounded">
                    {getFileIcon(fileUrl)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
