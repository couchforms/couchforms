import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { parseAsync } from "json2csv";
import { slugify } from "../../lib/utils";

export default function DownloadResponses({ survey, answerSessions }) {
  const download = async (format: "csv" | "excel") => {
    // build dict of answers in copy of answerSessions
    const data = JSON.parse(JSON.stringify(answerSessions));
    for (const session of data) {
      for (const answer of session.answers) {
        session[answer.elementId] = answer.data;
      }
      delete session.answers;
    }
    // build data fields for csv/excel file
    const fields: any = [
      {
        label: "Timestamp",
        value: "createdAt",
      },
    ];
    for (const element of survey.elements) {
      if (element.type !== "instructions") {
        fields.push({
          label: element.data.question,
          value: (row) =>
            row.hasOwnProperty(element.id) ? row[element.id].value : "",
        });
      }
    }
    const opts: any = { fields };

    if (format === "excel") {
      opts.excelStrings = true;
    }
    const fileTypes = {
      csv: { mimeType: "text/csv", fileExtension: "csv" },
      excel: { mimeType: "application/vnd.ms-excel", fileExtension: "xls" },
    };

    try {
      const csv = await parseAsync(data, opts);
      // download
      var blob = new Blob([csv], { type: fileTypes[format].mimeType });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${slugify(survey.title)}.${fileTypes[format].fileExtension}`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Menu as="div" className="relative inline-block text-left z-10 w-full mt-2">
      <div>
        <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-l-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          Download
          <ChevronDownIcon
            className="w-5 h-5 ml-2 -mr-1 text-white hover:text-gray-100"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => download("csv")}
                  className={`${
                    active ? "bg-pink-500 text-white" : "text-gray-900"
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  Download as CSV
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => download("excel")}
                  className={`${
                    active ? "bg-pink-500 text-white" : "text-gray-900"
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  Download as Excel
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
