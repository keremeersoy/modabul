import React from "react";
import CreateQuestion from "./create-question";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import AnswerTheQuestion from "./advert-answer-the-question";

const AdvertQuestionsArea = ({
  advertOwnerId,
  advertId,
}: {
  advertOwnerId: string;
  advertId: string | string[];
}) => {
  const { data: session } = useSession();

  const {
    data: questions,
    isLoading,
    error,
    refetch,
  } = api.advert.getAdvertQuestionsAndAnswers.useQuery({
    advertId: advertId as string,
  });

  if (!session) return null;

  return (
    <div>
      <h1 className="my-8 text-center text-3xl font-semibold">Sorular</h1>

      {session?.user.id !== advertOwnerId && (
        <CreateQuestion advertId={advertId} onCreateSuccess={refetch} />
      )}

      <div className="mt-8 flex flex-col gap-4">
        {questions?.map((question) => (
          <Card key={question.id}>
            <CardContent className="p-4">
              <div>
                <div className="flex gap-2">
                  <div>
                    <Avatar className="h-8 w-8">
                      {question.user?.image && (
                        <AvatarImage src={question.user.image} />
                      )}
                      <AvatarFallback>
                        {question.user.name?.[0]}
                        {question.user.surname?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <Label className="text-sm italic text-gray-600 dark:text-gray-400">
                    {question.user.name} {question.user.surname}
                  </Label>
                </div>
                <div className="ml-10 text-sm">
                  <p>{question.content}</p>
                </div>
              </div>

              {!question.answer && session?.user.id === advertOwnerId && (
                <AnswerTheQuestion
                  questionId={question.id}
                  onCreateSuccess={refetch}
                />
              )}

              {question.answer && (
                <Card className="ml-8 mt-4 bg-gray-100 dark:bg-gray-900">
                  <CardContent className="p-4 text-sm">
                    <Label className="text-sm italic text-gray-600 dark:text-gray-400">
                      Satıcı
                    </Label>
                    <p>{question.answer.content}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdvertQuestionsArea;
