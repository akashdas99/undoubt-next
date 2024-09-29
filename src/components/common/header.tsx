"use client";
import Link from "next/link";
import SelectSearch from "./selectSearch";
import { useEffect, useState } from "react";
import { getQuestions } from "@/actions/getQuestions";
import useDebounce from "@/hooks/useDebounce";

const Header: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [data, setData] = useState<{ value: string; label: string }[]>();
  const searchQuestion = useDebounce(searchValue, 1500);
  const isLoading = false;
  useEffect(() => {
    const fn = async () => {
      const data = await getQuestions(searchQuestion);
      setData(
        data.map((question: { description: string; _id: string }) => ({
          label: question?.description,
          value: question?._id,
        }))
      );
    };
    fn();
  }, [searchQuestion]);

  const handleChange = async (search: string) => {
    setSearchValue(search);
  };
  return (
    <div className="flex items-center px-[10%] gap-[20px] h-[60px] bg-[--dark-background] text-white">
      <Link
        className="bg-blue-500 font-semibold rounded-tl-lg rounded-br-lg border-2 w-[82px] text-center"
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
      <div className="h-full flex items-center justify-between grow">
        <Link className="link" href="/">
          Home
        </Link>
        <Link className="link" href="/addquestion">
          Add Question
        </Link>
        <Link className="link" href="/signin">
          SignIn
        </Link>
        <Link className="link" href="/signup">
          SignUp
        </Link>
      </div>
    </div>
  );
};

export default Header;
