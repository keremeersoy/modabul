import AdvertCard from "@/components/advert-card";
import MaxWidthWrapperWithoutFlex from "@/components/max-width-wrapper-without-flex";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import React from "react";

const MyAdvertsPage = () => {
  const { data: session } = useSession();

  const {
    data: savedAdverts,
    isLoading,
    error,
  } = api.advert.getSavedAdverts.useQuery();

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

  if (!savedAdverts)
    return (
      <MaxWidthWrapperWithoutFlex className="flex items-center justify-center">
        <p>İlan bulunamadı.</p>
      </MaxWidthWrapperWithoutFlex>
    );

  return (
    <MaxWidthWrapperWithoutFlex>
      <Label className="mb-4 flex items-center text-xl">Kaydedilenler</Label>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
        {savedAdverts?.map((advert) => (
          <AdvertCard
            key={advert.id}
            advert={advert}
            showEditAndDeleteButtons={false}
          />
        ))}

        {/* {savedAdverts?.map((advert) => (
          <AdvertCard
            key={advert.advert.id}
            advert={advert.advert}
            showEditAndDeleteButtons={true}
          />
        ))} */}
      </div>
    </MaxWidthWrapperWithoutFlex>
  );
};

export default MyAdvertsPage;
