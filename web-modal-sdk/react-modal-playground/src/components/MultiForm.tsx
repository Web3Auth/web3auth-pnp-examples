import React, { JSX } from "react";

interface FormProps {
  heading?: string;
  headingCenter?: boolean;
  formDetails: {
    label: string;
    input: string;
    readOnly?: boolean;
    onChange?: any;
  }[];
  children?: JSX.Element | JSX.Element[];
}

function MultiForm({ heading, headingCenter, formDetails, children }: FormProps) {
  return (
    <div className="w-11/12 px-4 sm:px-6 lg:px-8  z-0">
      <p className={`text-lg font-bold ${headingCenter ? "text-center" : ""}`}>{heading}</p>
      <form action="" className="p-8 mt-6 mb-0 space-y-4 rounded-lg bg-white">
        {formDetails.map((formDetail) => (
          <div key={formDetail.label}>
            <label className="text-sm font-medium">{formDetail.label}</label>
            <div className="relative mt-1">
              {formDetail.onChange ? (
                <input
                  type="email"
                  id="email"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm  z-0"
                  value={formDetail.input}
                  onChange={(e) => {
                    formDetail.onChange(e.target.value as string);
                  }}
                />
              ) : (
                <input
                  type="email"
                  id="email"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm  z-0"
                  value={formDetail.input}
                  {...(formDetail.readOnly ? { readOnly: true } : {})}
                />
              )}
            </div>
          </div>
        ))}
      </form>
      {children}
    </div>
  );
}

export default MultiForm;
