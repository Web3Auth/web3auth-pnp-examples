/* eslint-disable prettier/prettier */
import { Signature } from "ethers";
import { useState } from "react";

import Console from "../components/Console";
import Form from "../components/Form";
import Header from "../components/Header";
import MultiForm from "../components/MultiForm";
import Sidebar from "../components/Sidebar";
import { useWeb3Auth } from "../services/web3auth";

interface feeInfo {
  feeLimit: number;
  tokenId: string;
  sourceVaultId: number;
}

interface signature {
  r: string;
  s: string;
}

interface OrderL1 {
  nonce: number;
  ethAddress: string;
  amountSell: number;
  amountBuy: number;
  tokenSell: string;
  tokenBuy: string;
  vaultIdSell: number;
  vaultIdBuy: number;
  expirationTimestamp: number;
  feeInfo: feeInfo;
  orderType: number;
  type: string;
}

interface OrderL2 {
  nonce: number;
  publicKey: string;
  amountSell: number;
  amountBuy: number;
  tokenSell: string;
  tokenBuy: string;
  vaultIdSell: number;
  vaultIdBuy: number;
  expirationTimestamp: number;
  feeInfo: feeInfo;
  orderType: number;
  type: string;
  signature: signature;
}

const sampleOrderL1: OrderL1 = {
  nonce: 1,
  amountSell: 50,
  amountBuy: 140,
  ethAddress: "0xDABadaBadabADaBadabADabAdabadABadAbadAbA",
  tokenSell: "0x20",
  tokenBuy: "0x10",
  vaultIdSell: 1,
  vaultIdBuy: 2,
  expirationTimestamp: 623456,
  feeInfo: {
    feeLimit: 2000,
    tokenId: "0x20",
    sourceVaultId: 1,
  },
  orderType: 0,
  type: "OrderL1Request",
};

const sampleOrderL2: OrderL2 = {
  nonce: 0,
  amountSell: 150,
  amountBuy: 40,
  publicKey: "0x70",
  tokenSell: "0x10",
  tokenBuy: "0x20",
  vaultIdSell: 48,
  vaultIdBuy: 64,
  expirationTimestamp: 642956,
  feeInfo: {
    feeLimit: 1000,
    tokenId: "0x10",
    sourceVaultId: 48,
  },
  signature: {
    s: "0x0",
    r: "0x0",
  },
  orderType: 0,
  type: "OrderL2Request",
};

