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
  cyberpunk: { fill1: '#00fff2', fill2: '#4361ee', fill3: '#9d4edd', border: '#9d4edd', bg: '#0d0221', glow: '#00fff2', effect: 'glitch', icon: 'emoji-star' },
  synthwave: { fill1: '#ff6ec7', fill2: '#ff9a3c', fill3: '#7b2cbf', border: '#7b2cbf', bg: '#240046', glow: '#ff6ec7', effect: 'neon', icon: 'emoji-gamepad' },
  arcade: { fill1: '#39ff14', fill2: '#32cd32', fill3: '#ffffff', border: '#ffffff', bg: '#000000', glow: '#39ff14', effect: 'levelup', icon: 'emoji-alien' },
  bloodborne: { fill1: '#ff0000', fill2: '#8b0000', fill3: '#ffd700', border: '#ffd700', bg: '#1a0a0a', glow: '#ff0000', effect: 'blood', icon: 'emoji-blood' },
  ocean: { fill1: '#00ced1', fill2: '#0077be', fill3: '#20b2aa', border: '#20b2aa', bg: '#0a1628', glow: '#00ced1', effect: 'bubbles', icon: 'emoji-wave' },
  sakura: { fill1: '#ffb7c5', fill2: '#ff69b4', fill3: '#ff69b4', border: '#ff69b4', bg: '#2d132c', glow: '#ffb7c5', effect: 'petals', icon: 'emoji-flower' },
  toxic: { fill1: '#adff2f', fill2: '#228b22', fill3: '#ffff00', border: '#ffff00', bg: '#0a1a0a', glow: '#adff2f', effect: 'radioactive', icon: 'emoji-radioactive' },
  royal: { fill1: '#ffd700', fill2: '#9400d3', fill3: '#ffd700', border: '#ffd700', bg: '#1a0a2e', glow: '#ffd700', effect: 'sparkles', icon: 'emoji-crown' },
  ice: { fill1: '#e0ffff', fill2: '#87ceeb', fill3: '#e0ffff', border: '#e0ffff', bg: '#0a0a1e', glow: '#87ceeb', effect: 'snowflakes', icon: 'emoji-snowflake' },
  fire: { fill1: '#ffcc00', fill2: '#ff4500', fill3: '#ff4500', border: '#ff4500', bg: '#1a0500', glow: '#ff6600', effect: 'flames', icon: 'emoji-fire' },
  matrix: { fill1: '#00ff00', fill2: '#003300', fill3: '#00ff00', border: '#00ff00', bg: '#000000', glow: '#00ff00', effect: 'matrix', icon: 'emoji-skull' },
  sunset: { fill1: '#ffd700', fill2: '#ff4500', fill3: '#ff7f50', border: '#ff7f50', bg: '#2d1b30', glow: '#ffa07a', effect: 'sunrays', icon: 'emoji-sunset' },
  kawaii: { fill1: '#ffb6c1', fill2: '#98fb98', fill3: '#b19cd9', border: '#b19cd9', bg: '#2a1f3d', glow: '#ffb6c1', effect: 'kawaii', icon: 'emoji-unicorn' }
};

// Emoji icons
var blondieIconsEmoji = {
  'emoji-star': '⭐', 'emoji-heart': '❤️', 'emoji-diamond': '💎', 'emoji-trophy': '🏆', 'emoji-coin': '🪙',
  'emoji-fire': '🔥', 'emoji-bolt': '⚡', 'emoji-crown': '👑', 'emoji-sword': '⚔️', 'emoji-shield': '🛡️',
  'emoji-potion': '🧪', 'emoji-gem': '💠', 'emoji-skull': '💀', 'emoji-flower': '🌸', 'emoji-music': '🎵',
  'emoji-wave': '🌊', 'emoji-snowflake': '❄️', 'emoji-radioactive': '☢️',
  'emoji-gamepad': '🎮', 'emoji-alien': '👾', 'emoji-blood': '🩸', 'emoji-sunset': '🌅', 'emoji-unicorn': '🦄', 'emoji-laptop': '💻', 'emoji-mic': '🎤'
};

