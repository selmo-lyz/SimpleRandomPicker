"use client";

import { useState } from "react";
import CandidateInput from "@/app/ui/CandidateInput";
import PrizeInput from "@/app/ui/PrizeInput";
import DrawButton from "@/app/ui/DrawButton";
import DrawOnceButton from "@/app/ui/DrawOnceButton";
import DrawResultViewer from "@/app/ui/DrawResultViewer";
import { Prize, DrawResult, DrawRules } from "@/app/lib/draw";

export default function Home() {
  const [candidates, setCandidates] = useState<string[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([{ name: "", count: 1 }]);
  const [results, setResults] = useState<DrawResult[]>([]);
  const [drawRules, setDrawRules] = useState<DrawRules>({ repeat: "no-repeat", order: "first" });
  
  return (
    <div className="h-[100%] flex flex-col md:flex-row md:gap-4 justify-center items-center md:items-start">
      <div className="bg-white md:rounded-2xl min-h-100 md:min-h-200 max-w-xl w-full px-4 md:px-8 py-8">
        <h1 className="text-2xl font-bold text-center">簡易抽獎機</h1>

            <div className="flex justify-between mt-8">
          <DrawButton
            candidates={candidates}
            prizes={prizes}
            drawRules={drawRules}
            results={results}
            onDraw={setResults}
          />
          <DrawOnceButton
            candidates={candidates}
            prizes={prizes}
            drawRules={drawRules}
            results={results}
            onDraw={setResults}
          />
        </div>

        <div className="mt-4 mb-4">
          <label className="font-medium">抽獎規則：</label>
          <div className="flex flex-col md:flex-row justify-start gap-2 mt-2">
            <select
              className="border rounded px-2 py-1"
              value={drawRules.repeat}
              onChange={(e) => setDrawRules({ ...drawRules, repeat: e.target.value } as DrawRules)}
            >
              <option value="no-repeat">每人僅得獎一次</option>
              <option value="allow-repeat">允許重複得獎</option>
            </select>
            <select
              className="border rounded px-2 py-1"
              value={drawRules.order}
              onChange={(e) => setDrawRules({ ...drawRules, order: e.target.value } as DrawRules)}
            >
              <option value="first">從第一個獎品開始抽</option>
              <option value="last">從最後一個獎品開始抽</option>
            </select>
          </div>
        </div>

        <CandidateInput onChange={setCandidates} />

        <PrizeInput prizes={prizes} setPrizes={setPrizes} drawResult={results}/>
      </div>

      <div className="bg-white md:rounded-2xl min-h-100 md:min-h-200 max-w-xl w-full px-4 md:px-8 py-8">
        <DrawResultViewer results={results} setResults={setResults} />
      </div>
    </div>
  );
}
