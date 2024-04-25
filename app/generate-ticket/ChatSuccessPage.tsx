import { CheckCircleOutline } from "@mui/icons-material";
import React from "react";

const ChatSuccessPage = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-10 h-[100%]">
      <div className="">
        <CheckCircleOutline sx={{ fontSize: "150px", color: "#20B78A" }} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl text-naasa-green font-semibold">
          Thank You !!
        </span>
        <span>You have successfully created your ticket</span>
      </div>
    </div>
  );
};

export default ChatSuccessPage;
