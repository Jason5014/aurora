import React from 'react';
import { storiesOf } from '@storybook/react';

import Icon from '../Icon/icon';
import { Upload, UploadFile } from './upload';
import { action } from '@storybook/addon-actions';

const actionUrl = "http://jsonplaceholder.typicode.com/posts";

const defaultFileList: UploadFile[] = [
  { uid: 'upload-file-123', size: 1234, name: 'hello.md', status: 'success', percent: 100 },
  { uid: 'upload-file-124', size: 1234, name: 'xyz.md', status: 'uploading', percent: 30 },
  { uid: 'upload-file-125', size: 1234, name: 'eyiha.md', status: 'failed', percent: 30 },
];

const SimpleUpload = () => (
  <Upload
    action={actionUrl}
    onProgress={action('progress')}
    onSuccess={action('success')}
    onError={action('error')}
  />
);

export const checkFileSize = (file: File) => {
  if (Math.round(file.size / 1024) > 50) {
    alert('file too big');
    return false;
  }
  return true;
}

export const changeFileName = (file: File) => {
  const newFile = new File([file], 'new_name', { type: file.type });
  return Promise.resolve(newFile);
}

const UploadWithBeforeHandler = () => (
  <Upload
    action={actionUrl}
    onChange={action('changed')}
    // beforeUpload={changeFileName}
  />
);

const UploadWithDefaultFileList = () => (
  <Upload
    action={actionUrl}
    onChange={action('changed')}
    defaultFileList={defaultFileList}
    onRemove={action('removed')}
  />
);

const UploadWithCustomHeader = () => (
  <Upload
    action={actionUrl}
    onChange={action('changed')}
    onRemove={action('removed')}
    name="filename"
    header={{ 'X-Powered-By': 'aurora' }}
    data={{ 'key': 'value' }}
    accept=".rar"
    multiple
  />
);

const DraggableUpload = () => (
  <Upload
    action={actionUrl}
    onChange={action('changed')}
    onRemove={action('removed')}
    drag
  >
    <Icon icon="upload" size="5x" theme="secondary" />
    <br/>
    <p>Drag file over to upload</p>
  </Upload>
)

storiesOf('Upload', module)
  .add('Upload', SimpleUpload)
  .add('before upload', UploadWithBeforeHandler)
  .add('拥有默认值的 Upload', UploadWithDefaultFileList)
  .add('自定义上传参数', UploadWithCustomHeader)
  .add('可拖拽的 Upload', DraggableUpload)
