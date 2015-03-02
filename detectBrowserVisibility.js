/**
 * detectBrowserVisibility(options: object?)
 * @description
 * Détecte le changement d'état du navigateur
 * L'onglet est considéré comme étant actif au chargement du script
 *
 * @params
 * `options` (object) peut contenir
 *   - `forceOldBrowsersMethod`
 *     Permet de forcer l'usage des méthodes ancestrales (onfocus et onblur), l'API PageVisibility ne sera pas utilisée
 *     Default: false
 *
 * @return
 * Retourne une instance comportant deux méthodes :
 * onActive(callback: function)
 * onDisabled(callback: function)
 *
 * @usage
 * detectBrowserTabChanges().
 *   onActive(function() {
 *     console.log('onglet de nouveau actif');
 *   }).
 *   onDisabled(function() {
 *     console.log('onglet inactif');
 *   });
 */
var detectBrowserVisibility = function(options) {

  options = options || {};
  options.forceOldBrowsersMethod = options.forceOldBrowsersMethod || false;

  var callbacks = {
    onActive: function() {},
    onDisabled: function() {}
  };

  var eventLabels = {
    hidden: 'visibilitychange',
    mozHidden: 'mozvisibilitychange',
    msHidden: 'msvisibilitychange',
    webkitHidden: 'webkitvisibilitychange'
  };

  var hasPageVisibilityAPI = false;

  if (options.forceOldBrowsersMethod === false) {
    for (var eventLabelKey in eventLabels) {
      if (typeof document[eventLabelKey] !== 'undefined') {
        document.hidden = document[eventLabelKey];
        document.addEventListener(eventLabels[eventLabelKey], function() {
          callbacks[(document.hidden) ? 'onDisabled' : 'onActive']();
        }, false);
        hasPageVisibilityAPI = true;
        break;
      }
    }
  }

  if (options.forceOldBrowsersMethod === true ||
      hasPageVisibilityAPI === false) {
    // old browsers fallback
    if (typeof document.addEventListener === 'function') {
      window.addEventListener('focus', callbacks.onActive, true);
      window.addEventListener('blur', callbacks.onDisabled, true);
    } else {
      window.attachEvent('focus', callbacks.onActive, true);
      window.attachEvent('blur', callbacks.onDisabled, true);
    }
  }

  return new (function() {

    return {
      onActive: function(onActiveCallback) {
        callbacks.onActive = onActiveCallback;
        return this;
      },
      onDisabled: function(onDisabledCallback) {
        callbacks.onDisabled = onDisabledCallback;
        return this;
      }
    }
  });
};