// Pixel SVG icons
var blondieIconsSVG = {
  'pixel-star': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0h1v3h-1zM8 13h1v3h-1zM0 7h3v1H0zM13 7h3v1h-1zM3 3h1v1H3zM12 3h1v1h-1zM3 12h1v1H3zM12 12h1v1h-1zM5 4h1v1H5zM10 4h1v1h-1zM4 5h1v1H4zM11 5h1v1h-1zM4 6h8v1H4zM3 7h10v1H3zM4 8h8v1H4zM5 9h6v1H5zM5 10h2v1H5zM9 10h2v1H9zM4 11h2v1H4zM10 11h2v1h-2z"/></svg>',
  'pixel-heart': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h3v1H2zM11 4h3v1h-3zM1 5h2v1H1zM5 5h2v1H5zM9 5h2v1H9zM13 5h2v1h-2zM1 6h1v1H1zM7 6h2v1H7zM14 6h1v1h-1zM1 7h1v4H1zM14 7h1v4h-1zM2 7h12v1H2zM2 8h12v1H2zM2 9h12v1H2zM2 10h12v1H2zM2 11h12v1H2zM3 12h10v1H3zM4 13h8v1H4zM5 14h6v1H5zM6 15h4v1H6z"/></svg>',
  'pixel-diamond': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 1h4v1H6zM4 2h2v1H4zM10 2h2v1h-2zM3 3h2v1H3zM11 3h2v1h-2zM2 4h2v1H2zM12 4h2v1h-2zM1 5h2v1H1zM13 5h2v1h-2zM0 6h2v1H0zM14 6h2v1h-2zM0 7h1v1H0zM15 7h1v1h-1zM1 8h1v1H1zM14 8h1v1h-1zM2 9h1v1H2zM13 9h1v1h-1zM3 10h1v1H3zM12 10h1v1h-1zM4 11h1v1H4zM11 11h1v1h-1zM5 12h1v1H5zM10 12h1v1h-1zM6 13h1v1H6zM9 13h1v1H9zM7 14h2v1H7z"/></svg>',
  'pixel-trophy': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 1h8v1H4zM3 2h10v1H3zM3 3h1v3H3zM12 3h1v3h-1zM1 3h2v1H1zM13 3h2v1h-2zM0 4h1v2H0zM15 4h1v2h-1zM1 6h2v1H1zM13 6h2v1h-2zM2 7h3v1H2zM11 7h3v1h-3zM4 3h8v5H4zM5 8h6v1H5zM6 9h4v1H6zM7 10h2v3H7zM5 13h6v1H5zM4 14h8v1H4z"/></svg>',
  'pixel-coin': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 1h6v1H5zM3 2h2v1H3zM11 2h2v1h-2zM2 3h1v1H2zM13 3h1v1h-1zM1 4h1v1H1zM14 4h1v1h-1zM1 5h1v6H1zM14 5h1v6h-1zM2 11h1v1H2zM13 11h1v1h-1zM3 12h2v1H3zM11 12h2v1h-2zM5 13h6v1H5zM7 4h2v1H7zM6 5h1v1H6zM7 5h2v1H7zM7 6h2v1H7zM7 7h2v1H7zM8 8h1v1H8zM7 9h2v1H7z"/></svg>',
  'pixel-fire': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M7 0h2v1H7zM6 1h1v1H6zM8 1h1v1H8zM5 2h1v1H5zM9 2h2v1H9zM5 3h1v1H5zM10 3h1v1h-1zM4 4h1v1H4zM10 4h1v2h-1zM4 5h1v2H4zM11 5h1v1h-1zM7 5h1v1H7zM6 6h1v1H6zM11 6h1v2h-1zM3 7h1v2H3zM5 7h2v1H5zM12 8h1v2h-1zM3 9h1v2H3zM4 11h1v1H4zM11 11h1v1h-1zM5 12h2v1H5zM9 12h2v1H9zM6 13h4v1H6z"/></svg>',
  'pixel-bolt': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0h3v1H8zM7 1h2v1H7zM6 2h2v1H6zM5 3h2v1H5zM4 4h2v1H4zM3 5h2v1H3zM2 6h6v1H2zM6 7h2v1H6zM7 8h2v1H7zM8 9h2v1H8zM9 10h2v1H9zM10 11h2v1h-2zM11 12h2v1h-2zM12 13h2v1h-2zM13 14h2v1h-2z"/></svg>',
  'pixel-crown': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h1v1H2zM7 3h2v1H7zM13 3h1v1h-1zM2 4h1v1H2zM7 4h2v1H7zM13 4h1v1h-1zM2 5h1v1H2zM5 5h1v1H5zM7 5h2v1H7zM10 5h1v1h-1zM13 5h1v1h-1zM2 6h3v1H2zM6 6h4v1H6zM11 6h3v1h-3zM2 7h12v1H2zM2 8h12v1H2zM2 9h12v1H2zM2 10h12v1H2zM3 11h10v1H3z"/></svg>',
  'pixel-sword': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M12 0h2v1h-2zM11 1h2v1h-2zM10 2h2v1h-2zM9 3h2v1H9zM8 4h2v1H8zM7 5h2v1H7zM6 6h2v1H6zM2 7h1v2H2zM5 7h2v1H5zM3 8h1v1H3zM4 8h2v1H4zM1 9h2v1H1zM3 9h2v1H3zM0 10h2v1H0zM2 10h1v1H2zM0 11h1v1H0z"/></svg>',
  'pixel-shield': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 1h10v1H3zM2 2h12v1H2zM2 3h12v1H2zM2 4h12v1H2zM2 5h12v1H2zM2 6h12v1H2zM3 7h10v1H3zM3 8h10v1H3zM4 9h8v1H4zM4 10h8v1H4zM5 11h6v1H5zM6 12h4v1H6zM7 13h2v1H7z"/></svg>',
  'pixel-potion': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 0h4v1H6zM5 1h1v1H5zM10 1h1v1h-1zM5 2h1v3H5zM10 2h1v3h-1zM6 2h4v1H6zM4 5h2v1H4zM10 5h2v1h-2zM3 6h2v1H3zM11 6h2v1h-2zM2 7h2v1H2zM12 7h2v1h-2zM2 8h12v1H2zM2 9h12v1H2zM2 10h12v1H2zM3 11h10v1H3zM4 12h8v1H4zM5 13h6v1H5z"/></svg>',
  'pixel-gem': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2h8v1H4zM2 3h3v1H2zM6 3h4v1H6zM11 3h3v1h-3zM1 4h4v1H1zM6 4h4v1H6zM11 4h4v1h-4zM2 5h4v1H2zM6 5h4v1H6zM10 5h4v1h-4zM3 6h3v1H3zM6 6h4v1H6zM10 6h3v1h-3zM4 7h2v1H4zM6 7h4v1H6zM10 7h2v1h-2zM5 8h2v1H5zM7 8h2v1H7zM9 8h2v1H9zM6 9h4v1H6zM7 10h2v1H7z"/></svg>',
  'pixel-skull': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 1h6v1H5zM3 2h2v1H3zM11 2h2v1h-2zM2 3h2v1H2zM12 3h2v1h-2zM2 4h1v1H2zM13 4h1v1h-1zM1 5h2v1H1zM13 5h2v1h-2zM1 6h2v1H1zM5 6h2v1H5zM9 6h2v1H9zM13 6h2v1h-2zM1 7h2v1H1zM5 7h2v1H5zM9 7h2v1H9zM13 7h2v1h-2zM2 8h1v1H2zM13 8h1v1h-1zM2 9h3v1H2zM6 9h4v1H6zM11 9h3v1h-3zM3 10h10v1H3zM4 11h2v1H4zM7 11h2v1H7zM10 11h2v1h-2zM4 12h2v1H4zM7 12h2v1H7zM10 12h2v1h-2z"/></svg>',
  'pixel-flower': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M7 0h2v1H7zM6 1h1v1H6zM9 1h1v1H9zM6 2h4v1H6zM2 4h2v1H2zM6 4h4v1H6zM12 4h2v1h-2zM1 5h2v1H1zM5 5h1v1H5zM10 5h1v1h-1zM13 5h2v1h-2zM1 6h2v1H1zM5 6h6v1H5zM13 6h2v1h-2zM2 7h2v1H2zM5 7h6v1H5zM12 7h2v1h-2zM6 8h4v1H6zM7 9h2v3H7zM6 12h4v1H6zM7 13h2v2H7z"/></svg>',
  'pixel-music': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 1h6v1H6zM5 2h1v1H5zM11 2h1v9h-1zM5 3h1v8H5zM12 9h2v1h-2zM11 10h1v1h-1zM13 10h1v1h-1zM11 11h3v1h-3zM12 12h1v1h-1zM6 10h2v1H6zM5 11h1v1H5zM7 11h1v1H7zM5 12h3v1H5zM6 13h1v1H6z"/></svg>'
};

