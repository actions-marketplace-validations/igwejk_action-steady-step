const _core = require("@actions/core");
const _exec = require("util").promisify(require("child_process").exec);

const DRY_RUN_MODE = "dry-run";

if (require.main === module || !module.parent) {
    const { STEADY_STEP_ACTION_MODE: steadStepActionMode } = process.env;
    const commandline = getExecutionCommandLine({ steadStepActionMode });

    main({ commandline, handlerErrors });
}

function getExecutionCommandLine({ core = _core, steadStepActionMode }) {
    if (DRY_RUN_MODE === steadStepActionMode) {
        return core.getInput("stub");
    }

    return core.getInput("run");
}

async function main({
    commandline,
    exec = _exec,
    console = global.console,
    handlerErrors,
}) {
    try {
        const { stdout, stderr } = await exec(commandline);
        console.log("stdout:", stdout);
        console.error("stderr:", stderr);

        return { stdout, stderr, code: 0 };
    } catch ({ message, code, stdout, stderr }) {
        handlerErrors({ message, code, stdout, stderr });
    }
}

function handlerErrors({
    message = "no error message",
    code = 1,
    stdout,
    stderr,
    core = _core,
    console = global.console,
    process = global.process,
}) {
    core.setFailed(message);
    console.log("stdout:", stdout);
    console.error("stderr:", stderr);
    process.exit(code);
}

module.exports = Object.seal({
    getExecutionCommandLine,
    main,
    handlerErrors,
    DRY_RUN_MODE,
});
