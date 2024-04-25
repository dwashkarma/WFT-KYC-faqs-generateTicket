"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
// import ChatSuccessPage from "./ChatSuccessPage";
import {
  TextField,
  InputAdornment,
  Radio,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { Mail, Smartphone } from "@mui/icons-material";
import { CiInstance, kycInstance } from "@/config/axios";
import TicketForms from "./TicketForms";
import axios from "axios";
import jwt from "jsonwebtoken";

type ValidationErrors = {
  phoneNumber: string | null;
  email: string | null;
};

type GenerateTicketProps = {
  sessionId: string | null | undefined;
  handleTicketSubmition: () => void;
};

interface UserInfo {
  firstname: string;
  lastname: string;
  exp: number;
  contactNumber: string;
}
const GenerateTicketPage: React.FC<GenerateTicketProps> = ({
  sessionId,
  handleTicketSubmition,
}) => {
  //tracking ticket creation steps
  const [currentStep, setCurrentStep] = useState(0);
  // 0 is for sms and 1 is for email
  const [validationType, setValidationType] = useState(0);
  const [showTicketForms, setShowTicketForms] = useState(false);
  const [isExistingClient, setIsExistingClient] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [userDetail, setUserDetail] = useState({});

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    phoneNumber: null,
    email: null,
  });

  // const [verificationScreen, setVerificationScreen] = useState(false);
  const [isValidateClient, setIsValidateClient] = useState({
    loading: false,
    status: "",
  });
  const [otp, setOTP] = useState(["", "", "", ""]);
  const [validateOtp, setValidateOtp] = useState({
    loading: false,
    status: "",
    response: "",
  });

  //Check the token and access to the TicketForm
  useEffect(() => {
    const Auth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = jwt.decode(token) as UserInfo;
          console.log(user);

          if (user) {
            setCurrentStep(1);
            setUserDetail(user);
            setPhoneNumber(user.contactNumber);

            setIsExistingClient(true);
          }
        } catch (err) {
          console.error("Error decoding JWT:", err);
        }
      }
    };
    Auth();
  }, []);
  console.log(userDetail);

  useEffect(() => {
    console.log(userDetail);
  }, [userDetail]);
  //Client Verification
  const validateClient = async (payload: any) => {
    setIsValidateClient({
      ...isValidateClient,
      loading: true,
    });

    try {
      const res = await CiInstance.post("/client/generateOTP", payload);
      if (res) {
        setIsValidateClient({
          status: "success",
          loading: false,
        });
        // setTimeout(() => {
        //   setCurrentStep(1);
        // }, 2000);
      }
    } catch (error) {
      setIsValidateClient({
        status: "failure",
        loading: false,
      });
      console.log(error);
    }
  };

  // validate OTP
  const validateOTP = async (payload: any) => {
    setValidateOtp({
      ...validateOtp,
      loading: true,
    });
    try {
      const response = await CiInstance.post("/client/validateOtp", payload);
      if (response) {
        setValidateOtp({
          loading: false,
          status: "success",
          response: "",
        });
        setShowTicketForms(true);
        setCurrentStep(1);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setValidateOtp({
          loading: false,
          status: "failure",
          response: error.response.data.message,
        });
      } else {
        setValidateOtp({
          loading: false,
          status: "failure",
          response: "An unexpected error occurred, please try again",
        });
      }
    }
  };

  // handle otp field change
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    // Ensure the value is a number and has a length of 1
    if (/^[0-9]$/.test(value) && value.length === 1) {
      const updatedOTP = [...otp];
      updatedOTP[index] = value;
      setOTP(updatedOTP);

      // If the input has a value, focus on the next input
      if (index < 3 && value) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
      if (index === 3 && updatedOTP.every((digit) => digit !== "")) {
        // All OTPs have been entered, make the API call here

        const otpValue = updatedOTP.join(""); // Concatenate the OTP digits
        let payload;
        if (validationType == 0) {
          payload = {
            clientPhone: phoneNumber,
            otp: otpValue,
          };
        } else {
          payload = {
            clientEmail: email,
            otp: otpValue,
          };
        }
        validateOTP(payload);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // Prevent the default behavior

      if (index === 0) {
        // If it's the first input, clear it
        const updatedOTP = Array.from({ length: otp.length }, (_, i) =>
          i === 0 ? "" : otp[i]
        );
        setOTP(updatedOTP);
      } else {
        // If it's not the first input, clear the current input and move focus to the previous one
        const updatedOTP = [...otp];
        updatedOTP[index] = "";
        setOTP(updatedOTP);

        if (index > 0) {
          const prevInput = document.getElementById(`otp-input-${index - 1}`);
          if (prevInput) {
            prevInput.focus();
          }
        }
      }
    }
  };

  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event?.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event?.target?.value);
  };

  const validatePhoneNumber = (value: string) => {
    const phoneNumberRegex = /^[0-9]{10}$/; // regex for a 10-digit phone number
    return phoneNumberRegex.test(value);
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // regex for email validation
    return emailRegex.test(value);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleCheckClient();
    }
  };

  //handle function after ticket creation
  const handleTicketCreation = () => {
    setCurrentStep(0);
    setIsExistingClient(false);
    setIsValidateClient({
      ...isValidateClient,
      status: "",
    });
    setShowTicketForms(false);
    setPhoneNumber("");
    setEmail("");
    setOTP(["", "", "", ""]);
    handleTicketSubmition();
  };

  const handleCheckClient = async () => {
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);
    const isEmailValid = validateEmail(email);

    setValidationErrors({
      phoneNumber: isPhoneNumberValid ? null : "Enter a valid phone number",
      email: isEmailValid ? null : "Enter a valid email",
    });

    let payload;
    if (isPhoneNumberValid || isEmailValid) {
      try {
        const response = await kycInstance.get(
          `/NaasaWeb/get-client-masking?${
            validationType == 0
              ? `clientInfo=${phoneNumber}`
              : `clientInfo=${email}`
          }`
        );
        if (response.status === 200) {
          setIsValidateClient({
            status: "success",
            loading: false,
          });

          setIsExistingClient(true);
        }

        if (validationType === 0 && isPhoneNumberValid) {
          payload = {
            clientPhone: phoneNumber,
          };
        } else if (validationType === 1 && isEmailValid) {
          payload = {
            clientEmail: email,
          };
        }
      } catch (error: any) {
        console.log(error?.response);
        if (error?.response.status == 400) {
          setIsValidateClient({
            ...isValidateClient,
            loading: false,
          });
          payload =
            validationType === 0
              ? { clientPhone: phoneNumber }
              : { clientEmail: email };
        }
      }

      validateClient(payload);
    }
  };

  if (isExistingClient) {
    <TicketForms
      isExistingClient={isExistingClient}
      clientPhoneNumber={phoneNumber}
      clientEmail={email}
      otp={otp}
      clientName={userDetail}
      sessionId={sessionId}
      // setCurrentStep={setCurrentStep}
      handleTicketCreation={handleTicketCreation}
    />;
  }

  return (
    <div className="flex flex-col p-5 gap-5 max-sm:mt-12 md:w-[35rem]">
      <div className="flex items-center place-content-center  ">
        <Image src="/images/Bot.png" alt="botlogo" height="100" width="100" />
        <span className="text-center   italic font-semibold">
          Hi! Generate your support ticket here
        </span>
      </div>

      {currentStep === 0 ? (
        <>
          {showTicketForms ? (
            // Do not render anything when Ticket Forms are to be displayed
            <> </>
          ) : (
            <div className="flex flex-col gap-1">
              {validationType === 0 ? (
                <TextField
                  id="input-with-icon-textfield"
                  placeholder="Enter your Phone number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  onKeyDown={handleEnter}
                  error={validationErrors?.phoneNumber ? true : false}
                  helperText={validationErrors?.phoneNumber}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Smartphone />
                      </InputAdornment>
                    ),
                    sx: {
                      backgroundColor: "rgba(32,183,138,0.2)",
                      padding: "5px",
                      borderRadius: "10px",
                    },
                    disableUnderline: true,
                  }}
                  variant="standard"
                />
              ) : (
                <TextField
                  id="input-with-icon-textfield"
                  placeholder="Enter your Email address"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyDown={handleEnter}
                  type="email"
                  error={validationErrors?.email ? true : false}
                  helperText={validationErrors?.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail />
                      </InputAdornment>
                    ),
                    sx: {
                      backgroundColor: "rgba(32,183,138,0.2)",
                      padding: "5px",
                      borderRadius: "10px",
                    },
                    disableUnderline: true,
                  }}
                  variant="standard"
                />
              )}
              {validationType === 0 ? (
                <span
                  className="cursor-pointer hover:text-naasa-green text-sm"
                  onClick={() => setValidationType(1)}
                >
                  Use Email instead ?
                </span>
              ) : (
                <span
                  className="cursor-pointer hover:text-naasa-green text-sm"
                  onClick={() => setValidationType(0)}
                >
                  Use Phone Number Instead ?
                </span>
              )}
            </div>
          )}
          <div className="flex flex-col gap-1">
            {/* Previously Check Mark Added to set isExistingClient */}
            {/* <div className="flex justify-end items-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={isExistingClient}
                      onChange={() => setIsExistingClient(!isExistingClient)}
                    />
                  }
                  label="Existing Client?"
                />
              </div> */}
            <button
              className="bg-naasa-yellow rounded py-[10px] px-[20px] text-[13px] font-semibold"
              onClick={handleCheckClient}
              disabled={isValidateClient.loading}
            >
              {isValidateClient.loading ? (
                <CircularProgress size={20} />
              ) : isValidateClient.status === "success" ? (
                "Resend Verification Code"
              ) : (
                "Verify"
              )}
            </button>
            {/* Screen that displays the OTP enter screen */}
            <div className="flex flex-col gap-5 justify-center items-center">
              {isValidateClient.status === "success" ? (
                <>
                  <span className="text-naasa-green">
                    OTP Successfully sent !!
                  </span>
                  <div className="flex">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="number"
                        maxLength={1}
                        className="w-12 h-12 text-3xl mx-2 text-center border border-gray-300 rounded focus:outline-none focus:border-blue-500 no-number-arrows"
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    ))}
                  </div>
                  <div className="">
                    {validateOtp.loading ? (
                      <span className="text-sm text-gray-500">
                        Verifying...
                      </span>
                    ) : validateOtp.status === "failure" ? (
                      <span className="text-sm text-red-500">
                        {validateOtp.response}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : isValidateClient.status === "failure" ? (
                <span className="text-red-500">
                  Error Sending OTP, please try again
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      ) : (
        //TicketForms shown when isExistingClient is false
        <TicketForms
          isExistingClient={isExistingClient}
          clientPhoneNumber={phoneNumber}
          clientEmail={email}
          otp={otp}
          clientName={userDetail}
          sessionId={sessionId}
          // setCurrentStep={setCurrentStep}
          handleTicketCreation={handleTicketCreation}
        />
      )}
    </div>
  );
};

export default GenerateTicketPage;
