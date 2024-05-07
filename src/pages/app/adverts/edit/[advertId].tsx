import EditAdvertComponent from "@/components/edit-advert-component";
import MaxWidthWrapperWithoutFlex from "@/components/max-width-wrapper-without-flex";
import { api } from "@/utils/api";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import React from "react";

const EditAdvertPage = () => {
  const router = useRouter();
  const { advertId } = router.query;

  const { data, isLoading, error } = api.advert.getAdvertById.useQuery({
    advertId: Array.isArray(advertId) ? advertId[0] : advertId,
  });

  if (!advertId) return null;

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

  if (!data)
    return (
      <MaxWidthWrapperWithoutFlex className="flex items-center justify-center">
        <p>İlan bulunamadı.</p>
      </MaxWidthWrapperWithoutFlex>
    );

  return (
    <EditAdvertComponent
      advertId={advertId}
      advert={{
        title: data.title,
        description: data.description ?? "",
        price: data.price,
        size: data.size,
        gender: data.gender,
        color: data.color,
        phone: data.phone ?? "",
        isChildCloth: data.isChildCloth,
        isFree: data.isFree,
        isUsed: data.isUsed,
        imageUrl: data.images[0]?.url ?? "",
      }}
    />
  );
};

export default EditAdvertPage;
