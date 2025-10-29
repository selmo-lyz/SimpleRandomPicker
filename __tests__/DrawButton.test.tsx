import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Prize, DrawResult, DrawRules } from "@/app/lib/draw";
import DrawButton from "../src/app/ui/DrawButton";

describe("DrawButton", () => {
  it("renders a button", () => {
    // GIVEN: valid props for DrawButton
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
      <DrawButton
        candidates={candidates}
        prizes={prizes}
        drawRules={drawRules}
        results={results}
        onDraw={ ()=>{} }
      />
    );

    // THEN: a button should be rendered
    const drawButton = screen.getByRole("button");
    expect(drawButton).toBeInTheDocument();
  });

  it("calls onDraw when clicked", async () => {
    // GIVEN: a DrawButton with valid props
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
      <DrawButton
        candidates={candidates}
        prizes={prizes}
        drawRules={drawRules}
        results={results}
        onDraw={onDrawMock}
      />
    );
    
    // WHEN: the button is clicked
    const drawButton = screen.getByRole("button");
    await userEvent.click(drawButton);

    // THEN: onDraw should be called
    expect(onDrawMock).toHaveBeenCalledTimes(1);
    onDrawMock.mockRestore();
  });

  it("alerts when no prize is given", async () => {
    // GIVEN: a DrawButton with no prize is given
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
      <DrawButton
        candidates={candidates}
        prizes={prizes}
        drawRules={drawRules}
        results={results}
        onDraw={() => {}}
      />
    );
    
    // WHEN: the button is clicked
    const drawButton = screen.getByRole("button");
    await userEvent.click(drawButton);

    // THEN: an alert should be called
    expect(alertMock).toHaveBeenCalledTimes(1);
    alertMock.mockRestore();
  });

  it("alerts when no candidate is given", async () => {
    // GIVEN: a DrawButton with no candidate is given
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
      <DrawButton
        candidates={candidates}
        prizes={prizes}
        drawRules={drawRules}
        results={results}
        onDraw={() => {}}
      />
    );
    
    // WHEN: the button is clicked
    const drawButton = screen.getByRole("button");
    await userEvent.click(drawButton);

    // THEN: an alert should be called
    expect(alertMock).toHaveBeenCalledTimes(1);
    alertMock.mockRestore();
  });

  it("alerts when there is not enough candidate is given", async () => {
    // GIVEN: a DrawButton with too few candidates
    const candidates: string[] = [
      "CandidateA",
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

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(
      <DrawButton
        candidates={candidates}
        prizes={prizes}
        drawRules={drawRules}
        results={results}
        onDraw={() => {}}
      />
    );
    
    // WHEN: the button is clicked
    const drawButton = screen.getByRole("button");
    await userEvent.click(drawButton);

    // THEN: an alert should be called
    expect(alertMock).toHaveBeenCalledTimes(1);
    alertMock.mockRestore();
  });

  it("alerts when all prizes have been claimed", async () => {
    // GIVEN: a DrawButton with too few candidates
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
      <DrawButton
        candidates={candidates}
        prizes={prizes}
        drawRules={drawRules}
        results={results}
        onDraw={() => {}}
      />
    );
    
    // WHEN: the button is clicked
    const drawButton = screen.getByRole("button");
    await userEvent.click(drawButton);

    // THEN: an alert should be called
    expect(alertMock).toHaveBeenCalledTimes(1);
    alertMock.mockRestore();
  });
});