// Combined icons object
var blondieIcons = Object.assign({}, blondieIconsEmoji, blondieIconsSVG);

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

  // Twitch events
  if (listener === 'follower-latest' && eventType === 'follower') {
    blondieProgress++;
    blondieIconPulse();
    blondieUpdateBar();
  }
  else if (listener === 'subscriber-latest' && eventType === 'subscriber') {
    // Skip individual gift recipients (they come with gifted:true but no bulkGifted)
    // to avoid double-counting with the bulk event
    if (event.gifted && !event.bulkGifted) {
      return;
    }
    // For bulk/community gifts, use amount field for count
    var subCount = event.bulkGifted ? (event.amount || 1) : 1;
    blondieProgress += subCount;
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
  root.style.setProperty('--blondie-title-font-size', (blondieFieldData.titleFontSize || 14) + 'px');
  root.style.setProperty('--blondie-values-font-size', (blondieFieldData.valuesFontSize || 14) + 'px');

  // Title positioning
  var titleAlign = blondieFieldData.titleAlign || 'row';
  var titlePos = blondieFieldData.titlePosition || 'top';
  var titleText = blondieFieldData.goalTitle || '';
  var valPos = blondieFieldData.valuesPosition || 'below';

  // Parse title position (e.g., 'top-left' -> base: 'top', align: 'left')
  var titleParts = titlePos.split('-');
  var titleBase = titleParts[0]; // top, bottom, left, right, hidden
  var titleHAlign = titleParts[1] || 'center'; // left, right, center

  // Parse values position
  var valParts = valPos.split('-');
  var valBase = valParts[0]; // below, above, inside, left, right, hidden
  var valHAlign = valParts[1] || 'center'; // left, right, center

  // All possible title elements
  var titleTop = document.getElementById('blondie-title-top');
  var titleBottom = document.getElementById('blondie-title-bottom');
  var titleLeft = document.getElementById('blondie-title-left');
  var titleRight = document.getElementById('blondie-title-right');
  var titleBarTop = document.getElementById('blondie-title-bar-top');
  var titleBarBottom = document.getElementById('blondie-title-bar-bottom');
  var titleRowTop = document.getElementById('blondie-title-row-top');
  var titleRowBottom = document.getElementById('blondie-title-row-bottom');

  // Hide all titles and remove alignment classes
  [titleTop, titleBottom, titleLeft, titleRight, titleBarTop, titleBarBottom, titleRowTop, titleRowBottom].forEach(function(el) {
    if (el) {
      el.style.display = 'none';
      el.classList.remove('align-left', 'align-center', 'align-right');
    }
  });

  // Calculate title offsets and bar padding for absolutely positioned elements
  // Title height ~24px, values height ~20px
  var titleBarTopOffset = '10px';
  var titleBarBottomOffset = '10px';
  var barPaddingTop = 0;
  var barPaddingBottom = 0;

  var valuesAlign = blondieFieldData.valuesAlign || 'bar';
  var hasTitleBarTop = titleText && titleBase === 'top' && titleAlign === 'bar';
  var hasTitleBarBottom = titleText && titleBase === 'bottom' && titleAlign === 'bar';
  var hasValuesAbove = valBase === 'above' && valuesAlign === 'bar';
  var hasValuesBelow = valBase === 'below' && valuesAlign === 'bar';

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

  if (titleText && titleBase !== 'hidden') {
    var targetTitle = null;

    // Choose correct element based on position and alignment
    if (titleBase === 'top') {
      if (titleAlign === 'bar') targetTitle = titleBarTop;
      else if (titleAlign === 'row') targetTitle = titleRowTop;
      else targetTitle = titleTop;
    } else if (titleBase === 'bottom') {
      if (titleAlign === 'bar') targetTitle = titleBarBottom;
      else if (titleAlign === 'row') targetTitle = titleRowBottom;
      else targetTitle = titleBottom;
    } else if (titleBase === 'left') {
      targetTitle = titleLeft;
    } else if (titleBase === 'right') {
      targetTitle = titleRight;
    }

    if (targetTitle) {
      targetTitle.textContent = titleText;
      targetTitle.style.display = 'block';
      // Add alignment class for bar-aligned and row-aligned titles
      if ((titleAlign === 'bar' || titleAlign === 'row') && (titleBase === 'top' || titleBase === 'bottom')) {
        targetTitle.classList.add('align-' + titleHAlign);
      }
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
      // Determine which icon to use
      var iconType = blondieFieldData.iconType;

      // If iconType is "theme", get icon from current theme
      if (iconType === 'theme' && theme !== 'custom' && blondieThemes[theme]) {
        iconType = blondieThemes[theme].icon || 'emoji-star';
      }

      if (iconType === 'custom' && blondieFieldData.customIcon) {
        var iconSize = blondieFieldData.iconSize || 32;
        var img = document.createElement('img');
        img.src = blondieFieldData.customIcon;
        img.style.cssText = 'width:' + iconSize + 'px;height:' + iconSize + 'px;object-fit:contain;image-rendering:pixelated;';
        iconEl.appendChild(img);
        iconEl.style.display = 'flex';
      } else if (blondieIcons[iconType]) {
        var iconContent = blondieIcons[iconType];
        var isPixelIcon = iconType.indexOf('pixel-') === 0;

        if (isPixelIcon) {
          iconEl.innerHTML = iconContent;
          // Use custom color if set, otherwise use glow color
          var iconColor = blondieFieldData.iconColor || 'var(--blondie-glow)';
          iconEl.style.color = iconColor;
        } else {
          // Emoji icon
          iconEl.textContent = iconContent;
        }
        iconEl.style.display = 'flex';
      }
    }
  }

  // Values position setup
  blondieSetupValuesPosition();
}

