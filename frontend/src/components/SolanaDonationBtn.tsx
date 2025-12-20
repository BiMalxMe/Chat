import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

const SOLANA_WALLET = "FrkC18jMLDDehiAYEcKV1mGjMwtoZHc8VayEssmLQFe3";
const connection = new Connection("https://api.devnet.solana.com");

export const SolanaDonationButton = () => {
  const { publicKey, sendTransaction, connected } = useWallet();

  const handleDonate = async () => {
    if (!connected || !publicKey) return alert("Connect your wallet first!");

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(SOLANA_WALLET),
          lamports: 1 * 1e9,
        })
      );

      transaction.feePayer = publicKey;
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");
      alert("Donation successful! Thank you!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed or was rejected.");
    }
  };

  return (
    <button
      onClick={handleDonate}
      className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
    >
      Donate 1 SOL
    </button>
  );
};
