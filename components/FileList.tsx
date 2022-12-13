import { Flex, Icon, IconButton } from "@chakra-ui/react";
import React from "react";
import {
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineVideoCamera,
} from "react-icons/ai";
import { fileURLToPath } from "url";
export interface FileListProps {
  files: File[];
}

export const FileList = (props: React.PropsWithChildren<FileListProps>) => (
  <ul>
    {props.files.map((file: File) => (
      <div key={`${file.name}_${file.lastModified}`}>
        <Flex>
          {/* {props.files.map((file: File) => {
            switch (file.type) {
              case "image/jpeg":
                return (
                  <Icon boxSize="1.5rem" aria-label="asd">
                    {<AiOutlineFileImage />}
                  </Icon>
                );

              case "application/pdf":
                return (
                  <Icon boxSize="1.5rem" aria-label="asd">
                    {<AiOutlineFilePdf />}
                  </Icon>
                );

              case "video/mp4":
                return (
                  <Icon boxSize="1.5rem" aria-label="asd">
                    {<AiOutlineVideoCamera />}
                  </Icon>
                );

              default:
                break;
            }
          })} */}
          {file.type == "image/jpeg" || file.type == "image/png" ? (
            <Icon h="100%" fontSize="1.3rem" mt="1" aria-label="asd">
              {<AiOutlineFileImage />}
            </Icon>
          ) : (
            ""
          )}
          {file.type == "application/pdf" ||
          file.type ==
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
            <Icon fontSize="1.3rem" mt="1" aria-label="asd">
              {" "}
              {<AiOutlineFilePdf />}
            </Icon>
          ) : (
            ""
          )}
          {file.type == "video/mp4" || file.type == "video/mp3" ? (
            <Icon fontSize="1.3rem" mt="1" aria-label="asd">
              {<AiOutlineVideoCamera />}
            </Icon>
          ) : (
            ""
          )}
          - {file.name.slice(0, 18)}
        </Flex>
      </div>
    ))}
  </ul>
);

//FileList.displayName = "FileList";
