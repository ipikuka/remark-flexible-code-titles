describe("dummy test", () => {
  it("Line numbers text input should match with the regex", () => {
    const RE = /{([\d,-]+)}/g;
    const input = "{1,2-4}";
    const match = input.match(RE);
    expect(match).not.toBeNull();
  });
});
