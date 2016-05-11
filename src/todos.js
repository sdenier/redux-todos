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
    this.unsubscribe = this.context.store.subscribe(() =>
      this.forceUpdate()
    )
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const props = this.props
    const store = this.context.store
    const state = store.getState()
    return (
      <Link active={ props.filter === state.visibilityFilter }
        onClick={() =>
          store.dispatch({
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
FilterLink.contextTypes = {
  store: React.PropTypes.object
}

const Footer = () => {
  return (
    <p>
      Show:&nbsp;
      <FilterLink filter='SHOW_ALL'>
        All
      </FilterLink>&nbsp;
      <FilterLink filter='SHOW_ACTIVE'>
        Active
      </FilterLink>&nbsp;
      <FilterLink filter='SHOW_COMPLETED'>
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

const AddTodo = (props, { store }) => {
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
AddTodo.contextTypes = {
  store: React.PropTypes.object
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

const mapStateToProps = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch({
        type: 'TOGGLE_TODO',
        id: id
      })
    }
  }
}

const VisibleTodoList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TodoList);

const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

const { Provider } = ReactRedux

ReactDOM.render(
  <Provider store={ Redux.createStore(todoApp) }>
    <TodoApp />
  </Provider>,
  document.getElementById('app')
)
