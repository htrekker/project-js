import graphlib from "graphlib";
import { Task } from "./task";
import { Project } from "./project";
import { WorkBreakdownStructure } from "./wbs";

class Serializer {
    /**
     * 将一个项目对象进行序列化
     */
    dump(project) {
        console.warn("not implemented.");
    }

    /**
     * 反序列化一个项目对象
     */
    load(json) {
        console.warn("not implemented.");
    }
}

class TaskSerializer extends Serializer {
    /**
     * 序列化一个任务对象
     *
     * @param {Task} task 需要序列化的任务对象
     * @returns
     */
    dump(task) {
        return {
            id: task.id,
            title: task.title,
            baseline: task.baseline,
            plan: task.plan,
            real: task.real,
            description: task.description,
            progress: task.progress,
            parent: task.parent.id,
            abstract: task.abstract,
        };
    }

    /**
     * 加载任务对象
     *
     * @param {Object} json 描述任务的json对象
     * @returns
     */
    load(json) {
        return {};
    }
}

class WBSSerializer extends Serializer {
    #taskSerializer;

    constructor() {
        super();
        this.#taskSerializer = new TaskSerializer();
    }

    dump(wbs) {}

    /**
     * 
     * @param {Array.<Task>} json 
     */
    load(json) {
        /**
         * 摘要到任务的映射
         * @type {Map<string, Task>}
         */
        let abstract2Task = new Map();
        let wbs = new WorkBreakdownStructure();
        for (let t of json) {
            abstract2Task.set(t.id, t);
        }

        for (let abstract of Array.from(abstract2Task.keys()).sort()) {
            let segments = abstract.split(".");
            if (segments.length === 1) {
                wbs.createTask();
            } else {
                wbs.createSubTaskAt(t.parent, null);
            }
        }
    }
}

class ProjectSerializer extends Serializer {
    #taskSerializer;
    #wbsSerializer;

    constructor() {
        super();
        this.#taskSerializer = new TaskSerializer();
        this.#wbsSerializer = new WBSSerializer();
    }

    /**
     * 支持对project对象的序列化和反序列化
     *
     * @param {Project} project
     */
    dump(project) {
        let dag = graphlib.json.write(project.dependencies);

        return {
            dependencies: dag["edges"],
        };
    }

    buildGraphlibJson(edges) {
        let options = { directed: true, multigraph: false, compound: false };
        let nodes = new Set();
        for (let edge in edges) {
            nodes.add(edge.v);
            nodes.add(edge.w);
        }

        nodes = Array.from(nodes).forEach((v, i, arr) => {
            arr[i] = { v: v, value: { label: "" } };
        });

        return {
            options: options,
            nodes: nodes,
            edges: edges,
        };
    }

    /**
     *
     * @param {String|Object} json
     */
    load(json) {
        if (!json.dependencies || !json.tasks || !json.resources) {
            throw new Error("项目数据不完整，无法加载");
        }
        let dependencies = graphlib.json.read(this.buildGraphlibJson(json.dependencies));
        let wbs = this.#wbsSerializer.load(json.tasks);

        Project.build(wbs, dependencies, json.resources);
    }
}

const project = new ProjectSerializer();

/**
 * @type {ProjectSerializer}
 */
export default project;
