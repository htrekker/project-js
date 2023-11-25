import graphlib from "graphlib";
import { WBSStrucutre } from "./wbs";
import { Task } from "../WBS";

class Project {
    #dependency;
    #wbs;

    constructor() {
        this.#dependency = new graphlib.Graph({ directed: false });
        this.#wbs = new WBSStrucutre();
    }

    createTask() {

    }

    promote() {

    }

    lower() {

    }

    createSubTask() {
    }

    createSiblingTask() {
        
    }

    /**
     *
     * @param {Task|String} source
     * @param {Task|String} target
     */
    linkBetween(source, target) {
        if (source instanceof Task) {
            source = source.id;
        } else if (target instanceof Task) {
            target = target.id;
        }

        if (!this.#wbs.has(source) || !this.#wbs.has(target)) {
            throw new Error("无法找到给定的任务");
        }

        this.#dependency.setEdge(source, target);
    }

    /**
     * 根据给定的任务id查询对应的任务
     *
     * @param {string} id 待查询任务id
     */
    getTaskById(id) {
        return {};
    }
}
