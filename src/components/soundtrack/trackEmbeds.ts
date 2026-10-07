/**
 * @file src/components/soundtrack/trackEmbeds.ts
 * @desc Where a track's audio lives and how to embed it: the provider names, YouTube id
 *       extraction, the YouTube and SoundCloud player URLs, and the provider a bare URL implies.
 *       Pure, server-safe.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** youtube and soundcloud embed in an iframe, direct is an audio file, link is anything else. */
export type AudioProvider = "youtube" | "soundcloud" | "direct" | "link";

/**
 * @function youtubeId
 * @param raw {string} a YouTube watch, short, embed or youtu.be URL
 * @returns {string | null} the video id, or null when the URL isn't a YouTube video
 */
export const youtubeId = (raw: string): string | null => {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.hostname.endsWith("youtu.be")) return url.pathname.slice(1) || null;
  if (!url.hostname.endsWith("youtube.com")) return null;
  if (url.pathname === "/watch") return url.searchParams.get("v");
  const [kind, id] = url.pathname.split("/").filter(Boolean);
  return (kind === "embed" || kind === "shorts") && id ? id : null;
};

/**
 * @function soundcloudPlayerUrl
 * @param url {string} a SoundCloud track URL
 * @returns {string} the visual SoundCloud widget for it, no autoplay, in the cup's green
 */
export const soundcloudPlayerUrl = (url: string): string => {
  const params = new URLSearchParams({
    url,
    color: "#84cc99",
    auto_play: "false",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "false",
    visual: "true",
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
};

/**
 * @function guessProvider
 * @param url {string} an audio URL
 * @returns {AudioProvider} youtube or soundcloud by host, direct for common audio file
 *          extensions, link otherwise
 */
export const guessProvider = (url: string): AudioProvider => {
  if (youtubeId(url)) return "youtube";
  if (/^https?:\/\/(?:www\.)?soundcloud\.com\//i.test(url)) return "soundcloud";
  if (/\.(?:mp3|ogg|opus|wav|flac|m4a)(?:\?|#|$)/i.test(url)) return "direct";
  return "link";
};
