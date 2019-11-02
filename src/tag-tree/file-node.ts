class FileNode {
  // The name that should be displayed when viewing in the ui
  public displayName: string;
  // The absolute filepath
  public filePath: string;
  // The tags that are in the file itself;
  public tags: string[];
  public pathToNode: string;
  public key: string;
  public modifiedDate: Date;
  public createdDate: Date;

  constructor(
    key: string,
    filePath: string,
    pathToNode: string,
    tags: string[],
    displayName: string,
    modifiedDate: Date,
    createdDate: Date
  ) {
    this.displayName = displayName;
    this.key = key;
    this.filePath = filePath;
    this.pathToNode = `${pathToNode}/${this.key}`;
    this.tags = tags;
    this.modifiedDate = modifiedDate;
    this.createdDate = createdDate;
  }
}

interface IFileNodeSort {
  (fileA: FileNode, fileB: FileNode): number;
}

const fileNodeSortName: IFileNodeSort = (fileA: FileNode, fileB: FileNode) => {
  if (fileA.filePath < fileB.filePath) {
    return -1;
  } else if (fileA.filePath > fileB.filePath) {
    return 1;
  } else {
    return 0;
  }
};

// "explorer.sortOrder": "modified",

const fileNodeSortModified: IFileNodeSort = (fileA: FileNode, fileB: FileNode) => {
  if (fileA.modifiedDate < fileB.modifiedDate) {
    return -1;
  } else if (fileA.modifiedDate > fileB.modifiedDate) {
    return 1;
  } else {
    return 0;
  }
};

export { FileNode, fileNodeSortName as fileNodeSortDefalt, fileNodeSortModified };
