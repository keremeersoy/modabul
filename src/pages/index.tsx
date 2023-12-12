import { Button } from "@/components/ui/button";
import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="space-y-24">
        <h1 className="px-12 text-center text-8xl font-bold tracking-wide">
          ihtiyacınız olanı{" "}
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            modabul{" "}
          </span>
          ile bulmaya şimdi{" "}
          <span className="underline decoration-violet-500/50 underline-offset-2">
            başlayın
          </span>
          !
        </h1>
        <div>
          <Button asChild>
            <Link href="/register">Şimdi Başlayın</Link>
          </Button>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
