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

const store = Redux.createStore(todoApp);


const FilterLink = ({ filter, currentFilter, children }) => {
  if (filter === currentFilter) {
    return (
      <span>{ children }</span>
    )
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault()
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter: filter
        })
      }}
    >
      { children }
    </a>
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

let nextTodoId = 0

class TodoApp extends React.Component {
  render() {
    let {
      todos,
      visibilityFilter
    } = this.props
    let visibleTodos = getVisibleTodos(todos, visibilityFilter)
    return (
      <div>
        <input ref={node => {
          this.input = node
        }}/>
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          });
          this.input.value = '';
        }}>
          Add Todo
        </button>
        <TodoList
          todos={visibleTodos}
          onTodoClick={id => {
            store.dispatch({
              type: 'TOGGLE_TODO',
              id: id
            });
          }}
        />
        <p>
          Show:&nbsp;
          <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter}>
            All
          </FilterLink>&nbsp;
          <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter}>
            Active
          </FilterLink>&nbsp;
          <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter}>
            Completed
          </FilterLink>
        </p>
      </div>
    )
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp
      { ...store.getState() }
    />,
    document.getElementById('app')
  );
}

store.subscribe(render);
render();

