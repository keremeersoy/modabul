import React from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import { createAnswerSchema, CreateAnswerSchema } from "@/schemas/advert";
import { zodResolver } from "@hookform/resolvers/zod";

const AnswerTheQuestion = ({
  questionId,
  onCreateSuccess,
}: {
  questionId: string;
  onCreateSuccess: () => void;
}) => {
  const createAnswerMutation = api.advert.createAdvertAnswer.useMutation({
    onSuccess: () => {
      onCreateSuccess();
    },
  });

  const createAnswerForm = useForm<CreateAnswerSchema>({
    resolver: zodResolver(createAnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleCreateAnswer = async (data: CreateAnswerSchema) => {
    console.log("data", data);

    const result = await createAnswerMutation.mutateAsync({
      content: data.content,
      questionId: questionId,
    });

    console.log("result", result);
  };

  return (
    <div className="mt-4 w-full">
      <Form {...createAnswerForm}>
        <form onSubmit={createAnswerForm.handleSubmit(handleCreateAnswer)}>
          <FormField
            control={createAnswerForm.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    id="content"
                    placeholder="Ürün hakkında sorulan soruya cevap verin..."
                    maxLength={500}
                    className="mb-2"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" variant={"purple"}>
              Cevapla
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerTheQuestion;
