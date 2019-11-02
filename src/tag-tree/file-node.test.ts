import { fileNodeSortDefalt, FileNode } from "./file-node";

describe(fileNodeSortDefalt.name, () => {
  test("Sorts in ascending order", () => {
    const fileNodeA = new FileNode("a", "a", "a", [], "a", new Date, new Date);
    const fileNodeB = new FileNode("b", "b", "b", [], "b", new Date, new Date);

    expect(fileNodeSortDefalt(fileNodeA, fileNodeB)).toEqual(-1);
    expect(fileNodeSortDefalt(fileNodeB, fileNodeA)).toEqual(1);
    expect(fileNodeSortDefalt(fileNodeA, fileNodeA)).toEqual(0);
  });
});
