"use client";

import useDebounce from "@/hooks/useDebounce";
import { useQuestionsByKeyword } from "@/lib/queries/questions";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@workspace/ui/components/input";

export default function QuestionSearch({ onClick }: { onClick?: () => void }) {
  const [searchValue, setSearchValue] = useState<string>("");
  const searchQuestion: string = useDebounce(searchValue, 300);
  const { data, isLoading } = useQuestionsByKeyword(searchQuestion);

  const handleChange = async (search: string) => {
    setSearchValue(search);
  };

  return (
    <div className="p-xs font-sans text-base">
      <Input
        className="bg-white p-lg text-base focus-visible:ring-blue-500"
        placeholder={"Got a doubt? Just search it"}
        type={"text"}
        onChange={(e) => handleChange(e.target.value)}
      />
      <div className="flex max-h-(--container-narrow) flex-col divide-y-2 overflow-auto">
        {!searchQuestion ? (
          <div className="flex h-(--container-narrow) items-center justify-center">
            <div className="text-center">
              Type something to begin your search.
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex h-(--container-narrow) items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : data?.length === 0 ? (
          <div className="flex h-(--container-narrow) items-center justify-center">
            <div className="text-center">No results for your search.</div>
          </div>
        ) : (
          data?.map((question, index) => (
            <Link
              key={index}
              className="p-sm"
              href={"/question/" + question?.value}
              onClick={onClick}
            >
              {question?.label}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
