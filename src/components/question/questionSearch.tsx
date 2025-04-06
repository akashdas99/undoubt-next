"use client";

import useDebounce from "@/hooks/useDebounce";
import { useGetAllQuestionsByKeywordQuery } from "@/lib/store/questions/question";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SelectSearch from "../ui/selectSearch";

export default function QuestionSearch(): JSX.Element {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const searchQuestion = useDebounce(searchValue, 300);
  const router = useRouter();
  const { data, isFetching } = useGetAllQuestionsByKeywordQuery(searchQuestion);

  const handleChange = async (search: string) => {
    setSearchValue(search);
  };
  useEffect(() => {
    if (selectedValue) {
      router.push("/question/" + selectedValue);
      setSearchValue("");
    }
  }, [selectedValue]);

  return (
    <SelectSearch
      selectedValue={selectedValue}
      onSelectedValueChange={setSelectedValue}
      searchValue={searchValue}
      onSearchValueChange={handleChange}
      items={data ?? []}
      isLoading={isFetching}
      emptyMessage="No question found."
    />
  );
}
