"use client";

import useDebounce from "@/hooks/useDebounce";
import { useGetAllQuestionsByKeywordQuery } from "@/lib/store/questions/questionApi";
import { useState } from "react";
import SelectSearch from "../ui/selectSearch";

export default function QuestionSearch(): JSX.Element {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const searchQuestion = useDebounce(searchValue, 1500);

  const { data, isLoading } = useGetAllQuestionsByKeywordQuery(searchQuestion);

  const handleChange = async (search: string) => {
    setSearchValue(search);
  };
  return (
    <SelectSearch
      selectedValue={selectedValue}
      onSelectedValueChange={setSelectedValue}
      searchValue={searchValue}
      onSearchValueChange={handleChange}
      items={data ?? []}
      isLoading={isLoading}
      emptyMessage="No question found."
    />
  );
}
