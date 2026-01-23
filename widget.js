// Pixel Quest v2 - StreamElements Widget
// Supports Twitch + YouTube events

var blondieFieldData = {};
var blondieProgress = 0;
var blondieGoalAmount = 100;
var blondieCurrencySymbol = '$';
var blondieWasComplete = false;
var blondieLastMilestone = 0;
var blondieLastProgress = 0;
var blondieEffectDuration = 4000;

var blondieThemes = {
  cyberpunk: { fill1: '#00fff2', fill2: '#4361ee', fill3: '#9d4edd', border: '#9d4edd', bg: '#0d0221', glow: '#00fff2', effect: 'glitch' },
  synthwave: { fill1: '#ff6ec7', fill2: '#ff9a3c', fill3: '#7b2cbf', border: '#7b2cbf', bg: '#240046', glow: '#ff6ec7', effect: 'neon' },
  arcade: { fill1: '#39ff14', fill2: '#32cd32', fill3: '#ffffff', border: '#ffffff', bg: '#000000', glow: '#39ff14', effect: 'levelup' },
  bloodborne: { fill1: '#ff0000', fill2: '#8b0000', fill3: '#ffd700', border: '#ffd700', bg: '#1a0a0a', glow: '#ff0000', effect: 'blood' },
  ocean: { fill1: '#00ced1', fill2: '#0077be', fill3: '#20b2aa', border: '#20b2aa', bg: '#0a1628', glow: '#00ced1', effect: 'bubbles' },
  sakura: { fill1: '#ffb7c5', fill2: '#ff69b4', fill3: '#ff69b4', border: '#ff69b4', bg: '#2d132c', glow: '#ffb7c5', effect: 'petals' },
  toxic: { fill1: '#adff2f', fill2: '#228b22', fill3: '#ffff00', border: '#ffff00', bg: '#0a1a0a', glow: '#adff2f', effect: 'radioactive' },
  royal: { fill1: '#ffd700', fill2: '#9400d3', fill3: '#ffd700', border: '#ffd700', bg: '#1a0a2e', glow: '#ffd700', effect: 'sparkles' },
  ice: { fill1: '#e0ffff', fill2: '#87ceeb', fill3: '#e0ffff', border: '#e0ffff', bg: '#0a0a1e', glow: '#87ceeb', effect: 'snowflakes' },
  fire: { fill1: '#ffcc00', fill2: '#ff4500', fill3: '#ff4500', border: '#ff4500', bg: '#1a0500', glow: '#ff6600', effect: 'flames' },
  matrix: { fill1: '#00ff00', fill2: '#003300', fill3: '#00ff00', border: '#00ff00', bg: '#000000', glow: '#00ff00', effect: 'matrix' },
  sunset: { fill1: '#ffd700', fill2: '#ff4500', fill3: '#ff7f50', border: '#ff7f50', bg: '#2d1b30', glow: '#ffa07a', effect: 'sunrays' },
  kawaii: { fill1: '#ffb6c1', fill2: '#98fb98', fill3: '#b19cd9', border: '#b19cd9', bg: '#2a1f3d', glow: '#ffb6c1', effect: 'kawaii' }
};

var blondieIcons = {
  star: '⭐', heart: '❤️', diamond: '💎', trophy: '🏆', coin: '🪙',
  fire: '🔥', bolt: '⚡', crown: '👑', sword: '⚔️', shield: '🛡️',
  potion: '🧪', gem: '💠', skull: '💀', flower: '🌸', music: '🎵'
};

