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


const render = () => {
  ReactDOM.render(
    <h1>Hello, world! {store.getState().todos.length}</h1>,
    document.getElementById('app')
  );
}

store.subscribe(render);


store.dispatch({
  type: 'ADD_TODO',
  text: 'hello',
  id: 0
});

console.log('--- FIRST ACTION ---');
console.log(store.getState());

store.dispatch({
  type: 'ADD_TODO',
  text: 'world',
  id: 1
});

console.log('--- SECOND ACTION ---');
console.log(store.getState());

store.dispatch({
  type: 'TOGGLE_TODO',
  id: 0
});

console.log('--- THIRD ACTION ---');
console.log(store.getState());

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_NOT_COMPLETED'
});

console.log('--- FOURTH ACTION ---');
console.log(store.getState());
