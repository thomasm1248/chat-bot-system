'use strict';

t.module('chatLanguage', () => {
  const e = {};

  // Types
  
  const Int = value => {
    if(Math.round(value) !== value)
      throw new Error('value was not an integer');
  };
  const Optional = shape =>
    value => {
      if(value === undefined) return;
      t.shape(shape, value);
    };
  const Dictionary = shape =>
    value => {
      t.shape({}, value);
      for(const key in value)
        t.shape(shape, value[key]);
    };
  const Option = t.freeze({
    text: 'string',
    jumps: ['string'],
  });
  const Section = t.freeze({
    text: 'string',
    interruptInterval: Optional('number'), // minutes
    options: Dictionary(Option),
  });
  const Brain = Dictionary(Section);

  // Parsing

  e.parse = (brain, text, textSourceName) => {
    if(brain === undefined)
      brain = {
        'system options': {
          text: 'These options belong to the system,' +
                ' and can only be modified at the' +
                ' start of a module.',
          options: {
            'entry points': {
              text: 'These define the entry points' +
                    ' that new conversations can' +
                    ' start on. One will be chosen' +
                    ' at random.',
              jumps: [],
            },
          },
        },
      };
    t.shape(Brain, brain);
    t.assert(t.mutable(brain), 'brain must be mutable');
    t.shape('string', text);
    t.shape('string', textSourceName);

    // Split text into lines
    const lines = text
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    let currentSectionLabel = 'system options';
    let currentOptionLabel = 'entry points';
    let i = 0;
    for(let i = 0; i < lines.length; i++) {
      const result = parseLine(
        brain,
        lines[i],
        `${textSourceName} line ${i + 1}`,
        currentSectionLabel,
        currentOptionLabel);
      currentSectionLabel = result.currentSectionLabel;
      currentOptionLabel = result.currentOptionLabel;
    }

    return brain;
  };
  e.parse.meta = `(brain, text, sourceName) => brain
If brain is undefined, then a new empty brain\
 will be created. Either way, the text will be\
 parsed, and the brain will be updated to contain\
 the declarations in the text.`;

  const parseLine = (brain, line, source, currentSectionLabel, currentOptionLabel) => {
    t.shape(Brain, brain);
    t.shape('string', line);
    t.shape('string', source);
    t.shape(Optional('string'), currentSectionLabel);
    t.shape(Optional('string'), currentOptionLabel);
    
    // Try parsing the line
    const result =
      parseSectionDeclaration(line) ??
      parseSectionIntervalDeclaration(line, currentSectionLabel) ??
      parseOptionDeclaration(line, currentSectionLabel) ??
      parseOptionJumpDeclaration(line, currentSectionLabel, currentOptionLabel);
    if(result === null)
      return `${source}: Invalid line.`;

    // Add information to brain
    t.shape({ type: 'string' }, result);
    switch(result.type) {
      case 'section':
        t.shape({ label: 'string', text: 'string' }, result);
        if(brain[result.label] === undefined)
          brain[result.label] = {
            options: {},
          };
        brain[result.label].text = result.text;
        currentSectionLabel = result.label;
        currentOptionLabel = undefined;
        break;
      case 'section interval':
        if(result.label === undefined)
          return `${source}: Failed to imply section label.`;
        t.shape({ label: 'string', minutes: Optional(Int) }, result);
        if(brain[result.label] === undefined)
          return `${source}: The section '${result.label}' hasn't been defined yet.`;
        brain[result.label].interruptInterval = result.minutes;
        currentSectionLabel = result.label;
        currentOptionLabel = undefined;
        break;
      case 'option':
        if(result.section === undefined)
          return `${source}: Failed to imply section label.`;
        t.shape({ section: 'string', option: 'string', text: 'string' }, result);
        if(brain[result.section] === undefined)
          return `${source}: The section '${result.label}' hasn't been defined yet.`;
        if(brain[result.section].options[result.option] === undefined)
          brain[result.section].options[result.option] = {
            jumps: [],
          };
        brain[result.section].options[result.option].text = result.text;
        currentSectionLabel = result.section;
        currentOptionLabel = result.option;
        break;
      case 'option jump':
        if(result.section === undefined)
          return `${source}: Failed to imply section label.`;
        if(result.option === undefined)
          return `${source}: Failed to imply option label.`;
        t.shape({ section: 'string', option: 'string', jump: 'string' }, result);
        if(brain[result.section] === undefined)
          return `${source}: The section '${result.label}' hasn't been defined yet.`;
        if(brain[result.section].options[result.option] === undefined)
          return `${source}: The option '${result.section}.${result.label}' hasn't been defined yet.`;
        brain[result.section].options[result.option].jumps.push(result.jump);
        currentSectionLabel = result.section;
        currentOptionLabel = result.option;
        break;
      default:
        throw new Error(`${source}: Parsing functions\
 returned an unknown shape.`);
    }

    return t.freeze({
      currentSectionLabel,
      currentOptionLabel,
    });
  };

  const parseSectionDeclaration = line => {
    t.shape('string', line);

    const match = line.match(/^(?<label>[\w-]+):(?<text>.*)$/);
    if(match === null)
      return null;

    return t.freeze({
      type: 'section',
      label: match.groups.label,
      text: match.groups.text.trim(),
    });
  };

  const parseSectionIntervalDeclaration = (line, currentSectionLabel) => {
    t.shape('string', line);
    t.shape(Optional('string'), currentSectionLabel);

    // What needs to be collected
    let amount;
    let unit;

    // Allow label to be implied
    const firstCharacter = line[0];
    if(firstCharacter === '~') {
      // Label is implied
      const match = line.match(/^~((?<never>never)|(?<amount>\d+)(?<unit>[mhdMy]))$/);
      if(match === null)
        return null;
      if(match.groups.never === undefined) {
        amount = match.groups.amount;
        unit = match.groups.unit;
      }
    } else {
      // Label is specified
      const match = line.match(/^(?<label>[\w-]+)~((?<never>never)|(?<amount>\d+)(?<unit>[mhdMy]))$/);
      if(match === null)
        return null;
      currentSectionLabel = match.groups.label;
      if(match.groups.never === undefined) {
        amount = match.groups.amount;
        unit = match.groups.unit;
      }
    }

    // Convert unit to minutes
    let minutes;
    if(amount !== undefined) {
      switch(unit) {
        case 'm':
          minutes = amount * 1;
          break;
        case 'h':
          minutes = amount * 60;
          break;
        case 'd':
          minutes = amount * 24 * 60;
          break;
        case 'M':
          minutes = amount * 30 * 24 * 60;
          break;
        case 'y':
          minutes = amount * 365 * 24 * 60;
          break;
        default:
          throw new Error('Unit was not [mhdMy]');
      }
    }

    return t.freeze({
      type: 'section interval',
      label: currentSectionLabel,
      minutes,
    });
  };

  const parseOptionDeclaration = (line, currentSectionLabel) => {
    t.shape('string', line);
    t.shape(Optional('string'), currentSectionLabel);

    // What needs to be collected
    let text;
    let optionLabel;

    // Allow section label to be implied
    const firstCharacter = line[0];
    if(firstCharacter === '.') {
      // Section label is implied
      const match = line.match(/^\.(?<option>[\w-]+):(?<text>.*)$/);
      if(match === null) return null;
      text = match.groups.text.trim();
      optionLabel = match.groups.option;
    } else {
      // Section label is specified
      const match = line.match(/^(?<section>[\w-]+)\.(?<option>[\w-]+):(?<text>.*)$/);
      if(match === null) return null;
      text = match.groups.text.trim();
      optionLabel = match.groups.option;
      currentSectionLabel = match.groups.section;
    }

    return t.freeze({
      type: 'option',
      section: currentSectionLabel,
      option: optionLabel,
      text,
    });
  };

  const parseOptionJumpDeclaration = (line, currentSectionLabel, currentOptionLabel) => {
    t.shape('string', line);
    t.shape(Optional('string'), currentSectionLabel);
    t.shape(Optional('string'), currentOptionLabel);

    // What needs to be collected
    let jumpValue;

    // Allow section/option labels to be implied
    const firstCharacter = line[0];
    if(firstCharacter === '.') {
      // Only section is implied
      const match = line.match(/^\.(?<option>[\w-]+)->(?<jump>.*)$/);
      if(match === null) return null;
      jumpValue = match.groups.jump.trim();
      currentOptionLabel = match.groups.option;
    } else if(firstCharacter === '-') {
      // Both are implied
      const match = line.match(/^->(?<jump>.*)$/);
      if(match === null) return null;
      jumpValue = match.groups.jump.trim();
    } else {
      // Neither are implied
      const match = line.match(/^(?<section>[\w-]+)\.(?<option>[\w-]+)->(?<jump>.*)$/);
      if(match === null) return null;
      jumpValue = match.groups.jump.trim();
      currentOptionLabel = match.groups.option;
      currentSectionLabel = match.groups.section;
    }

    return t.freeze({
      type: 'option jump',
      section: currentSectionLabel,
      option: currentOptionLabel,
      jump: jumpValue,
    });
  };

  return e;
});
