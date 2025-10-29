import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CandidateInput from "../src/app/ui/CandidateInput";

describe("CandidateInput", () => {
  it("renders a textarea", () => {
    // GIVEN: valid props for CandidateInput
    const onChange = () => {};

    // WHEN: the component is rendered
    render(<CandidateInput onChange={onChange} />);

    // THEN: a textarea should be rendered
    const candidateInput = screen.getByRole("textbox");
    expect(candidateInput).toBeInTheDocument();
  });

  it("calls onChange when its content is changed", () => {
    // GIVEN: a CandidateInput with valid props
    const mockOnChange = jest.fn();
    render(<CandidateInput onChange={mockOnChange} />);
    
    // WHEN: its content is changed
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, {
      target: { value: "CandidateA\nCandidateB\nCandidateC\n" },
    });

    // THEN: onChange should be called
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("calls onChange with trimmed and filtered names", () => {
    // GIVEN: a CandidateInput with valid props
    const mockOnChange = jest.fn();
    render(<CandidateInput onChange={mockOnChange} />);
    
    // WHEN: its content is changed
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, {
      target: { value: "\n CandidateA \n\n CandidateB \n \n CandidateC \n  " },
    });

    // THEN: onChange should be called with trimmed and filtered names
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(["CandidateA", "CandidateB", "CandidateC"]);
  });

  it("sends empty array when input is cleared", () => {
    // GIVEN: a CandidateInput with valid props
    const mockOnChange = jest.fn();
    render(<CandidateInput onChange={mockOnChange} />);
    
    // WHEN: its content is cleared
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, {
      target: { value: "CandidateA\nCandidateB\nCandidateC\n" },
    });
    fireEvent.change(textarea, { target: { value: "" } });

    // THEN: onChange should be called with empty array
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });
});