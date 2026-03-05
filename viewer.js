t.module('viewer', () => {
  const e = {};

  const grandpaSays = document
    .getElementById('grandpa-says');
  const optionList = document
    .getElementById('I-say');

  e.viewFunction = state => {
    t.log('updating view, mode:', state.mode);

    switch(state.mode) {
      case 'unititialized':
        grandpaSays.innerHTML = '';
        optionList.innerHTML = '';
        break;
      case 'loading brain':
        grandpaSays.innerHTML = 'Loading...';
        optionList.innerHTML = '';
        break;
      case 'ready':
        grandpaSays.innerHTML = 'Ready';
        optionList.innerHTML = '';
        break;
      case 'talking':
        renderConversationSection(state.brain, state.currentSection);
        break;
      case 'error':
        grandpaSays.innerHTML = `Error: ${state.errorMessage}`;
        optionList.innerHTML = '';
        break;
      default:
        t.warn('viewer did not recognize state\'s mode', state);
        break;
    }

    renderTitle(state.lastStartedFlashing, state.mode);
  };
  e.viewFunction.meta = `Updates the UI for the grandpa app.`;

  const renderConversationSection = (brain, currentSection) => {
    grandpaSays.innerHTML = brain[currentSection].text;
    optionList.innerHTML = '';

    const options =
        brain[currentSection].options;

    for(const label in options) {
      const option = options[label];
      optionList.innerHTML +=
        `<li data-option-label="${label}">${option.text}</li>`;
    }
  };

  const renderTitle = (lastStartedFlashing, mode) => {
    if(lastStartedFlashing === undefined) {
      document.title = 'Grandpa Simulator';
      return;
    }

    const timeSince = Date.now() - lastStartedFlashing;
    if(timeSince > 10000 || mode != 'talking') return;

    document.title = timeSince % 1000 > 500
      ? 'Grandpa Said Something'
      : '----------------------';
  };

  return e;
});
