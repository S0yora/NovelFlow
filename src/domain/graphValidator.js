export function validateProject(project) {
    const issues = [];
    const nodeMap = new Map(project.nodes.map((node) => [node.id, node]));
    if (!project.startNodeId) {
        issues.push({ level: "error", message: "Стартовый узел не выбран." });
    }
    else if (!nodeMap.has(project.startNodeId)) {
        issues.push({ level: "error", message: "Стартовый узел указывает на несуществующую сцену." });
    }
    for (const node of project.nodes) {
        if (!node.text.trim()) {
            issues.push({ level: "warning", message: `У узла «${node.title}» пустой текст реплики.` });
        }
        for (const choice of node.choices) {
            if (!choice.targetNodeId || !nodeMap.has(choice.targetNodeId)) {
                issues.push({
                    level: "error",
                    message: `Вариант «${choice.text}» в узле «${node.title}» ведёт в несуществующую сцену.`
                });
            }
        }
    }
    const visited = new Set();
    if (project.startNodeId && nodeMap.has(project.startNodeId)) {
        traverse(project.startNodeId, nodeMap, visited);
    }
    for (const node of project.nodes) {
        if (!visited.has(node.id)) {
            issues.push({ level: "warning", message: `Узел «${node.title}» недостижим от старта.` });
        }
    }
    return issues;
}
function traverse(nodeId, nodeMap, visited) {
    if (visited.has(nodeId))
        return;
    const node = nodeMap.get(nodeId);
    if (!node)
        return;
    visited.add(nodeId);
    for (const choice of node.choices) {
        if (choice.targetNodeId) {
            traverse(choice.targetNodeId, nodeMap, visited);
        }
    }
}
