const todo = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return Object.assign({},
        state, {
          completed: !state.completed
        });
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default: return state;
  }
}

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  if (action.type === 'SET_VISIBILITY_FILTER') {
    return action.filter;
  } else {
    return state;
  }
}

const todoApp = Redux.combineReducers({
  todos,
  visibilityFilter
})


const Link = ({ active, children, onClick }) => {
  if (active) {
    return (
      <span>{ children }</span>
    )
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
    >
      { children }
    </a>
  )
}

class FilterLink extends React.Component {
  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(() =>
      this.forceUpdate()
    )
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const props = this.props
    const state = props.store.getState()
    return (
      <Link active={ props.filter === state.visibilityFilter }
        onClick={() =>
          props.store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
      >
        { props.children }
      </Link>
    )
  }
}

const Footer = ({store}) => {
  return (
    <p>
      Show:&nbsp;
      <FilterLink store={ store } filter='SHOW_ALL'>
        All
      </FilterLink>&nbsp;
      <FilterLink store={ store } filter='SHOW_ACTIVE'>
        Active
      </FilterLink>&nbsp;
      <FilterLink store={ store } filter='SHOW_COMPLETED'>
        Completed
      </FilterLink>
    </p>
  )
}

const Todo = ({onClick, completed, text}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}>
    { text }
  </li>
)

const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)

let nextTodoId = 0

const AddTodo = ({ store }) => {
  let input
  return (
    <div>
      <input ref={node => {
        input = node
      }}/>
      <button onClick={() => {
        store.dispatch({
          type: 'ADD_TODO',
          text: input.value,
          id: nextTodoId++
        })
        input.value = ''
      }}>
        Add Todo
      </button>
    </div>
  )
}

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ACTIVE':
      return todos.filter(t => ! t.completed)
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    default:
      return todos
  }
}

class VisibleTodoList extends React.Component {
  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(() =>
      this.forceUpdate()
    )
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { store } = this.props;
    const state = store.getState();
    return (
      <TodoList
        todos={getVisibleTodos(state.todos, state.visibilityFilter)}
        onTodoClick={id => {
          store.dispatch({
            type: 'TOGGLE_TODO',
            id: id
          });
        }}
      />
    )
  }
}

const TodoApp = ({store}) => (
  <div>
    <AddTodo store={ store } />
    <VisibleTodoList store={ store } />
    <Footer store={ store } />
  </div>
)


ReactDOM.render(
  <TodoApp store={ Redux.createStore(todoApp) } />,
  document.getElementById('app')
);
