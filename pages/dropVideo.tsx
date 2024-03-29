import React from "react";
import DragnDrop from "../components/DragnDrop";

const DropVideo = () => {
  return (
    <DragnDrop
      acceptedTypes={["video/mp4", "video/mp3"]}
      text="drop your VIDEOS here."
      src={"/assets/video.png"}
      minFileSize={2000}
      maxFileSize={1550000}
      rules="accept video.
      maxSize 50mb"
      title="TITULO3"
      subTitle="subtitulo3"
    />
  );
};

export default DropVideo;
