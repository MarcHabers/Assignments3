; (function () {
  const e = React.createElement
  const useState = React.useState
  const useEffect = React.useEffect

  const FILTERS = {
    all: 'ALL',
    active: 'ACTIVE',
    done: 'DONE'
  }

  function App() {
    const [tasks, setTasks] = useState(loadTasks)
    const [text, setText] = useState('')
    const [filter, setFilter] = useState(FILTERS.all)

    useEffect(function () {
      localStorage.setItem('todo_list_v3', JSON.stringify(tasks))
    }, [tasks])

    function loadTasks() {
      const raw = localStorage.getItem('todo_list_v3')
      if (!raw) return []
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed
      } catch (err) { }
      return []
    }

    function addTask(evt) {
      evt.preventDefault()
      const clean = text.trim()
      if (clean === '') return
      const newTask = { id: Date.now(), title: clean, done: false }
      setTasks(tasks.concat(newTask))
      setText('')
    }

    function toggleTask(id) {
      const updated = tasks.map(function (t) {
        if (t.id === id) return { id: t.id, title: t.title, done: !t.done }
        return t
      })
      setTasks(updated)
    }

    function deleteTask(id) {
      const filtered = tasks.filter(function (t) { return t.id !== id })
      setTasks(filtered)
    }

    function changeFilter(newFilter) {
      setFilter(newFilter)
    }

    function getVisibleTasks() {
      if (filter === FILTERS.active) {
        return tasks.filter(function (t) { return !t.done })
      }
      if (filter === FILTERS.done) {
        return tasks.filter(function (t) { return t.done })
      }
      return tasks
    }

    const visibleTasks = getVisibleTasks()

    return e('div', { className: 'card' },
      e('form', { className: 'task-form', onSubmit: addTask },
        e('input', {
          type: 'text',
          placeholder: 'Write a new task xD',
          value: text,
          onChange: function (ev) { setText(ev.target.value) },
          'aria-label': 'Neue Aufgabe'
        }),
        e('button', { type: 'submit' }, 'Add')
      ),
      e('div', { className: 'filters' },
        e('button', {
          type: 'button',
          className: filter === FILTERS.all ? 'active' : '',
          onClick: function () { changeFilter(FILTERS.all) }
        }, 'All'),
        e('button', {
          type: 'button',
          className: filter === FILTERS.active ? 'active' : '',
          onClick: function () { changeFilter(FILTERS.active) }
        }, 'Active'),
        e('button', {
          type: 'button',
          className: filter === FILTERS.done ? 'active' : '',
          onClick: function () { changeFilter(FILTERS.done) }
        }, 'Done')
      ),
      e('ul', { className: 'task-list' },
        visibleTasks.length === 0
          ? e('li', { className: 'empty' }, 'No task here')
          : visibleTasks.map(function (task) {
            return e('li', { key: task.id, className: task.done ? 'done' : '' },
              e('label', null,
                e('input', {
                  type: 'checkbox',
                  checked: task.done,
                  onChange: function () { toggleTask(task.id) }
                }),
                e('span', null, task.title)
              ),
              e('button', {
                type: 'button',
                className: 'delete',
                onClick: function () { deleteTask(task.id) }
              }, 'Delete')
            )
          })
      )
    )
  }

  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(e(App))
})()

