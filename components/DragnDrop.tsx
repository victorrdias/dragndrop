import React, { useEffect, useRef } from "react";
import { DropZone } from "../components/DropZone";
import { FileList, FileListProps } from "../components/FileList";
import { Flex, Button, Text } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { db, storage } from "../firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "@firebase/storage";
import { promises } from "stream";

export const DragnDrop = () => {
  const [isDropActive, setIsDropActive] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [errorMsg, setErrorMsg] = React.useState<any | undefined>(false);
  const [isSuccess, setIsSuccess] = React.useState<any | undefined>(false);
  const captionRef = useRef<HTMLInputElement>(null);

  const onDragStateChange = React.useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive);
  }, []);

  const { open } = useDropzone({
    noClick: true,
    noKeyboard: true,
  });

  const onDrop = (prevState: File[]) => {
    files.push(...prevState);
    console.log(prevState, "prevState");

    setFiles([...files]);
  };

  const validateSelectedFileSize = (prevState: File[], files: File[]) => {
    const filesSizeArray: number[] = files.map((newFile: File) => {
      const fileSize: number = newFile && Math.round(newFile.size / 1000);
      return fileSize;
    });

    setIsSuccess(false);
    setErrorMsg("");

    let newFilesSize: number = 0;
    filesSizeArray.forEach((size) => {
      newFilesSize = newFilesSize + size;
    });

    console.log(newFilesSize, "newfilesize");

    const MIN_FILE_SIZE: number = 100;

    const MAX_FILE_SIZE: number = 5000;

    if (newFilesSize < MIN_FILE_SIZE || newFilesSize > MAX_FILE_SIZE)
      setIsSuccess(false),
        setErrorMsg("O tamanho do arquivo nao condiz com os requerimentos");
    else setIsSuccess(true), onDrop(prevState);
  };

  const uploadFiles = async () => {
    const current = captionRef.current;

    if (current) {
      const docRef = await addDoc(collection(db, "posts"), {
        caption: current.value,
        timestamp: serverTimestamp(),
      });
      await Promise.all(
        files.map((file) => {
          const fileRef = ref(
            storage,
            `posts/${docRef.id}/${file.webkitRelativePath}`
          );
          console.log("file", fileRef);
          uploadBytes(fileRef, file, { md5Hash: undefined }).then(async () => {
            const downloadURL = await getDownloadURL(fileRef);
            await updateDoc(doc(db, "posts", docRef.id), {
              files: arrayUnion(downloadURL),
            });
          });
          setFiles([]);
          setIsSuccess(false);
          setErrorMsg("");
        })
      );
    }
    if (current) {
      captionRef.current.value = "";
      setFiles([]);
    }
  };

  return (
    <Flex direction="column" align="center" h="100vh" justify="center" gap="4">
      <DropZone
        onFilesDrop={(files) => validateSelectedFileSize(files, files)}
        onDragStateChange={onDragStateChange}
      >
        <Flex
          align="center"
          justify="center"
          w="30vw"
          h="30vh"
          bgColor="gray.200"
          border="dashed"
          borderColor="red"
        >
          <Text>Drop your files here</Text>
        </Flex>
      </DropZone>
      <Button onClick={open}>Search</Button>
      <input type="text" ref={captionRef} />
      <FileList files={files} />
      <Flex>
        {files.length === 0 ? (
          <h3>No files to upload</h3>
        ) : (
          <h3>Files to upload: {files.length}</h3>
        )}
      </Flex>
      {isSuccess && files.length > 0 ? (
        <p className="success-message">Validation successful</p>
      ) : null}
      <p className="error-message">{errorMsg}</p>
      <Button onClick={() => uploadFiles()}>Upload</Button>
    </Flex>
  );
};

DragnDrop.displayName = "DragnDrop";
export default DragnDrop;
