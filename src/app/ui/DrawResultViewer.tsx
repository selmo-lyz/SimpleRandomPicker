import { memo } from "react";
import { DrawResult } from "@/app/lib/draw";
import { FixedSizeList as List } from "react-window";

type Props = {
  results: ReadonlyArray<DrawResult>;
  setResults: (results: DrawResult[]) => void;
};

type RowProps = {
  index: number;
  style: React.CSSProperties;
  candidate: string;
  prize: string;
};

export default function DrawResultViewer({ results, setResults }: Props) {
  const csvText = () => [
    ...results.map(
      (r) => `${r.name},${r.prize}`
    )
  ].join("\n");

  const downloadCsv = () => {
    const blob = new Blob([csvText()], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "draw_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const removeResult = (index: number) => {
    const newResults = [...results];
    newResults.splice(index, 1);
    setResults(newResults);
  };

  const removeAllResult = () => {
    const newResults = [...results];
    newResults.splice(0, newResults.length);
    setResults(newResults);
  };

  const ResultRow = ({ index, style, candidate, prize }: RowProps) => (
    <div
      style={style}
      className={`relative flex text-sm border-b border-gray-200 hover:bg-gray-50 ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      }`}
    >
      <span className="w-4/9 px-4 py-2 truncate">{candidate}</span>
      <span className="absolute opacity-0 select-text">,</span>
      <span className="w-4/9 px-4 py-2 truncate">{prize}</span>
      <span className="absolute opacity-0 select-text"><br></br></span>
      <button
        onClick={() => removeResult(index)}
        className="w-1/9 flex-initial del-btn-bg hover:del-btn-bg text-white px-2 py-2 rounded"
        disabled={results.length <= 0}
      >
        X
      </button>
    </div>
  );
  const Row = memo(ResultRow);

  const renderRow = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <Row
      index={index}
      style={style}
      candidate={results[index].name}
      prize={results[index].prize}
    />
  );

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="w-1/3 text-xl font-medium">得獎名單</h2>
        <div className="w-2/3 flex justify-end gap-8">
          <button
          onClick={removeAllResult}
          className="del-btn-bg hover:del-btn-bg text-white px-4 py-2 rounded"
          disabled={results.length <= 0}
          >
            清除
          </button>
          <button
            onClick={downloadCsv}
            className="btn-bg hover:btn-bg text-white px-4 py-2 rounded transition"
          >
            下載 CSV
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="text-gray-500 mt-4">尚無得獎紀錄。</p>
      ) : (
        <div className="rounded-lg shadow overflow-hidden border border-gray-300 mt-4">
          <div className="flex bg-gray-100 text-left text-sm font-semibold border-b border-gray-300">
            <div className="w-4/9 px-4 py-2">得獎者</div>
            <div className="w-4/9 px-4 py-2">獎品</div>
            <div className="w-1/9 px-4 py-2"></div>
          </div>
          <List
            height={600}
            itemCount={results.length}
            itemSize={40}
            width="100%"
          >
            {renderRow}
          </List>
        </div>
      )}
    </div>
  );
}