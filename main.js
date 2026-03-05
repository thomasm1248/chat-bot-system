(() => {
  const initialState = {
    mode: 'unititialized',
    modules: [],
  };

  const actor = t.require('actor');

  const app = t.require('functionalUiFramework').makeApp(
    initialState,
    t.require('viewer').viewFunction,
    t.require('reducer').reducerFunction,
    command => actor.actorFunction(command, dispatch));

  const dispatch = app.dispatch;

  dispatch({
    type: 'initialize',
  });

  const grandpaSays = document.getElementById('grandpa-says');
  grandpaSays.onclick = e => {
    dispatch({
      type: 'begin conversation',
    });
  };

  const iSay = document.getElementById('I-say');
  iSay.onclick = e => {
    const newSection = e.srcElement.dataset.optionLabel;
    dispatch({
      type: 'goto section',
      label: newSection,
    });
  };

  setInterval(() => {
    dispatch({
      type: 'check for interrupts',
      timestamp: Date.now(),
    });
  }, 1000);

})();