window.addEventListener('onWidgetLoad', function(obj) {
  console.log('Pixel Quest v2 loaded', obj);

  blondieFieldData = obj.detail.fieldData || {};
  blondieGoalAmount = parseInt(blondieFieldData.goalAmount) || 100;
  blondieEffectDuration = (parseInt(blondieFieldData.effectDuration) || 4) * 1000;

  // Currency setup
  var currSetting = blondieFieldData.currency || '$';
  if (currSetting === 'custom') {
    blondieCurrencySymbol = blondieFieldData.customCurrency || '$';
  } else {
    blondieCurrencySymbol = currSetting;
  }

  blondieApplyStyles();

  // Load progress from StreamElements session data
  var eventType = blondieFieldData.eventType || 'manual';
  var eventPeriod = blondieFieldData.eventPeriod || 'session';

  if (eventType !== 'manual') {
    // Map event types to SE session keys
    var seEventType = eventType;
    if (eventType === 'member') seEventType = 'subscriber'; // YT members use subscriber key
    if (eventType === 'superchat') seEventType = 'tip'; // Superchats use tip key

    var eventIndex = seEventType + '-' + eventPeriod;
    var sessionData = obj.detail.session.data;

    console.log('Event index:', eventIndex);

    if (sessionData && sessionData[eventIndex]) {
      if (eventType === 'follower' || eventType === 'subscriber' || eventType === 'member') {
        blondieProgress = sessionData[eventIndex].count || 0;
      } else {
        blondieProgress = sessionData[eventIndex].amount || 0;
      }
      console.log('Loaded progress:', blondieProgress);
    }
  }

  blondieUpdateBar();

  // Preview effect in editor
  if (blondieFieldData.previewEffect) {
    setTimeout(function() {
      document.documentElement.style.setProperty('--blondie-progress', '100%');
      blondieSetValuesDisplay(blondieGoalAmount, blondieGoalAmount);
      blondieCelebrate();
    }, 500);
  }
});

window.addEventListener('onEventReceived', function(obj) {
  if (!obj.detail) return;

  var listener = obj.detail.listener;
  var event = obj.detail.event;

  // Handle chat commands
  if (listener === 'message') {
    blondieHandleCommand(event);
    return;
  }

  var eventType = blondieFieldData.eventType || 'manual';
  if (eventType === 'manual') return;

  var eventAmount = event.amount || 0;
  var isGift = event.bulkGifted !== undefined;

  // Twitch events
  if (listener === 'follower-latest' && eventType === 'follower') {
    blondieProgress++;
    blondieIconPulse();
    blondieUpdateBar();
  }
  else if (listener === 'subscriber-latest' && eventType === 'subscriber' && !isGift) {
    blondieProgress++;
    blondieIconPulse();
    blondieUpdateBar();
  }
  else if (listener === 'tip-latest' && eventType === 'tip') {
    blondieProgress += eventAmount;
    blondieIconPulse();
    blondieUpdateBar();
  }
  else if (listener === 'cheer-latest' && eventType === 'cheer') {
    blondieProgress += eventAmount;
    blondieIconPulse();
    blondieUpdateBar();
  }
  // YouTube events
  else if ((listener === 'subscriber-latest' || listener === 'sponsor-latest') && eventType === 'member') {
    blondieProgress++;
    blondieIconPulse();
    blondieUpdateBar();
  }
  else if (listener === 'superchat-latest' && eventType === 'superchat') {
    blondieProgress += eventAmount;
    blondieIconPulse();
    blondieUpdateBar();
  }
});

function blondieAnimateBar(animationType) {
  var barContainer = document.getElementById('blondie-bar-container');
  if (!barContainer) return;

  // Remove any existing animation classes
  barContainer.classList.remove('bar-pulse', 'bar-flash', 'bar-shake', 'bar-bounce');

  // Force reflow to restart animation
  void barContainer.offsetWidth;

  // Add the animation class
  barContainer.classList.add('bar-' + animationType);

  // Remove class after animation completes
  setTimeout(function() {
    barContainer.classList.remove('bar-' + animationType);
  }, 600);
}

function blondieIconPulse() {
  var iconLeft = document.getElementById('blondie-icon-left');
  var iconRight = document.getElementById('blondie-icon-right');
  var icon = (iconLeft && iconLeft.style.display === 'flex') ? iconLeft : iconRight;

  if (icon && icon.style.display === 'flex') {
    icon.classList.remove('blondie-icon-pulse');
    void icon.offsetWidth;
    icon.classList.add('blondie-icon-pulse');
    setTimeout(function() { icon.classList.remove('blondie-icon-pulse'); }, 600);
  }
}

