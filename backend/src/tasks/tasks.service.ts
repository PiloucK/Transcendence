import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { findIndex } from 'rxjs';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[]{

    const { status, search} = filterDto;
    let tasks = this.getAllTasks(); 

    if(status) {
      tasks = tasks.filter((task) => task.status == status);
    }


    
    if (search) {
      tasks = tasks.filter((tasks) => {
        if(tasks.title.includes(search) || tasks.description.includes(search))
          return true ; 
        else 
          return false ; 
      }); 
    }
    return tasks;
  }

  getTaskById(id: string): Task {
    
    const ret = this.tasks.find((task) => task.id == id); 
    if (!ret)
      throw new NotFoundException('Task with ID "${id}" not found');
    else
      return ret;
  }

  deleteTaskById(id: string): void {
  const found = this.getTaskById(id); 
  const index = this.tasks.indexOf(this.tasks.find((task) => task.id == id)); 
  this.tasks.splice(index); 

  }

  updateTaskStatus(id:string, status: TaskStatus)
  {
    const task = this.getTaskById(id); 
    task.status = status; 
    return task; 
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const {title, description } = createTaskDto;
    console.log('and there');

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }
}
