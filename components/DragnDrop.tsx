import React, { useEffect, useRef } from "react";
import { DropZone } from "../components/DropZone";
import { FileList, FileListProps } from "../components/FileList";
import { Flex, Button, Text, Image, Icon, IconButton } from "@chakra-ui/react";
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
import { DragnDropProps } from "../utils/interface/DragnDropProps";
import { GiConfirmed } from "react-icons/gi";

export const DragnDrop: React.FC<DragnDropProps> = ({
  src,
  minFileSize,
  maxFileSize,
  text,
  rules,
  title,
  subTitle,
}) => {
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

    const fileTypeArray = files.map((file) => file.type);

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

    if (newFilesSize < MIN_FILE_SIZE || newFilesSize > MAX_FILE_SIZE)
      setIsSuccess(false),
        setErrorMsg("O arquivo nao condiz com os requerimentos");
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
    <Flex
      direction="column"
      align="flex-start"
      h="60vh"
      justify="center"
      p="12"
    >
      <input type="text" ref={captionRef} />

      <Text>{title}</Text>
      <Text>{subTitle}</Text>
      <DropZone onFilesDrop={(files) => validateSelectedFileSize(files, files)}>
        <Button onClick={open} h="100%" p="0" borderRadius="15px">
          <Flex
            borderRadius="15px"
            align="center"
            justify="center"
            w="30vw"
            h="30vh"
            bgColor="gray.200"
            border="dashed"
            borderColor={
              isSuccess === false && files.length > 0 ? "red" : "gray"
            }
          >
            <Image
              boxSize="16rem"
              opacity={0.2}
              position="absolute"
              src={src}
              aria-label="corresponding type files icon"
            />
            <Text fontSize="30" fontWeight="bold">
              {text}
            </Text>
          </Flex>
        </Button>
      </DropZone>
      {isSuccess && files.length > 0 ? (
        <Icon color="green" boxSize="6" mt="1.5">
          {<GiConfirmed />}
        </Icon>
      ) : null}
      <Text color="red" fontWeight="semibold" className="error-message">
        {errorMsg}
      </Text>
      <Text>- {rules}</Text>
      {/* <Button onClick={open}>Search</Button> */}
      <Flex direction="row" align="center" gap="2" h="100%">
        <FileList files={files} />
      </Flex>
      <Flex>
        {files.length === 0 ? (
          <h3>- No files to upload</h3>
        ) : (
          <h3>Files to upload: {files.length}</h3>
        )}
      </Flex>

      <Button onClick={() => uploadFiles()}>Upload</Button>
    </Flex>
  );
};

DragnDrop.displayName = "DragnDrop";
export default DragnDrop;