function blondieApplyStyles() {
  var root = document.documentElement;
  var container = document.getElementById('blondie-quest-container');
  var theme = blondieFieldData.colorTheme || 'custom';
  var colors;

  if (theme !== 'custom' && blondieThemes[theme]) {
    colors = blondieThemes[theme];
  } else {
    colors = {
      fill1: blondieFieldData.fillColor1 || '#00fff2',
      fill2: blondieFieldData.fillColor2 || '#4361ee',
      fill3: blondieFieldData.fillColor3 || '#9d4edd',
      border: blondieFieldData.borderColor || '#9d4edd',
      bg: blondieFieldData.barBgColor || '#0d0221',
      glow: blondieFieldData.glowColor || '#00fff2'
    };
  }

  root.style.setProperty('--blondie-bar-width', (blondieFieldData.barWidth || 280) + 'px');
  root.style.setProperty('--blondie-bar-height', (blondieFieldData.barHeight || 32) + 'px');
  root.style.setProperty('--blondie-icon-size', (blondieFieldData.iconSize || 32) + 'px');
  root.style.setProperty('--blondie-fill-1', colors.fill1);
  root.style.setProperty('--blondie-fill-2', colors.fill2);
  root.style.setProperty('--blondie-fill-3', colors.fill3);
  root.style.setProperty('--blondie-border', colors.border);
  root.style.setProperty('--blondie-bg', colors.bg);
  root.style.setProperty('--blondie-glow', colors.glow);
  root.style.setProperty('--blondie-glow-size', (blondieFieldData.glowSize || 10) + 'px');
  root.style.setProperty('--blondie-anim-speed', (blondieFieldData.animSpeed || 3) + 's');

  // Title positioning
  var titleAlign = blondieFieldData.titleAlign || 'widget';
  var titlePos = blondieFieldData.titlePosition || 'top';
  var titleText = blondieFieldData.goalTitle || '';
  var valPos = blondieFieldData.valuesPosition || 'below';

  // All possible title elements
  var titleTop = document.getElementById('blondie-title-top');
  var titleBottom = document.getElementById('blondie-title-bottom');
  var titleLeft = document.getElementById('blondie-title-left');
  var titleRight = document.getElementById('blondie-title-right');
  var titleBarTop = document.getElementById('blondie-title-bar-top');
  var titleBarBottom = document.getElementById('blondie-title-bar-bottom');

  // Hide all titles first
  [titleTop, titleBottom, titleLeft, titleRight, titleBarTop, titleBarBottom].forEach(function(el) {
    if (el) el.style.display = 'none';
  });

  // Calculate title offsets and bar padding for absolutely positioned elements
  // Title height ~24px, values height ~20px
  var titleBarTopOffset = '10px';
  var titleBarBottomOffset = '10px';
  var barPaddingTop = 0;
  var barPaddingBottom = 0;

  var hasTitleBarTop = titleText && titlePos === 'top' && titleAlign === 'bar';
  var hasTitleBarBottom = titleText && titlePos === 'bottom' && titleAlign === 'bar';
  var hasValuesAbove = valPos === 'above';
  var hasValuesBelow = valPos === 'below';

  // Calculate top padding and title offset
  if (hasTitleBarTop && hasValuesAbove) {
    titleBarTopOffset = '36px';
    barPaddingTop = 60; // title(24) + offset(10) + values(20) + offset(6)
  } else if (hasTitleBarTop) {
    barPaddingTop = 34; // title(24) + offset(10)
  } else if (hasValuesAbove) {
    barPaddingTop = 26; // values(20) + offset(6)
  }

  // Calculate bottom padding and title offset
  if (hasTitleBarBottom && hasValuesBelow) {
    titleBarBottomOffset = '36px';
    barPaddingBottom = 60;
  } else if (hasTitleBarBottom) {
    barPaddingBottom = 34;
  } else if (hasValuesBelow) {
    barPaddingBottom = 26;
  }

  root.style.setProperty('--blondie-title-bar-top-offset', titleBarTopOffset);
  root.style.setProperty('--blondie-title-bar-bottom-offset', titleBarBottomOffset);
  root.style.setProperty('--blondie-bar-padding-top', barPaddingTop + 'px');
  root.style.setProperty('--blondie-bar-padding-bottom', barPaddingBottom + 'px');

  if (titleText && titlePos !== 'hidden') {
    var targetTitle = null;

    // Choose correct element based on position and alignment
    if (titlePos === 'top') {
      targetTitle = (titleAlign === 'bar') ? titleBarTop : titleTop;
    } else if (titlePos === 'bottom') {
      targetTitle = (titleAlign === 'bar') ? titleBarBottom : titleBottom;
    } else if (titlePos === 'left') {
      targetTitle = titleLeft;
    } else if (titlePos === 'right') {
      targetTitle = titleRight;
    }

    if (targetTitle) {
      targetTitle.textContent = titleText;
      targetTitle.style.display = 'block';
    }
  }

  // Icons
  var iconLeft = document.getElementById('blondie-icon-left');
  var iconRight = document.getElementById('blondie-icon-right');
  [iconLeft, iconRight].forEach(function(el) {
    if (el) { el.style.display = 'none'; el.innerHTML = ''; }
  });

  if (blondieFieldData.showIcon) {
    var iconEl = blondieFieldData.iconPosition === 'right' ? iconRight : iconLeft;
    if (iconEl) {
      if (blondieFieldData.iconType === 'custom' && blondieFieldData.customIcon) {
        var iconSize = blondieFieldData.iconSize || 32;
        var img = document.createElement('img');
        img.src = blondieFieldData.customIcon;
        img.style.cssText = 'width:' + iconSize + 'px;height:' + iconSize + 'px;object-fit:contain;image-rendering:pixelated;';
        iconEl.appendChild(img);
        iconEl.style.display = 'flex';
      } else if (blondieIcons[blondieFieldData.iconType]) {
        iconEl.textContent = blondieIcons[blondieFieldData.iconType];
        iconEl.style.display = 'flex';
      }
    }
  }

  // Values position setup
  blondieSetupValuesPosition();
}

