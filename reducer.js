t.module('reducer', () => {
  const e = {};

  const convoManager = t.require('conversationCore');

  e.reducerFunction = (state, message) => {
    switch(message.type) {
      case 'initialize':
        return {
          newState: {
            ...state,
            mode: 'loading brain',
          },
          commands: [
            { type: 'initialize' },
          ],
        };
      case 'replace brain':
        t.shape({ brain: 'object' }, message);
        return {
          newState: {
            ...state,
            brain: message.brain,
            interrupts: extractInterrupts(message.brain),
            mode: 'ready',
          },
        };
      case 'begin conversation':
        if(state.mode !== 'ready')
          return { newState: state };
        return {
          newState: {
            ...state,
            mode: 'talking',
            currentSection: convoManager.startConversation(state.brain),
          },
        };
      case 'goto section':
        t.shape({ label: 'string' }, message);
        const result = convoManager.jump(
          state.brain,
          state.currentSection,
          message.label)
        if(result.type === 'error') {
          return {
            newState: {
              ...state,
              mode: 'error',
              errorMessage: result.message,
            },
          };
        } else if(result.type === 'url') {
          return {
            newState: {
              ...state,
              mode: 'ready',
              currentSection: undefined,
            },
            commands: [
              {
                type: 'jump to url',
                url: result.url,
              },
            ],
          };
        } else if(result.type === 'section') {
          return {
            newState: {
              ...state,
              mode: 'talking',
              currentSection: result.label,
            },
          };
        } else if(result.type === 'done') {
          return {
            newState: {
              ...state,
              mode: 'ready',
            },
          };
        } else {
          t.warn('urecognized jump result', result);
          return {
            newState: {
              ...state,
              mode: 'error',
              errorMessage: 'Internal error',
            },
          };
        }
      case 'check for interrupts':
        if(state.mode === 'ready') {
          const label = convoManager.checkForInterrupts(
            state.interrupts,
            message.timestamp - state.lastCheckedForInterrupts);
          if(label === null) {
            return {
              newState: {
                ...state,
                lastCheckedForInterrupts: message.timestamp,
              },
            };
          } else {
            return {
              newState: {
                ...state,
                lastCheckedForInterrupts: message.timestamp,
                mode: 'talking',
                lastStartedFlashing: message.timestamp,
                currentSection: label,
              },
            };
          }
        }
      case 'animation frame':
        return { newState: state };
      default:
        t.warn('unknown message type', message);
        return { newState: state };
    }
  };
  e.reducerFunction.meta = `Updates the state for the Grandpa Simulator app.`;

  const extractInterrupts = brain => {
    const interrupts = [];
    for(const sectionLabel in brain) {
      const section = brain[sectionLabel];
      const interval = section.interruptInterval;
      if(interval !== undefined) {
        t.shape('number', interval);
        interrupts.push({
          label: sectionLabel,
          interval,
        });
      }
    }
    return interrupts;
  };

  return e;
});
