import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const App = () => {
  return (
    <MaxWidthWrapper>
      <Button variant={"success"} asChild>
        <Link href={"/app/create-advert"}>ilan oluştur!</Link>
      </Button>
    </MaxWidthWrapper>
  );
};

export default App;
