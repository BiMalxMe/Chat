import type{ ReactNode } from "react";
interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  icon?: ReactNode;
  value?: string; // <-- add this
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // <-- add this
}

export const InputField = ({ label, placeholder, type = "text", icon, value, onChange }: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="flex items-center gap-2 bg-gray-900 px-3 py-2 rounded-md">
        {icon}
        <input
          type={type}
          placeholder={placeholder}
          className="bg-transparent flex-1 outline-none text-white"
          value={value}    
          onChange={onChange} 
        />
      </div>
    </div>
  );
};
