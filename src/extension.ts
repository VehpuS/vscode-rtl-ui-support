// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

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