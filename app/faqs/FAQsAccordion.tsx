import React, { useEffect, useState } from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";

import { faqsList } from "@/raw-data/faqs";
import { Add, Remove } from "@mui/icons-material";
import { title } from "process";

type FilterValueState = {
  search: string;
  category: string;
};

type FAQsAccordionProps = {
  filterValue: FilterValueState;
};

const FAQsAccordion = ({ filterValue }: FAQsAccordionProps) => {
  const [faqData, setFaqData] = useState(faqsList);
  const [activeAccordion, setActiveAccordion] = useState(
    Array(faqData.length).fill(false)
  );

  const [error, setError] = useState(false);

  useEffect(() => {
    const filteredData = faqsList.filter((item) => {
      const titleContainsSearch = item.title
        .toLowerCase()
        .includes(filterValue.search.toLowerCase());

      //Search the "Content" inside the Array
      const contentSearch = item.content
        .toLowerCase()
        .includes(filterValue.search.toLowerCase());

      //Search the description inside the nested object named:steps;
      const desContent = item.steps
        ?.map((element) => {
          return element?.description;
        })
        .toLocaleString()
        .toLowerCase()
        .includes(filterValue.search.toLocaleLowerCase());

      const categoryMatches =
        filterValue.category.toLowerCase() === "all categories" ||
        item.category.toLowerCase() === filterValue.category.toLowerCase();
      return (
        (titleContainsSearch && categoryMatches) ||
        (contentSearch && categoryMatches) ||
        desContent
      );
    });

    setFaqData(filteredData);
  }, [filterValue]);

  function RenderAnswer({ text }: { text: string }) {
    // Check if the answer contains an <b> tag using a regex
    const hasBoldTag = /<b\b[^>]*>(.*?)<\/b>/i.test(text);
    // Check if the answer contains an <b> tag using a regex
    const hasBreakTag = /<br\s*\/?>/i.test(text);
    // Check if the answer contains an <a> tag with href and target attributes using a regex
    const hasAnchorTag = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*\/?>/i.test(
      text
    );

    if (hasBoldTag || hasBreakTag || hasAnchorTag) {
      // If <a> or <b></b> or <br> tag is present, render the text using dangerouslySetInnerHTML
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: text
              .replace(/<b\b[^>]*>/i, '<b style="font-weight: bold;">')
              .replace(/<br\s*\/?>/i, "<br>")
              .replace(/<\/a>/i, "</a>")
              .replace(/<\/b>/i, "</b>")
              .replace(
                /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*\/?>/i,
                `<a href="$2" target="_blank" style="color: blue; text-decoration: underline; cursor:pointer">`
              ),
          }}
        />
      );
    } else {
      // If no <a> or <b> or <br> tag, render the text as plain text
      return <span>{text}</span>;
    }
  }

  const toggleAccordion = (index: number) => {
    const newActiveAccordion = [...activeAccordion];
    newActiveAccordion[index] = !newActiveAccordion[index];
    setActiveAccordion(newActiveAccordion);
  };

  return (
    <div>
      {faqData?.map((faqs, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={
              activeAccordion[index] ? <Remove color="primary" /> : <Add />
            }
            aria-controls="panel1a-content"
            id="panel1a-header"
            onClick={() => toggleAccordion(index)}
          >
            <div className="flex items-center gap-[10px] flex-wrap">
              <span
                className={`font-bold ${
                  activeAccordion[index] && "text-naasa-green"
                }`}
              >
                {faqs.title}
              </span>
              <span className="text-xs border border-naasa-green bg-[#F2FFFB] px-[10px] py-[5px] rounded-[18px]">
                {faqs.category}
              </span>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            {faqs?.steps ? (
              <div>
                {faqs.steps.map((step, index) => (
                  <div>
                    <div key={index} className="flex gap-[10px]">
                      <span className="font-semibold">{step.title}</span>
                      <RenderAnswer text={step.description} />
                    </div>
                    <div className="flex flex-col gap-[10px] ml-[7em] mt-[10px]">
                      {step?.steps &&
                        step?.steps?.map((options, index) => (
                          <div key={index} className="flex gap-[10px]">
                            <span className="font-semibold">
                              {options.title}
                            </span>
                            <RenderAnswer text={options.content} />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <RenderAnswer text={faqs.content} />
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default FAQsAccordion;
