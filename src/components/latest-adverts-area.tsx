import { api } from "@/utils/api";
import React from "react";
import AdvertCard from "./advert-card";
import MaxWidthWrapperWithoutFlex from "./max-width-wrapper-without-flex";
import { ReloadIcon } from "@radix-ui/react-icons";

const LatestAdvertsArea = () => {
  const { data, isLoading, error } = api.advert.getLastFiveAdverts.useQuery();

  if (isLoading)
    return (
      <MaxWidthWrapperWithoutFlex className="flex items-center justify-center">
        <ReloadIcon className="w-1h-14 h-14 animate-spin" />
      </MaxWidthWrapperWithoutFlex>
    );

  if (error)
    return (
      <div>
        {void console.log("error", error)}
        error
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
      {data?.map((advert) => <AdvertCard key={advert.id} advert={advert} />)}
    </div>
  );
};

export default LatestAdvertsArea;