function blondieSetupValuesPosition() {
  var valPos = blondieFieldData.valuesPosition || 'below';
  var valuesAlign = blondieFieldData.valuesAlign || 'row';

  // Parse values position (e.g., 'below-left' -> base: 'below', align: 'left')
  var valParts = valPos.split('-');
  var valBase = valParts[0]; // below, above, inside, left, right, hidden
  var valHAlign = valParts[1] || 'center'; // left, right, center

  // Hide all values containers
  var valAbove = document.getElementById('blondie-values-above');
  var valBelow = document.getElementById('blondie-values-below');
  var valTop = document.getElementById('blondie-values-top');
  var valBottom = document.getElementById('blondie-values-bottom');
  var valRowTop = document.getElementById('blondie-values-row-top');
  var valRowBottom = document.getElementById('blondie-values-row-bottom');
  var valLeft = document.getElementById('blondie-values-left');
  var valRight = document.getElementById('blondie-values-right');
  var valInside = document.getElementById('blondie-values-inside');

  [valAbove, valBelow, valTop, valBottom, valRowTop, valRowBottom, valLeft, valRight, valInside].forEach(function(el) {
    if (el) {
      el.style.display = 'none';
      el.innerHTML = '';
      el.classList.remove('pos-left', 'pos-center', 'pos-right', 'align-left', 'align-center', 'align-right');
    }
  });

  // Show values in correct position
  var targetEl = null;
  if (valBase === 'above') {
    if (valuesAlign === 'bar') targetEl = valAbove;
    else if (valuesAlign === 'row') targetEl = valRowTop;
    else targetEl = valTop;
    targetEl.classList.add('align-' + valHAlign);
  } else if (valBase === 'below') {
    if (valuesAlign === 'bar') targetEl = valBelow;
    else if (valuesAlign === 'row') targetEl = valRowBottom;
    else targetEl = valBottom;
    targetEl.classList.add('align-' + valHAlign);
  } else if (valBase === 'left') {
    targetEl = valLeft;
  } else if (valBase === 'right') {
    targetEl = valRight;
  } else if (valBase === 'inside') {
    targetEl = valInside;
    if (valHAlign === 'left') valInside.classList.add('pos-left');
    else if (valHAlign === 'center') valInside.classList.add('pos-center');
    else if (valHAlign === 'right') valInside.classList.add('pos-right');
  }

  if (targetEl && valBase !== 'hidden') {
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
          var size = 10 + Math.random() * 8;
          p.className = 'blondie-particle';
          p.style.cssText = 'left:' + (Math.random()*100) + '%;width:' + size + 'px;height:' + size + 'px;background:' + colors[Math.floor(Math.random()*colors.length)] + ';animation:blondie-confetti ' + (1.5+Math.random()*1) + 's ease forwards;animation-delay:' + (Math.random()*0.4) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 3500, p);
        }
      }, wave * 700);
    })(w);
  }
}

