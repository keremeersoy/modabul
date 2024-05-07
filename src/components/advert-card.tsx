import { Advert } from "@prisma/client";
import Image from "next/image";
import NoImage from "public/images/NoImage.png";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Bookmark, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import EditAndDeleteAdvertButtonGroup from "./edit-and-delete-advert-button-group";

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
  const { data: session } = useSession();

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
    user,
  } = advert;

  const isOwner = session?.user.id === user.id;

  return (
    <Card className="h-full">
      {isOwner && (
        <EditAndDeleteAdvertButtonGroup
          advertId={id}
          isOwner={isOwner}
          className="mt-4"
        />
      )}
      <Link href={`/app/adverts/${id}`}>
        <CardHeader className="flex flex-col items-center justify-center">
          <div
            className={cn(
              "flex h-56 w-full items-center justify-center overflow-hidden rounded-md",
              className,
            )}
          >
            <Image
              src={
                images?.[0]?.url ??
                "https://st3.depositphotos.com/17828278/33150/v/450/depositphotos_331503262-stock-illustration-no-image-vector-symbol-missing.jpg"
              }
              alt={title}
              width={200}
              height={200}
            />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col space-y-4">
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
            <Badge variant={"outline"}>
              {isUsed ? "2.El" : "Kullanılmamış"}
            </Badge>
            {isChildCloth && <Badge variant={"warning"}>Çocuk</Badge>}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default AdvertCard;
