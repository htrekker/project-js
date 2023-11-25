import graphlib from "graphlib";
import { Task } from "./task";

export class WorkBreakdownStructure {
    #dependency;
    #root;
    #taskMap;

    constructor() {
        this.#dependency = new graphlib.Graph();
        this.#taskMap = new Map();

        this.#root = new Task();
    }

    createTask() {}

    /**
     * 
     * @param {Task|String} task 
     * @param {Object} newTask 
     */
    createSubTaskAt(task, newTask) {

    }

    createSiblingTaskAfter(task, newTask) {}

    promote(task) {}

    lower(task) {}

    updateTask(taskId, taskInfo) {
        
    }

    /**
     *
     * @param {Task|String} source
     * @param {Task|String} target
     * @param {*} dep
     */
    startBefore(pre, suc, dep) {
        this.#dependency.setEdge(pre, suc, dep);
        if (!graphlib.alg.isAcyclic(this.#dependency)) {
            throw new Error("");
        }
    }
}
