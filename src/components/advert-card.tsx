import { Advert } from "@prisma/client";
import Image from "next/image";
import NoImage from "public/images/NoImage.png";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Bookmark } from "lucide-react";

interface AdvertDetails extends Advert {
  category: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string | null;
    surname: string | null;
    email: string | null;
    emailVerified: Date | null;
    createdAt: Date;
    updatedAt: Date;
    image: string | null;
  };
  images: {
    id: string;
    url: string;
    advertId: string;
  }[];
  location?: {
    id: string;
    city: string;
    detail: string | null;
    advertId: string;
  } | null;
}

const AdvertCard = ({
  advert,
  className,
}: {
  advert: AdvertDetails;
  className?: string;
}) => {
  const {
    id,
    title,
    description,
    price,
    color,
    isChildCloth,
    isFree,
    isUsed,
    savedCount,
    size,
    category,
    images,
    location,
    createdAt,
  } = advert;

  return (
    <Card>
      <CardHeader className="flex flex-col items-center justify-center">
        <Image
          src={images?.[0]?.url ?? NoImage}
          alt={title}
          width={200}
          height={200}
        />
      </CardHeader>

      <CardContent className="flex flex-col space-y-2">
        <Label className="text-md font-semibold">
          {title.length > 25 ? title.substring(0, 25) + "..." : title}
        </Label>
        <p
          className={cn(
            "h-14 text-sm text-muted-foreground",
            !description && "italic",
          )}
        >
          {description && description?.length > 50
            ? description?.substring(0, 50) + "..."
            : "açıklama yok"}
        </p>

        <div className="flex items-center justify-between">
          {isFree ? (
            <Badge className="text-sm" variant={"success"}>
              Ücretsiz
            </Badge>
          ) : (
            <Label className="text-xl font-semibold">{price} TL</Label>
          )}

          <div className="text-md flex items-center justify-center gap-1">
            {savedCount}
            <Bookmark className="h-5 w-5" />
          </div>
        </div>

        <div className="flex flex-wrap gap-1 text-sm">
          <Badge variant={"info"}>{size}</Badge>
          <Badge variant={"default"}>{color}</Badge>
          <Badge variant={"outline"}>{isUsed ? "2.El" : "Kullanılmamış"}</Badge>
          {isChildCloth && <Badge variant={"warning"}>Çocuk</Badge>}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvertCard;
