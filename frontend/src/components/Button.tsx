import type { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "lg" | "md";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onclick?: () => void;
  fullwidth?: boolean;
}

const variantStyle = {
  primary: "bg-gray-100 text-black",
  secondary: "bg-gray-100 text-black", 
};

const sizeStyles = {
  sm: "py-1 px-2 text-sm",
  md: "py-2 px-4 text-md",
  lg: "py-3 px-6 text-lg",
};

const defaultStyles =
  "rounded-md font-light flex items-center border border-gray-300";

export const Button = (props: ButtonProps) => {
  return (
    <button
      onClick={props.onclick}
      className={`
        ${variantStyle[props.variant]}
        ${defaultStyles}
        ${sizeStyles[props.size]}
        ${props.fullwidth ? "w-full justify-center" : ""}
        cursor-pointer 
        hover:bg-gray-100 
        hover:scale-[1.02] 
        transition-all duration-200
      `}
    >
      {props.startIcon && <span className="mr-2">{props.startIcon}</span>}
      <span>{props.text}</span>
      {props.endIcon && <span className="ml-2">{props.endIcon}</span>}
    </button>
  );
};
