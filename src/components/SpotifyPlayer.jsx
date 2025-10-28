"use client";

import { useState, useEffect } from "react";

export default function SpotifyPlayer({ link }) {
  const [embedUrl, setEmbedUrl] = useState(null);

  useEffect(() => {
    if (!link) return;

    try {
      const url = new URL(link);
      if (url.hostname !== "open.spotify.com") throw new Error("Invalid Spotify link");

      const [_, type, id] = url.pathname.split("/");
      if (!type || !id) throw new Error("Invalid Spotify link format");

      setEmbedUrl(`https://open.spotify.com/embed/${type}/${id}`);
    } catch (err) {
      console.error(err);
      setEmbedUrl(null);
    }
  }, [link]);

  if (!embedUrl) return null;

  return (
    <div className="w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg my-4">
      <iframe
        src={embedUrl}
        width="100%"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        title="Spotify Player"
        className="rounded-lg"
      />
    </div>
  );
}
