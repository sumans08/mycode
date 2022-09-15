const path=require("path");delete process.env.ELECTRON_RUN_AS_NODE,process.env.VSCODE_DEV?(process.env.VSCODE_INJECT_NODE_MODULE_LOOKUP_PATH=process.env.VSCODE_INJECT_NODE_MODULE_LOOKUP_PATH||path.join(__dirname,"..","remote","node_modules"),require("./bootstrap-node").injectNodeModuleLookupPath(process.env.VSCODE_INJECT_NODE_MODULE_LOOKUP_PATH)):delete process.env.VSCODE_INJECT_NODE_MODULE_LOOKUP_PATH,require("./bootstrap-amd").load("vs/server/node/server.cli");

//# sourceMappingURL=server-cli.js.map
