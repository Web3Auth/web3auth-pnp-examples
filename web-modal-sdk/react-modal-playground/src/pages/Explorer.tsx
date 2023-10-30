/* eslint-disable prettier/prettier */
/* eslint-disable require-atomic-updates */
// @ts-ignore
import { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import JsonFormatter from "react-json-formatter";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Tabs from "../components/Tabs";
import { useWeb3Auth } from "../services/web3auth";

function Explorer() {
  const {
    provider,
  } = useWeb3Auth();

  const [l1TransactionData, setL1TransactionData] = useState([]);
  const [l2TransactionData, setL2TransactionData] = useState([]);
  const [starkexBatches, setStarkexBatches] = useState([]);
  const [lastStarkexBatch, setLastStarkexBatch] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [tab, setTab] = useState("l1");
  const itemsCountPerPage = 10;
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    if (tab === "batches") {
      console.log("Page Number", pageNumber);
    }
  };


  const TabData = [
    {
      tabName: "L1 Transactions",
      onClick: () => setTab("l1"),
      active: tab === "l1",
    },
    {
      tabName: "StarkEx Batches",
      onClick: () => {
        setTab("batches");
      },
      active: tab === "batches",
    },
    {
      tabName: "StarkEx Transactions",
      active: tab === "starkex",
    },
  ];

  const renderTabs = () => {
    if (tab === "starkex") {
      const columns = ["txn_info"];
      const jsonStyle = {
        propertyStyle: { color: "red" },
        stringStyle: { color: "green" },
        numberStyle: { color: "darkorange" },
      };
      return (
        <div className="w-11/12 px-4 sm:px-6 lg:px-8 flex-col">
          <div className="justify-center p-8 mt-6 mb-0 space-y-4 rounded-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm divide-y divide-gray-200 table-fixed">
                <thead className="w-full">
                  <tr>
                    {columns.length > 0 &&
                      columns.map((item) => {
                        return (
                          <th className="p-4 font-bold text-left text-gray-900 whitespace-nowrap w-1/3">
                            {item}
                          </th>
                        );
                      })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  <JsonFormatter
                    json={JSON.stringify(l2TransactionData)}
                    tabWith={4}
                    jsonStyle={jsonStyle}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else if (tab === "l1") {
      const columns = [
        "hash",
        "block_number",
        "from_address",
        "to_address",
        "gas",
      ];
      return (
        <div className="w-11/12 px-4 sm:px-6 lg:px-8 flex-col">
          <div className="justify-center p-8 mt-6 mb-0 space-y-4 rounded-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm divide-y divide-gray-200 table-fixed">
                <thead className="w-full">
                  <tr>
                    {columns.length > 0 &&
                      columns.map((item) => {
                        return (
                          <th className="p-4 font-bold text-left text-gray-900 whitespace-nowrap w-1/3">
                            {item}
                          </th>
                        );
                      })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {l1TransactionData.length > 0 &&
                    l1TransactionData
                      .slice(
                        (activePage - 1) * itemsCountPerPage,
                        (activePage - 1) * itemsCountPerPage + itemsCountPerPage
                      )
                      .map((item) => {
                        return (
                          <tr>
                            {columns.map((columnName) => (
                              <td className="p-4 font-medium whitespace-nowrap truncate">
                                {item[`${columnName}`]}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                </tbody>
              </table>
              <div className="flex-1 w-full px-20 py-5 justify-center align-center">
                <Pagination
                  innerClass="pagination"
                  itemClass="page-item"
                  linkClass="page-link"
                  activePage={activePage}
                  activeClass="active-page"
                  itemsCountPerPage={itemsCountPerPage}
                  totalItemsCount={l1TransactionData.length}
                  onChange={(e) => {
                    handlePageChange(e);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else if (tab === "batches") {
      const columns = [
        "batch_id",
        "prev_batch_id",
        "sequence_number",
        "no_of_txns",
        "time_created",
      ];
      return (
        <div className="w-11/12 px-4 sm:px-6 lg:px-8 flex-col">
          <div className="justify-center p-8 mt-6 mb-0 space-y-4 rounded-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm divide-y divide-gray-200 table-fixed">
                <thead className="w-full">
                  <tr>
                    {columns.length > 0 &&
                      columns.map((item) => {
                        return (
                          <th className="p-4 font-bold text-left text-gray-900 whitespace-nowrap w-1/3">
                            {item}
                          </th>
                        );
                      })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {starkexBatches.length > 0 &&
                    starkexBatches
                      .slice(0)
                      .reverse()
                      .map((item) => {
                        return (
                          <tr>
                            {columns.map((columnName) => (
                              <td
                                className="p-4 font-medium whitespace-nowrap truncate"
                                onClick={() => {
                                  setTab("starkex");
                                  setL2TransactionData(item.txs_info);
                                }}
                              >
                                {item[`${columnName}`]}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                </tbody>
              </table>
              <div className="flex-1 w-full px-20 py-5 justify-center align-center">
                <Pagination
                  innerClass="pagination"
                  itemClass="page-item"
                  linkClass="page-link"
                  activePage={activePage}
                  activeClass="active-page"
                  itemsCountPerPage={itemsCountPerPage}
                  totalItemsCount={lastStarkexBatch}
                  onChange={(e) => {
                    handlePageChange(e);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {provider ? (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
            <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">
              StarkEx Explorer
            </h1>
            <Tabs tabData={TabData} />
            {renderTabs()}
          </div>
        ) : (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-center overflow-scroll p-4">
            <h1 className="text-2xl font-bold text-center sm:text-3xl">
              Welcome to Web3Auth StarkEx Playground
            </h1>
            <p className="max-w-md mx-auto mt-4 text-center text-gray-500">
              Please connect to Web3Auth to get started.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Explorer;
