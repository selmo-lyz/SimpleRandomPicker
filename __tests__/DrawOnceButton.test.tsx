import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Prize, DrawResult, DrawRules } from "@/app/lib/draw";
import DrawOnceButton from "../src/app/ui/DrawOnceButton";

describe("DrawOnceButton", () => {
  it("renders a button", () => {
    // GIVEN: valid props for DrawOnceButton
    const candidates: string[] = [
      "CandidateA",
      "CandidateB",
    ];
    const prizes: Prize[] = [
      { name: "PrizeA", count: 1 },
      { name: "PrizeB", count: 1 },
    ];
    const drawRules: DrawRules = {
      repeat: "no-repeat",
      order: "first",
    };
    const results: DrawResult[] = [];
    
    // WHEN: the component is redered
    render(
      <DrawOnceButton
        candidates={candidates}
        prizes={prizes}
        drawRules={drawRules}
        results={results}
        onDraw={ ()=>{} }
      />
    );

    // THEN: a button should be rendered
    const drawOnceButton = screen.getByRole("button");
    expect(drawOnceButton).toBeInTheDocument();
  });

  it("calls onDraw when clicked", async () => {
    // GIVEN: a DrawOnceButton with valid props
    const candidates: string[] = [
      "CandidateA",
      "CandidateB",
    ];
    const prizes: Prize[] = [
      { name: "PrizeA", count: 1 },
      { name: "PrizeB", count: 1 },
    ];
    const drawRules: DrawRules = {
      repeat: "no-repeat",
      order: "first",
    };
    const results: DrawResult[] = [];

    const onDrawMock = jest.fn();
    render(
      <DrawOnceButton
        candidates={candidates}
        prizes={prizes}
        drawRules={drawRules}
        results={results}
        onDraw={onDrawMock}
      />
    );
    
    // WHEN: the button is clicked
    const drawOnceButton = screen.getByRole("button");
    await userEvent.click(drawOnceButton);

    // THEN: onDraw should be called
    expect(onDrawMock).toHaveBeenCalledTimes(1);
    onDrawMock.mockRestore();
  });

  it("alerts when no prize is given", async () => {
    // GIVEN: a DrawOnceButton with no prize is given
    const candidates: string[] = [
      "CandidateA",
      "CandidateB",
    ];
    const prizes: Prize[] = [];
    const drawRules: DrawRules = {
      repeat: "no-repeat",
      order: "first",
    };
    const results: DrawResult[] = [];

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(
      <DrawOnceButton
        candidates={candidates}
        prizes={prizes}
        drawRules={drawRules}
        results={results}
        onDraw={() => {}}
      />
    );
    
    // WHEN: the button is clicked
    const drawOnceButton = screen.getByRole("button");
    await userEvent.click(drawOnceButton);

    // THEN: an alert should be called
    expect(alertMock).toHaveBeenCalledTimes(1);
    alertMock.mockRestore();
  });

  it("alerts when no candidate is given", async () => {
    // GIVEN: a DrawOnceButton with no candidate is given
    const candidates: string[] = [];
    const prizes: Prize[] = [
      { name: "PrizeA", count: 1 },
      { name: "PrizeB", count: 1 },
    ];
    const drawRules: DrawRules = {
      repeat: "allow-repeat",
      order: "first",
    };
    const results: DrawResult[] = [];

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(
      <DrawOnceButton
        candidates={candidates}
        prizes={prizes}
        drawRules={drawRules}
        results={results}
        onDraw={() => {}}
      />
    );
    
    // WHEN: the button is clicked
    const drawOnceButton = screen.getByRole("button");
    await userEvent.click(drawOnceButton);

    // THEN: an alert should be called
    expect(alertMock).toHaveBeenCalledTimes(1);
    alertMock.mockRestore();
  });

  it("alerts when all prizes have been claimed", async () => {
    // GIVEN: a DrawOnceButton with too few candidates
    const candidates: string[] = [
      "CandidateA",
      "CandidateB",
    ];
    const prizes: Prize[] = [
      { name: "PrizeA", count: 1 },
    ];
    const drawRules: DrawRules = {
      repeat: "no-repeat",
      order: "first",
    };
    const results: DrawResult[] = [
      { name: "CandidateA", prize: "PrizeA" },
    ];

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(
      <DrawOnceButton
        candidates={candidates}
        prizes={prizes}
        drawRules={drawRules}
        results={results}
        onDraw={() => {}}
      />
    );
    
    // WHEN: the button is clicked
    const drawOnceButton = screen.getByRole("button");
    await userEvent.click(drawOnceButton);

    // THEN: an alert should be called
    expect(alertMock).toHaveBeenCalledTimes(1);
    alertMock.mockRestore();
  });
});