import React, { useReducer } from "react";
import { ACTIONS } from "./utils/actions";
import type { ReducerActions } from "./utils/types";

const initialState = {
  open: false,
  itemsCount: 0,
  activeItem: 0,
};

export const LightboxContext = React.createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<ReducerActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: typeof initialState, action: ReducerActions) => {
  switch (action.type) {
    case ACTIONS.TOGGLE_OPEN:
      return {
        ...state,
        open: action.payload.open,
      };
    case ACTIONS.SET_ACTIVE_ITEM:
      return {
        ...state,
        activeItem: action.payload.index,
      };
    case ACTIONS.SET_ITEMS_COUNT:
      return {
        ...state,
        itemsCount: action.payload.length,
      };
    case ACTIONS.RESET_STATE:
      return {
        ...state,
        open: false,
        activeItem: 0,
      };
    default:
      return state;
  }
};

export const Provider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <LightboxContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </LightboxContext.Provider>
  );
};

export const useLightboxContext = () => {
  const context = React.useContext(LightboxContext);
  if (context === undefined) {
    throw new Error(
      "useLightboxContext must be used within a LightboxProvider"
    );
  }
  return context;
};