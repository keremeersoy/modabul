import LatestAdvertsArea from "@/components/latest-adverts-area";
import MaxWidthWrapperWithoutFlex from "@/components/max-width-wrapper-without-flex";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";

const App = () => {
  return (
    <MaxWidthWrapperWithoutFlex>
      <div className="mb-4 flex justify-between">
        <Label className="flex items-center text-xl">Son Eklenen İlanlar</Label>
        <Button variant={"success"} asChild>
          <Link href={"/app/create-advert"}>ilan oluştur!</Link>
        </Button>
      </div>
      <LatestAdvertsArea />
    </MaxWidthWrapperWithoutFlex>
  );
};

export default App;
