// @ts-expect-error// @ts-expect-error the type definitions for Handlebars don't match what we're
// actually using
import Handlebars from "handlebars/dist/handlebars.runtime.js";
import type {
  IState,
  IStateMachine,
} from "../../../types/state-machine-cat.js";

await import("./dot.template.js");
await import("./dot.states.template.js");

Handlebars.registerPartial(
  "dot.states.template.hbs",
  Handlebars.templates["dot.states.template.hbs"],
);

Handlebars.registerHelper("stateSection", (pStateMachine: IStateMachine) =>
  // eslint-disable-next-line no-use-before-define
  Handlebars.templates["dot.states.template.hbs"](splitStates(pStateMachine)),
);

// TODO: duplicate from the one in state-transformers.js
function isType(pString: string) {
  return (pState: IState): boolean => pState.type === pString;
}

// TODO: duplicate from the one in state-transformers.js
function isOneOfTypes(pStringArray: string[]) {
  return (pState: IState): boolean => pStringArray.includes(pState.type);
}

// TODO: duplicate from the one in index.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function splitStates(pStateMachine: any): any {
  pStateMachine.initialStates = pStateMachine.states.filter(isType("initial"));
  pStateMachine.regularStates = pStateMachine.states.filter(
    (pState: IState): boolean =>
      isType("regular")(pState) && !pState.statemachine,
  );
  pStateMachine.historyStates = pStateMachine.states.filter(isType("history"));
  pStateMachine.deepHistoryStates = pStateMachine.states.filter(
    isType("deephistory"),
  );
  pStateMachine.choiceStates = pStateMachine.states.filter(isType("choice"));
  pStateMachine.forkjoinStates = pStateMachine.states.filter(
    isOneOfTypes(["fork", "join", "forkjoin"]),
  );
  pStateMachine.junctionStates = pStateMachine.states.filter(
    isType("junction"),
  );
  pStateMachine.terminateStates = pStateMachine.states.filter(
    isType("terminate"),
  );
  pStateMachine.finalStates = pStateMachine.states.filter(isType("final"));
  pStateMachine.compositeStates = pStateMachine.states.filter(
    (pState: IState) => pState.statemachine,
  );

  return pStateMachine;
}
export default function renderDotFromAST(pStateMachine: IStateMachine): string {
  return Handlebars.templates["dot.template.hbs"](pStateMachine);
}