function blondieEffectGlitch(container) {
  var barContainer = document.getElementById('blondie-bar-container');
  if (barContainer) {
    barContainer.classList.add('blondie-glitch-active');
    setTimeout(function() { barContainer.classList.remove('blondie-glitch-active'); }, blondieEffectDuration);
  }
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
  var waves = Math.ceil(blondieEffectDuration / 500);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        // Main blood drips - bigger and more visible
        for (var i = 0; i < 25; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          var width = 6 + Math.random() * 8;
          var height = 25 + Math.random() * 35;
          p.style.cssText = 'left:' + (Math.random()*100) + '%;top:-10px;width:' + width + 'px;height:' + height + 'px;background:linear-gradient(180deg,#ff0000 0%,#cc0000 50%,#8b0000 100%);border-radius:' + (width/2) + 'px ' + (width/2) + 'px 50% 50%;box-shadow:0 0 10px #ff0000,0 0 20px rgba(255,0,0,0.6);animation:blondie-blood-drip ' + (1.0+Math.random()*0.8) + 's ease-in forwards;animation-delay:' + (Math.random()*0.3) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 2500, p);
        }
        // Blood splatter particles
        for (var j = 0; j < 15; j++) {
          var s = document.createElement('div');
          s.className = 'blondie-particle';
          var size = 5 + Math.random() * 10;
          var startX = Math.random() * 100;
          var splatX = (Math.random() - 0.5) * 80;
          s.style.cssText = 'left:' + startX + '%;top:40%;width:' + size + 'px;height:' + size + 'px;background:#ff0000;border-radius:50%;box-shadow:0 0 10px #ff0000,0 0 20px rgba(255,0,0,0.8);animation:blondie-blood-splat ' + (0.6+Math.random()*0.5) + 's ease-out forwards;animation-delay:' + (Math.random()*0.2) + 's;--splat-x:' + splatX + 'px;';
          box.appendChild(s);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 1500, s);
        }
      }, wave * 400);
    })(w);
  }
}

