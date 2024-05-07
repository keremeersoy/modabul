import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/lib/utils";

const EditAndDeleteAdvertButtonGroup = ({
  advertId,
  isOwner,
  className,
}: {
  advertId: string;
  isOwner: boolean;
  className?: string;
}) => {
  const router = useRouter();
  const deleteAdvertMutation = api.advert.deleteAdvert.useMutation();

  const handleDeleteAdvert = async () => {
    const result = await deleteAdvertMutation.mutateAsync({ advertId });

    if (result) {
      toast({
        title: "Başarıyla ilanınızı sildiniz.",
        description: "İlanlarım sayfasından ilanlarınıza erişebilirsiniz.",
        variant: "success",
      });
      await router.push("/app/adverts/my-adverts");
    } else {
      toast({
        title: "Bir hata oluştu.",
        description: "Lütfen daha sonra tekrar deneyiniz.",
        variant: "destructive",
      });
    }
  };

  if (!isOwner) {
    return null;
  }

  return (
    <div className={cn("grid w-full grid-cols-2 gap-2 px-4", className)}>
      <Link href={`/app/adverts/edit/${advertId}`}>
        <Button
          variant="info"
          size="sm"
          className="flex w-full items-center justify-center gap-1"
        >
          <Pencil className="mr-2 h-5 w-5" />
          Düzenle
        </Button>
      </Link>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="flex w-full items-center justify-center gap-1"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            Sil
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>İlanı Sil</DialogTitle>
            <DialogDescription>
              İlanı silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">İptal</Button>
            </DialogClose>

            <Button variant="destructive" onClick={handleDeleteAdvert}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <Button
        variant="destructive"
        size="sm"
        className="flex w-full items-center justify-center gap-1"
        onClick={handleDeleteAdvert}
      >
        <Trash2 className="mr-2 h-5 w-5" />
        Sil
      </Button> */}
    </div>
  );
};

export default EditAndDeleteAdvertButtonGroup;
