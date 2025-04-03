import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import React, { useRef, useState } from 'react';

const Dropzone = ({
  onUpload,
  singleFile = false,
  allowedFileTypes,
  maxFileSize,
  errorMessage,
  allowAllTypes = false,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState(null);
  const dropzoneRef = useRef(null);

  const handleDragEnter = () => {
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const fileToUpload = singleFile ? [files[0]] : files;
    handleFiles(fileToUpload);
  };

  const handleFileSelect = (e) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      const isValid = allowAllTypes ? true : validateFile(file);
      if (isValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      setError(
        `${
          singleFile
            ? 'Please select valid file.'
            : `Please select valid files.`
        }`,
      );
    } else {
      setError(null);
      onUpload(validFiles);
    }
  };

  const handleClick = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.click();
    }
  };

  const validateFile = (file) => {
    const fileType = getFileType(file.type);
    if (!fileType || !allowedFileTypes.includes(file.type)) {
      return false;
    }

    const maxSize = maxFileSize[fileType];

    if (!maxSize || file.size > maxSize) {
      return false;
    }

    return true;
  };

  const getFileType = (fileType) => {
    if (fileType.startsWith('image')) {
      return 'image';
    } else if (fileType === 'application/pdf') {
      return 'pdf';
    }
    return undefined;
  };
  const supportedFileTypes = allowedFileTypes.map((type) =>
    type.split('/')[1].toUpperCase(),
  );
  const supportedFileTypesMessage = `Supported file types: ${supportedFileTypes.join(
    ', ',
  )}`;
  return (
    <>
      <div
        className={`flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed p-5
          ${isDragActive ? 'border-sky-400 bg-sky-50' : 'border-gray-300'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}>
        <div className='flex flex-col'>
          <div className='mx-auto mb-2 text-gray-400'>
            <CloudArrowUpIcon className='h-5 w-5' />
          </div>
          {!singleFile && (
            <label
              htmlFor='file-upload'
              className='flex cursor-pointer flex-col items-center'>
              <input
                id='file-upload'
                type='file'
                className='hidden'
                onChange={handleFileSelect}
                multiple={!singleFile}
                ref={dropzoneRef}
              />
              <span className='mr-1 cursor-pointer text-[#4070f4]'>
                Click to upload
              </span>
              or drag and drop
            </label>
          )}
          {singleFile && (
            <div>
              <input
                id='file-upload'
                type='file'
                className='hidden'
                accept='.jpg, .jpeg, .png, .pdf'
                onChange={handleFileSelect}
                ref={dropzoneRef}
              />
              <span
                className='mr-1 cursor-pointer text-[#4070f4]'
                onClick={() => handleClick()}>
                Click to upload
              </span>
              or drag and drop
            </div>
          )}
          {!allowAllTypes && (
            <div className='text-[10px] font-normal text-gray-500'>
              {supportedFileTypesMessage}
            </div>
          )}
        </div>
      </div>
      {(error || errorMessage) && (
        <div className='text-red-500'>{error ? error : errorMessage}</div>
      )}
    </>
  );
};

export default Dropzone;
