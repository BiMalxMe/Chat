import { useState } from "react";
import PayPalCheckout from "../components/Paypal";
import { WalletConnector } from "../components/WalletConnector";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { SolanaDonationButton } from "../components/SolanaDonationBtn";

export const Checkout = () => {
  const [method, setMethod] = useState<"paypal" | "solana" | null>(null);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Support Me</h1>
        <p className="text-lg text-white mb-6">Choose your preferred donation method:</p>

        {/* Choose method buttons */}
        {!method && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setMethod("paypal")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded"
            >
              PayPal
            </button>
            <button
              onClick={() => setMethod("solana")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded"
            >
              Solana Wallet
            </button>
          </div>
        )}

        {/* Render selected checkout */}
        {method === "paypal" && (
          <div className="mt-6">
            <PayPalCheckout />
          </div>
        )}

        {method === "solana" && (
          <div className="mt-6">
            <WalletConnector>
              <WalletMultiButton />
              <br />
              <SolanaDonationButton />
            </WalletConnector>
          </div>
        )}

        {/* Reset button */}
        {method && (
          <button
            onClick={() => setMethod(null)}
            className="mt-4 underline text-sm text-gray-300 hover:text-white"
          >
            Choose a different method
          </button>
        )}
      </div>
    </div>
  );
};
