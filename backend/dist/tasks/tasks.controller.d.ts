import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    getAllTasks(filterDto: GetTasksFilterDto): Task[];
    getTaskById(id: string): Task;
    deleteTaskById(id: string): void;
    updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Task;
    createTask(createTaskDto: CreateTaskDto): Task;
}
