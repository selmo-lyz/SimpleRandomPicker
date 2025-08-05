import { Prize, DrawResult, DrawRules, draw } from "@/app/lib/draw";

type Props = {
  candidates: ReadonlyArray<string>;
  prizes: ReadonlyArray<Prize>;
  drawRules: DrawRules;
  results: ReadonlyArray<DrawResult>;
  onDraw: (results: DrawResult[]) => void;
};

export default function DrawOnceButton({ candidates, prizes, drawRules, results, onDraw }: Props) {
  const handleDraw = () => {
    const winnerSet = new Set(results.map((r) => r.name));
    const availableCandidates = candidates.filter((name) => !winnerSet.has(name));
    const availablePrizes: Prize[] = prizes.flatMap((p) => {
      const cnt = p.count - results.reduce((cnt, r) => (r.prize == p.name) ? cnt + 1 : cnt, 0);
      return (cnt > 0) ? { name: p.name, count: cnt } : undefined;
    }).filter((p): p is Prize => p !== undefined);
    const cntAvailablePrizes = availablePrizes.reduce((sum, p) => sum + p.count, 0);
    
    const minCandidatesValidationForAllowRepeat = () => (
      drawRules.repeat === "allow-repeat" && candidates.length <= 0
    );
    if (minCandidatesValidationForAllowRepeat()) {
      alert("請至少輸入 1 位候選人");
      return;
    }
    const minCandidatesValidationForNoRepeat = () => (
      drawRules.repeat === "no-repeat" && availableCandidates.length < 1
    );
    if (minCandidatesValidationForNoRepeat()) {
      alert(`請至少再輸入 1 位候選人。`);
      return;
    }
    const minPrizesValidation = () => (
      cntAvailablePrizes == 0
    );
    if (minPrizesValidation()) {
      alert(`獎品已全數抽出。`);
      return;
    }

    const drawResults = draw(
      (drawRules.repeat === "no-repeat") ? availableCandidates : candidates,
      [{
        name: (drawRules.order === "first") ? availablePrizes[0].name : availablePrizes[availablePrizes.length - 1].name, 
        count: 1
      }],
      drawRules
    );
    onDraw([...drawResults, ...results]);
  };

  return (
    <button
      onClick={handleDraw}
      className="btn-bg hover:btn-bg text-white px-4 py-2 rounded"
    >
      抽出
    </button>
  );
}