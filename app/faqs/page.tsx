"use client";

import React, { ChangeEvent, useState } from "react";
import SearchFilter from "./SearchFilter";
import FAQsAccordion from "./FAQsAccordion";
import { SelectChangeEvent } from "@mui/material";

const FaqsPage: React.FC = () => {
  const [filterValue, setFilterValue] = useState({
    search: "",
    category: "All Categories",
  });

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterValue({
      ...filterValue,
      search: event.target.value,
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setFilterValue({
      ...filterValue,
      category: event.target.value,
    });
  };

  const handleFilter = () => {
    console.log(filterValue);
  };

  return (
    <div className="flex  flex-col gap-[30px]">
      <span className="text-[40px] font-bold">
        Frequently Asked Questions (FAQ){" "}
      </span>
      <SearchFilter
        filterValue={filterValue}
        handleSearchChange={handleSearchChange}
        handleCategoryChange={handleCategoryChange}
        handleFilter={handleFilter}
      />
      <FAQsAccordion filterValue={filterValue} />
    </div>
  );
};

export default FaqsPage;
