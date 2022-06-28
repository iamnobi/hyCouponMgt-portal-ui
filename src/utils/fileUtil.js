function extractFilename(filename) {
  if (!filename) {
    return filename;
  }
  var filenameAry = filename.split('\\');
  return filenameAry[filenameAry.length - 1];
}

/**
 * 檢查是否為合法副檔名，接受 jpg, jpeg, png
 * @param {String} fileTypes 副檔名字串
 * @returns True if fileType is one of jpg, jpeg, png
 */
function checkImageFileType(fileType) {
  if (fileType === '' || !fileType) {
    throw new TypeError('Invalid type of argument: fileTypes must be a string');
  }

  return /^(jpe?g|png)$/.test(fileType);
}

export { extractFilename, checkImageFileType };
