(() => {
  
  // Load modules
  const parser = t.require('chatLanguage');
  const brainCode = t.require('brainCode').code;
  const convoManager = t.require('conversationCore');

  // Parse brain
  const brain = parser.parse(undefined, brainCode, 'brainCode');

  // Connect to UI
  const sectionText = document.getElementById('grandpa-says');
  const optionList = document.getElementById('I-say');

  // State
  let currentSectionLabel = null;

  // Connect event listeners
  sectionText.onclick = e => {
    if(currentSectionLabel !== null) return;
    startConversation();
  };
  optionList.onclick = e => {
    const optionLabel = e.srcElement.dataset.optionLabel;
    selectOption(optionLabel);
  };
  setInterval(() => {
    checkForInterrupts();
  }, 1000);



  // Main logic

  // Start a conversation
  const startConversation = () => {
    currentSectionLabel = convoManager.startConversation(brain),
    t.shape('string', currentSectionLabel);
    renderUi();
  };

  // Select an option during conversation
  const selectOption = label => {
    const result = convoManager.jump(
      brain,
      currentSectionLabel,
      label);
    
    switch(result.type) {
      case 'section':
        currentSectionLabel = result.label;
        t.shape('string', currentSectionLabel);
        renderUi();
        break;
      case 'url':
        openInNewTab(result.url);
        currentSectionLabel = null;
        renderUi();
        break;
      case 'done':
        currentSectionLabel = null;
        renderUi();
        break;
      case 'error':
        console.warn(result.message);
        currentSectionLabel = null;
        renderUi();
        break;
      default:
        t.warn(
          'jumping to option returned weird result:',
          result);
        break;
    }
  };

  // Check for interrupts
  let lastCheck = Date.now();
  const checkForInterrupts = () => {
    // Calculate milliseconds that have passed
    const currentTime = Date.now();
    const passedMS = currentTime - lastCheck;
    lastCheck = currentTime;
    
    // Don't interrupt during conversations
    if(currentSectionLabel !== null) return;

    // Check for an interrupt
    const label = convoManager.checkForInterrupts(
      brain,
      passedMS);

    // Start a new conversation
    if(label !== null) {
      currentSectionLabel = label;
      renderUi();
    }
  };



  // UI operations

  const renderUi = () => {
    if(currentSectionLabel === null) {
      // No conversation currently
      sectionText.innerHTML = 'Click to start conversation';
      optionList.innerHTML = '';
    } else {
      // We're in a conversation
      const section = brain[currentSectionLabel];

      // Display section text
      sectionText.innerHTML = section.text;

      // Display options
      optionList.innerHTML = '';
      const options = section.options;
      for(const label in options) {
        const option = options[label];
        optionList.innerHTML +=
          `<li data-option-label="${label}">${option.text}</li>`;
      }
    }
  };

  const openInNewTab = url => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
  };



  // Initialize UI
  renderUi();

})();
