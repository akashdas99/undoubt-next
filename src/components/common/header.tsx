"use client";
import useDebounce from "@/hooks/useDebounce";
import { useGetAllQuestionsByKeywordQuery } from "@/lib/store/questions/questionApi";
import Link from "next/link";
import { useState } from "react";
import SelectSearch from "./selectSearch";

const Header: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const searchQuestion = useDebounce(searchValue, 1500);

  const { data, isLoading } = useGetAllQuestionsByKeywordQuery(searchQuestion);

  const handleChange = async (search: string) => {
    setSearchValue(search);
  };
  return (
    <div className="flex items-center px-[10%] gap-[20px] h-[60px] bg-[--dark-background] text-white">
      <Link
        className="bg-blue-500 font-semibold rounded-tl-lg rounded-br-lg border-2 px-2 text-center"
        href="/"
      >
        UNdoubt
      </Link>
      <SelectSearch
        selectedValue={selectedValue}
        onSelectedValueChange={setSelectedValue}
        searchValue={searchValue}
        onSearchValueChange={handleChange}
        items={data ?? []}
        isLoading={isLoading}
        emptyMessage="No question found."
      />
      <div className="h-full flex items-center justify-end gap-8">
        <Link className="link" href="/">
          Home
        </Link>
        <Link className="link" href="/addquestion">
          Add Question
        </Link>
        <Link className="link" href="/signin">
          Sign In
        </Link>
        <Link className="link" href="/register">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Header;
