interface Node {
  id: string;
  type: "container" | "slot" | "text" | "icon" | "image";
  children?: Node[];
}

export interface Structure {
  tree: Node;
}
