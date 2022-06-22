const { main } = require("../index");

describe("index.js", () => {
    test("actual execution", async () => {
        const expectedStringInStdout = "steady-tmp-dir-prefix";
        const console = {
            log: jest.fn(),
            error: jest.fn(),
        };
        const commandline = `ls -al "$(dirname "$(mktemp -d -t '${expectedStringInStdout}')")" | grep '${expectedStringInStdout}'`;

        const { stdout: actualStdout } = await main({ commandline, console });

        expect(actualStdout.trim()).toMatch(
            new RegExp(`^drwx------.+${expectedStringInStdout}.+$`, "m")
        );
    });
});
