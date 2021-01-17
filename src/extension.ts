// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/* START - Added for customize-ui replication */
import * as path from 'path';
import * as fs from 'fs';

interface FolderMap { [key: string]: string; }

interface Contribution {
	folderMap: FolderMap;
	browserModules: Array<string>;
	mainProcessModules: Array<string>;
}

interface API {
	contribute(sourceExtensionId: string, contribution: Contribution): void;
	active(): boolean;
}

function mkdirRecursive(p: string) {
	if (!fs.existsSync(p)) {
		if (path.parse(p).root !== p) {
			let parent = path.join(p, "..");
			mkdirRecursive(parent);
		}
		fs.mkdirSync(p);
	}
}

class CustomUIExtension {

	constructor(context: vscode.ExtensionContext) {
		this.context = context;

		context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('customizeUI.')) {
				this.configurationChanged(e);
			}
		}));
	}

	get sourcePath() {
		return path.join(this.context.extensionPath, "modules");
	}

	get modulesPath() {
		// return path.join(this.context.globalStoragePath, "modules");
		return path.join(this.context.globalStorageUri.path, "modules");
	}

	private copyModule(name: string) {

		let src = path.join(this.sourcePath, name);
		let dst = path.join(this.modulesPath, name);

		let data = fs.readFileSync(src);

		if (fs.existsSync(dst)) {
			let current = fs.readFileSync(dst);
			if (current.compare(data) === 0) {
				return false;
			}
		}
		fs.writeFileSync(dst, data);
		return true;
	}

	// private get haveBottomActivityBar() {
	// 	return vscode.workspace.getConfiguration().get("customizeUI.activityBar") === "bottom";
	// }

	// private get haveInlineTitleBar() {
	// 	return vscode.workspace.getConfiguration().get("customizeUI.titleBar") === "inline";
	// }

	// private get haveFontCustomizations() {
	// 	return vscode.workspace.getConfiguration().get("customizeUI.fontSizeMap") !== undefined &&
	// 		vscode.workspace.getConfiguration().get("customizeUI.font.regular") !== undefined ||
	// 		vscode.workspace.getConfiguration().get("customizeUI.font.monospace") !== undefined;
	// }

	private get haveStylesheetCustomizations() {
		return vscode.workspace.getConfiguration().get("customizeUI.stylesheet") !== undefined;
	}

	async start() {

		let freshStart = !fs.existsSync(this.modulesPath);
		mkdirRecursive(this.modulesPath);

		// copy the modules to global storage path, which unlike extension path is not versioned
		// and will work after update

		let browser = [
			this.copyModule("customize-ui.css"),
			this.copyModule("customize-ui.js"),
			// this.copyModule("activity-bar.js"),
			// this.copyModule("fonts.js"),
			// this.copyModule("title-bar.js")
		];

		let mainProcess = [
			// this.copyModule("title-bar-main-process.js"),
			this.copyModule("utils.js"),
		];

		let updatedBrowser = browser.includes(true);
		let updatedMainProcess = mainProcess.includes(true);

		if (!freshStart && (
			// this.haveBottomActivityBar ||
			// this.haveInlineTitleBar ||
			// this.haveFontCustomizations ||
			this.haveStylesheetCustomizations)) {
			if (updatedMainProcess) {
				let res = await vscode.window.showInformationMessage("CustomizeUI extension was updated. Your VSCode instance needs to be restarted", "Restart");
				if (res === "Restart") {
					this.promptRestart();
				}
			}
			else if (updatedBrowser) {
				let res = await vscode.window.showInformationMessage("CustomizeUI extension was updated. Your VSCode window needs to be reloaded.", "Reload Window");
				if (res === "Reload Window") {
					vscode.commands.executeCommand("workbench.action.reloadWindow");
				}
			}
		}

		let monkeyPatch = vscode.extensions.getExtension("iocave.monkey-patch");

		if (monkeyPatch !== undefined) {
			await monkeyPatch.activate();
			let exports: API = monkeyPatch.exports;
			console.log({ monkeyPatchExports: exports });
			exports.contribute("VehpuS.rtl-ui-support",
				{
					folderMap: {
						"customize-ui": this.modulesPath,
					},
					browserModules: [
						"customize-ui/customize-ui"
					],
					mainProcessModules: [
						// "customize-ui/title-bar-main-process",
					]
				}
			);
		} else {
			vscode.window.showWarningMessage("Monkey Patch extension is not installed. CustomizeUI will not work.");
		}
	}

	private async promptRestart() {
		// This is a hacky way to display the restart prompt
		let v = vscode.workspace.getConfiguration().inspect("window.titleBarStyle");
		if (v !== undefined) {
			let value = vscode.workspace.getConfiguration().get("window.titleBarStyle");
			await vscode.workspace.getConfiguration().update("window.titleBarStyle", value === "native" ? "custom" : "native", vscode.ConfigurationTarget.Global);
			vscode.workspace.getConfiguration().update("window.titleBarStyle", v.globalValue, vscode.ConfigurationTarget.Global);
		}
	}

	async configurationChanged(e: vscode.ConfigurationChangeEvent) {
		let monkeyPatch = vscode.extensions.getExtension("iocave.monkey-patch");
		if (monkeyPatch !== undefined) {
			await monkeyPatch.activate();
			let exports: API = monkeyPatch.exports;
			if (!exports.active()) {
				let res = await vscode.window.showWarningMessage("Monkey Patch extension is not enabled. Please enable Monkey Patch in order to use Customize UI.", "Enable");
				if (res === "Enable") {
					vscode.commands.executeCommand("iocave.monkey-patch.enable");
				}
			} else {
				// if (e.affectsConfiguration("customizeUI.titleBar")) {
				// 	let enabled = this.haveInlineTitleBar;
				// 	if (enabled) {
				// 		let titleBarStyle = vscode.workspace.getConfiguration().get("window.titleBarStyle");
				// 		if (titleBarStyle === "custom") {
				// 			let res = await vscode.window.showWarningMessage("Inline title bar requires titleBarStyle = 'native'.", "Enable");
				// 			if (res === "Enable") {
				// 				await vscode.workspace.getConfiguration().update(
				// 					"window.titleBarStyle", "native", vscode.ConfigurationTarget.Global,
				// 				);
				// 				return;
				// 			}
				// 		}
				// 	}
				// 	this.promptRestart();
				// }
				let res = await vscode.window.showInformationMessage("Customizing UI requires window reload", "Reload Window");
				if (res === "Reload Window") {
					vscode.commands.executeCommand("workbench.action.reloadWindow");
				}
			}
		}
	}

	private context: vscode.ExtensionContext;
}

/* END - Added for customize-ui replication */

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	/* START - Added for customize-ui replication */
	new CustomUIExtension(context).start();
	/* END - Added for customize-ui replication */

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rtl-ui-support" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('rtl-ui-support.showCSSPlans', () => {
		// The code you place here will be executed every time your command is executed

		// ${String.fromCharCode(0x200f)}
		// Display a message box to the user
		vscode.window.showInformationMessage(`
		// TODO: here's some CSS plans

		// Move minimap to left
		.minimap.slider-mouseover {
		    left: auto !important;
			margin-left: 1em;
		}

		// Add per line support for RTL without alignment change
		.view-line>span:before {
		    content: "\\200f";
		}

		.view-line>span:after {
		    content: "\\200f";
		}
		`);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

/*
// Move minimap to left
.minimap.slider-mouseover {
	left: auto !important;
	margin-left: 1em;
}

// Add per line support for RTL without alignment change
.view-line>span:before {
	content: "\200f";
}

.view-line>span:after {
	content: "\200f";
}
*/