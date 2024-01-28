import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createAdvertSchema, type CreateAdvertSchema } from "@/schemas/advert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import React from "react";
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

const CreateAdvertPage = () => {
  const router = useRouter();

  const createForm = useForm<CreateAdvertSchema>({
    resolver: zodResolver(createAdvertSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 1,
      size: "",
      gender: "",
      color: "",
      phone: "",
      isChildCloth: false,
      isFree: false,
      isUsed: true,
    },
  });

  const createAdvertMutation = api.advert.createAdvert.useMutation();

  const handleCreateAdvert = async (data: CreateAdvertSchema) => {
    // console.log("data", data);

    const result = await createAdvertMutation.mutateAsync(data);

    // console.log("result", result);

    if (result) {
      toast({
        title: "Başarıyla ilan oluşturdunuz.",
        description: "İlanlarım sayfasından ilanlarınıza erişebilirsiniz.",
        variant: "success",
      });
      void router.push("/app");
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
          <CardTitle>İlan Ver</CardTitle>
          <CardDescription>
            İnsanlarla yardımlaşmaya ve alışveriş yapmaya ilan oluşturarak
            başlayın!
          </CardDescription>
        </CardHeader>

        <Form {...createForm}>
          <form onSubmit={createForm.handleSubmit(handleCreateAdvert)}>
            <CardContent className="flex flex-col space-y-4">
              <FormField
                control={createForm.control}
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
                control={createForm.control}
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

              <div className="space-y-4 md:grid md:grid-cols-3 md:items-end md:space-x-4">
                <FormField
                  control={createForm.control}
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
                          disabled={createForm.getValues("isFree")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
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
                  control={createForm.control}
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
                  control={createForm.control}
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
                                      createForm.setValue("color", color.value);
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
                  control={createForm.control}
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
                                      createForm.setValue("size", size.value);
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
                  control={createForm.control}
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
                  control={createForm.control}
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
                  control={createForm.control}
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
                İlan Oluştur
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </MaxWidthWrapper>
  );
};

export default CreateAdvertPage;