function blondieEffectBubbles(box) {
  var waves = Math.ceil(blondieEffectDuration / 600);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 15; i++) {
          var p = document.createElement('div');
          var size = 10 + Math.random() * 20;
          p.className = 'blondie-particle';
          p.style.cssText = 'left:' + (Math.random()*100) + '%;top:80%;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:rgba(0,206,209,0.4);border:2px solid rgba(0,206,209,0.8);box-shadow:0 0 10px rgba(0,206,209,0.5),inset 0 0 10px rgba(255,255,255,0.3);animation:blondie-bubble ' + (1.2+Math.random()*0.8) + 's ease-out forwards;animation-delay:' + (Math.random()*0.4) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 2500, p);
        }
      }, wave * 500);
    })(w);
  }
}

function blondieEffectPetals(box) {
  var petals = ['🌸', '🎀', '💮', '🌺', '✿'];
  var waves = Math.ceil(blondieEffectDuration / 500);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 18; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          p.textContent = petals[Math.floor(Math.random()*petals.length)];
          var size = 22 + Math.random() * 18;
          var drift = (Math.random() - 0.5) * 80;
          p.style.cssText = 'left:' + (Math.random()*100) + '%;top:-10px;font-size:' + size + 'px;filter:drop-shadow(0 0 8px #ff69b4) drop-shadow(0 0 15px #ffb7c5);animation:blondie-petal ' + (1.5+Math.random()*1) + 's ease-out forwards;animation-delay:' + (Math.random()*0.4) + 's;--petal-drift:' + drift + 'px;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 3000, p);
        }
      }, wave * 400);
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
  var flakes = ['❄️', '❅', '❆', '✧', '⛄', '✦'];
  var waves = Math.ceil(blondieEffectDuration / 500);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 18; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          p.textContent = flakes[Math.floor(Math.random()*flakes.length)];
          var size = 20 + Math.random() * 18;
          var drift = (Math.random() - 0.5) * 60;
          p.style.cssText = 'left:' + (Math.random()*100) + '%;top:-10px;color:#ffffff;filter:drop-shadow(0 0 8px #87ceeb) drop-shadow(0 0 15px #e0ffff) drop-shadow(0 0 25px #00bfff);font-size:' + size + 'px;animation:blondie-snow ' + (1.3+Math.random()*1) + 's ease-out forwards;animation-delay:' + (Math.random()*0.4) + 's;--snow-drift:' + drift + 'px;';
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
        for (var i = 0; i < 15; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          p.textContent = flames[Math.floor(Math.random()*flames.length)];
          var size = 22 + Math.random() * 20;
          p.style.cssText = 'left:' + (Math.random()*100) + '%;top:70%;font-size:' + size + 'px;filter:drop-shadow(0 0 8px #ff4500) drop-shadow(0 0 15px #ff6600);animation:blondie-flame ' + (0.8+Math.random()*0.6) + 's ease-out forwards;animation-delay:' + (Math.random()*0.3) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 2000, p);
        }
      }, wave * 350);
    })(w);
  }
}

