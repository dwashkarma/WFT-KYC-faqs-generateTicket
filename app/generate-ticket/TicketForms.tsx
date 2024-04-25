import { CiInstance } from "@/config/axios";
import {
  AccountCircle,
  CheckCircle,
  PhoneInTalk,
  EmailRounded,
} from "@mui/icons-material";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";

type TicketFormProps = {
  isExistingClient: Boolean;
  clientPhoneNumber: string;
  clientEmail: string;
  otp: any;
  clientName: any;
  sessionId: string | null | undefined;
  // setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleTicketCreation: () => void;
};

const TicketForms: React.FC<TicketFormProps> = ({
  isExistingClient,
  clientPhoneNumber,
  clientEmail,
  otp,
  sessionId,
  clientName,
  // setCurrentStep,
  handleTicketCreation,
}) => {
  const [issueList, setIssueList] = useState([]);
  const [subIssueList, setSubIssueList] = useState([]);
  const [inputValue, setInputValue] = useState({
    clientName: "",
    issue: "",
    subIssue: "",
    remarks: "",
  });
  const [existingClientDetails, setExistingClientDetails]: any = useState();
  const [createTicketData, setCreateTicketData] = useState({
    isLoading: false,
    status: "",
  });

  // api to fetch issues
  const fetchIssues = async () => {
    try {
      const response = await CiInstance.get("/client/issue");
      if (response) {
        setIssueList(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //api call to create ticket
  const createTicket = async (payload: any) => {
    setCreateTicketData({ ...createTicketData, isLoading: true });
    try {
      const response = await CiInstance.post("/client/createTicket", payload);
      if (response) {
        setCreateTicketData({ isLoading: false, status: "success" });
        setTimeout(() => {
          // setCurrentStep(0);
          handleTicketCreation();
        }, 2000);
      }
    } catch (error) {
      setCreateTicketData({ isLoading: false, status: "failure" });
      console.log(error);
    }
  };

  const fetchClientDetails = async () => {
    try {
      const response = await axios.get(
        // `https://kyc.naasasecurities.com.np/api/kyc/GetByPhoneNo?phoneno=${clientPhoneNumber}`,
        // `https://kyc.naasasecurities.com.np/api/kyc/GetByEmail?email=${clientEmail}`,
        `https://naasa-kyc-api.waterflowtechnology.net/api/NaasaWeb/get-client-masking?clientInfo=${
          clientPhoneNumber || clientEmail
        }`,
        {
          headers: {
            Authorization: "Basic bmFhc2FhcGk6cEpSMlliVTBpSVpadlJoQ0J1amg=",
          },
        }
      );
      setExistingClientDetails(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, [event.target.name]: event.target.value });
  };

  const handleIssueSelect = (event: SelectChangeEvent<string>) => {
    setInputValue({ ...inputValue, issue: event.target.value });
    const filteredSubIssue: any = issueList?.find(
      (issue: any) => issue?._id === event.target.value
    );
    if (filteredSubIssue) {
      setSubIssueList(filteredSubIssue?.sub_issues);
    }
  };

  const handleSubIssueSelect = (event: SelectChangeEvent<string>) => {
    setInputValue({ ...inputValue, subIssue: event.target.value });
  };

  const handleGenerateTicket = () => {
    let payload = {
      clientName: clientName.firstname,
      clientPhone: clientPhoneNumber,
      clientEmail: clientEmail,
      remarks: inputValue.remarks,
      issue: inputValue.issue,
      sub_issue: inputValue.subIssue,
      otp: otp.join(""),
      session_id: sessionId ? sessionId : "",
    };
    createTicket(payload);
  };

  // function call to fetch issues when component mounts
  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    if (isExistingClient || clientPhoneNumber || clientEmail) {
      fetchClientDetails();
    }
  }, [isExistingClient, clientPhoneNumber, clientEmail]);

  return (
    <div className="flex flex-col gap-4">
      {/* && existingClientDetails */}
      {isExistingClient && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AccountCircle />
            <span className="font-bold">
              {clientName?.firstname}

              {/* {existingClientDetails?.clientId} */}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {clientName?.contactNumber ? (
              <>
                <PhoneInTalk />
                {/* Phone Number */}
                {/* <span>{clientPhoneNumber}</span> */}
                <span>{clientName?.contactNumber}</span>
              </>
            ) : (
              // Render email if clientPhoneNumber is not present
              <>
                <EmailRounded />
                {/* <span>{clientEmail}</span> */}
              </>
            )}
          </div>
        </div>
      )}
      {!isExistingClient && (
        <div className="flex flex-col">
          <span className="text-sm">Client Name</span>
          <TextField
            // label="Client Name"
            size="small"
            value={inputValue.clientName}
            onChange={handleInputValueChange}
            name="clientName"
            // onKeyDown={handleEnter}
            // error={validationErrors?.phoneNumber ? true : false}
            // helperText={validationErrors?.phoneNumber}
            InputProps={{
              sx: {
                backgroundColor: "rgba(32,183,138,0.2)",
                padding: "5px",
                borderRadius: "10px",
              },
              // disableUnderline: true,
            }}
            variant="outlined"
          />
        </div>
      )}
      <div className="w-100 flex flex-col">
        <span className="text-sm">Issue Category</span>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={inputValue.issue}
          name="transactionType"
          size="small"
          onChange={handleIssueSelect}
          sx={{
            backgroundColor: "rgba(32,183,138,0.2)",
            padding: "5px",
            borderRadius: "10px",
          }}
        >
          {issueList &&
            issueList?.length > 0 &&
            issueList?.map((issue: any, index) => (
              <MenuItem key={index} value={issue?._id}>
                {issue?.name}
              </MenuItem>
            ))}
        </Select>
      </div>
      {subIssueList?.length > 0 && (
        <div className="w-100 flex flex-col">
          <span className="text-sm">Sub Issue</span>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            size="small"
            value={inputValue.subIssue}
            name="transactionType"
            onChange={handleSubIssueSelect}
            sx={{
              backgroundColor: "rgba(32,183,138,0.2)",
              padding: "5px",
              borderRadius: "10px",
            }}
          >
            {subIssueList?.map((subIssue: any, index) => (
              <MenuItem key={index} value={subIssue?._id}>
                {subIssue?.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      )}
      <div className="w-100 flex flex-col">
        <span className="text-sm">Remarks</span>
        <TextField
          id="outlined-multiline-static"
          value={inputValue.remarks}
          onChange={handleInputValueChange}
          name="remarks"
          multiline
          rows={3}
          InputProps={{
            sx: {
              backgroundColor: "rgba(32,183,138,0.2)",
              padding: "5px",
              borderRadius: "10px",
            },
          }}
        />
      </div>
      {createTicketData?.status === "success" ? (
        <span className="text-naasa-green flex gap-2">
          Ticket created successfully
          <CheckCircle />
        </span>
      ) : createTicketData?.status === "failure" ? (
        <span className="text-red-500">
          Error creating ticket please try again
        </span>
      ) : (
        ""
      )}
      <button
        className="bg-naasa-yellow rounded py-[10px] px-[20px] text-[13px] font-semibold"
        onClick={handleGenerateTicket}
        disabled={createTicketData?.isLoading}
      >
        {createTicketData?.isLoading ? (
          <CircularProgress size={20} />
        ) : (
          "Generate Ticket"
        )}
      </button>
    </div>
  );
};

export default TicketForms;
