import { render, screen } from "@testing-library/react";
import Skills from "../components/Skills.tsx";

it("renders React skill", () => {
    render(<Skills data={["React","TypeScript"]} />);
    expect(screen.getByText("React")).toBeInTheDocument();
});