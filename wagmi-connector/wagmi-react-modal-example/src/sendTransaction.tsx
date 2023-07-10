import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";
import { parseEther } from "viem";

export const SendTransaction = () => {
  const { config } = usePrepareSendTransaction({
    //@ts-ignore
    request: {
      to: "0x2E464670992574A613f10F7682D5057fB507Cc21",
      value: parseEther("0.00073"),
    },
  });

  const { data, sendTransaction } = useSendTransaction(config);

  const { isLoading, isSuccess, isError, isIdle } = useWaitForTransaction({
    hash: data?.hash,
  });

  if (isLoading) return <div>Check Wallet</div>;

  if (isIdle)
    return (
      <button className="card" disabled={isLoading} onClick={() => sendTransaction}>
        Send Transaction
      </button>
    );

  return (
    <div>
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      {isError && <div>Error sending transaction</div>}
    </div>
  );
};