function blondieSetupValuesPosition() {
  var valPos = blondieFieldData.valuesPosition || 'below';

  // Hide all values containers
  var valAbove = document.getElementById('blondie-values-above');
  var valBelow = document.getElementById('blondie-values-below');
  var valLeft = document.getElementById('blondie-values-left');
  var valRight = document.getElementById('blondie-values-right');
  var valInside = document.getElementById('blondie-values-inside');

  [valAbove, valBelow, valLeft, valRight, valInside].forEach(function(el) {
    if (el) {
      el.style.display = 'none';
      el.innerHTML = '';
      el.classList.remove('pos-left', 'pos-center', 'pos-right');
    }
  });

  // Show values in correct position
  var targetEl = null;
  if (valPos === 'above') targetEl = valAbove;
  else if (valPos === 'below') targetEl = valBelow;
  else if (valPos === 'left') targetEl = valLeft;
  else if (valPos === 'right') targetEl = valRight;
  else if (valPos === 'inside-left' || valPos === 'inside-center' || valPos === 'inside-right') {
    targetEl = valInside;
    if (valPos === 'inside-left') valInside.classList.add('pos-left');
    else if (valPos === 'inside-center') valInside.classList.add('pos-center');
    else if (valPos === 'inside-right') valInside.classList.add('pos-right');
  }

  if (targetEl && valPos !== 'hidden') {
    targetEl.style.display = 'flex';
    targetEl.innerHTML = '<span id="blondie-current">0</span><span class="blondie-separator">|</span><span id="blondie-goal">' + blondieGoalAmount + '</span>';
  }
}

function blondieSetValuesDisplay(current, goal) {
  var eventType = blondieFieldData.eventType || 'manual';
  var isTipType = (eventType === 'tip' || eventType === 'superchat');

  var currEl = document.getElementById('blondie-current');
  var goalEl = document.getElementById('blondie-goal');

  if (currEl) {
    currEl.textContent = isTipType ? blondieCurrencySymbol + Math.round(current) : Math.round(current);
  }
  if (goalEl) {
    goalEl.textContent = isTipType ? blondieCurrencySymbol + goal : goal;
  }
}

