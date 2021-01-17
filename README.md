# VSCode RTL UI Support

<!-- This is the README for your extension "rtl-ui-support". After writing up a brief description, we recommend including the following sections. -->

This extension aims to add support for writing / viewing in right to left mode within VSCode - both per line or per file, with and without document / line alignments.

## Planned Features

This extension is in pre-release, with a feature list still work in progress.

Currently, I'm thinking of the following features:

- [ ] Set whole document to `direction: rtl;`.

- [ ] Move the minimap to the left.

- [ ] RTL layout for the editor using the above.

- [ ] Per line RTL settings

- [ ] Per line alignment to right (still unsure how to implement this in practice - in terms of the desired UX).

- [ ] Dedicated context menu for the different RTL and alignment settings.

- [ ] Workspace settings to remember chosen RTL / alignment layouts for files / lines in files.

- [ ] Comment format to define rtl / alignment blocks in code (?)

## Caveats
- It turns out VSCode [outright disallows making changes to the editor's DOM](https://code.visualstudio.com/api/extension-capabilities/overview#no-dom-access)
- However, [as noted in the RTL issue in vscode's repo](https://github.com/microsoft/vscode/issues/11770#issuecomment-737441166), there is some work done to overcome this using the [Monkey Patch extension](https://github.com/iocave/monkey-patch).
    - [Sample extension using the monkey patch extension](https://github.com/iocave/customize-ui).

## CSS snippets for the planned features

```css
// Move minimap to left

.minimap.slider-mouseover {
    left: auto !important;
    margin-left: 1em; // precise value TBD
}


// Add per line support for RTL without alignment change

.view-line>span:before {
    content: "\200f";
}

.view-line>span:after {
    content: "\200f";
}
```

## Issues to track in VSCode

- [Support for RTL languages #11770](https://github.com/microsoft/vscode/issues/11770)
- [Support for RTL languages (such as Arabic / Hebrew / Persian etc.) #86667](https://github.com/microsoft/vscode/issues/86667)
- [[rtl] Add Right-to-Left editing #4994](https://github.com/microsoft/vscode/issues/4994)

<!--
Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow. -->

<!-- 
## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.
-->

<!--
## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something
-->

<!-- 
## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

-----------------------------------------------------------------------------------------------------------

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
 -->
