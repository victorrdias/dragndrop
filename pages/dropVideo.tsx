import React from "react";
import DragnDrop from "../components/DragnDrop";

const DropVideo = () => {
  return (
    <DragnDrop
      text="drop your VIDEOS here."
      src={"/assets/video.png"}
      minFileSize={2000}
      maxFileSize={1550000}
      rules="accept video.
      maxSize 50mb"
      title="TITULO"
      subTitle="subtitulo"
    />
  );
};

export default DropVideo;