function blondieUpdateBar() {
  var pct = Math.min((blondieProgress / blondieGoalAmount) * 100, 100);
  var container = document.getElementById('blondie-quest-container');
  var overflow = blondieFieldData.overflowBehavior || 'show';
  var repeatMode = blondieFieldData.effectRepeat || 'once';

  document.documentElement.style.setProperty('--blondie-progress', pct + '%');

  var displayValue = blondieProgress;
  var isComplete = blondieProgress >= blondieGoalAmount;

  if (isComplete && overflow === 'cap') {
    displayValue = blondieGoalAmount;
  }

  if (!isComplete && container) {
    container.style.opacity = '1';
  }

  blondieSetValuesDisplay(displayValue, blondieGoalAmount);

  // Bar animation on progress (before celebration)
  var progressIncreased = blondieProgress > blondieLastProgress;
  var barAnimation = blondieFieldData.barAnimation || 'none';

  if (progressIncreased && barAnimation !== 'none') {
    blondieAnimateBar(barAnimation);
  }

  // Celebration logic
  var shouldCelebrate = false;

  // Check for goal completion animations (at and after 100%)
  if (isComplete) {
    if (repeatMode === 'once' && !blondieWasComplete) {
      shouldCelebrate = true;
    } else if (repeatMode === 'every' && progressIncreased) {
      shouldCelebrate = true;
    } else if (repeatMode === 'milestones') {
      var currentPct = (blondieProgress / blondieGoalAmount) * 100;
      var currentMilestone = Math.floor(currentPct / 50) * 50;
      if (currentMilestone > blondieLastMilestone && currentMilestone >= 100) {
        shouldCelebrate = true;
        blondieLastMilestone = currentMilestone;
      }
    }
  }

  if (isComplete && !blondieWasComplete && repeatMode === 'milestones') {
    blondieLastMilestone = 100;
  }

  blondieLastProgress = blondieProgress;

  if (shouldCelebrate) {
    blondieCelebrate();

    if (overflow === 'hide') {
      setTimeout(function() {
        if (container) container.style.opacity = '0';
      }, blondieEffectDuration + 1000);
    }
  }

  blondieWasComplete = isComplete;
}

function blondieCelebrate() {
  var effectSetting = blondieFieldData.celebrationEffect || 'theme';
  var theme = blondieFieldData.colorTheme || 'custom';
  var effect;

  if (effectSetting === 'theme' && blondieThemes[theme]) {
    effect = blondieThemes[theme].effect;
  } else if (effectSetting === 'none') {
    return;
  } else {
    effect = effectSetting;
  }

  var container = document.getElementById('blondie-quest-container');
  var effectsBox = document.getElementById('blondie-effects');
  if (!container || !effectsBox) return;

  effectsBox.innerHTML = '';
  container.classList.remove('blondie-glitch-active', 'blondie-shake');

  if (effect !== 'none') {
    container.classList.add('blondie-shake');
    setTimeout(function() { container.classList.remove('blondie-shake'); }, 800);
  }

  switch(effect) {
    case 'confetti': blondieEffectConfetti(effectsBox); break;
    case 'glitch': blondieEffectGlitch(container); break;
    case 'neon': blondieEffectNeon(effectsBox); break;
    case 'levelup': blondieEffectLevelUp(effectsBox); break;
    case 'blood': blondieEffectBlood(effectsBox); break;
    case 'bubbles': blondieEffectBubbles(effectsBox); break;
    case 'petals': blondieEffectPetals(effectsBox); break;
    case 'radioactive': blondieEffectRadioactive(effectsBox); break;
    case 'sparkles': blondieEffectSparkles(effectsBox); break;
    case 'snowflakes': blondieEffectSnowflakes(effectsBox); break;
    case 'flames': blondieEffectFlames(effectsBox); break;
    case 'matrix': blondieEffectMatrix(effectsBox); break;
    case 'sunrays': blondieEffectSunrays(effectsBox); break;
    case 'kawaii': blondieEffectKawaii(effectsBox); break;
  }
}

// Effect functions
function blondieEffectConfetti(box) {
  var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  var waves = Math.ceil(blondieEffectDuration / 800);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 20; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          p.style.cssText = 'left:' + (Math.random()*100) + '%;width:8px;height:8px;background:' + colors[Math.floor(Math.random()*colors.length)] + ';animation:blondie-confetti ' + (1.2+Math.random()*0.8) + 's ease forwards;animation-delay:' + (Math.random()*0.4) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 2500, p);
        }
      }, wave * 700);
    })(w);
  }
}

function blondieEffectGlitch(container) {
  container.classList.add('blondie-glitch-active');
  setTimeout(function() { container.classList.remove('blondie-glitch-active'); }, blondieEffectDuration);
}

function blondieEffectNeon(box) {
  var colors = ['#ff6ec7', '#00ffff', '#ff00ff', '#ffff00'];
  var waves = Math.ceil(blondieEffectDuration / 1000);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 5; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          p.style.cssText = 'left:50%;top:50%;width:50px;height:50px;border-radius:50%;border:3px solid ' + colors[i % colors.length] + ';transform:translate(-50%,-50%);animation:blondie-neon-burst 1s ease forwards;animation-delay:' + (i*0.12) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 1500, p);
        }
      }, wave * 900);
    })(w);
  }
}

