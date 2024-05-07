import { CreateAdvertSchema, createAdvertSchema } from "@/schemas/advert";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import MaxWidthWrapper from "./max-width-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { CldUploadButton, CldUploadWidget } from "next-cloudinary";
import { UploadCloudIcon } from "lucide-react";
import NextImage from "next/image";

const sizes = [
  { label: "XS", value: "xs" },
  { label: "S", value: "s" },
  { label: "M", value: "m" },
  { label: "L", value: "l" },
  { label: "XL", value: "xl" },
  { label: "XXL", value: "xxl" },
];

const colors = [
  { label: "Siyah", value: "siyah" },
  { label: "Beyaz", value: "beyaz" },
  { label: "Kırmızı", value: "kırmızı" },
  { label: "Mavi", value: "mavi" },
  { label: "Yeşil", value: "yeşil" },
  { label: "Sarı", value: "sarı" },
  { label: "Turuncu", value: "turuncu" },
  { label: "Mor", value: "mor" },
  { label: "Pembe", value: "pembe" },
  { label: "Gri", value: "gri" },
];

const EditAdvertComponent = ({
  advertId,
  advert,
}: {
  advertId: string | string[];
  advert: CreateAdvertSchema;
}) => {
  const router = useRouter();

  const editForm = useForm<CreateAdvertSchema>({
    resolver: zodResolver(createAdvertSchema),
    defaultValues: advert,
  });

  const editAdvertMutation = api.advert.editAdvert.useMutation();

  const handleEditAdvert = async (data: CreateAdvertSchema) => {
    const result = await editAdvertMutation.mutateAsync({
      advertId: advertId as string,
      ...data,
    });

    if (result) {
      toast({
        title: "Başarıyla ilan düzenlediniz.",
        description: "İlanlarım sayfasından ilanlarınıza erişebilirsiniz.",
        variant: "success",
      });
      void router.push("/app/adverts/my-adverts");
    } else {
      toast({
        title: "Bir hata oluştu.",
        description: "Lütfen daha sonra tekrar deneyiniz.",
        variant: "destructive",
      });
    }
  };

  return (
    <MaxWidthWrapper>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>İlanı Düzenle</CardTitle>
          <CardDescription>
            İlanınızı düzenleyebilir ve güncelleyebilirsiniz.
          </CardDescription>
        </CardHeader>

        <Form {...editForm}>
          <form onSubmit={editForm.handleSubmit(handleEditAdvert)}>
            <CardContent className="flex flex-col space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İlan Başlığı</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        id="title"
                        type="text"
                        placeholder="Mavi Temiz Tişört"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İlan Açıklaması</FormLabel>

                    <FormControl>
                      <Textarea
                        {...field}
                        id="description"
                        placeholder="İlanınızın açıklamasını yazınız."
                        maxLength={500}
                        className="h-32 resize-none"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* image upload will be added here */}
              <FormField
                control={editForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ürün Fotoğrafı</FormLabel>

                    <FormControl>
                      <div>
                        <CldUploadButton
                          uploadPreset="cjdkz8j1"
                          onSuccess={(result) => {
                            if (typeof result.info !== "string") {
                              editForm.setValue(
                                "imageUrl",
                                result.info?.secure_url ?? "",
                              );
                            }
                          }}
                          options={{
                            maxFiles: 1,
                            maxFileSize: 5000000,
                            multiple: false,
                            sources: ["local", "camera"],
                          }}
                        >
                          {editForm.getValues("imageUrl") ? (
                            <NextImage
                              src={editForm.getValues("imageUrl")!}
                              alt="uploaded image"
                              width={350}
                              height={350}
                            />
                          ) : (
                            <div className="inline-flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                              <UploadCloudIcon className="mr-2 h-4 w-4 shrink-0" />
                              Yükle
                            </div>
                          )}
                        </CldUploadButton>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4 md:grid md:grid-cols-3 md:items-end md:space-x-4">
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fiyat</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          id="price"
                          type="number"
                          placeholder="0"
                          disabled={editForm.getValues("isFree")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border px-3 py-1 shadow-sm">
                      <FormLabel>Ücretsiz</FormLabel>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          id="phone"
                          type="number"
                          placeholder="5554443322"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4 md:grid md:grid-cols-3 md:items-end md:space-x-4">
                <FormField
                  control={editForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-3">
                      <FormLabel>Renk</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? colors.find(
                                      (color) => color.value === field.value,
                                    )?.label
                                  : "Renk Seçiniz"}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent>
                            <Command>
                              <CommandInput
                                placeholder="Renk ara"
                                className="w-full"
                              />
                              <CommandEmpty>
                                Aradığınız renk bulunamadı.
                              </CommandEmpty>
                              <CommandGroup>
                                {colors.map((color) => (
                                  <CommandItem
                                    value={color.label}
                                    key={color.value}
                                    onSelect={() => {
                                      editForm.setValue("color", color.value);
                                    }}
                                  >
                                    {color.label}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        color.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-3">
                      <FormLabel>Beden</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? sizes.find(
                                      (size) => size.value === field.value,
                                    )?.label
                                  : "Beden Seçiniz"}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent>
                            <Command>
                              <CommandInput
                                placeholder="Beden ara"
                                className="w-full"
                              />
                              <CommandEmpty>
                                Aradığınız beden bulunamadı.
                              </CommandEmpty>
                              <CommandGroup>
                                {sizes.map((size) => (
                                  <CommandItem
                                    value={size.label}
                                    key={size.value}
                                    onSelect={() => {
                                      editForm.setValue("size", size.value);
                                    }}
                                  >
                                    {size.label}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        size.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cinsiyet</FormLabel>

                      <FormControl className="py-2">
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal">Erkek</FormLabel>
                          </FormItem>

                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal">Kadın</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4 md:grid md:grid-cols-2 md:items-end md:space-x-4">
                <FormField
                  control={editForm.control}
                  name="isChildCloth"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border px-3 py-1 shadow-sm">
                      <FormLabel>Çocuk Eşyası</FormLabel>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="isUsed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border px-3 py-1 shadow-sm">
                      <FormLabel>İkinci El</FormLabel>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant="success"
                type="submit"
                // disabled={registerMutation.isLoading}
              >
                İlanı Düzenle
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </MaxWidthWrapper>
  );
};

export default EditAdvertComponent;
