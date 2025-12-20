import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalCheckout: React.FC = () => {
  return (
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <PayPalButtons
        createOrder={(_, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: "10.00",
                },
              },
            ],
          });
        }}
        onApprove={async (_, actions) => {
          if (!actions.order) return;
          const details = await actions.order.capture();
          const givenName =
            details.payment_source?.paypal?.name?.given_name ?? "customer";
          alert(`Transaction completed by ${givenName}`);
        }}
        onError={(err) => {
          console.error("PayPal Checkout Error:", err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalCheckout;
