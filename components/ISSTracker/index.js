import { useEffect, useState } from "react";
import Controls from "../Controls/index";
import Map from "../Map/index";
import useSWR from "swr";

const url = "https://api.wheretheiss.at/v1/satellites/25544";
export default function ISSTracker() {
  // const fetcher = (url) => fetch(url).then(() => response.json());
  const fetcher = async (url) => {
    const res = await fetch(url);

    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      const error = new Error("An error occurred while fetching the data.");
      // Attach extra info to the error object.
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }

    return res.json();
  };
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 5000,
  });
  console.log(data);
  if (error) {
    return <h1>There was an error loading the data! Please try again.</h1>;
  }
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <main>
      <Map longitude={data.longitude} latitude={data.latitude} />
      <Controls
        longitude={data.longitude}
        latitude={data.latitude}
        onRefresh={() => mutate()}
      />
    </main>
  );
}
