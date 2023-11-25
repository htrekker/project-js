import { dayBetween } from "@/utils/datetime";

class DateRange {
    // 记录时间用的，做开又闭
    #start;
    #end;

    mode; // 时间的记录模式：精确或天

    constructor(mode = "day") {
        this.#start = new Date();
        this.#end = new Date();

        this.mode = mode;
    }

    get duration() {
        if (!this.#start || !this.#end) {
            return null;
        }

        return dayBetween(this.#start, this.#end);
    }

    /**
     * 清除 小时、分钟、秒和毫秒
     *
     * @param {Date} datetime 需要被清除的时间
     */
    clearTime(datetime) {
        let t = new Date(datetime);
        t.setHours(0);
        t.setMinutes(0);
        t.setSeconds(0);
        t.setMilliseconds(0);
        return t;
    }

    /**
     *
     * @param {Date} datetime
     */
    set start(datetime) {
        if (this.mode === "precise") {
            this.#start = new Date(datetime);
        } else {
            this.#start = this.clearTime(datetime);
        }
    }

    set end(datetime) {
        if (this.#start && datetime < this.#end) {
            // this.#start = new Date(datetime);
            throw new Error("结束时间必须大于开始时间");
        } else {
            this.#start = this.clearTime(datetime);
        }
    }

    /**
     * 获取range的长度
     */
    get durartion() {
        if (this.mode === "precise") {
            return this.#end - this.#start;
        } else {
            return dayBetween(this.#start, this.#end);
        }
    }
}

/**
 * 任务类型
 * @typedef {Object} Task
 * @property {string} title 任务的标题
 * @property {string} description
 * @property {string} id 任务的uuid
 * @property {Array} subTask
 * @property {number} progress
 * @property {Task} parent
 */
class Task {
    #baseline;
    #plan;
    #real;

    #uuid;

    parent;
    subTasks;

    // ----- 任务的基本信息 -----
    title;
    description;
    #resource;
    #progress; // 任务的进度
    #status; // 任务状态
    #permitStatus; // 任务的审批状态

    // ----- 领域无关的信息 -----
    #abstract;
    #createTime;
    #creator;

    // ----- 扩展信息 -----
    #extensions;

    constructor(baselineStart, baselineEnd) {
        this.#baseline = new DateRange();
        this.#baseline.start = baselineStart;
        this.#baseline.end = baselineEnd;
        this.#plan = new DateRange();
        this.#real = new DateRange();

        // 设置任务的id
        this.#uuid = crypto.randomUUID();

        this.#extensions = new Map();
        this.subTasks = new Array();

        this.#abstract = new Array();
    }

    /**
     * 返回任务的id。id没有setter，所以id是只读的。
     */
    get id() {
        return this.#uuid;
    }

    set progress(progress) {
        this.#progress = progress;
    }

    get abstract() {
        return this.#abstract.join(".");
    }

    set abstract(abstract) {
        this.#abstract = abstract;
    }

    /**
     * 更新子任务的摘要编号，会递归的对所有子任务进行更新。
     */
    updateAbstract() {
        for (let [index, t] of this.subTasks.entries()) {
            t.abstract = this.#abstract.concat(index + 1);
            t.updateAbstract();
        }
    }

    /**
     * 
     * @param {Task|Number} target 
     * @param {Array|Task} newTask 
     */
    insertSubTaskAfter(target, newTask) {
        if (target instanceof Task) {
            target = this.subTasks.findIndex((t) => t.id === target.id);
        } else if (target === null) {
            target = this.subTasks.findIndex((t) => t.id > newTask.id);
        } else if (typeof target === "number" && target < 0) {
            target = this.subTasks.length + target;
        }

        if (newTask instanceof Array) {
            // 如果 target 是数字，直接当成索引使用。
            for (let t of newTask) {
                t.parent = this;
            }
            this.subTasks.splice(target + 1, 0, ...newTask);
        } else {
            newTask.parent = this;
            this.subTasks.splice(target + 1, 0, newTask);
        }

        this.updateAbstract();
    }

    /**
     * 从子任务列表中删除一个任务
     * 
     * @param {String|Task} task 
     */
    removeSubTask(task) {
        if (task instanceof Task) {
            task = task.id;
        }

        let idx = this.subTasks.findIndex(t => t.id === task);
        this.subTasks.splice(idx, 1);

        this.updateAbstract();
    }
}


class Validator {
    validate(obj) {
        console.warn("method not implemented");
    }
}

class TaskValidator extends Validator {
    validate(task) {
        return true;
    }
}

class ProjectValidator extends Validator {
    validate(project) {
        return true;
    }
}