"use client";

import Image from "next/image";
import Link from "next/link";

import { POSTER_IMAGE } from "~/lib/constants";
import { Resource } from "~/lib/types";
import imageNotFound from "~/images/image_not_available.png";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useWatchlistStore, WatchlistItem } from "~/lib/stores/watchlist-store";
import { useEffect } from "react";

export function Carousel({
  items,
  hrefType = "movies",
}: {
  items: Resource[];
  hrefType?: "movies" | "tv";
}) {
  const watchlist = useWatchlistStore((store) => store.watchlist);
  const addToWatchlist = useWatchlistStore((store) => store.addToWatchlist);

  useEffect(() => {
    useWatchlistStore.persist.rehydrate();
  }, []);

  const handleAddToWatchlistClick = (e: React.MouseEvent<HTMLButtonElement>, item: Resource) => {
    e.preventDefault();

    addToWatchlist(item, hrefType);
  };

  return (
    <div>
      <div className="flex p-4 space-x-6 overflow-x-scroll flex-nowrap snap-x">
        {items.map((item) => (
          <CarouselItem
            key={item.id}
            item={item}
            hrefType={hrefType}
            watchlist={watchlist}
            handleAddToWatchlistClick={handleAddToWatchlistClick}
          />
        ))}
      </div>
    </div>
  );
}

function CarouselItem({
  item,
  hrefType,
  watchlist,
  handleAddToWatchlistClick,
}: {
  item: Resource;
  hrefType: "movies" | "tv";
  watchlist: WatchlistItem[];
  handleAddToWatchlistClick: (e: React.MouseEvent<HTMLButtonElement>, item: Resource) => void;
}) {
  const itemInWatchlist = (watchlist ?? []).find(
    (itemInList: Resource) => itemInList.id === item.id
  );
  const imageSrc = item.poster_path ? `${POSTER_IMAGE.W342}${item.poster_path}` : imageNotFound;
  const imageAlt = item?.title ?? item?.name ?? "";

  return (
    <Link href={`/${hrefType}/${item.id}`} className="relative rounded-md group">
      <div className="snap-start w-[225px] h-[350px] flex-shrink-0 shadow-md shadow-white/20 rounded-md overflow-hidden">
        <div className="relative w-full h-full">
          <Image src={imageSrc} alt={imageAlt} fill />
          <button
            onClick={(event) => handleAddToWatchlistClick(event, item)}
            className="absolute rounded-bl-xl top-0 p-2 -right-[100%] bg-pink-500/80 group-hover:-right-0 transition-all duration-300 ease-in-out z-10"
          >
            {itemInWatchlist ? (
              <IconHeartFilled className="text-white" />
            ) : (
              <IconHeart className="text-white" />
            )}
          </button>
        </div>
      </div>

      <div className="absolute top-0 bottom-0 left-0 right-0 transition-all duration-200 ease-in-out bg-black/20 group-hover:bg-black/50"></div>
    </Link>
  );
}
