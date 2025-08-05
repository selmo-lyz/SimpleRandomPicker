import React from "react";

type Props = {
  onChange: (names: string[]) => void;
};

export default function CandidateInput({ onChange }: Props) {
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    onChange(lines);
  };

  const placeholderText = `小明\n小美\n小華`;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium">
        候選名單
      </h3>
      <textarea
        rows={8}
        onChange={handleInput}
        placeholder={placeholderText}
        className="w-full p-2 border rounded mt-2"
      />
    </div>
  );
}
