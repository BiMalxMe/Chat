import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { MessageCircle } from "lucide-react";

export const Landing = () => {
  return (
    <div className="absolute inset-0 bg-black text-white flex flex-col p-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-20">
        <Logo />
        <Button
          variant="primary"
          size="md"
          text="Get Started"
          fullwidth={false}
        />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col justify-center flex-1 max-w-3xl">
        <h1 className="text-5xl font-bold leading-tight">
          Chat Smarter.{" "}
          <span className="text-blue-400">Together.</span>
        </h1>

        <p className="text-gray-400 mt-4 text-lg">
          SapiensChat is your next-gen communication platform built for seamless,
          real-time conversations with a sleek dark UI.
        </p>

        <div className="mt-8 flex gap-4">
          <Button
            variant="primary"
            size="lg"
            text="Launch App"
            fullwidth={false}
            startIcon={<MessageCircle className="h-5 w-5 text-black" />}
          />
          <Button
            variant="secondary"
            size="lg"
            text="Learn More"
            fullwidth={false}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-gray-500 text-sm mt-20">
        © {new Date().getFullYear()} SapiensChat. All rights reserved.
      </div>
    </div>
  );
};
