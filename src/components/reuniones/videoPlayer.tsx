import React from "react";

// Define el tipo para las props que recibirá el componente
interface VideoPlayerProps {
  urlVideo: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ urlVideo }) => {
  return (
    <iframe
      src={urlVideo}
      allow="autoplay; fullscreen; picture-in-picture"
      className="block w-full h-full"
      style={{
        border: "none", // Eliminar borde
        borderRadius: "8px", // Bordes redondeados
      }}
      title="Video"
    />
  );
};

export default VideoPlayer;
