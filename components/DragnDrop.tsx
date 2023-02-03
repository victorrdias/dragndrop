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
import { GiConfirmed, GiConsoleController } from "react-icons/gi";
import { isDragActive } from "framer-motion";
import { validateSelectedFile } from "./validateSelectedFile";

export const DragnDrop: React.FC<DragnDropProps> = ({
  src,
  minFileSize,
  maxFileSize,
  text,
  rules,
  title,
  subTitle,
  acceptedTypes,
}) => {
  const [isDropActive, setIsDropActive] = React.useState(false);
  let [files, setFiles] = React.useState<File[]>([]);
  let [filesSave, setFilesSave] = React.useState<File[]>([]);
  let [filesDrop, setFilesDrop] = React.useState<File[]>([]);
  const [errorMsg, setErrorMsg] = React.useState<any | undefined>(false);
  const [isValid, setIsValid] = React.useState<any | undefined>(false);
  const captionRef = useRef<HTMLInputElement>(null);

  const onDragStateChange = React.useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive);
  }, []);

  const { open, acceptedFiles } = useDropzone({});

  const onDrop = (prevState: File[]) => {
    filesDrop.push(...prevState);
    setFilesDrop([...filesDrop]);
  };

  const handleFileDrop = (
    filesDrop: File[],
    minFileSize: number,
    maxFileSize: number,
    acceptedTypes: string[]
  ) => {
    const { isValid, errorMsg } = validateSelectedFile(
      filesDrop,
      minFileSize,
      maxFileSize,
      acceptedTypes
    );
    if (!isValid) {
      setIsValid(isValid);
      setErrorMsg(errorMsg);
      return;
    }
    onDrop(filesDrop);
    files.push(...filesDrop);
    setIsValid(isValid);
    setErrorMsg("");
  };

  const onSave = (acceptedFiles: File[]) => {
    filesSave.push(...acceptedFiles);
    setFilesSave([...filesSave]);
  };
  const handleOnSave = (
    filesSave: File[],
    minFileSize: number,
    maxFileSize: number,
    acceptedTypes: string[]
  ) => {
    if (acceptedFiles.length > 0) {
      const { isValid, errorMsg } = validateSelectedFile(
        acceptedFiles,
        minFileSize,
        maxFileSize,
        acceptedTypes
      );
      if (!isValid) {
        setIsValid(isValid);
        setErrorMsg(errorMsg);
        return;
      }
      onSave(acceptedFiles);
      files.push(...filesSave);
      setIsValid(isValid);
      setErrorMsg("");
    }
  };

  useEffect(() => {
    handleOnSave(filesSave, minFileSize, maxFileSize, acceptedTypes);

    console.log("acceptedFiles", acceptedFiles);
    //console.log("filesSave", filesSave);
    //console.log("files", files);
  }, [acceptedFiles]);

  // useEffect(() => {
  //   console.log("files", { files, acceptedFiles });
  //   //console.log("accceptedFiles", acceptedFiles);
  // }, [files, acceptedFiles]);

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
          setIsValid(true);
          setErrorMsg("");
        })
      );
    }
    if (current) {
      captionRef.current.value = "";
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
      <DropZone
        onFilesDrop={(filesDrop) =>
          handleFileDrop(filesDrop, minFileSize, maxFileSize, acceptedTypes)
        }
        onDragStateChange={onDragStateChange}
      >
        <Button onClick={open} h="100%" p="0" borderRadius="15px">
          <Flex
            borderRadius="15px"
            align="center"
            justify="center"
            w="20vw"
            h="30vh"
            bgColor="gray.200"
            border="dashed"
            borderColor={
              !isValid ? "red" : files.length == 0 && isValid ? "gray" : "green"
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
      {isValid && files.length > 0 ? (
        <Icon color="green" boxSize="6" mt="1.5">
          {<GiConfirmed />}
        </Icon>
      ) : null}
      <Text color="red" fontWeight="semibold" className="error-message">
        {errorMsg}
      </Text>
      <Text>- {rules}</Text>

      <Flex direction="row" align="center" gap="2" h="100%">
        <FileList files={files} />
      </Flex>
      <Flex>
        {/* <p>{lists}</p> */}
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