function Settlement() {
  const { provider } = useWeb3Auth();
  const [OrderL11, setOrderL11] = useState(sampleOrderL1 as OrderL1);
  const [OrderL12, setOrderL12] = useState(sampleOrderL2 as OrderL2);

  const [nonce1, setNonce1] = useState(sampleOrderL1.nonce);
  const [orderType1, setOrderType1] = useState(sampleOrderL1.orderType);
  const [ethAddress1, setEthAddress1] = useState(sampleOrderL1.ethAddress);
  const [amountSell1, setAmountSell1] = useState(sampleOrderL1.amountSell);
  const [amountBuy1, setAmountBuy1] = useState(sampleOrderL1.amountSell);
  const [tokenSell1, setTokenSell1] = useState(sampleOrderL1.tokenSell);
  const [tokenBuy1, setTokenBuy1] = useState(sampleOrderL1.tokenBuy);
  const [feeInfoTokenId1, setFeeInfoTokenId1] = useState(
    sampleOrderL1.feeInfo.tokenId
  );
  const [feeInfoSourceVaultId1, setfeeInfoSourceVaultId1] = useState(
    sampleOrderL1.feeInfo.sourceVaultId
  );
  const [feeInfoFeeLimit1, setFeeInfoFeeLimit1] = useState(
    sampleOrderL1.feeInfo.feeLimit
  );
  const [expirationTime1, setExpirationTime1] = useState(
    sampleOrderL1.expirationTimestamp
  );
  const [vaultIdSell1, setVaultIdSell1] = useState(sampleOrderL1.vaultIdSell);
  const [vaultIdBuy1, setVaultIdBuy1] = useState(sampleOrderL1.vaultIdBuy);

  const [nonce2, setNonce2] = useState(sampleOrderL2.nonce);
  const [orderType2, setOrderType2] = useState(sampleOrderL1.orderType);
  const [amountSell2, setAmountSell2] = useState(sampleOrderL2.amountSell);
  const [amountBuy2, setAmountBuy2] = useState(sampleOrderL2.amountSell);
  const [tokenSell2, setTokenSell2] = useState(sampleOrderL2.tokenSell);
  const [tokenBuy2, setTokenBuy2] = useState(sampleOrderL2.tokenBuy);
  const [feeInfoTokenId2, setFeeInfoTokenId2] = useState(
    sampleOrderL2.feeInfo.tokenId
  );
  const [feeInfoSourceVaultId2, setfeeInfoSourceVaultId2] = useState(
    sampleOrderL2.feeInfo.sourceVaultId
  );
  const [feeInfoFeeLimit2, setFeeInfoFeeLimit2] = useState(
    sampleOrderL2.feeInfo.feeLimit
  );
  const [expirationTime2, setExpirationTime2] = useState(
    sampleOrderL2.expirationTimestamp
  );
  const [vaultIdSell2, setVaultIdSell2] = useState(sampleOrderL2.vaultIdSell);
  const [vaultIdBuy2, setVaultIdBuy2] = useState(sampleOrderL2.vaultIdBuy);
  const [signatureR2, setSignatureR2] = useState(sampleOrderL2.signature.r);
  const [signatureS2, setSignatureS2] = useState(sampleOrderL2.signature.s);

  function OrderL1Request(order: any, setOrder: any): any[] {
    return [
      {
        label: "nonce",
        input: nonce1,
        onChange: setNonce1,
      },
      {
        label: "order_type",
        input: orderType1,
        onChange: setOrderType1,
      }, //
      {
        label: "eth_address",
        input: ethAddress1,
        onChange: setEthAddress1,
      },
      {
        label: "amount_sell",
        input: amountSell1,
        onChange: setAmountSell1,
      },
      {
        label: "amount_buy",
        input: amountBuy1,
        onChange: setAmountBuy1,
      },
      {
        label: "token_sell",
        input: tokenSell1,
        onChange: setTokenSell1,
      },
      {
        label: "token_buy",
        input: tokenBuy1,
        onChange: setTokenBuy1,
      },
      {
        label: "vault_id_sell",
        input: vaultIdSell1,
        onChange: setVaultIdSell1,
      },
      {
        label: "vault_id_buy",
        input: vaultIdBuy1,
        onChange: setVaultIdBuy1,
      },
      {
        label: "expiration_timestamp",
        input: expirationTime1,
        onChange: setExpirationTime1,
      },
      {
        label: "fee_info.feeLimit",
        input: feeInfoFeeLimit1,
        onChange: setFeeInfoFeeLimit1,
      },
      {
        label: "fee_info.sourceVaultId",
        input: feeInfoSourceVaultId1 as unknown as string,
        onChange: setfeeInfoSourceVaultId1,
      },
      {
        label: "fee_info.tokenId",
        input: feeInfoTokenId1,
        onChange: setFeeInfoTokenId1,
      },
    ];
  }

  function OrderL2Request(order: OrderL2, setOrder: any): any[] {
    return [
      {
        label: "nonce",
        input: nonce2,
        onChange: setNonce2,
      },
      {
        label: "order_type",
        input: orderType2,
        onChange: setOrderType2,
      },
      {
        label: "amount_sell",
        input: amountSell2,
        onChange: setAmountSell2,
      },
      {
        label: "amount_buy",
        input: amountBuy2,
        onChange: setAmountBuy2,
      },
      {
        label: "token_sell",
        input: tokenSell2,
        onChange: setTokenSell2,
      },
      {
        label: "token_buy",
        input: tokenBuy2,
        onChange: setTokenBuy2,
      },
      {
        label: "vault_id_sell",
        input: vaultIdSell2,
        onChange: setVaultIdSell2,
      },
      {
        label: "vault_id_buy",
        input: vaultIdBuy2,
        onChange: setVaultIdBuy2,
      },
      {
        label: "expiration_timestamp",
        input: expirationTime2,
        onChange: setExpirationTime2,
      },
      {
        label: "fee_info.feeLimit",
        input: feeInfoFeeLimit2,
        onChange: setFeeInfoFeeLimit2,
      },
      {
        label: "fee_info.sourceVaultId",
        input: feeInfoSourceVaultId2 as unknown as string,
        onChange: setfeeInfoSourceVaultId2,
      },
      {
        label: "fee_info.tokenId",
        input: feeInfoTokenId2,
        onChange: setFeeInfoTokenId2,
      },
      {
        label: "singature.r",
        input: signatureR2,
        onChange: setSignatureR2,
      },
      {
        label: "singature.s",
        input: signatureS2,
        onChange: setSignatureS2,
      },
    ];
  }

  const formDetails1 = OrderL1Request(OrderL11, setOrderL11);
  const formDetails2 = OrderL2Request(OrderL12, setOrderL12);

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {provider ? (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
            <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">
              Settlement
            </h1>
            <div className="md:w-11/12 w-full md:flex justify-center align-center">
              <div className="w-full flex justify-center align-center">
                <MultiForm
                  heading="OrderL1Request"
                  headingCenter
                  formDetails={formDetails1}
                ></MultiForm>
              </div>
              <div className="w-full flex justify-center align-center">
                <MultiForm
                  heading="OrderL2Request"
                  headingCenter
                  formDetails={formDetails2}
                ></MultiForm>
              </div>
            </div>

            <button
              className="w-10/12 mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
              style={{ backgroundColor: "#0364ff" }}
            >
              Send with StarkEx Gateway
            </button>
            <Console />
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

export default Settlement;
