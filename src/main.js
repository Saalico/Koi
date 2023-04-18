let component = (type = 'div') => document.createElement(type)
let nada = () => null
let applyAttributes = (attributes, component) => {
  Objects.entries(attributes).forEach((k, v) => {
    component.setAttribute(k, v)
  })
  return component
}
let applyClasses = (classes, component) => {
  classes.forEach(_class => component.classList.add(_class))
  return component
}
let signal = (value, reaction, reactOnInit = false) => {
  if (reactOnInit) reaction(value)
  let _signal = (newValue, preUpdateHook) => {
    preUpdateHook ? preUpdateHook(value) : null
    value = newValue
    reaction(value)
    return _signal
  }
  return _signal
}
let insertText = (text, component) => {
  component.innerText = text
  return component
}
let appendComponent = (target, component) => {
  target.append(component)
  return component
}
let appendToTarget = (target) => (component) => appendComponent(target, component)


let prependComponent = (target, component) => {
  target.prepend(component)
  return component
}

let prependToTarget = (target) => (component) => prependComponent(target, component)

let prependToRoller = prependToTarget(document.getElementById('roller'))

let take = (slot) => () => slot

let store = (host, data) => {
  host.push(data)
  return data
}

let autoExpandTextarea = (target) => () => {
  target.style.height = 0; // Temporarily reset the height to auto
  target.style.height = `${target.scrollHeight}px`; // Set the height to the scroll height
}
let autoExpandTasksOnResize = () => {
  let tasks = document.getElementById('roller').children
  return () => {
    for (const task of tasks) {
      let textarea = task.getElementsByTagName('textarea')[0]
      if (textarea) autoExpandTextarea(textarea)()
    }
  }
}
let autoExpandTextareaHooks = {};
let taskBox = () => {
  //UI
  let taskBoxWrapper = applyClasses(['task_box_wrapper', 'slide_in_from_left'], component())
  let _taskBox = applyClasses(['task_box'], component('div'))
  let taskInput = component('textarea')
  //Functions

  //Signals
  let inputSignal = signal('', autoExpandTextarea(taskInput))
  //Listeners
  taskInput.addEventListener('input', () => inputSignal(taskInput.value))

  appendComponent(appendComponent(taskBoxWrapper, _taskBox), taskInput)

  return taskBoxWrapper
}
window.addEventListener('resize', autoExpandTasksOnResize())


document.getElementById('add_task_button').addEventListener('click', () => prependToRoller(taskBox()))