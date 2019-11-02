import * as vscode from 'vscode';

function upsertTags(newTag?: string) {
  const defaultSnippetName = 'vscode_nested_tags_template_default';
  
  // Get first two lines of active editor
  const activeEditor = vscode.window.activeTextEditor;
  if(activeEditor) {
    const text = activeEditor.document.getText(new vscode.Range(0, 0, 1, 4)).replace(/\r?\n|\r/g, "");
    // If header data was alreadly inserted, move cursor to the last of tag list
    if(text === '---tags') {
      //最後の ]の後の，最初の非，スペース
      const match = /[^\s]\s*\]\s*$/.exec(activeEditor.document.lineAt(1).text);
      
      const pos = 
        (match !== null ? new vscode.Position(1, match.index + 1) : new vscode.Position(1, 4));
        
      activeEditor.selection = new vscode.Selection(pos, pos);
      
      if(newTag !== undefined) {
        activeEditor.edit(e => {
          e.insert(activeEditor.selection.start, ", " + newTag);
        });
      }
    } else {
      const pos = new vscode.Position(0, 0);
      activeEditor.selection = new vscode.Selection(pos, pos);
      
      // Insert the default note text
      vscode.commands.executeCommand('editor.action.insertSnippet', ...[{ langId: 'markdown', name: defaultSnippetName }]).then(res => {
        console.log(res);
        
        const activeEditor = vscode.window.activeTextEditor;
        if(activeEditor && newTag !== undefined) {
          activeEditor.edit(e => {
            e.insert(activeEditor.selection.start, newTag);
          });
        }
      }, err => {
        console.error(err);
      });
    }
  }
}

function copySearchPattern() {
  const searchPattern = "^(tags:.*)TAG(\\n|.)*TEXT";
  
  vscode.env.clipboard.writeText(searchPattern).then(res => { console.log("copied!"); });
  
  saveMarkdownFileWithTitleAndTag();
}

function newMarkdownFile() {
  vscode.workspace.openTextDocument({ language: "markdown" }).then((document) => vscode.window.showTextDocument(document));
}

function getMarkdownTitle(doc: vscode.TextDocument): string {
  let inHeader = false;
  
  for(let l=0; l<doc.lineCount; l++) {
    const line = doc.lineAt(l).text.trim();
    
    if(line === "") { continue; }
    if(line === "---") {
      inHeader = !inHeader;
      continue;
    }
    
    if(inHeader) { continue; }
    
    if(line.match(/^#+\s/)) {
      return line.replace(/^#+\s+/, '');
    }
    
    return line;
  }
  
  return "untitled-n";
}

function saveMarkdownFileWithTitleAndTag() {
  const editor = vscode.window.activeTextEditor;
  
  if(editor){    
    // this closed untitled document (vscode's bug?)
    // editor.document.save();
    
    // set tag
    vscode.window.showInputBox({prompt: "Input a tag of this note."})
    .then((tag) => {
      if(tag !== undefined) {
        upsertTags(tag);
      }
      
      const docTitle = getMarkdownTitle(editor.document);
      vscode.env.clipboard.writeText(docTitle).then(res => {
        vscode.window.showInformationMessage('Title copied!');
      });
    });
  }
  
  /*
  var oldDocText = fs.readFileSync(oldFileAbsolutePath);
  fs.writeFileSync(newFileAbsolutePath, oldDocText);

  const finalUri = vscode.Uri.file(newFileAbsolutePath);
  vscode.workspace.openTextDocument(finalUri).then((doc) => {
      vscode.window.showTextDocument(doc, {preview: false});
  });*/
}

export function activateCommand(context: vscode.ExtensionContext) {
  /*{
    const command = 'vscode-nested-tags.insertTag';
    context.subscriptions.push(vscode.commands.registerCommand(command, upsertTags));
  }*/
  
  {
    const command = 'vscode-nested-tags.copySearchPattern';
    context.subscriptions.push(vscode.commands.registerCommand(command, copySearchPattern));
  }
  
  {
    const command = 'vscode-nested-tags.newMarkdownFile';
    context.subscriptions.push(vscode.commands.registerCommand(command, newMarkdownFile));
  }
  
  {
    const command = 'vscode-nested-tags.saveMarkdownFileWithTitleAndTag';
    context.subscriptions.push(vscode.commands.registerCommand(command, saveMarkdownFileWithTitleAndTag));
  }
}
