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
    data: adverts,
    isLoading,
    error,
  } = api.advert.getOneUserAdverts.useQuery({
    userId: session?.user.id ?? null,
  });

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

  if (!adverts)
    return (
      <MaxWidthWrapperWithoutFlex className="flex items-center justify-center">
        <p>İlan bulunamadı.</p>
      </MaxWidthWrapperWithoutFlex>
    );

  return (
    <MaxWidthWrapperWithoutFlex>
      <Label className="mb-4 flex items-center text-xl">İlanlarım</Label>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
        {adverts?.map((advert) => (
          <AdvertCard
            key={advert.id}
            advert={advert}
            showEditAndDeleteButtons={true}
          />
        ))}
      </div>
    </MaxWidthWrapperWithoutFlex>
  );
};

export default MyAdvertsPage;