function blondieEffectLevelUp(box) {
  var text = document.createElement('div');
  text.className = 'blondie-levelup-text blondie-particle';
  text.textContent = 'LEVEL UP!';
  text.style.animation = 'blondie-levelup 2s ease forwards';
  box.appendChild(text);
  setTimeout(function() { if(text.parentNode) text.parentNode.removeChild(text); }, 2500);
  blondieEffectConfetti(box);
}

function blondieEffectBlood(box) {
  var waves = Math.ceil(blondieEffectDuration / 600);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 10; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          p.style.cssText = 'left:' + (Math.random()*100) + '%;top:0;width:4px;height:' + (15+Math.random()*15) + 'px;background:linear-gradient(180deg,#ff0000,#8b0000);border-radius:2px;animation:blondie-blood-drip ' + (0.8+Math.random()*0.6) + 's ease forwards;animation-delay:' + (Math.random()*0.4) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 2000, p);
        }
      }, wave * 500);
    })(w);
  }
}

function blondieEffectBubbles(box) {
  var waves = Math.ceil(blondieEffectDuration / 700);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 12; i++) {
          var p = document.createElement('div');
          var size = 8 + Math.random() * 18;
          p.className = 'blondie-particle';
          p.style.cssText = 'left:' + (Math.random()*100) + '%;bottom:0;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:rgba(0,206,209,0.3);border:2px solid rgba(0,206,209,0.6);animation:blondie-bubble ' + (1.5+Math.random()*1) + 's ease forwards;animation-delay:' + (Math.random()*0.6) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 3000, p);
        }
      }, wave * 600);
    })(w);
  }
}

function blondieEffectPetals(box) {
  var petals = ['🌸', '🎀', '💮', '🌺'];
  var waves = Math.ceil(blondieEffectDuration / 700);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 12; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          p.textContent = petals[Math.floor(Math.random()*petals.length)];
          p.style.cssText = 'left:' + (Math.random()*100) + '%;font-size:' + (14+Math.random()*12) + 'px;animation:blondie-petal ' + (1.8+Math.random()*1.2) + 's ease forwards;animation-delay:' + (Math.random()*0.6) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 3500, p);
        }
      }, wave * 600);
    })(w);
  }
}

function blondieEffectRadioactive(box) {
  var symbols = ['☢️', '⚠️', '💀', '🧪'];
  var waves = Math.ceil(blondieEffectDuration / 800);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 6; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          p.textContent = symbols[Math.floor(Math.random()*symbols.length)];
          p.style.cssText = 'left:' + (15+Math.random()*70) + '%;top:' + (15+Math.random()*70) + '%;font-size:' + (18+Math.random()*10) + 'px;animation:blondie-radioactive 1.3s ease forwards;animation-delay:' + (Math.random()*0.4) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 2000, p);
        }
      }, wave * 700);
    })(w);
  }
}

function blondieEffectSparkles(box) {
  var sparkles = ['✨', '⭐', '💫', '👑', '💎'];
  var waves = Math.ceil(blondieEffectDuration / 500);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 10; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          p.textContent = sparkles[Math.floor(Math.random()*sparkles.length)];
          p.style.cssText = 'left:' + (Math.random()*100) + '%;top:' + (Math.random()*100) + '%;font-size:' + (16+Math.random()*14) + 'px;animation:blondie-sparkle ' + (0.8+Math.random()*0.5) + 's ease forwards;animation-delay:' + (Math.random()*0.3) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 1800, p);
        }
      }, wave * 400);
    })(w);
  }
}

function blondieEffectSnowflakes(box) {
  var flakes = ['❄️', '❅', '❆', '✧', '⛄'];
  var waves = Math.ceil(blondieEffectDuration / 600);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 12; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          p.textContent = flakes[Math.floor(Math.random()*flakes.length)];
          p.style.cssText = 'left:' + (Math.random()*100) + '%;color:#e0ffff;text-shadow:0 0 10px #87ceeb;font-size:' + (12+Math.random()*12) + 'px;animation:blondie-snow ' + (1.5+Math.random()*1.5) + 's ease forwards;animation-delay:' + (Math.random()*0.6) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 3500, p);
        }
      }, wave * 500);
    })(w);
  }
}

