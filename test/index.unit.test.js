const { main, DRY_RUN_MODE, getExecutionCommandLine } = require("../index");

describe("index.js", () => {
    test("main:success", async () => {
        const stdout = "stdout log";
        const stderr = "stderr log";
        const exec = jest.fn(async () => ({ stdout, stderr }));
        const commandline = "command --test";
        const console = {
            log: jest.fn(),
            error: jest.fn(),
        };

        await main({ commandline, console, exec });

        expect(exec).toHaveBeenCalledWith(commandline);
        expect(console.log).toHaveBeenCalledWith("stdout:", "stdout log");
        expect(console.error).toHaveBeenCalledWith("stderr:", "stderr log");
    });

    test("main:failure", async () => {
        const handlerErrors = jest.fn();

        await main({
            exec: jest.fn(async () => {
                throw new Error();
            }),
            handlerErrors,
        });

        expect(handlerErrors).toHaveBeenCalled();
    });

    test("dry-run execution", async () => {
        const core = { getInput: jest.fn(() => "execute-stub.sh") };

        getExecutionCommandLine({ core, steadStepActionMode: DRY_RUN_MODE });

        expect(core.getInput).toHaveBeenCalledTimes(1);
        expect(core.getInput).toHaveBeenCalledWith("stub");
        expect(core.getInput).toHaveReturnedWith("execute-stub.sh");
    });

    test("actual execution", async () => {
        const core = { getInput: jest.fn(() => "execute-run.sh") };

        getExecutionCommandLine({ core, steadStepActionMode: undefined });

        expect(core.getInput).toHaveBeenCalledTimes(1);
        expect(core.getInput).toHaveBeenCalledWith("run");
        expect(core.getInput).toHaveReturnedWith("execute-run.sh");
    });
});
