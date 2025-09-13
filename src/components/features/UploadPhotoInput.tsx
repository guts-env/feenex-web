import { useState } from 'react';
import { UploadIcon, EyeIcon, TrashIcon } from 'lucide-react';
import { ErrorCode } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/dropzone';
import { useGeneratePresigned, useUploadFile } from '@/api/services/UploadService/mutation';
import { ALLOWED_IMAGE_TYPES } from '@/constants/upload';
import { UploadStatusEnum, UploadTypeEnum } from '@/constants/enums';

export type UploadedFile = File & {
  key?: string;
  uploadedAt?: Date;
  status?: UploadStatusEnum;
};

interface UploadPhotoInputProps {
  type: UploadTypeEnum;
  value: UploadedFile[] | string[];
  onChange: (files: UploadedFile[]) => void;
  onUploadError: (error: string) => void;
  onFileNamesChange?: (names: string[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  className?: string;
  disabled?: boolean;
}

enum CustomErrorCode {
  FileAlreadyExists = 'file-already-exists',
}

function UploadPhotoInput({
  type,
  value = [],
  onChange,
  onUploadError,
  onFileNamesChange,
  maxFiles = 5,
  maxSizeInMB = 5,
  className,
  disabled = false,
}: UploadPhotoInputProps) {
  const { mutate: generatePresigned } = useGeneratePresigned();
  const { mutate: uploadFile } = useUploadFile();

  const [previewImage, setPreviewImage] = useState<File | string | null>(null);

  const files = value.filter((item): item is UploadedFile => item instanceof File);
  const urls = value.filter((item): item is string => typeof item === 'string');

  const isDuplicateFile = (newFile: File): boolean => {
    return files.some(
      (existingFile) => existingFile.name === newFile.name && existingFile.size === newFile.size,
    );
  };

  const handleUploadFile = (url: string, key: string, file: File) => {
    const uploadingFile: UploadedFile = Object.assign(file, {
      key,
      status: UploadStatusEnum.UPLOADING,
    });

    const updatedFiles = [...files, uploadingFile].slice(0, maxFiles);
    onChange?.(updatedFiles);
    onFileNamesChange?.(updatedFiles.map((file) => file.name));

    uploadFile(
      { url, file },
      {
        onSuccess: () => {
          const uploadedFile: UploadedFile = Object.assign(file, {
            key,
            status: UploadStatusEnum.UPLOADED,
          });

          const currentFiles = [...files, uploadingFile].slice(0, maxFiles);
          const updatedFiles = currentFiles.map((f) => (f.key === key ? uploadedFile : f));

          onChange?.(updatedFiles);
          onFileNamesChange?.(updatedFiles.map((file) => file.name));
        },
        onError: (error) => {
          const errorMessage = `Failed to upload ${file.name}: ${error.message}`;
          onUploadError(errorMessage);

          const currentFiles = [...files, uploadingFile].slice(0, maxFiles);
          const updatedFiles = currentFiles.filter((f) => !(f.key === key));
          onChange?.(updatedFiles);
          onFileNamesChange?.(updatedFiles.map((file) => file.name));
        },
      },
    );
  };

  const handleGeneratePresigned = (file: File) => {
    generatePresigned(
      {
        key: type,
        filename: file.name,
        contentType: file.type,
        filesize: file.size,
      },
      {
        onSuccess: (data) => {
          const { url, key } = data;
          handleUploadFile(url, key, file);
        },
        onError: (error) => {
          const errorMessage = `Failed to prepare ${file.name} for upload: ${error.message}`;
          onUploadError(errorMessage);
        },
      },
    );
  };

  const handleDrop = (newFiles: File[], index?: number) => {
    if (disabled) return;

    const duplicateFiles = newFiles.filter(isDuplicateFile);
    if (duplicateFiles.length > 0) {
      const errorMessage = `Duplicate file detected: ${duplicateFiles[0].name}`;
      onUploadError(errorMessage);

      throw new Error(errorMessage, {
        cause: CustomErrorCode.FileAlreadyExists,
      });
    }

    if (index == null) {
      const file = newFiles[0];
      handleGeneratePresigned(file);
    }
  };

  const handleError = (error: Error) => {
    let errorMessage = '';

    if (error.cause === ErrorCode.FileTooLarge) {
      errorMessage = `File size exceeds ${maxSizeInMB}MB limit`;
    } else if (error.cause === ErrorCode.TooManyFiles) {
      errorMessage = `Maximum ${maxFiles} files allowed`;
    } else if (error.cause === ErrorCode.FileInvalidType) {
      errorMessage = 'Invalid file type. Only images or PDFs are allowed';
    } else if (error.cause === CustomErrorCode.FileAlreadyExists) {
      errorMessage = 'File already exists';
    } else {
      errorMessage = error.message || 'An unknown error occurred';
    }

    onUploadError(errorMessage);
  };

  const removeFile = (index: number) => {
    if (disabled) return;
    const updatedFiles = files.filter((_, i) => i !== index);
    onChange?.(updatedFiles);
    onFileNamesChange?.(updatedFiles.map((file) => file.name));
  };

  const removeUrl = (index: number) => {
    if (disabled) return;
    const updatedUrls = urls.filter((_, i) => i !== index);
    const updatedValue = [...updatedUrls, ...files];
    onChange?.(files);
    onFileNamesChange?.(updatedValue.map((item) => (typeof item === 'string' ? item : item.name)));
  };

  const openPreview = (fileOrUrl: File | string) => {
    setPreviewImage(fileOrUrl);
  };

  const renderFileDropzone = (index: number, file: UploadedFile) => (
    <div
      key={`file-${index}`}
      className="relative min-w-[130px] min-h-[130px] aspect-square flex-shrink-0 group"
    >
      <Dropzone
        src={[file]}
        onDrop={(files) => handleDrop(files, index)}
        onError={handleError}
        accept={ALLOWED_IMAGE_TYPES}
        maxSize={maxSizeInMB * 1024 * 1024}
        maxFiles={1}
        disabled={disabled}
        className={`${className} border-dashed aspect-square w-[130px] h-[130px] p-0`}
      >
        <DropzoneContent>
          <div className="w-full h-full relative">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-full h-full object-cover"
            />
            {file.status === UploadStatusEnum.UPLOADING && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-xs">Uploading...</div>
              </div>
            )}
            {file.status === UploadStatusEnum.ERROR && (
              <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                <div className="text-white text-xs">Upload Failed</div>
              </div>
            )}
          </div>
        </DropzoneContent>
      </Dropzone>

      {!disabled && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              openPreview(file);
            }}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 dark:hover:bg-destructive/50 dark:hover:text-destructive-foreground"
            onClick={(e) => {
              e.stopPropagation();
              removeFile(index);
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  const renderUrlDropzone = (index: number, url: string) => (
    <div
      key={`url-${index}`}
      className="relative min-w-[130px] min-h-[130px] aspect-square flex-shrink-0 group"
    >
      <div className="w-full h-full border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden">
        <img src={url} alt={`Uploaded image ${index + 1}`} className="w-full h-full object-cover" />
      </div>

      {!disabled && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              openPreview(url);
            }}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 dark:hover:bg-destructive/50 dark:hover:text-destructive-foreground"
            onClick={(e) => {
              e.stopPropagation();
              removeUrl(index);
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  const renderEmptyDropzone = (index: number) => (
    <div
      key={`empty-${index}`}
      className="relative min-w-[130px] min-h-[130px] aspect-square flex-shrink-0 group"
    >
      <Dropzone
        onDrop={(files) => handleDrop(files)}
        onError={handleError}
        accept={ALLOWED_IMAGE_TYPES}
        maxSize={maxSizeInMB * 1024 * 1024}
        maxFiles={1}
        disabled={disabled}
        className={`${className} border-dashed aspect-square w-[130px] h-[130px] p-2`}
      >
        <DropzoneEmptyState>
          <div className="flex w-full h-full items-center justify-center">
            <div className="text-center space-y-2 flex flex-col justify-center h-full">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground mx-auto">
                <UploadIcon size={16} />
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-muted-foreground text-xs text-wrap">
                  Drag and drop or click to upload
                </p>
                <p className="text-muted-foreground text-xs text-wrap">Max size: {maxSizeInMB}MB</p>
              </div>
            </div>
          </div>
        </DropzoneEmptyState>
      </Dropzone>
    </div>
  );

  const totalItems = files.length + urls.length;
  const dropzonesToShow = Math.min(totalItems + 1, maxFiles);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        {files.map((file, index) => renderFileDropzone(index, file))}
        {urls.map((url, index) => renderUrlDropzone(index, url))}
        {totalItems < maxFiles && (
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: dropzonesToShow - totalItems }, (_, index) =>
              renderEmptyDropzone(index),
            )}
          </div>
        )}
      </div>

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-left">
              {typeof previewImage === 'string' ? 'Image Preview' : previewImage?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-6 pt-0 overflow-hidden">
            {previewImage && (
              <img
                src={
                  typeof previewImage === 'string'
                    ? previewImage
                    : URL.createObjectURL(previewImage)
                }
                alt={typeof previewImage === 'string' ? 'Preview' : previewImage.name}
                className="w-full h-full max-h-[60vh] object-contain rounded-md"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UploadPhotoInput;
