import AdvertCardFullscreen from "@/components/advert-card-fullscreen";
import MaxWidthWrapperWithoutFlex from "@/components/max-width-wrapper-without-flex";
import { api } from "@/utils/api";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import React from "react";

const AdvertIdPage = () => {
  const router = useRouter();
  const { advertId } = router.query;

  const { data, isLoading, error } = api.advert.getAdvertById.useQuery({
    advertId: Array.isArray(advertId) ? advertId[0] : advertId,
  });

  const { data: isAdvertSaved, isLoading: isAdvertSavedLoading } =
    api.advert.isAdvertSaved.useQuery({
      advertId: Array.isArray(advertId) ? advertId[0] : advertId,
    });

  if (isLoading || isAdvertSavedLoading)
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

  if (!data)
    return (
      <MaxWidthWrapperWithoutFlex className="flex items-center justify-center">
        <p>İlan bulunamadı.</p>
      </MaxWidthWrapperWithoutFlex>
    );

  return (
    <MaxWidthWrapperWithoutFlex>
      <AdvertCardFullscreen advert={data} isAdvertSaved={isAdvertSaved} />
    </MaxWidthWrapperWithoutFlex>
  );
};

export default AdvertIdPage;
