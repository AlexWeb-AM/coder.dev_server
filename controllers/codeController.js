import SandboxedModule from 'sandboxed-module';
import ts from 'typescript';

export const receiveCode = async (req, res) => {
    const { code, language } = req.body;

    if (!code || !language) {
        return res.status(400).json({ message: "Write Code!", success: false });
    }

    if (language !== "JavaScript" && language !== "TypeScript") {
        return res.status(400).json({ message: "Unsupported language", success: false });
    }

    try {
        let transpiledCode = code;

        if (language === "TypeScript") {
            const result = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
            transpiledCode = result.outputText;
        }

        let output = [];
        
        const sandbox = SandboxedModule.load('dummy-module', {
            source: transpiledCode,
            globals: {
                console: {
                    log: (...args) => output.push(args.join(" "))
                },
            }
        });

        sandbox.exports(); 

        return res.status(200).json({
            result: output.join("\n"),
            success: true,
            message: null
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Error executing code",
            success: false,
            result: null
        });
    }
};
