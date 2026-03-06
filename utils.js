'use strict';

t.module('utils', () => {
  const e = {};

  e.encodeTextForHtml = text => {
    // Encodes a string so that it
    // can be safely written to HTML.
    const textArea = document.createElement('textarea');
    t.log('text:', text);
    textArea.innerText = text;
    t.log('innerHTML:', textArea.innerHTML);
    return textArea.innerHTML.split('<br>').join('\n');
  };

  return e;
});
