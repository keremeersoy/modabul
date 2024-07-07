import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateQuestionSchema, createQuestionSchema } from "@/schemas/advert";
import { Button } from "./ui/button";
import { api } from "@/utils/api";
import { toast } from "./ui/use-toast";

const CreateQuestion = ({
  advertId,
  onCreateSuccess,
}: {
  advertId: string | string[];
  onCreateSuccess: () => void;
}) => {
  const createQuestionMutation = api.advert.createAdvertQuestion.useMutation({
    onSuccess: () => {
      onCreateSuccess(); // Soru başarıyla oluşturulduğunda onCreateSuccess fonksiyonunu çağır
    },
  });

  const createQuestionForm = useForm<CreateQuestionSchema>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleCreateQuestion = async (data: CreateQuestionSchema) => {
    const result = await createQuestionMutation.mutateAsync({
      content: data.content,
      advertId: advertId as string,
    });

    if (result) {
      toast({
        title: "Başarıyla soru oluşturdunuz.",
        variant: "success",
      });
      createQuestionForm.reset(); // Formu sıfırla
    } else {
      toast({
        title: "Bir hata oluştu.",
        description: "Lütfen daha sonra tekrar deneyiniz.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2>Satıcıya Soru Sor</h2>
      </CardHeader>

      <Form {...createQuestionForm}>
        <form onSubmit={createQuestionForm.handleSubmit(handleCreateQuestion)}>
          <CardContent>
            <FormField
              control={createQuestionForm.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="content"
                      placeholder="Satıcıya ürün hakkında soru sorun ve detayları elde edin..."
                      maxLength={500}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" variant={"purple"}>
              Soruyu Gönder
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CreateQuestion;
