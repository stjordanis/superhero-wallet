import icon from '../icons/twitter-icon-tip.svg';
import './tipButton.scss';

global.browser = require('webextension-polyfill');

export default url => {
  // Create the tip action
  const superheroTipAction = document.createElement('div');
  superheroTipAction.className = 'action-superhero-tip';
  superheroTipAction.setAttribute('role', 'button');
  superheroTipAction.setAttribute('tabindex', '0');

  // Create the tip button icon
  const buttonIcon = document.createElement('img');
  buttonIcon.src = icon;

  // Create the tip button content
  const buttonContent = document.createElement('span');
  buttonContent.innerHTML = 'Tip';

  // Create the tip button
  const superheroTipButton = document.createElement('button');
  superheroTipButton.appendChild(buttonIcon);
  superheroTipButton.appendChild(buttonContent);

  // Events
  // On click send postMessage for invoking tip with the tweetId
  superheroTipButton.onclick = e => {
    browser.runtime.sendMessage({ from: 'content', type: 'openTipPopup', url });
    e.stopPropagation();
  };

  superheroTipAction.appendChild(superheroTipButton);

  return superheroTipAction;
};