function blondieEffectMatrix(box) {
  var chars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF<>{}[]';
  var waves = Math.ceil(blondieEffectDuration / 400);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 25; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle blondie-matrix-char';
          p.textContent = chars[Math.floor(Math.random()*chars.length)];
          var size = 18 + Math.random() * 16;
          p.style.cssText = 'left:' + (Math.random()*100) + '%;top:-10px;font-size:' + size + 'px;animation:blondie-matrix ' + (0.8+Math.random()*0.6) + 's linear forwards;animation-delay:' + (Math.random()*0.3) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 2000, p);
        }
      }, wave * 350);
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
  var waves = Math.ceil(blondieEffectDuration / 500);
  for (var w = 0; w < waves; w++) {
    (function(wave) {
      setTimeout(function() {
        for (var i = 0; i < 18; i++) {
          var p = document.createElement('div');
          p.className = 'blondie-particle';
          p.textContent = kawaii[Math.floor(Math.random()*kawaii.length)];
          var size = 20 + Math.random() * 20;
          var startY = 30 + Math.random() * 40;
          p.style.cssText = 'left:' + (Math.random()*100) + '%;top:' + startY + '%;font-size:' + size + 'px;filter:drop-shadow(0 0 8px #ff69b4) drop-shadow(0 0 15px #ffb6c1);animation:blondie-kawaii-float ' + (1.2+Math.random()*0.8) + 's ease-out forwards;animation-delay:' + (Math.random()*0.4) + 's;';
          box.appendChild(p);
          setTimeout(function(el) { if(el.parentNode) el.parentNode.removeChild(el); }, 2500, p);
        }
      }, wave * 400);
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
