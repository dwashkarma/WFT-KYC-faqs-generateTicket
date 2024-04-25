import React, { ChangeEvent } from "react";

import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { faqCategories } from "@/raw-data/faqs";

type FilterValueState = {
  search: string;
  category: string;
};

type SearchFilterProps = {
  filterValue: FilterValueState;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCategoryChange: (event: SelectChangeEvent<string>) => void;
  handleFilter: () => void;
};

const SearchFilter = ({
  filterValue,
  handleSearchChange,
  handleCategoryChange,
  handleFilter,
}: SearchFilterProps) => {
  return (
    <div className="flex items-center justify-between gap-[10px]">
      <TextField
        size="small"
        sx={{ width: "30em" }}
        onChange={handleSearchChange}
        value={filterValue.search}
        placeholder="Search FAQs"
        InputProps={{
          sx: {
            borderRadius: "34px",
            padding: "4px 10px",
            fontSize: "18px",
            backgroundColor: "#F2FFFB",
            border: "none",
          },
          startAdornment: <Search />,
          disableUnderline: true,
        }}
      />
      <FormControl sx={{ width: "15em" }}>
        {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filterValue.category}
          // label="Age"
          onChange={handleCategoryChange}
          sx={{
            borderRadius: "34px",
          }}
        >
          {faqCategories?.map((categories, index) => (
            <MenuItem key={index} value={categories?.label}>
              {categories.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <button
        onClick={handleFilter}
        className="bg-naasa-green text-slate-50 rounded-[26px] py-[10px] px-[20px]"
      >
        Search
      </button> */}
    </div>
  );
};

export default SearchFilter;
