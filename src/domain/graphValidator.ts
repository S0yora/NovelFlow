import type { SceneNode, StoryProject, ValidationIssue } from "./types";

export function validateProject(project: StoryProject): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const nodeMap = new Map(project.nodes.map((node) => [node.id, node]));

  if (!project.startNodeId) {
    issues.push({ level: "error", message: "Start node is not selected." });
  } else if (!nodeMap.has(project.startNodeId)) {
    issues.push({ level: "error", message: "Start node points to missing node." });
  }

  for (const node of project.nodes) {
    if (!node.text.trim()) {
      issues.push({ level: "warning", message: `Node "${node.title}" has empty dialogue text.` });
    }

    for (const choice of node.choices) {
      if (!choice.targetNodeId || !nodeMap.has(choice.targetNodeId)) {
        issues.push({
          level: "error",
          message: `Choice "${choice.text}" in node "${node.title}" points to missing target.`
        });
      }
    }
  }

  const visited = new Set<string>();
  if (project.startNodeId && nodeMap.has(project.startNodeId)) {
    traverse(project.startNodeId, nodeMap, visited);
  }
  for (const node of project.nodes) {
    if (!visited.has(node.id)) {
      issues.push({ level: "warning", message: `Node "${node.title}" is unreachable from start.` });
    }
  }

  return issues;
}

function traverse(nodeId: string, nodeMap: Map<string, SceneNode>, visited: Set<string>) {
  if (visited.has(nodeId)) return;
  const node = nodeMap.get(nodeId);
  if (!node) return;

  visited.add(nodeId);
  for (const choice of node.choices) {
    if (choice.targetNodeId) {
      traverse(choice.targetNodeId, nodeMap, visited);
    }
  }
}
