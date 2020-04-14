export function defaultState() {
  return {
    loading: false,
    today: "today's date",
  };
}

export function appState(state = defaultState(), action) {
  switch (action.type) {
    case "ADD_ERROR":
      return onShowError(state, action);
    case "CANCEL":
      return onCancel(state);

    default:
      return state;
  }
}

const onShowError = (state, action) => {
  return {
    ...state,
    error: action.error,
    loading: false,
  };
};

const onCancel = (state) => {
  return {
    ...state,
    loading: false,
  };
};
