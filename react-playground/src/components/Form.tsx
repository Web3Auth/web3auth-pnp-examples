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

function Form({ heading, headingCenter, formDetails, children }: FormProps) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 z-0">
      {heading && <p className={`text-lg font-bold text-gray-900 dark:text-dark-text-primary ${headingCenter ? "text-center" : ""}`}>{heading}</p>}
      <div className="p-8 mt-6 mb-6 space-y-4 rounded-lg bg-white dark:bg-dark-bg-tertiary shadow-md">
        <form action="" className="pb-6">
          {formDetails.map((formDetail) => (
            <div key={formDetail.label}>
              <label className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">{formDetail.label}</label>
              <div className="relative mt-1">
                {formDetail.onChange ? (
                  <input
                    type="email"
                    id="email"
                    className="w-full p-4 pr-12 text-sm border-gray-200 dark:border-dark-border-primary rounded-lg shadow-sm bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary focus:ring-2 focus:ring-primary dark:focus:ring-dark-accent-primary z-0"
                    value={formDetail.input}
                    onChange={(e) => {
                      formDetail.onChange(e.target.value as string);
                    }}
                  />
                ) : (
                  <input
                    type="email"
                    id="email"
                    className="w-full p-4 pr-12 text-sm border-gray-200 dark:border-dark-border-primary rounded-lg shadow-sm bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary focus:ring-2 focus:ring-primary dark:focus:ring-dark-accent-primary z-0"
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
    </div>
  );
}

export default Form;
