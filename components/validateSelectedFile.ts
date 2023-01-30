/**
 * @todo validate duplicate filesDrop
 */
export const validateSelectedFile = (
  filesDrop: File[],
  minFileSize: number,
  maxFileSize: number,
  acceptedTypes: string[]
) => {
  if (filesDrop.length == 0)
    return {
      isValid: true,
      errorMsg: "",
    };
  const filesSizeArray: number[] = filesDrop.map((newFile: File) => {
    const fileSize: number = newFile && Math.round(newFile.size / 1000);
    return fileSize;
  });

  const fileTypeArray = filesDrop.map((file) => file.type);

  let fileType = "";
  fileTypeArray.forEach((type) => {
    fileType = fileType + type;
  });

  console.log("fileType", fileType);

  let newFilesSize: number = 0;
  filesSizeArray.forEach((size) => {
    newFilesSize = newFilesSize + size;
  });

  console.log(newFilesSize, "newfilesize");

  const MIN_FILE_SIZE: number = minFileSize;

  const MAX_FILE_SIZE: number = maxFileSize;

  if (acceptedTypes && !acceptedTypes.includes(fileType))
    return {
      isValid: false,
      errorMsg: "O tipo do arquivo não é válido",
    };

  if (newFilesSize < MIN_FILE_SIZE || newFilesSize > MAX_FILE_SIZE)
    return {
      isValid: false,
      errorMsg: "O tamanho do arquivo não é válido",
    };
  return {
    isValid: true,
    errorMsg: "",
  };
};
