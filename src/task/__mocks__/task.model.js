const TaskModel = {
  tasks: [
    {
      id: 1,
      description: 'wash clothes',
      isCompleted: false,
      userId: 1,
      createdAt: '2022-07-16T19:21:24.970Z',
      updatedAt: '2022-07-16T19:21:24.970Z',
    },
    {
      id: 2,
      description: 'learn coding',
      isCompleted: false,
      userId: 1,
      createdAt: '2022-07-16T19:21:50.085Z',
      updatedAt: '2022-07-16T19:21:50.085Z',
    },
    {
      id: 3,
      description: 'learn math',
      isCompleted: false,
      userId: 2,
      createdAt: '2022-07-16T19:22:51.072Z',
      updatedAt: '2022-07-16T19:22:51.072Z',
    },
    {
      id: 4,
      description: 'learn math',
      isCompleted: false,
      userId: 2,
      createdAt: '2022-07-16T19:38:07.137Z',
      updatedAt: '2022-07-16T19:38:07.137Z',
    },
  ],
  async findAll(id) {
    if (!id) return this.tasks;

    const userId = Number(id.where.userId);
    const tasksFilter = this.tasks.filter((task) => task.userId === userId);

    return tasksFilter;
  },
  async findOne(id) {
    const taskId = Number(id.where.id);
    const task = this.tasks.find((task) => task.id === taskId);
    if (!task) return null;

    return task;
  },
  async create(data) {
    const {description, isCompleted, userId} = data;
    const createData = {
      id: 5,
      description,
      isCompleted,
      userId,
      createdAt: '2022-07-16T19:38:07.137Z',
      updatedAt: '2022-07-16T19:38:07.137Z',
    };

    this.tasks.push(createData);
    return createData;
  },
  async update(data, id) {
    const taskId = Number(id.where.id);
    const {description, isCompleted} = data;
    const findTask = this.tasks.find((task) => task.id === taskId);

    findTask.description = description;
    findTask.isCompleted = isCompleted;

    return findTask;
  },
  async destroy(id) {
    const taskId = Number(id.where.id);
    const findTaskDelete = this.tasks.find((task) => task.id === taskId);
    const indexTaskDelete = this.tasks.indexOf(findTaskDelete);
    this.tasks.splice(indexTaskDelete, 1);
  },
};

module.exports = TaskModel;
