"use client";

import useDebounce from "@/hooks/useDebounce";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  questionApi,
  useGetAllQuestionsByKeywordQuery,
} from "@/lib/store/questions/question";
import { skipToken } from "@reduxjs/toolkit/query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "../ui/input";

export default function QuestionSearch(): JSX.Element {
  const [searchValue, setSearchValue] = useState<string>("");
  const searchQuestion: string = useDebounce(searchValue, 300);
  const { data, isLoading } = useGetAllQuestionsByKeywordQuery(
    searchQuestion?.length ? searchQuestion : skipToken
  );
  const dispatch = useAppDispatch();
  const handleChange = async (search: string) => {
    setSearchValue(search);
    if (search) {
      dispatch(
        questionApi.util.updateQueryData(
          "getAllQuestionsByKeyword",
          undefined,
          () => {
            console.log("invalidate");

            return [];
          }
        )
      );
    }
  };

  console.log(data);
  return (
    <div className="font-montserrat text-base p-2">
      <Input
        className="bg-white focus-visible:ring-blue-500 p-5 text-base"
        placeholder={"Got a doubt? Just search it"}
        type={"text"}
        onChange={(e) => handleChange(e.target.value)}
      />
      <div className="divide-y-2 flex flex-col max-h-52 overflow-auto">
        {!searchQuestion ? (
          <div className="flex items-center justify-center h-52">
            <div>Type something to begin your search.</div>
          </div>
        ) : isLoading ? (
          <Loader2 className="animate-spin" />
        ) : data?.length === 0 ? (
          <div className="flex items-center justify-center h-52">
            <div>No results for your search.</div>
          </div>
        ) : (
          data?.map((question, index) => (
            <Link
              key={index}
              className="p-3 "
              href={"/question/" + question?.value}
            >
              {question?.label}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
