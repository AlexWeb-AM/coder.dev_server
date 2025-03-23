export const receiveCode = async (req, res) => {
    const { code, language } = req.body;

    if (!code || !language) {
        return res.status(400).json({ message: "Write Code!", success: false });
    }

    if (language === "JavaScript" || language === 'TypeScript') {
        try {
            let output = [];
            const originalConsoleLog = console.log;
            console.log = (...args) => output.push(args.join(" "));

            const func = new Function(code);
            const result = func(); 

            console.log = originalConsoleLog;

            if (result !== undefined) {
                output.push(String(result));
            }

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
    }

    return res.status(400).json({ message: "Unsupported language", success: false });
};
