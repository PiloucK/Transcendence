"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const task_model_1 = require("./task.model");
const uuid_1 = require("uuid");
let TasksService = class TasksService {
    constructor() {
        this.tasks = [];
    }
    getAllTasks() {
        return this.tasks;
    }
    getTasksWithFilters(filterDto) {
        const { status, search } = filterDto;
        let tasks = this.getAllTasks();
        if (status) {
            tasks = tasks.filter((task) => task.status == status);
        }
        if (search) {
            tasks = tasks.filter((tasks) => {
                if (tasks.title.includes(search) || tasks.description.includes(search))
                    return true;
                else
                    return false;
            });
        }
        return tasks;
    }
    getTaskById(id) {
        const ret = this.tasks.find((task) => task.id == id);
        if (!ret)
            throw new common_1.NotFoundException('Task with ID "${id}" not found');
        else
            return ret;
    }
    deleteTaskById(id) {
        const found = this.getTaskById(id);
        const index = this.tasks.indexOf(this.tasks.find((task) => task.id == id));
        this.tasks.splice(index);
    }
    updateTaskStatus(id, status) {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
    createTask(createTaskDto) {
        const { title, description } = createTaskDto;
        console.log('and there');
        const task = {
            id: (0, uuid_1.v4)(),
            title,
            description,
            status: task_model_1.TaskStatus.OPEN,
        };
        this.tasks.push(task);
        return task;
    }
};
TasksService = __decorate([
    (0, common_1.Injectable)()
], TasksService);
exports.TasksService = TasksService;
//# sourceMappingURL=tasks.service.js.map