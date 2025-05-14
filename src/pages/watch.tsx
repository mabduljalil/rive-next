import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "@/styles/Watch.module.scss";
import { setContinueWatching } from "@/Utils/continueWatching";
import { toast } from "sonner";
import { IoReturnDownBack } from "react-icons/io5";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { BsHddStack, BsHddStackFill } from "react-icons/bs";
import axiosFetch from "@/Utils/fetchBackend";
import WatchDetails from "@/components/WatchDetails";
import Player from "@/components/Artplayer";

const Watch = () => {
  const params = useSearchParams();
  const { back, push } = useRouter();
  const [type, setType] = useState<string | null>("");
  const [id, setId] = useState<any>();
  const [season, setSeason] = useState<any>();
  const [episode, setEpisode] = useState<any>();
  const [embedMode, setEmbedMode] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [embedURL, setEmbedURL] = useState<string>("");

  useEffect(() => {
    setType(params.get("type"));
    setId(params.get("id"));
    setSeason(params.get("season"));
    setEpisode(params.get("episode"));

    const fetchEmbedURL = async () => {
      try {
        let embedApiUrl = "";

        // Construct the embed URL based on the type
        if (type === "movie") {
          embedApiUrl = `https://rivestream.org/embed?type=movie&id=${id}`;
        } else if (type === "tv") {
          embedApiUrl = `https://rivestream.org/embed?type=tv&id=${id}&season=${season}&episode=${episode}`;
        }

        // Fetch the embed URL
        const response = await axiosFetch({
          url: embedApiUrl, // Use the constructed URL
          method: "GET",
        });

        // Set the embed URL or handle the response
        setEmbedURL(response?.data?.embedURL || embedApiUrl);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch embed URL:", error);
        setEmbedMode(false);
      }
    };

    if (type && id) {
      fetchEmbedURL();
    }
  }, [params, type, id, season, episode]);

  return (
    <div className={styles.watch}>
      <div onClick={() => back()} className={styles.backBtn}>
        <IoReturnDownBack data-tooltip-id="tooltip" data-tooltip-content="go back" />
      </div>
      {loading ? (
        <div className={`${styles.loader} skeleton`}>Loading</div>
      ) : embedURL ? (
        <iframe
          src={embedURL}
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : (
        <div className={styles.error}>Failed to load video</div>
      )}
    </div>
  );
};

export default Watch;
