import { useState, useRef, useEffect } from 'react';
import { SmileIcon, XIcon } from 'lucide-react';

// Common emojis for chat
const EMOJI_CATEGORIES = {
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  gestures: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🙏', '🤝', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️'],
  food: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧋', '🧃', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄'],
  activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🧘', '🏇', '🏄', '🏊', '🤽', '🚣', '🧗', '🚴', '🚵', '🪖', '🏇', '🏄', '🏊', '🤽', '🚣', '🧗', '🚴', '🚵', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳', '🎮', '🎰', '🧩'],
  objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚗️', '🧪', '🔬', '🔭', '📡', '🩺', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🔬', '🔭', '📡', '🩺', '💉', '🩸', '🧬', '🦠', '🧫'],
  symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫️', '⚪️', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫️', '⚪️', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '🔘']
};

function EmojiPicker({ onEmojiSelect, isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [searchTerm, setSearchTerm] = useState('');
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
    onClose();
  };

  const getFilteredEmojis = () => {
    if (!searchTerm) {
      return EMOJI_CATEGORIES[activeCategory] || [];
    }

    const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
    return allEmojis.filter(emoji => 
      emoji.includes(searchTerm) || 
      getEmojiName(emoji).toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getEmojiName = (emoji) => {
    // Simple emoji name mapping for common emojis
    const names = {
      '😀': 'grinning face', '😃': 'grinning face with big eyes', '😄': 'grinning face with smiling eyes',
      '😁': 'beaming face with smiling eyes', '😆': 'grinning squinting face', '😅': 'grinning face with sweat',
      '😂': 'face with tears of joy', '🤣': 'rolling on the floor laughing', '😊': 'smiling face with smiling eyes',
      '😇': 'smiling face with halo', '🙂': 'slightly smiling face', '😉': 'winking face',
      '😌': 'relieved face', '😍': 'heart eyes', '🥰': 'smiling face with hearts',
      '😘': 'face blowing a kiss', '😗': 'kissing face', '😙': 'kissing face with smiling eyes',
      '😚': 'kissing face with closed eyes', '😋': 'face savoring food', '😛': 'squinting face with tongue',
      '😜': 'winking face with tongue', '🤪': 'zany face', '😝': 'squinting face with tongue',
      '🤗': 'hugging face', '🤔': 'thinking face', '😐': 'neutral face',
      '😑': 'expressionless face', '😶': 'face without mouth', '😏': 'smirking face',
      '😒': 'unamused face', '🙄': 'face with rolling eyes', '😬': 'grimacing face',
      '😔': 'pensive face', '😪': 'sleepy face', '😴': 'sleeping face',
      '😷': 'face with medical mask', '🤒': 'face with thermometer', '🤕': 'face with head bandage',
      '🤢': 'nauseated face', '🤮': 'vomiting face', '🥵': 'hot face',
      '🥶': 'cold face', '😵': 'dizzy face', '🤯': 'exploding head',
      '🥳': 'partying face', '😎': 'smiling face with sunglasses', '🤓': 'nerd face',
      '🧐': 'monocle face', '😕': 'confused face', '😟': 'worried face',
      '🙁': 'slightly frowning face', '😮': 'face with open mouth', '😯': 'hushed face',
      '😲': 'astonished face', '😳': 'flushed face', '🥺': 'pleading face',
      '😦': 'frowning face with open mouth', '😧': 'anguished face', '😨': 'fearful face',
      '😰': 'anxious face with sweat', '😥': 'sad but relieved face', '😢': 'crying face',
      '😭': 'loudly crying face', '😱': 'face screaming in fear', '😖': 'confounded face',
      '😣': 'persevering face', '😞': 'disappointed face', '😓': 'downcast face with sweat',
      '😩': 'weary face', '😫': 'tired face', '🥱': 'yawning face',
      '😤': 'face with steam from nose', '😡': 'pouting face', '😠': 'angry face',
      '🤬': 'face with symbols on mouth', '😈': 'smiling face with horns', '👿': 'angry face with horns',
      '💀': 'skull', '☠️': 'skull and crossbones', '💩': 'pile of poo',
      '🤡': 'clown face', '👹': 'ogre', '👺': 'goblin',
      '👻': 'ghost', '👽': 'alien', '👾': 'alien monster',
      '🤖': 'robot', '❤️': 'red heart', '🧡': 'orange heart',
      '💛': 'yellow heart', '💚': 'green heart', '💙': 'blue heart',
      '💜': 'purple heart', '🖤': 'black heart', '🤍': 'white heart',
      '🤎': 'brown heart', '💔': 'broken heart', '❣️': 'heart with arrow',
      '💕': 'two hearts', '💞': 'revolving hearts', '💓': 'beating heart',
      '💗': 'growing heart', '💖': 'sparkling heart', '💘': 'cupid',
      '💝': 'heart with ribbon', '👋': 'waving hand', '🤚': 'raised back of hand',
      '🖐️': 'hand with fingers splayed', '✋': 'raised hand', '🖖': 'vulcan salute',
      '👌': 'OK hand', '🤌': 'sign of the horns', '🤏': 'pinching hand',
      '✌️': 'victory hand', '🤞': 'crossed fingers', '🤟': 'love-you gesture',
      '🤘': 'sign of the horns', '🤙': 'call me hand', '👈': 'backhand index pointing left',
      '👉': 'backhand index pointing right', '👆': 'backhand index pointing up', '🖕': 'middle finger',
      '👇': 'backhand index pointing down', '☝️': 'backhand index pointing up', '👍': 'thumbs up',
      '👎': 'thumbs down', '✊': 'raised fist', '👊': 'oncoming fist',
      '🤛': 'left-facing fist', '🤜': 'right-facing fist', '👏': 'clapping hands',
      '🙌': 'raising hands', '👐': 'open hands', '🤲': 'palms up together',
      '🙏': 'folded hands', '💪': 'flexed biceps', '🦾': 'mechanical arm',
      '🦿': 'mechanical leg', '🦵': 'leg', '🦶': 'foot',
      '👂': 'ear', '🦻': 'ear with hearing aid', '👃': 'nose',
      '🧠': 'brain', '🫀': 'anatomical heart', '🫁': 'lungs',
      '🦷': 'tooth', '🦴': 'bone', '👀': 'eyes',
      '👁️': 'eye', '👅': 'tongue', '👄': 'mouth',
      '🍎': 'red apple', '🍊': 'orange', '🍋': 'lemon',
      '🍌': 'banana', '🍉': 'watermelon', '🍇': 'grapes',
      '🍓': 'strawberry', '🫐': 'blueberries', '🍈': 'melon',
      '🍒': 'cherries', '🍑': 'peach', '🥭': 'mango',
      '🍍': 'pineapple', '🥥': 'coconut', '🥝': 'kiwi fruit',
      '🍅': 'tomato', '🍆': 'eggplant', '🥑': 'avocado',
      '🥦': 'broccoli', '🥬': 'leafy green', '🥒': 'cucumber',
      '🌶️': 'hot pepper', '🫑': 'bell pepper', '🌽': 'corn',
      '🥕': 'carrot', '🫒': 'olive', '🧄': 'garlic',
      '🧅': 'onion', '🥔': 'potato', '🍠': 'sweet potato',
      '🥐': 'croissant', '🍞': 'bread', '🥖': 'baguette bread',
      '🥨': 'pretzel', '🧀': 'cheese wedge', '🥚': 'egg',
      '🍳': 'cooking', '🧈': 'butter', '🥞': 'pancakes',
      '🧇': 'waffle', '🥓': 'bacon', '🥩': 'steak',
      '🍗': 'poultry leg', '🍖': 'meat on bone', '🦴': 'bone',
      '🌭': 'hot dog', '🍔': 'hamburger', '🍟': 'french fries',
      '🍕': 'pizza', '🥪': 'sandwich', '🥙': 'stuffed flatbread',
      '🧆': 'falafel', '🌮': 'taco', '🌯': 'burrito',
      '🫔': 'tamale', '🥗': 'salad', '🥘': 'shallow pan of food',
      '🫕': 'fondue', '🍝': 'spaghetti', '🍜': 'steaming bowl',
      '🍲': 'pot of food', '🍛': 'curry rice', '🍣': 'sushi',
      '🍱': 'bento box', '🥟': 'dumpling', '🦪': 'oyster',
      '🍤': 'fried shrimp', '🍙': 'rice ball', '🍚': 'cooked rice',
      '🍘': 'rice cracker', '🍥': 'fish cake with swirl', '🥠': 'fortune cookie',
      '🥮': 'moon cake', '🍢': 'oden', '🍡': 'dango',
      '🍧': 'shaved ice', '🍨': 'ice cream', '🍦': 'soft ice cream',
      '🥧': 'pie', '🧁': 'cupcake', '🍰': 'shortcake',
      '🎂': 'birthday cake', '🍮': 'custard', '🍭': 'lollipop',
      '🍬': 'candy', '🍫': 'chocolate bar', '🍿': 'popcorn',
      '🍩': 'doughnut', '🍪': 'cookie', '🌰': 'chestnut',
      '🥜': 'peanuts', '🍯': 'honey pot', '🥛': 'glass of milk',
      '🍼': 'baby bottle', '☕': 'hot beverage', '🫖': 'teapot',
      '🍵': 'teacup without handle', '🍶': 'sake', '🍾': 'bottle with popping cork',
      '🍷': 'wine glass', '🍸': 'cocktail glass', '🍹': 'tropical drink',
      '🍺': 'beer mug', '🍻': 'clinking beer mugs', '🥂': 'clinking glasses',
      '🥃': 'tumbler glass', '🥤': 'cup with straw', '🧋': 'bubble tea',
      '🧃': 'beverage box', '🧉': 'mate', '🧊': 'ice cube',
      '🥢': 'chopsticks', '🍽️': 'plate with cutlery', '🍴': 'fork and knife',
      '🥄': 'spoon', '⚽': 'soccer ball', '🏀': 'basketball',
      '🏈': 'american football', '⚾': 'baseball', '🥎': 'softball',
      '🎾': 'tennis', '🏐': 'volleyball', '🏉': 'rugby football',
      '🥏': 'flying disc', '🎱': '8 ball', '🪀': 'yo-yo',
      '🏓': 'ping pong', '🏸': 'badminton', '🏒': 'ice hockey',
      '🏑': 'field hockey', '🥍': 'lacrosse', '🏏': 'cricket',
      '🪃': 'boomerang', '🥅': 'goal net', '🪁': 'kite',
      '🏹': 'bow and arrow', '🎣': 'fishing pole', '🤿': 'diving mask',
      '🥊': 'boxing glove', '🥋': 'martial arts uniform', '🎽': 'running shirt',
      '🛹': 'skateboard', '🛷': 'sled', '⛸️': 'ice skate',
      '🥌': 'curling stone', '🎿': 'skis', '⛷️': 'skier',
      '🪂': 'parachute', '🏋️': 'person lifting weights', '🤼': 'people wrestling',
      '🤸': 'person cartwheeling', '⛹️': 'person bouncing ball', '🤺': 'person fencing',
      '🧘': 'person in lotus position', '🏇': 'horse racing', '🏄': 'person surfing',
      '🏊': 'person swimming', '🤽': 'person playing water polo', '🚣': 'person rowing boat',
      '🧗': 'person climbing', '🚴': 'person biking', '🚵': 'person mountain biking',
      '🪖': 'military helmet', '🎪': 'circus tent', '🎭': 'performing arts',
      '🎨': 'artist palette', '🎬': 'clapper board', '🎤': 'microphone',
      '🎧': 'headphone', '🎼': 'musical score', '🎹': 'musical keyboard',
      '🥁': 'drum', '🪘': 'long drum', '🎺': 'trumpet',
      '🎸': 'guitar', '🪕': 'banjo', '🎻': 'violin',
      '🎲': 'game die', '♟️': 'chess pawn', '🎯': 'direct hit',
      '🎳': 'bowling', '🎮': 'video game', '🎰': 'slot machine',
      '🧩': 'puzzle piece', '⌚': 'watch', '📱': 'mobile phone',
      '📲': 'mobile phone with arrow', '💻': 'laptop', '⌨️': 'keyboard',
      '🖥️': 'desktop computer', '🖨️': 'printer', '🖱️': 'computer mouse',
      '🖲️': 'trackball', '🕹️': 'joystick', '🗜️': 'clamp',
      '💽': 'computer disk', '💾': 'floppy disk', '💿': 'optical disk',
      '📀': 'dvd', '📼': 'videocassette', '📷': 'camera',
      '📸': 'camera with flash', '📹': 'video camera', '🎥': 'movie camera',
      '📽️': 'film projector', '🎞️': 'film frame', '📞': 'telephone receiver',
      '☎️': 'telephone', '📟': 'pager', '📠': 'fax machine',
      '📺': 'television', '📻': 'radio', '🎙️': 'studio microphone',
      '🎚️': 'level slider', '🎛️': 'control knobs', '🧭': 'compass',
      '⏱️': 'stopwatch', '⏲️': 'timer clock', '⏰': 'alarm clock',
      '🕰️': 'mantelpiece clock', '⌛': 'hourglass done', '⏳': 'hourglass not done',
      '📡': 'satellite antenna', '🔋': 'battery', '🔌': 'electric plug',
      '💡': 'light bulb', '🔦': 'flashlight', '🕯️': 'candle',
      '🪔': 'diya lamp', '🧯': 'fire extinguisher', '🛢️': 'oil drum',
      '💸': 'money with wings', '💵': 'dollar bill', '💴': 'yen banknote',
      '💶': 'euro banknote', '💷': 'pound banknote', '💰': 'money bag',
      '💳': 'credit card', '💎': 'gem stone', '⚗️': 'alembic',
      '🧪': 'test tube', '🔬': 'microscope', '🔭': 'telescope',
      '🩺': 'stethoscope', '💉': 'syringe', '🩸': 'drop of blood',
      '🧬': 'dna', '🦠': 'microbe', '🧫': 'petri dish'
    };
    return names[emoji] || emoji;
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={pickerRef}
      className="absolute bottom-20 left-4 bg-slate-800 rounded-lg shadow-2xl border border-slate-700 z-50 w-80 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <h3 className="text-white font-medium">Emoji Picker</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-slate-700">
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Categories */}
      {!searchTerm && (
        <div className="flex gap-2 p-3 border-b border-slate-700 overflow-x-auto">
          {Object.keys(EMOJI_CATEGORIES).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Emojis Grid */}
      <div className="p-3 overflow-y-auto max-h-48">
        <div className="grid grid-cols-8 gap-1">
          {getFilteredEmojis().map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              className="text-2xl hover:bg-slate-700 rounded p-1 transition-colors hover:scale-110"
              title={getEmojiName(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmojiPicker;
