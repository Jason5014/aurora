import React, { FC, useState, useRef, CSSProperties, ChangeEvent } from 'react';
import classnames from 'classnames';

import Button from '../Button/button';
import axios from 'axios';
import UploadList from './uploadList';
import { Dragger } from './dragger';

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'failed';

export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status?: UploadFileStatus;
  percent?: number;
  raw?: File;
  response?: any;
  error?: any;
}

export interface UploadPropsType {
  action: string;
  defaultFileList?: UploadFile[];
  header?: { [key: string]: any };
  name?: string;
  data?: { [key: string]: any };
  withCredentials?: boolean;
  accept?: string;
  multiple?: boolean;
  drag?: boolean;
  beforeUpload?: (file: File) => boolean | Promise<File>;
  onProgress?: (percentage: number, file: UploadFile) => void;
  onChange?: (file: UploadFile) => void;
  onSuccess?: (data: any, file: UploadFile) => void;
  onError?: (err: any, file: UploadFile) => void;
  onRemove?: (file: UploadFile) => void;
}

export interface UploadProps extends UploadPropsType {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

export const Upload: FC<UploadProps> = ({ prefixCls, className, style, defaultFileList, action, name, header, data, withCredentials, accept, multiple, drag, children, beforeUpload, onProgress, onChange, onSuccess, onError, onRemove }) => {
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || []);
  const fileInput = useRef<HTMLInputElement>(null);
  const updateFileList = (uploadFile: UploadFile, updateObj: Partial<UploadFile>) => {
    setFileList(prevList => {
      return prevList.map(file => {
        if (file.uid === uploadFile.uid) {
          return { ...file, ...updateObj };
        }
        return file;
      });
    });
  }
  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }
  const handleRemove = (file: UploadFile) => {
    setFileList(prevList => prevList.filter(item => item.uid !== file.uid));
    onRemove?.(file);
  }
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    uploadFiles(files);
    if (fileInput.current) {
      fileInput.current.value = '';
    }
  }
  const uploadFiles = (files: FileList) => {
    let postFiles = Array.from(files);
    postFiles.forEach(file => {
      if (!beforeUpload) {
        postFile(file);
      } else {
        const result = beforeUpload(file);
        if (result instanceof Promise) {
          result.then(processedFile => {
            postFile(processedFile);
          });
        } else if (result === true) {
          postFile(file);
        }
      }
    });
  }
  const postFile = (file: File) => {
    let _file: UploadFile = {
      uid: 'upload-file-' + Date.now(),
      status: 'ready',
      name: file.name,
      size: file.size,
      percent: 0,
      raw: file,
    };
    setFileList(prevList => [...prevList, _file]);
    const formData = new FormData();
    formData.append(name || 'file_name', file);
    if (data) {
      Object.keys(data).forEach(key => formData.append(key, data[key]));
    }
    axios.post(action, formData, {
      headers: {
        ...header,
        'Content-Type': 'multipart/form-data'
      },
      withCredentials,
      onUploadProgress: (e) => {
        let percentage = Math.round((e.loaded * 100) / e.total) || 0;
        if (percentage < 100) {
          updateFileList(_file, { percent: percentage, status: 'uploading' });
          _file.status = 'uploading';
          _file.percent = percentage;
          onProgress?.(percentage, _file);
        }
      }
    }).then(resp => {
      updateFileList(_file, { status: 'success', response: resp.data });
      _file.response = resp.data;
      _file.status = 'success';
      onSuccess?.(resp.data, _file);
      onChange?.(_file);
    }).catch(err => {
      updateFileList(_file, { status: 'failed', error: err });
      _file.status = 'failed';
      _file.error = err;
      onError?.(err, _file);
      onChange?.(_file);
    });
  }
  const cls = classnames(prefixCls, {}, className);
  return (
    <div className={cls} style={style}>
      <div className={`${prefixCls}-inpput`} onClick={handleClick}>
        {drag ? <Dragger onFile={uploadFiles}>{children}</Dragger> : (children || <Button btnType="primary">Upload File</Button>)}
        <input
          hidden
          type="file"
          accept={accept}
          multiple={multiple}
          ref={fileInput}
          className={`${prefixCls}-file-input`}
          onChange={handleFileChange}
        />
      </div>
      <UploadList
        fileList={fileList}
        onRemove={handleRemove}
      />
    </div>
  )
}

Upload.defaultProps = {
  prefixCls: 'au-upload',
  defaultFileList: [],
  name: 'file_name',
};

export default Upload;
