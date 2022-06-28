export {
  triggerDownload,
  downloadBase64,
  downloadString,
  downloadText,
  downloadFileName
};

/**
 * 下載 Blob 檔案
 * @param {String} filename 檔名
 * @param {Blob} blob blob
 */
function triggerDownload(filename, blob) {
  // ie
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    return window.navigator.msSaveOrOpenBlob(blob, filename);
  }
  // Chome, Firefox, ....
  const object_url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = object_url;
  a.download = filename;
  a.click();
  a.remove();
  URL.revokeObjectURL(object_url);
}

/**
 * 將 base64 string 轉成 blob 後下載
 * @param {String} filename 檔名
 * @param {String} base64 base64 string
 */
function downloadBase64(filename, base64) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/octet-stream' });
  triggerDownload(filename, blob);
}

/**
 * 將 string 轉成 blob(二进制数据) 後下載
 * @param {String} filename 檔名
 * @param {String} string string
 */
function downloadString(filename, string) {
  const blob = new Blob([string], { type: 'application/octet-stream' });
  triggerDownload(filename, blob);
}

/**
 * 將 string 轉成 blob(普通文本) 後下載
 * @param {String} filename 檔名
 * @param {String} string string
 */
function downloadText(filename, string) {
  const blob = new Blob([string], { type: 'text/plain' });
  triggerDownload(filename, blob);
}

/**
 * 取得回傳的檔案名稱
 * @param {String} contentDisposition
 * @param {String} customFileName 若沒有 contentDisposition, 自行定義的下載檔案的檔案名稱
 */
function downloadFileName(response, customFileName = '') {
  let contentDisposition = response.headers['content-disposition'];
  if (!contentDisposition) return customFileName;

  const regex = new RegExp(/filename="([^"]+)"/);
  let urlEncodedFileNmae = regex.exec(contentDisposition)[1];

  return decodeURIComponent(urlEncodedFileNmae);
}
