"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchSuggestion } from "@/lib/fetchSuggestion";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoarsStore";
const Header = () => {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);
    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);

      setSuggestion(suggestion);
      setLoading(false);
    };
    fetchSuggestionFunc();
  }, [board]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl ">
        <div className="absolute top-0 left-0 w-full h-96  bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50 " />
        <Image
          src="https://links.papareact.com/c2cdd5"
          alt="logo"
          height={100}
          width={300}
          className="w-44 md:w-55 pb-10 md:pb-0 object-contain"
        />
        <div className="flex items-center space-x-5 flex-1 justify-end w-full ">
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial ">
            <MagnifyingGlassIcon className="h-6 w-6 texxt-gray-400 " />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2  "
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden>
              search
            </button>
          </form>
          <Avatar name="Gowrish Kotari " size="50" round color="#0055D1" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-5  py-2 md:py-5 ">
        <p className="w-full p-5 flex items-center text-sm font-light pr-5 shadow-xl rounded-xl bg-white italic max-w-3xl text-[#0050D1] ">
          <UserCircleIcon
            className={`inline-block h-10 w-10 text-[#0050D1] mr-1 ${
              loading && "animate-spin"
            } `}
          />
          {suggestion && !loading
            ? suggestion
            : "GPT is summerising your data  for the day"}
        </p>
      </div>
    </header>
  );
};

export default Header;
