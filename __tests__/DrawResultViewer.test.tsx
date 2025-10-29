import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Prize, DrawResult, DrawRules } from "@/app/lib/draw";
import DrawResultViewer from "../src/app/ui/DrawResultViewer";

describe("DrawResultViewer", () => {
  it("renders a empty message when no results", () => {
    // GIVEN: valid props with empty result for DrawResultViewer
    const results: ReadonlyArray<DrawResult> = [];
    const mockSetResults = (result: DrawResult[]) => {};

    // WHEN: the component is rendered
    render(<DrawResultViewer 
      results={results}
      setResults={mockSetResults}
    />);

    // THEN: a empty message should be rendered
    const msg = screen.getByText("尚無得獎紀錄。");
    expect(msg).toBeInTheDocument();
  });

  it("renders all results when results exist", () => {
    // GIVEN: valid props for DrawResultViewer
    const results: ReadonlyArray<DrawResult> = [
      { name: "CandidateA", prize: "PrizeA" },
      { name: "CandidateB", prize: "PrizeB" },
    ];
    const mockSetResults = (result: DrawResult[]) => {};
    
    // WHEN: the component is rendered
    render(<DrawResultViewer 
      results={results}
      setResults={mockSetResults}
    />);

    // THEN: all results should be rendered
    expect(screen.getByText("CandidateA")).toBeInTheDocument();
    expect(screen.getByText("PrizeA")).toBeInTheDocument();
    expect(screen.getByText("CandidateB")).toBeInTheDocument();
    expect(screen.getByText("PrizeB")).toBeInTheDocument();
  });

  it("renders download button and clear button", () => {
    // GIVEN: valid props for DrawResultViewer
    const results: ReadonlyArray<DrawResult> = [
      { name: "CandidateA", prize: "PrizeA" },
      { name: "CandidateB", prize: "PrizeB" },
    ];
    const mockSetResults = (result: DrawResult[]) => {};
    
    // WHEN: the component is rendered
    render(<DrawResultViewer 
      results={results}
      setResults={mockSetResults}
    />);

    // THEN: all results should be rendered
    const downloadBtn = screen.getByRole("button", { name: "清除" });
    expect(downloadBtn).toBeInTheDocument();
    const clearBtn = screen.getByRole("button", { name: "下載" });
    expect(clearBtn).toBeInTheDocument();
  });

  it("renders a delete button for each result", () => {
    // GIVEN: valid props for DrawResultViewer
    const results: ReadonlyArray<DrawResult> = [
      { name: "CandidateA", prize: "PrizeA" },
      { name: "CandidateB", prize: "PrizeB" },
    ];
    const mockSetResults = (result: DrawResult[]) => {};
    
    // WHEN: the component is rendered
    render(<DrawResultViewer 
      results={results}
      setResults={mockSetResults}
    />);

    // THEN: all results should have a delete button
    const deleteBtns = screen.getAllByRole("button", { name: "X" });
    expect(deleteBtns).toHaveLength(results.length);
  });

  it("clears all results when clear button clicked", async () => {
    // GIVEN: a DrawResultViewer with valid props
    const results: ReadonlyArray<DrawResult> = [
      { name: "CandidateA", prize: "PrizeA" },
      { name: "CandidateB", prize: "PrizeB" },
    ];
    const mockSetResults = jest.fn();

    render(<DrawResultViewer 
      results={results}
      setResults={mockSetResults}
    />);

    // WHEN: the clear button is clicked
    const clearBtn = screen.getByRole("button", { name: "清除" });
    await userEvent.click(clearBtn);

    // THEN: all results should be cleared
    expect(mockSetResults).toHaveBeenCalledWith([]);
  });

  it("removes a result when its delete button clicked", async () => {
    // GIVEN: a DrawResultViewer with valid props
    const results: ReadonlyArray<DrawResult> = [
      { name: "CandidateA", prize: "PrizeA" },
      { name: "CandidateB", prize: "PrizeB" },
      { name: "CandidateC", prize: "PrizeC" },
    ];
    const mockSetResults = jest.fn();
    
    render(<DrawResultViewer 
      results={results}
      setResults={mockSetResults}
    />);

    // WHEN: the clear button of second result is clicked
    const deleteBtns = screen.getAllByRole("button", { name: "X" });
    await userEvent.click(deleteBtns[1]);

    // THEN: setResults() should be called using results without the second element as argument
    expect(mockSetResults).toHaveBeenCalledWith([
      ...results.slice(0, 1),
      ...results.slice(2),
    ]);
  });

});