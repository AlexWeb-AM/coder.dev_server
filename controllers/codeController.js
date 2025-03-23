import { NodeVM } from "vm2";
import ts from "typescript";

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

        // Если TypeScript, сначала компилируем в JavaScript
        if (language === "TypeScript") {
            const result = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
            transpiledCode = result.outputText;
        }

        let output = [];
        const vm = new NodeVM({
            sandbox: { console: { log: (...args) => output.push(args.join(" ")) } },
            timeout: 1000, // 1 секунда на выполнение
        });

        vm.run(transpiledCode);

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