function blondieEffectFlames(box) {
  var flames = ['🔥', '🔥', '💥', '✨', '🔥'];
  var waves = Math.ceil(blondieEffectDuration / 400);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 10; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          p.textContent = flames[Math.floor(Math.random()*flames.length)];
          p.style.cssText = 'left:' + (Math.random()*100) + '%;bottom:0;font-size:' + (18+Math.random()*16) + 'px;animation:blondie-flame ' + (0.8+Math.random()*0.6) + 's ease forwards;animation-delay:' + (Math.random()*0.3) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 2000, p);
        }
      }, wave * 350);
    })(w);
  }
}

function blondieEffectMatrix(box) {
  var chars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF';
  var waves = Math.ceil(blondieEffectDuration / 500);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 20; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle blondie-matrix-char';
          p.textContent = chars[Math.floor(Math.random()*chars.length)];
          p.style.cssText = 'left:' + (Math.random()*100) + '%;animation:blondie-matrix ' + (1+Math.random()*0.8) + 's linear forwards;animation-delay:' + (Math.random()*0.4) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 2500, p);
        }
      }, wave * 400);
    })(w);
  }
}

function blondieEffectSunrays(box) {
  var waves = Math.ceil(blondieEffectDuration / 1200);
  var colors = ['#ffd700', '#ff7f50', '#ffa07a', '#ff4500'];
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 12; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          var color = colors[Math.floor(Math.random()*colors.length)];
          p.style.cssText = 'left:50%;top:50%;width:' + (80+Math.random()*40) + 'px;height:3px;background:linear-gradient(90deg,transparent,' + color + ',transparent);transform-origin:left center;transform:rotate(' + (i*30) + 'deg);animation:blondie-sunray 1.5s ease forwards;animation-delay:' + (i*0.06) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 2500, p);
        }
      }, wave * 1000);
    })(w);
  }
}

function blondieEffectKawaii(box) {
  var kawaii = ['💖', '💕', '🦄', '🌈', '⭐', '✨', '🎀', '💗', '🌟', '🍭', '🧁', '💜', '🦋'];
  var waves = Math.ceil(blondieEffectDuration / 600);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 15; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          p.textContent = kawaii[Math.floor(Math.random()*kawaii.length)];
          p.style.cssText = 'left:' + (Math.random()*100) + '%;bottom:0;font-size:' + (16+Math.random()*18) + 'px;animation:blondie-kawaii-float ' + (1.3+Math.random()*1) + 's ease forwards;animation-delay:' + (Math.random()*0.5) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 3000, p);
        }
      }, wave * 500);
    })(w);
  }
}

function blondieHandleCommand(data) {
  if (!data || !data.text) return;
  var isBroadcaster = data.tags && data.tags.broadcaster === '1';
  var isMod = data.tags && data.tags.mod === '1';
  if (!isBroadcaster && !(blondieFieldData.modCommands && isMod)) return;

  var msg = data.text.trim().split(' ');
  var cmd = msg[0].toLowerCase();
  var val = parseFloat(msg[1]) || 0;

  var cmdAdd = (blondieFieldData.cmdAdd || '!add').toLowerCase();
  var cmdDrop = (blondieFieldData.cmdDrop || '!drop').toLowerCase();
  var cmdProgress = (blondieFieldData.cmdProgress || '!progress').toLowerCase();
  var cmdTarget = (blondieFieldData.cmdTarget || '!target').toLowerCase();
  var cmdClear = (blondieFieldData.cmdClear || '!clear').toLowerCase();

  if (cmd === cmdAdd && val > 0) { blondieProgress += val; blondieIconPulse(); }
  else if (cmd === cmdDrop && val > 0) { blondieProgress = Math.max(0, blondieProgress - val); }
  else if (cmd === cmdProgress) { blondieProgress = Math.max(0, val); }
  else if (cmd === cmdTarget && val > 0) { blondieGoalAmount = val; blondieSetupValuesPosition(); }
  else if (cmd === cmdClear) { blondieProgress = 0; blondieWasComplete = false; blondieLastMilestone = 0; blondieLastProgress = 0; }
  else { return; }

  blondieUpdateBar();
}
