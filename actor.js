t.module('actor', () => {
  const e = {};

  const initialization = t.require('initialization');

  e.actorFunction = async (command, dispatch) => {
    t.shape({ type: 'string' }, command);
    switch(command.type) {
      case 'initialize':
        await initializeBrain(dispatch);
        break;
      case 'jump to url':
        t.shape({ url: 'string' }, command);
        const link = document.createElement('a');
        link.href = command.url;
        link.target = '_blank';
        link.click();
        break;
      default:
        t.warn('unknown command type:', command);
        break;
    }
  };
  e.actorFunction.meta = `Executes commands\
 for the grandpa simulator app.`;

  const initializeBrain = async dispatch => {
    const coreBrain = await initialization.loadCoreGrandpaBrainAsync();
    dispatch({
      type: 'replace brain',
      brain: coreBrain,
    });
  };

  return e;
});
