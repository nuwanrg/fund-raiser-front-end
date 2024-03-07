import { useCallback, useState } from "react";

import { ethers } from "ethers";

import FundRaiserContractABI from "data/abi/FundRaiserABI.json";

import { useSignerOrProvider } from "./useSignerOrProvider";

export const useFundRaiserContract = () => {
  const { signer } = useSignerOrProvider();
  const [loading, setLoading] = useState<boolean>(false);

  // Transfer Fund Currency
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "";
  const contract = new ethers.Contract(contractAddress, FundRaiserContractABI, signer);

  const transferFund = useCallback(
    async (
      // receiver: string,
      amount: number
    ): Promise<{ success: boolean; data: ethers.providers.TransactionReceipt | undefined }> => {
      setLoading(true);
      try {
        if (!ethers.utils.isAddress(contractAddress)) {
          throw new Error("Invalid address");
        }
        if (!amount || amount <= 0) {
          throw new Error("Invalid amount");
        }
        const amountToString = amount.toString();
        // const tx = {
        //   to: receiver,
        //   value: ethers.utils.parseEther(amountToString)
        // };
        const tx = await contract.fund({
          value: ethers.utils.parseEther(amountToString) // Amount to contribute
        });
        const receipt = await tx.wait();

        // const amountToString = amount.toString();
        // const tx = {
        //   to: receiver,
        //   value: ethers.utils.parseEther(amountToString)
        // };

        // const transaction = await signer?.sendTransaction(tx);
        // const receipt = await tx?.wait(2);
        return { success: true, data: receipt };
      } catch (error: any) {
        console.log("error", error);
        const message = error.reason ?? error.message ?? error;
        return { success: false, data: message };
      } finally {
        setLoading(false);
      }
    },
    [signer]
  );

  return {
    loading,
    transferFund,
    getTotalFunds: contract.getTotalFunds
  };
};
