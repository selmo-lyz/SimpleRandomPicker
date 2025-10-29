import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Prize, DrawResult, draw } from "@/app/lib/draw";
import PrizeInput from "../src/app/ui/PrizeInput";


describe("PrizeInput", () => {
  it("renders the form in initial form mode with no results", () => {
    // GIVEN: valid props with no results for PrizeInput
    const basePrizes: Prize[] = [
      { name: "PrizeA", count: 2 },
      { name: "PrizeB", count: 3 },
    ];
    const drawResults: DrawResult[] = [];
    const setPrizes = jest.fn();

    // WHEN: the component is rendered
    render(<PrizeInput 
      prizes={basePrizes} 
      setPrizes={setPrizes} 
      drawResult={drawResults} 
    />);

    // THEN: the form should be rendered
    expect(screen.getByText("獎品清單")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "切換到 CSV 模式" })).toBeInTheDocument();

    const prizeNames = screen.getAllByPlaceholderText("獎品名稱");
    expect(prizeNames).toHaveLength(2);
    expect(
      prizeNames.map((e) => {(e as HTMLInputElement).value})
    ).toEqual(
      basePrizes.map((p) => {p.name})
    );
  });

  it("renders a 'delete-prize' button for each prize in the form", () => {
    // GIVEN: valid props for PrizeInput
    const basePrizes: Prize[] = [
      { name: "PrizeA", count: 2 },
      { name: "PrizeB", count: 3 },
    ];
    const drawResults: DrawResult[] = [];
    const setPrizes = jest.fn();

    // WHEN: the component is rendered
    render(<PrizeInput 
      prizes={basePrizes} 
      setPrizes={setPrizes} 
      drawResult={drawResults} 
    />);

    // THEN: all prizes should have a 'delete-prize' button
    const deleteBtns = screen.getAllByText("X");
    expect(deleteBtns).toHaveLength(basePrizes.length);
  });

  it("renders a 'add-prize' button in the form", () => {
    // GIVEN: valid props for PrizeInput
    const basePrizes: Prize[] = [
      { name: "PrizeA", count: 2 },
      { name: "PrizeB", count: 3 },
    ];
    const drawResults: DrawResult[] = [];
    const setPrizes = jest.fn();

    // WHEN: the component is rendered
    render(<PrizeInput 
      prizes={basePrizes} 
      setPrizes={setPrizes} 
      drawResult={drawResults} 
    />);

    // THEN: a 'add-prize' button should be rendered
    const addPrizeBtn = screen.getByText("+");
    expect(addPrizeBtn).toBeInTheDocument();
  });

  it("toggles to CSV mode when the switch button is clicked", async () => {
    // GIVEN: a PrizeInput in form mode with valid props and no results
    const basePrizes: Prize[] = [
      { name: "PrizeA", count: 2 },
      { name: "PrizeB", count: 3 },
    ];
    const drawResults: DrawResult[] = [];
    const setPrizes = jest.fn();

    render(<PrizeInput 
      prizes={basePrizes} 
      setPrizes={setPrizes} 
      drawResult={drawResults} 
    />);

    // WHEN: the switch button is clicked
    const swithBtn = screen.getByRole("button", { name: "切換到 CSV 模式" });
    await userEvent.click(swithBtn);

    // THEN: the form should be transformed to csv mode
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("PrizeA,2\nPrizeB,3");
  });

  it("toggles to form mode when the switch button is clicked", async () => {
    // GIVEN: a PrizeInput in CSV mode with valid props and no results
    const basePrizes: Prize[] = [
      { name: "PrizeA", count: 2 },
      { name: "PrizeB", count: 3 },
    ];
    const drawResults: DrawResult[] = [];
    const setPrizes = jest.fn();

    render(<PrizeInput 
      prizes={basePrizes} 
      setPrizes={setPrizes} 
      drawResult={drawResults} 
    />);
    const swithBtn = screen.getByRole("button", { name: "切換到 CSV 模式" });
    await userEvent.click(swithBtn);

    // WHEN: the switch button is clicked
    await userEvent.click(swithBtn);

    // THEN: the form should be transformed to form mode
    const prizeNames = screen.getAllByPlaceholderText("獎品名稱");
    expect(prizeNames).toHaveLength(2);
    expect(
      prizeNames.map((e) => {(e as HTMLInputElement).value})
    ).toEqual(
      basePrizes.map((p) => {p.name})
    );
  });

  it("updates prizes when editing prize fields in form mode", async () => {
    // GIVEN: a PrizeInput with valid props
    const basePrizes: Prize[] = [
      { name: "PrizeA", count: 2 },
      { name: "PrizeB", count: 3 },
    ];
    const drawResults: DrawResult[] = [
      { name: "CandidateA", prize: "PrizeA" },
      { name: "CandidateB", prize: "PrizeB" },
    ];
    const setPrizes = jest.fn();

    render(<PrizeInput 
      prizes={basePrizes} 
      setPrizes={setPrizes} 
      drawResult={drawResults} 
    />);

    // WHEN: a prize field is changed
    const nameInputs = screen.getAllByPlaceholderText("獎品名稱");
    await userEvent.type(nameInputs[0], "PrizeZ");

    // THEN: setPrizes() should be called using updated prizes as arguments
    expect(setPrizes).toHaveBeenCalledWith([
      { name: "PrizeZ", count: basePrizes[0].count },
      ...basePrizes.slice(1),
    ]);
  });

  it("adds a prize when the 'add-prize' button is clicked with no existing prizes", async () => {
    // GIVEN: a PrizeInput with valid props
    const basePrizes: Prize[] = [];
    const drawResults: DrawResult[] = [];
    const setPrizes = jest.fn();

    render(<PrizeInput 
      prizes={basePrizes} 
      setPrizes={setPrizes} 
      drawResult={drawResults} 
    />);

    // WHEN: the 'add-prize' button is clicked
    const addPrizeBtn = screen.getByText("+");
    await userEvent.click(addPrizeBtn);

    // THEN: setPrizes() should be called using updated prizes as arguments
    expect(setPrizes).toHaveBeenCalledWith([
      ...basePrizes,
      { name: "", count: 1 },
    ]);
  });

  it("adds a prize when the 'add-prize' button is clicked with one existing prize", async () => {
    // GIVEN: a PrizeInput with valid props
    const basePrizes: Prize[] = [
      { name: "PrizeA", count: 2 },
    ];
    const drawResults: DrawResult[] = [];
    const setPrizes = jest.fn();

    render(<PrizeInput 
      prizes={basePrizes} 
      setPrizes={setPrizes} 
      drawResult={drawResults} 
    />);

    // WHEN: the 'add-prize' button is clicked
    const addPrizeBtn = screen.getByText("+");
    await userEvent.click(addPrizeBtn);

    // THEN: setPrizes() should be called using updated prizes as arguments
    expect(setPrizes).toHaveBeenCalledWith([
      ...basePrizes,
      { name: "", count: 1 },
    ]);
  });

  it("does not remove prizes when the 'delete-prize' button is clicked with only one existing prize", async () => {
    // GIVEN: a PrizeInput with valid props
    const basePrizes: Prize[] = [
      { name: "PrizeA", count: 2 },
    ];
    const drawResults: DrawResult[] = [];
    const setPrizes = jest.fn();

    render(<PrizeInput 
      prizes={basePrizes} 
      setPrizes={setPrizes} 
      drawResult={drawResults} 
    />);

    // WHEN: the 'delete-prize' button is clicked
    const deleteBtns = screen.getAllByText("X");
    await userEvent.click(deleteBtns[0]);

    // THEN: setPrizes() should be called using same prizes as arguments
    expect(setPrizes).toHaveBeenCalledWith([
      ...basePrizes,
    ]);
  });

  it("removes a prize when the 'delete-prize' button is clicked with > 1 existing prizes", async () => {
    // GIVEN: a PrizeInput with valid props
    const basePrizes: Prize[] = [
      { name: "PrizeA", count: 2 },
      { name: "PrizeB", count: 3 },
    ];
    const drawResults: DrawResult[] = [];
    const setPrizes = jest.fn();

    render(<PrizeInput 
      prizes={basePrizes} 
      setPrizes={setPrizes} 
      drawResult={drawResults} 
    />);

    // WHEN: the 'delete-prize' button is clicked
    const deleteBtns = screen.getAllByText("X");
    await userEvent.click(deleteBtns[0]);

    // THEN: setPrizes() should be called using same prizes as arguments
    expect(setPrizes).toHaveBeenCalledWith([
      ...basePrizes.splice(1),
    ]);
  });
  
  it("updates prizes when editing text in CSV mode", async () => {
    // GIVEN: a PrizeInput in CSV mode with valid props
    const basePrizes: Prize[] = [
      { name: "PrizeA", count: 2 },
      { name: "PrizeB", count: 3 },
    ];
    const drawResults: DrawResult[] = [
      { name: "CandidateA", prize: "PrizeA" },
      { name: "CandidateB", prize: "PrizeB" },
    ];
    const setPrizes = jest.fn();

    render(<PrizeInput 
      prizes={basePrizes} 
      setPrizes={setPrizes} 
      drawResult={drawResults} 
    />);
    await userEvent.click(screen.getByRole("button", { name: "切換到 CSV 模式" }));

    // WHEN: text is updated
    const textarea = screen.getByRole("textbox");
    await userEvent.type(textarea, basePrizes.reduce(
      (text, prize) => (text + `${prize.name}A, ${prize.count+1}`),
      ""
    ));

    // THEN: setPrizes() should be called using updated prizes as arguments
    expect(setPrizes).toHaveBeenCalledWith(basePrizes.map(
      (p) => ({name: p.name + "A", count: p.count + 1})
    ));
  });

  it("displays remaining counts correctly", () => {
    // GIVEN: a PrizeInput in CSV mode with valid props and some results
    const basePrizes: Prize[] = [
      { name: "PrizeA", count: 2 },
      { name: "PrizeB", count: 3 },
    ];
    const drawResults: DrawResult[] = [
      { name: "CandidateA", prize: "PrizeA" },
      { name: "CandidateB", prize: "PrizeB" },
    ];
    const setPrizes = jest.fn();

    // WHEN: the component is rendered
    render(<PrizeInput 
      prizes={basePrizes} 
      setPrizes={setPrizes} 
      drawResult={drawResults} 
    />);

    // THEN: remaining counts should be correct
    const actualCnts = screen.getAllByText(/剩餘 \d+ \//).map((e) => {
      const match = e.textContent.match(/剩餘 (\d+) \//);
      return match ? parseInt(match[1], 10) : NaN;
    });
    const remainingCnts = basePrizes.map((prize) => {
      prize.count - 
      drawResults.filter((r) => r.prize === prize.name).length
    });
    expect(actualCnts).toEqual(remainingCnts);
  });
});
