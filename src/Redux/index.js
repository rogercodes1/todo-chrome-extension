import { appState } from "./Reducers";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  appState,
});
