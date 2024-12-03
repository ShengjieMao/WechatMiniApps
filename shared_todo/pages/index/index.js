// index.js
Page({
  data: {
    newTaskTitle: '',
    newTaskContent: '',
    newTaskCount: '',
    activeTasks: [],
    completedTasks: [],
    nextId: 1
  },

  onLoad() {
    // Load tasks from storage when page loads
    const tasks = wx.getStorageSync('tasks') || { active: [], completed: [], nextId: 1 };
    this.setData({
      activeTasks: tasks.active,
      completedTasks: tasks.completed,
      nextId: tasks.nextId
    });
  },

  saveTasks() {
    // Save tasks to storage
    wx.setStorageSync('tasks', {
      active: this.data.activeTasks,
      completed: this.data.completedTasks,
      nextId: this.data.nextId
    });
  },

  onTitleInput(e) {
    this.setData({ newTaskTitle: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ newTaskContent: e.detail.value });
  },

  onCountInput(e) {
    this.setData({ newTaskCount: e.detail.value });
  },

  addTask() {
    if (!this.data.newTaskTitle.trim()) {
      wx.showToast({
        title: 'Title cannot be empty',
        icon: 'none'
      });
      return;
    }

    const newTask = {
      id: this.data.nextId,
      title: this.data.newTaskTitle,
      content: this.data.newTaskContent,
      count: parseInt(this.data.newTaskCount) || 0,
      completed: false,
      editing: false
    };

    this.setData({
      activeTasks: [...this.data.activeTasks, newTask],
      nextId: this.data.nextId + 1,
      newTaskTitle: '',
      newTaskContent: '',
      newTaskCount: ''
    });

    this.saveTasks();
  },

  toggleTask(e) {
    const taskId = e.currentTarget.dataset.id;
    const task = this.data.activeTasks.find(t => t.id === taskId);
    
    if (task) {
      const updatedActiveTasks = this.data.activeTasks.filter(t => t.id !== taskId);
      task.completed = true;
      
      this.setData({
        activeTasks: updatedActiveTasks,
        completedTasks: [...this.data.completedTasks, task]
      });

      this.saveTasks();
    }
  },

  decrementCount(e) {
    const taskId = e.currentTarget.dataset.id;
    const updatedTasks = this.data.activeTasks.map(task => {
      if (task.id === taskId) {
        const newCount = task.count - 1;
        if (newCount <= 0) {
          task.completed = true;
          task.count = 0;
          this.setData({
            completedTasks: [...this.data.completedTasks, task]
          });
          return null;
        }
        return { ...task, count: newCount };
      }
      return task;
    }).filter(Boolean);

    this.setData({
      activeTasks: updatedTasks
    });

    this.saveTasks();
  },

  editTask(e) {
    const taskId = e.currentTarget.dataset.id;
    const updatedTasks = this.data.activeTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, editing: !task.editing };
      }
      return task;
    });

    this.setData({
      activeTasks: updatedTasks
    });

    this.saveTasks();
  },

  onEditTitleInput(e) {
    const taskId = e.currentTarget.dataset.id;
    const updatedTasks = this.data.activeTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, title: e.detail.value };
      }
      return task;
    });

    this.setData({
      activeTasks: updatedTasks
    });
  },

  onEditContentInput(e) {
    const taskId = e.currentTarget.dataset.id;
    const updatedTasks = this.data.activeTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, content: e.detail.value };
      }
      return task;
    });

    this.setData({
      activeTasks: updatedTasks
    });
  },

  deleteTask(e) {
    const taskId = e.currentTarget.dataset.id;
    const updatedActiveTasks = this.data.activeTasks.filter(t => t.id !== taskId);
    const updatedCompletedTasks = this.data.completedTasks.filter(t => t.id !== taskId);

    this.setData({
      activeTasks: updatedActiveTasks,
      completedTasks: updatedCompletedTasks
    });

    this.saveTasks();
  }
});
