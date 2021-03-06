import { useState } from 'react';

import { FileMetaData } from 'models/FileUpload';

export enum UPLOAD_STATE {
  PRISTINE,
  UPLOADING,
  COMPLETE,
  ERROR,
  ABORTED,
}

export function useFileUpload() {
  const [progress, setProgress] = useState<number>(0);
  const [state, setState] = useState<UPLOAD_STATE>(UPLOAD_STATE.PRISTINE);
  let xhr: XMLHttpRequest;

  const reset = () => {
    setProgress(0);
    setState(UPLOAD_STATE.PRISTINE);
  };

  const abort = () => {
    try {
      xhr.abort();
    } catch {}

    reset();
  };

  const uploadFile = (file: File, completeHandler: Function) => {
    setState(UPLOAD_STATE.UPLOADING);
    const formData = new FormData();
    formData.append('file', file);
    xhr = new XMLHttpRequest();

    xhr.upload.addEventListener(
      'progress',
      event => {
        const percent = (event.loaded / event.total) * 100;
        setProgress(percent);
      },
      false
    );

    xhr.addEventListener(
      'load',
      event => {
        const { responseText } = event.currentTarget as XMLHttpRequest;
        try {
          if (responseText) {
            const metaData: FileMetaData = JSON.parse(responseText);
            completeHandler(metaData);
            reset(); //auto reset
          }
        } catch (e) {
          setState(UPLOAD_STATE.ERROR);
        }
      },
      false
    );

    xhr.addEventListener(
      'error',
      () => {
        setState(UPLOAD_STATE.ERROR);
      },
      false
    );

    xhr.addEventListener(
      'abort',
      () => {
        setState(UPLOAD_STATE.ABORTED);
      },
      false
    );

    xhr.open('POST', '/files/upload');
    xhr.send(formData);
  };

  return { uploadFile, progress, state, abort };
}
