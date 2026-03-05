'use strict';

t.module('conversationCore', () => {
  const e = {};

  e.startConversation = brain => {
    t.shape({
      'system options': {
        options: {
          'entry points': {
            jumps: ['string'],
          },
        },
      },
    },
    brain);

    const entryPointLabels =
      brain['system options'].options['entry points'].jumps;
    t.assert(entryPointLabels.length > 0, 'there are no entry points');

    const randomIndex = Math.floor(
      Math.random() * entryPointLabels.length);
    return entryPointLabels[randomIndex];
  };
  e.startConversation.meta = `brain => sectionLabel
Chooses a section to start with and returns it.`;

  e.jump = (brain, currentSection, option) => {
    const jumpLabels =
      brain[currentSection].options[option].jumps;

    if(jumpLabels.length === 0) {
      return {
        type: 'done',
      };
    }

    const randomIndex = Math.floor(
      Math.random() * jumpLabels.length);
    const chosenJump = jumpLabels[randomIndex];
    if(brain[chosenJump] === undefined) {
      if(!chosenJump.startsWith('http')) {
        t.warn('jump not defined', chosenJump);
        return {
          type: 'error',
          message: `Section '${chosenJump}' not defined`,
        };
      }
      return {
        type: 'url',
        url: chosenJump,
      };
    }
    return {
      type: 'section',
      label: chosenJump,
    };
  };
  e.jump.meta = `(brain, currentSectionLabel, optionLabel)\
 => { type: 'error|url|section|done', message|url|label: 'string' }
Jumps to a random section pointed to by the chosen option.`;

  e.checkForInterrupts = (interrupts, passedMS) => {
    t.shape([{ label: 'string', interval: 'number'}], interrupts);

    const interruptsThatHappened = interrupts
      .map(interrupt =>{
        const interruptIntervalMS = interrupt.interval * 6000;
        const probability = passedMS / interruptIntervalMS;
        const happened = Math.random() < probability;
        if(happened) t.log('interrupt:', interrupt.label);
        return happened ? interrupt : null;
      })
      .filter(l => l !== null)
      .sort((a, b) => a.interval < b.interval);

    if(interruptsThatHappened.length === 0)
      return null;

    return interruptsThatHappened[0].label;
  }
  e.checkForInterrupts.meta = `(interrupts, passedMS) => label | null
Checks if one of the interrupts happened during the passed ms.`;

  return e;
});
