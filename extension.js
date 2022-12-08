// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const lodash = require("lodash");
const mkdirp = require("mkdirp");
// import { getDefaultTemplate } from "./templates";
const createTemplates = require("./templates");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand("csft.cft", async (uri) => {
		const templates =  vscode.workspace.getConfiguration().get("csft.templatesPath");
		const fileName = await promptForParam("文件名称");
		if(!fileName){
			return;
		}
		let folderPath = vscode.workspace.workspaceFolders;
		const fsPath = folderPath[0].uri.fsPath;
		const createPath = await getTargetDirectory(uri, fileName);
		let fsPathUri = vscode.Uri.file(`${fsPath}/${templates}`);
		if(!fs.existsSync(`${fsPath}/${templates}`)){
			vscode.window.showErrorMessage("找不到模版文件夹");
			return;
		}
		let fileNameList = await vscode.workspace.fs.readDirectory(fsPathUri);
		if (fileNameList.length === 0) {
			vscode.window.showErrorMessage("找不到模版文件");
			return;
		}
		const templatesName = await promptForUseEquatable(fileNameList);
		fs.readFile(`${fsPath}/${templates}/${templatesName}`, "utf-8", async (err, dataStr) => {
			const getTemplateConfig = new Function(dataStr);
			try {
				const {
					templateInterface,
					template
				} = getTemplateConfig();
				const paramList = {}
				await Promise.all(
					templateInterface.map(async (item) => {
						paramList[item.key] = await promptForParam(item.label);
					})
				)
				await createFileFormTemplate({
					createPath,
					fileName,
					template,
					param: paramList
				});
				const openWhenFinished = vscode.workspace.getConfiguration().get("csft.openWhenFinished");
				if(openWhenFinished){
					const openUri = vscode.Uri.file(`${createPath}/${fileName}`);
					vscode.workspace.openTextDocument(openUri).then((doc) => {
						vscode.window.showTextDocument(doc)
					},(err)=>{
						vscode.window.showErrorMessage(err);
					});
				}
			} catch (err) {
				vscode.window.showErrorMessage(err);
			}
		});
	});

	let initDisposable= vscode.commands.registerCommand("csft.init", async () => {
		let folderPath = vscode.workspace.workspaceFolders;
		const fsPath = folderPath[0].uri.fsPath;
		const templates =  vscode.workspace.getConfiguration().get("csft.templatesPath");
		const contextPath = `${fsPath}/${templates}`;
		if (!fs.existsSync(contextPath)) {
			await mkdirp(contextPath);
		}
		const templateName = await promptForParam('请输入初始化模版名称');
		if(!templateName){
			vscode.window.showInformationMessage('请输入初始化模版名称');
			return;
		}
		await createFileFormTemplate({
			createPath:contextPath,
			fileName:templateName,
			template:createTemplates,
			param: {}
		});
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(initDisposable);
}

// 选择使用的模版
async function promptForUseEquatable(fileNameList) {
	const useEquatablePromptValues = fileNameList.map((item) => {
		return item[0];
	});

	const useEquatablePromptOptions = {
		placeHolder: "请选择创建页面使用的模版?",
		canPickMany: false,
	};

	const answer = await vscode.window.showQuickPick(
		useEquatablePromptValues,
		useEquatablePromptOptions
	);

	return answer;
}

// 监听输入参数
async function promptForParam(label) {
	const contextNamePromptOptions = {
		prompt: `输入${label}`,
		placeHolder: `请输入${label}`,
	};
	return vscode.window.showInputBox(contextNamePromptOptions);
}

// 判断当前是否是有效目录
async function getTargetDirectory(uri, fileName) {
	let targetDirectory;
	if (lodash.isNil(lodash.get(uri, "fsPath")) || !fs.lstatSync(uri.fsPath).isDirectory()) {
		targetDirectory = await promptForTargetDirectory(fileName);
		if (lodash.isNil(targetDirectory)) {
			throw Error("请选择有效的目录");
		}
	} else {
		targetDirectory = uri.fsPath;
	}

	return targetDirectory;
}

// 选择目录
async function promptForTargetDirectory(fileName) {
	const options = {
		canSelectMany: false,
		openLabel: `将${fileName}创建到这个目录`,
		canSelectFolders: true,
	};

	return vscode.window.showOpenDialog(options).then((uri) => {
		if (lodash.isNil(uri) || lodash.isEmpty(uri)) {
			return undefined;
		}
		return uri[0].fsPath;
	});
}

// 将模版写入文件
async function createFileFormTemplate({
	createPath,
	fileName,
	template,
	param
}) {
	const setFileExtendedName =  vscode.workspace.getConfiguration().get("csft.setFileExtendedName");
	let targetPath = `${createPath}/${fileName}`;
	if(setFileExtendedName){
		targetPath = `${targetPath}.${setFileExtendedName}`
	}
	if (fs.existsSync(targetPath)) {
		throw Error(`已经存在文件${fileName}`);
	}
	return new Promise(async (resolve, reject) => {
		fs.writeFile(
			targetPath,
			template(param),
			"utf8",
			(error) => {
				if (error) {
					reject(error);
					return;
				}
				resolve('');
			}
		);
	});
};

module.exports = {
	activate,
	promptForUseEquatable,
	promptForParam,
	getTargetDirectory,
	promptForTargetDirectory,

};