import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { exportProjectToRenpy } from "@/domain/renpyExporter";
import { validateProject } from "@/domain/graphValidator";
const STORAGE_KEY = "novelflow_mvp_project";
function uid(prefix) {
    const random = Math.random().toString(36).slice(2, 10);
    return `${prefix}_${Date.now()}_${random}`;
}
function createEmptyNode(title) {
    return {
        id: uid("node"),
        title: title ?? "New Node",
        characterName: "",
        text: "",
        backgroundAssetId: "",
        spriteAssetId: "",
        effects: [],
        choices: []
    };
}
function createDefaultProject() {
    const firstNode = createEmptyNode("Start");
    return {
        id: uid("project"),
        title: "My Visual Novel",
        startNodeId: firstNode.id,
        nodes: [firstNode],
        variables: [],
        assets: [],
        updatedAt: new Date().toISOString()
    };
}
export const useProjectStore = defineStore("project", () => {
    const project = ref(createDefaultProject());
    const selectedNodeId = ref(project.value.startNodeId);
    const selectedNode = computed(() => project.value.nodes.find((node) => node.id === selectedNodeId.value) ?? null);
    const validationIssues = computed(() => validateProject(project.value));
    const blockingIssues = computed(() => validationIssues.value.filter((issue) => issue.level === "error"));
    function touch() {
        project.value.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(project.value));
    }
    function loadFromLocalStorage() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return;
        try {
            const parsed = JSON.parse(raw);
            if (!parsed.nodes?.length)
                return;
            project.value = parsed;
            if (!project.value.nodes.some((node) => node.id === selectedNodeId.value)) {
                selectedNodeId.value = project.value.startNodeId || project.value.nodes[0].id;
            }
        }
        catch {
            // Ignore malformed cache.
        }
    }
    function resetProject() {
        project.value = createDefaultProject();
        selectedNodeId.value = project.value.startNodeId;
        touch();
    }
    function setProjectTitle(title) {
        project.value.title = title;
        touch();
    }
    function setStartNode(nodeId) {
        project.value.startNodeId = nodeId;
        touch();
    }
    function selectNode(nodeId) {
        selectedNodeId.value = nodeId;
    }
    function addNode() {
        const node = createEmptyNode(`Node ${project.value.nodes.length + 1}`);
        project.value.nodes.push(node);
        selectedNodeId.value = node.id;
        touch();
    }
    function updateNode(nodeId, patch) {
        const node = project.value.nodes.find((entry) => entry.id === nodeId);
        if (!node)
            return;
        Object.assign(node, patch);
        touch();
    }
    function removeNode(nodeId) {
        if (project.value.nodes.length <= 1)
            return;
        project.value.nodes = project.value.nodes.filter((node) => node.id !== nodeId);
        for (const node of project.value.nodes) {
            node.choices = node.choices.filter((choice) => choice.targetNodeId !== nodeId);
        }
        if (project.value.startNodeId === nodeId) {
            project.value.startNodeId = project.value.nodes[0].id;
        }
        if (selectedNodeId.value === nodeId) {
            selectedNodeId.value = project.value.nodes[0].id;
        }
        touch();
    }
    function addNodeEffect(nodeId) {
        const node = project.value.nodes.find((entry) => entry.id === nodeId);
        if (!node)
            return;
        const effect = { variableKey: "", operation: "set", value: 0 };
        node.effects.push(effect);
        touch();
    }
    function updateNodeEffect(nodeId, index, patch) {
        const node = project.value.nodes.find((entry) => entry.id === nodeId);
        if (!node || !node.effects[index])
            return;
        node.effects[index] = { ...node.effects[index], ...patch };
        touch();
    }
    function removeNodeEffect(nodeId, index) {
        const node = project.value.nodes.find((entry) => entry.id === nodeId);
        if (!node)
            return;
        node.effects.splice(index, 1);
        touch();
    }
    function addChoice(nodeId) {
        const node = project.value.nodes.find((entry) => entry.id === nodeId);
        if (!node)
            return;
        const fallbackTarget = project.value.nodes.find((item) => item.id !== nodeId)?.id ?? nodeId;
        const choice = {
            id: uid("choice"),
            text: "New choice",
            targetNodeId: fallbackTarget,
            conditions: [],
            effects: []
        };
        node.choices.push(choice);
        touch();
    }
    function updateChoice(nodeId, choiceId, patch) {
        const node = project.value.nodes.find((entry) => entry.id === nodeId);
        if (!node)
            return;
        const choice = node.choices.find((entry) => entry.id === choiceId);
        if (!choice)
            return;
        Object.assign(choice, patch);
        touch();
    }
    function removeChoice(nodeId, choiceId) {
        const node = project.value.nodes.find((entry) => entry.id === nodeId);
        if (!node)
            return;
        node.choices = node.choices.filter((choice) => choice.id !== choiceId);
        touch();
    }
    function addChoiceCondition(nodeId, choiceId) {
        const choice = findChoice(nodeId, choiceId);
        if (!choice)
            return;
        const condition = { variableKey: "", operator: "==", value: 0 };
        choice.conditions.push(condition);
        touch();
    }
    function updateChoiceCondition(nodeId, choiceId, index, patch) {
        const choice = findChoice(nodeId, choiceId);
        if (!choice || !choice.conditions[index])
            return;
        choice.conditions[index] = { ...choice.conditions[index], ...patch };
        touch();
    }
    function removeChoiceCondition(nodeId, choiceId, index) {
        const choice = findChoice(nodeId, choiceId);
        if (!choice)
            return;
        choice.conditions.splice(index, 1);
        touch();
    }
    function addChoiceEffect(nodeId, choiceId) {
        const choice = findChoice(nodeId, choiceId);
        if (!choice)
            return;
        const effect = { variableKey: "", operation: "set", value: 0 };
        choice.effects.push(effect);
        touch();
    }
    function updateChoiceEffect(nodeId, choiceId, index, patch) {
        const choice = findChoice(nodeId, choiceId);
        if (!choice || !choice.effects[index])
            return;
        choice.effects[index] = { ...choice.effects[index], ...patch };
        touch();
    }
    function removeChoiceEffect(nodeId, choiceId, index) {
        const choice = findChoice(nodeId, choiceId);
        if (!choice)
            return;
        choice.effects.splice(index, 1);
        touch();
    }
    function addVariable() {
        const variable = {
            id: uid("var"),
            key: `var_${project.value.variables.length + 1}`,
            type: "number",
            defaultValue: 0
        };
        project.value.variables.push(variable);
        touch();
    }
    function updateVariable(variableId, patch) {
        const variable = project.value.variables.find((entry) => entry.id === variableId);
        if (!variable)
            return;
        Object.assign(variable, patch);
        touch();
    }
    function removeVariable(variableId) {
        const variable = project.value.variables.find((entry) => entry.id === variableId);
        if (!variable)
            return;
        project.value.variables = project.value.variables.filter((entry) => entry.id !== variableId);
        touch();
    }
    function addAsset(asset) {
        project.value.assets.push(asset);
        touch();
    }
    function removeAsset(assetId) {
        project.value.assets = project.value.assets.filter((asset) => asset.id !== assetId);
        for (const node of project.value.nodes) {
            if (node.backgroundAssetId === assetId)
                node.backgroundAssetId = "";
            if (node.spriteAssetId === assetId)
                node.spriteAssetId = "";
        }
        touch();
    }
    function exportProjectJson() {
        return JSON.stringify(project.value, null, 2);
    }
    function importProjectJson(json) {
        try {
            const parsed = JSON.parse(json);
            if (!parsed.nodes?.length)
                return { ok: false, message: "Project JSON has no nodes." };
            project.value = parsed;
            selectedNodeId.value = parsed.startNodeId || parsed.nodes[0].id;
            touch();
            return { ok: true, message: "Project imported." };
        }
        catch {
            return { ok: false, message: "Invalid JSON." };
        }
    }
    function exportRenpy() {
        return exportProjectToRenpy(project.value);
    }
    function findChoice(nodeId, choiceId) {
        const node = project.value.nodes.find((entry) => entry.id === nodeId);
        if (!node)
            return null;
        return node.choices.find((entry) => entry.id === choiceId) ?? null;
    }
    loadFromLocalStorage();
    return {
        project,
        selectedNodeId,
        selectedNode,
        validationIssues,
        blockingIssues,
        setProjectTitle,
        setStartNode,
        selectNode,
        addNode,
        updateNode,
        removeNode,
        addNodeEffect,
        updateNodeEffect,
        removeNodeEffect,
        addChoice,
        updateChoice,
        removeChoice,
        addChoiceCondition,
        updateChoiceCondition,
        removeChoiceCondition,
        addChoiceEffect,
        updateChoiceEffect,
        removeChoiceEffect,
        addVariable,
        updateVariable,
        removeVariable,
        addAsset,
        removeAsset,
        exportProjectJson,
        importProjectJson,
        exportRenpy,
        resetProject
    };
});
