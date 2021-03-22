import * as vscode from 'vscode';
import * as path from 'path';
import { Uri } from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	
	const fs = vscode.workspace.fs;
	
	let disposable = vscode.commands.registerCommand('remote-file-system-test.showcase', async () => {
		// Project's folder
		let projectDirectory = await vscode.window.showInputBox({prompt: 'Provide current working folder', value: '/projects'});

		if (projectDirectory === undefined) {
			projectDirectory = '/projects'
		}

		// Step 1. Create test folder
		const testFolder = Uri.file(path.join(projectDirectory, 'testFolder'));
		await fs.createDirectory(testFolder);
		vscode.window.showInformationMessage('Step 1. Created test folder');

		// Step 2. Retrieve information about test folder
		const testFolderStat = await fs.stat(testFolder);
		vscode.window.showInformationMessage(`Step 2. Test folder stat: ${JSON.stringify(testFolderStat)}`);

		// Step 3. Create test file inside test folder
		const testFile = Uri.file(path.join(testFolder.fsPath, 'testFile'));
		await fs.writeFile(testFile, Buffer.from('sample content'));
		vscode.window.showInformationMessage('Step 3. Write content to test file');

		// Step 4. Read file content
		const testFileContent: Uint8Array = await fs.readFile(testFile);
		vscode.window.showInformationMessage(`Step 4. Test file content: ${Buffer.from(testFileContent).toString('utf8')}`);

		// Step 5. Copy test file
		const copiedTestFile = Uri.file(path.join(testFolder.fsPath, 'copiedTestFile'));
		await fs.copy(testFile, copiedTestFile, {overwrite: false});
		vscode.window.showInformationMessage('Step 5. Copy test file');

		// Step 6. Rename copied test file
		const renamedCopiedTestFile = Uri.file(path.join(testFolder.fsPath, 'renamedCopiedTestFile'));
		await fs.rename(copiedTestFile, renamedCopiedTestFile, {overwrite: false});
		vscode.window.showInformationMessage('Step 6. Copied file successfully renamed');

		// Step 7. Read directory content
		const directoryContent = await fs.readDirectory(testFolder);
		vscode.window.showInformationMessage(`Step 7. Directory content: ${JSON.stringify(directoryContent)}`);

		// Step 8. 
		await fs.delete(testFolder, {recursive: true, useTrash: false});
		vscode.window.showInformationMessage('Step 8. Test folder deleted');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
