const { main } = require("../index");

describe("index.js", () => {
    test("actual execution", async () => {
        const expectedStdout = "command was executed";
        const console = {
            log: jest.fn(),
            error: jest.fn(),
        };
        const commandline = `echo '${expectedStdout}'`;

        const { stdout: actualStdout } = await main({ commandline, console });

        expect(actualStdout).toMatch(new RegExp(`${expectedStdout}`));
    });
});
