import { useState, useRef, useEffect, useCallback } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

function MentionInput({ value, onChange, placeholder, disabled }) {
  const { selectedGroup, onlineUsers } = useChatStore();
  const { authUser } = useAuthStore();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Get available group members for mentions
  const getGroupMembers = useCallback(() => {
    if (!selectedGroup?.members) {
      console.log('🔍 No group members found');
      return [];
    }
    
    console.log('🔍 Raw group members:', selectedGroup.members);
    console.log('🔍 Online users:', onlineUsers);
    
    const members = selectedGroup.members
      .filter(member => {
        // Filter out self and invalid members
        if (!member) {
          console.log('🔍 Skipping null member');
          return false;
        }
        if (!member._id) {
          console.log('🔍 Skipping member without _id:', member);
          return false;
        }
        if (member._id === authUser._id) {
          console.log('🔍 Skipping self:', member._id);
          return false;
        }
        if (!member.fullName && !member.email) {
          console.log('🔍 Skipping member without name/email:', member);
          return false;
        }
        return true;
      })
      .map(member => ({
        id: member._id,
        name: member.fullName || member.email || 'Unknown',
        isOnline: onlineUsers && onlineUsers.includes(member._id)
      }))
      .sort((a, b) => {
        // Sort online members first, then alphabetically
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return a.name.localeCompare(b.name);
      });
    
    console.log('🔍 Available group members for mentions:', members);
    return members;
  }, [selectedGroup, onlineUsers, authUser._id]);

  // Check if cursor is at the end of a mention
  const getMentionContext = useCallback((text, cursorPos) => {
    const beforeCursor = text.substring(0, cursorPos);
    
    // Check if text ends with @ followed by something (not another @)
    const mentionMatch = beforeCursor.match(/@([^@\s][\w\s]*)$/);
    
    if (mentionMatch) {
      const mentionStart = cursorPos - mentionMatch[0].length;
      const searchTerm = mentionMatch[1];
      
      console.log('🔍 Found mention:', { mentionStart, searchTerm });
      
      return {
        isMention: true,
        mentionStart,
        searchTerm
      };
    }
    
    return { isMention: false };
  }, []);

  // Filter suggestions based on search term
  const filterSuggestions = useCallback((searchTerm) => {
    const members = getGroupMembers();
    
    if (!searchTerm || searchTerm.trim() === '') {
      console.log('🔍 No search term, showing first 5 members');
      return members.slice(0, 5);
    }
    
    const filtered = members
      .filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);
    
    console.log('🔍 Filtered suggestions for "' + searchTerm + '":', filtered);
    return filtered;
  }, [getGroupMembers]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    const newCursorPosition = e.target.selectionStart;
    
    console.log('🔍 Input change:', { newValue, cursorPosition: newCursorPosition });
    
    onChange(newValue);
    
    // Check if we're in a mention context
    const context = getMentionContext(newValue, newCursorPosition);
    console.log('🔍 Mention context:', context);
    
    if (context.isMention) {
      const filteredSuggestions = filterSuggestions(context.searchTerm);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
      setSelectedIndex(0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [onChange, getMentionContext, filterSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        break;
    }
  }, [showSuggestions, suggestions, selectedIndex]);

  // Select a suggestion
  const selectSuggestion = useCallback((suggestion) => {
    console.log('🎯 Selecting suggestion:', suggestion);
    console.log('🎯 Current value:', value);
    
    // Find the @ position in the current text
    const context = getMentionContext(value, value.length);
    
    if (context.isMention) {
      const beforeMention = value.substring(0, context.mentionStart);
      const newValue = `${beforeMention}@${suggestion.name} `;
      
      console.log('🎯 New value:', newValue);
      
      onChange(newValue);
      setShowSuggestions(false);
      setSuggestions([]);
      
      // Set cursor position after the mention and space
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPosition = newValue.length;
          inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          inputRef.current.focus();
        }
      }, 0);
    }
  }, [value, onChange, getMentionContext]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
      />
      
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 bg-slate-800 rounded-lg shadow-2xl border border-slate-700 z-50 w-full max-h-48 overflow-hidden">
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => selectSuggestion(suggestion)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  index === selectedIndex
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'hover:bg-slate-700 text-white'
                }`}
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-2 h-2 rounded-full ${
                    suggestion.isOnline ? 'bg-green-500' : 'bg-slate-500'
                  }`} />
                  <span className="font-medium">{suggestion.name}</span>
                </div>
                {suggestion.isOnline && (
                  <span className="text-xs text-green-400">Online</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MentionInput;
