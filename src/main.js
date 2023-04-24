let nada = () => null
let UI = {
  init: (...steps) => window.onload(() => steps.forEach(step => step())),
  component: (type = 'div') => document.createElement(type),
  applyAttributes: (attributes, component) => {
    Objects.entries(attributes).forEach((k, v) => {
      component.setAttribute(k, v)
    })
    return component
  },
  applyClasses: (classes, component) => {
    classes.forEach(_class => component.classList.add(_class))
    return component
  },
  insertText: (text, component) => {
    component.innerText = text
    return component
  },
  appendComponent: (target, component) => {
    target.append(component)
    return component
  },
  appendToTarget: (target) => (component) => UI.appendComponent(target, component),
  prependComponent: (target, component) => {
    target.prepend(component)
    return component
  },
  prependToTarget: (target) => (component) => UI.prependComponent(target, component),
  autoExpandTextarea: (target) => () => {
    target.style.height = 0;
    target.style.height = `${target.scrollHeight}px`; // Set the height to the scroll height
    return target
  },
  autoExpandAllTextAreasWithin: (parentOfTargets) => {
    let targets = parentOfTargets.children
    return () => {
      for (const target of targets) {
        let textarea = target.getElementsByTagName('textarea')[0]
        if (textarea) UI.autoExpandTextarea(textarea)()
      }
    }
  },
  textAreaToParagraph: (parent, textArea, p) => {
    if (textArea.value !== '') {
      p.textContent = textArea.value
      textArea.remove()
      UI.appendComponent(parent, p)
    }
  },
  paragraphToTextArea: (parent, textArea, p) => {
    const text = p.textContent;
    textArea.value = text;
    p.remove()
    UI.appendComponent(parent, textArea)
    textArea.focus()
  },

  consumeTextLoop: (parent, textArea, revealEventType = 'click') => {
    let p = component('p')
    parent.addEventListener(revealEventType, () => UI.paragraphToTextArea(parent, textArea, p));
    return () => UI.textAreaToParagraph(parent, textArea, p)
  },

}
let Signals = {
  new: (value, reaction) => {
    let _signal = (newValue) => {
      value = newValue
      reaction(value)
      return _signal
    }
    return _signal
  }
}

let taskBox = () => {
  //UI
  let taskBoxWrapper = UI.applyClasses(['task_box_wrapper', 'slide_in_from_left'], UI.component())
  let _taskBox = UI.applyClasses(['task_box'], UI.component())
  let taskInput = UI.component('textarea')
  let addStepButton = UI.applyClasses(['add_step_button'], UI.component())

  //Functions
  let consumeTextEvent = UI.consumeTextLoop(_taskBox, taskInput)

  //Signals
  let inputSignal = Signals.new('', UI.autoExpandTextarea(taskInput))

  //Listeners
  taskInput.addEventListener('input', () => inputSignal(taskInput.value))
  taskInput.addEventListener('blur', consumeTextEvent)
  taskInput.addEventListener('blur', () => addStepButton.remove())
  appendComponent(appendComponent(taskBoxWrapper, _taskBox), taskInput);
  _taskBox.focus()
}

UI.init(() => {
  window.addEventListener('resize', autoExpandTasks())
  document.getElementById('add_task_button').addEventListener('click', (e) => {
    let newBox = taskBox()
    document.getElementById('roller').prepend(newBox)
    newBox.getElementsByTagName('textarea')[0].focus()
  })
})
