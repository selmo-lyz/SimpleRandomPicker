import { useState } from "react";
import { Prize, DrawResult } from "@/app/lib/draw";

type Props = {
  prizes: ReadonlyArray<Prize>;
  setPrizes: (prizes: Prize[]) => void;
  drawResult: ReadonlyArray<DrawResult>;
};

export default function PrizeInput({ prizes, setPrizes, drawResult}: Props) {
  const [isCsvMode, setIsCsvMode] = useState(false);
  const [csvText, setCsvText] = useState("");

  const handleIsCsvModeChange = () => {
    if (!isCsvMode) {
      const lines = prizes.map((p) => `${p.name},${p.count}`);
      setCsvText(lines.join("\n"));
    }
    setIsCsvMode(!isCsvMode);
  }

  // 處理 CSV 文字變更，將內容轉成獎品陣列，並以此更新原獎品陣列
  const handleCsvChange = (text: Readonly<string>) => {
    setCsvText(text);
    
    const lines = text.split("\n");
    const newPrizes: Prize[] = [];
    for (const line of lines) {
      const [name, countStr] = line.split(",");
      if (!name) continue;
      const count = parseInt(countStr || "1");
      if (!isNaN(count) && count > 0) {
        newPrizes.push({ name: name.trim(), count });
      }
    }
    setPrizes(newPrizes);
  };

  const handlePrizeChange = (
    index: number,
    field: keyof Prize,
    value: string
  ) => {
    const newPrizes = [...prizes];
    if (field === "count") {
      newPrizes[index][field] = Math.max(1, parseInt(value) || 1);
    } else {
      newPrizes[index][field] = value;
    }
    setPrizes(newPrizes);
  };

  const addPrize = () => {
    setPrizes([...prizes, { name: "", count: 1 }]);
  };

  const removePrize = (index: number) => {
    const newPrizes = [...prizes];
    newPrizes.splice(index, 1);
    setPrizes(newPrizes);
  };

  const placeholderText = `格式：獎品名稱,數量\n100 元禮券,2\n電影票x2,1`;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">獎品清單</h3>
        <button
          onClick={handleIsCsvModeChange}
          className="text-blue-600 hover:underline"
        >
          {isCsvMode ? "切換到表單模式" : "切換到 CSV 模式"}
        </button>
      </div>

      {isCsvMode ? (
        <textarea
          rows={8}
          value={csvText}
          onChange={(e) => handleCsvChange(e.target.value)}
          placeholder={placeholderText}
          className="w-full border p-2 rounded font-mono mt-2"
        />
      ) : (
        <>
          {prizes.map((prize, index) => (
            <div key={index} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="獎品名稱"
                value={prizes[index].name}
                onChange={(e) =>
                  handlePrizeChange(index, "name", e.target.value)
                }
                className="flex-auto border p-2 rounded w-1/2"
              />
              
              <label className="flex-auto">
                剩餘 {
                  prizes[index].count - drawResult.reduce(
                    (cnt, r) => (r.prize == prizes[index].name) ? cnt + 1 : cnt, 0
                  )
                } /
              </label>
              <input
                type="number"
                min={1}
                value={prizes[index].count}
                onChange={(e) =>
                  handlePrizeChange(index, "count", e.target.value)
                }
                className="flex-auto border p-2 rounded w-20"
              />
              <button
                onClick={() => removePrize(index)}
                className="flex-initial del-btn-bg hover:del-btn-bg text-white px-4 py-2 rounded"
                disabled={prizes.length <= 1}
              >
                X
              </button>
            </div>
          ))}
          <button
            onClick={addPrize}
            className="btn-bg hover:btn-bg text-white px-4 py-2 rounded transition mt-4"
          >
            +
          </button>
        </>
      )}
    </div>
  );
}
