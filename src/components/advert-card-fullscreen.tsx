import { Advert } from "@prisma/client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { BookmarkIcon, BookmarkFilledIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";
import EditAndDeleteAdvertButtonGroup from "./edit-and-delete-advert-button-group";
import { Button } from "./ui/button";
import { api } from "@/utils/api";

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

const AdvertCardFullscreen = ({
  advert,
  className,
  isAdvertSaved: initialIsAdvertSaved,
}: {
  advert: AdvertDetails;
  className?: string;
  isAdvertSaved?: boolean;
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
    gender,
    category,
    images,
    location,
    createdAt,
    user,
    phone,
  } = advert;

  const { data: session } = useSession();
  const [isAdvertSaved, setIsAdvertSaved] = useState(initialIsAdvertSaved);

  const isOwner = session?.user.id === user.id;

  const saveAdvertMutation = api.advert.saveAdvert.useMutation();
  const unsaveAdvertMutation = api.advert.unsaveAdvert.useMutation();

  const handleSaveAdvert = async () => {
    await saveAdvertMutation.mutateAsync({ advertId: id });

    setIsAdvertSaved(true);
    advert.savedCount++;
  };

  const handleUnsaveAdvert = async () => {
    await unsaveAdvertMutation.mutateAsync({ advertId: id });

    setIsAdvertSaved(false);
    advert.savedCount--;
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex w-full items-center justify-between text-center">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {new Date(createdAt).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {/* {isOwner && (
                <EditAndDeleteAdvertButtonGroup
                  advertId={id}
                  isOwner={isOwner}
                />
              )} */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2 ">
          <div className="flex h-96 w-full items-center justify-center overflow-hidden rounded-md px-12">
            <Image
              src={
                images?.[0]?.url ??
                "https://st3.depositphotos.com/17828278/33150/v/450/depositphotos_331503262-stock-illustration-no-image-vector-symbol-missing.jpg"
              }
              alt={title}
              width={300}
              height={300}
              className="h-full w-full rounded-md"
            />
          </div>
          <div className="flex w-full flex-col space-y-4">
            <div className="flex items-center gap-4">
              <div>
                {user?.image ? (
                  <Avatar>
                    <AvatarImage src={user.image} />
                    <AvatarFallback>
                      {user.name?.[0]}
                      {user.surname?.[0]}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar>
                    <AvatarFallback>
                      {user.name?.[0]}
                      {user.surname?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className="w-full">
                <Label className="text-lg font-semibold">
                  {user.name} {user.surname}
                </Label>
                <div className="flex items-center justify-between gap-1 text-sm text-muted-foreground">
                  <Label className="text-sm">{user.email}</Label>
                  <Label className="text-sm">{phone}</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-center">
              {isFree ? (
                <Badge className="text-sm" variant={"success"}>
                  Ücretsiz
                </Badge>
              ) : (
                <Label className="text-3xl font-semibold">{price} TL</Label>
              )}

              <div className="flex items-center justify-center gap-1 text-xl">
                {savedCount}
                {isAdvertSaved ? (
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    onClick={handleUnsaveAdvert}
                  >
                    <BookmarkFilledIcon className="h-6 w-6" />
                  </Button>
                ) : (
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    onClick={handleSaveAdvert}
                  >
                    <BookmarkIcon className="h-6 w-6" />
                  </Button>
                )}
              </div>
            </div>

            <p
              className={cn(
                "text-sm text-muted-foreground",
                !description && "italic",
              )}
            >
              {description ? description : "açıklama yok"}
            </p>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-8">
                <Label className="w-12">Renk</Label>
                <p>:</p>
                <Badge variant={"default"}>{color}</Badge>
              </div>

              <div className="flex items-center gap-8">
                <Label className="w-12">Beden</Label>
                <p>:</p>

                <Badge variant={"info"}>{size}</Badge>
              </div>

              <div className="flex items-center gap-8">
                <Label className="w-12">Durum</Label>
                <p>:</p>

                <Badge variant={"outline"}>
                  {isUsed ? "2.El" : "Kullanılmamış"}
                </Badge>
              </div>

              <div className="flex items-center gap-8">
                <Label className="w-12">Cinsiyet</Label>
                <p>:</p>
                <Badge variant={"success"}>
                  {gender === "male" ? "Erkek" : "Kadın"}
                </Badge>
              </div>

              <div
                className={cn(
                  "flex items-center gap-8",
                  isChildCloth ? "flex" : "hidden",
                )}
              >
                <Label className="w-12">Uygun</Label>
                <p>:</p>

                <Badge variant={"warning"}>Çocuk</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertCardFullscreen;
