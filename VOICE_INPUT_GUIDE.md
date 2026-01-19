# 🎙️ Voice Input - Troubleshooting Guide

## ✅ The Issue Was Fixed!

**Problem**: Voice wasn't being transcribed due to stale state in the callback
**Solution**: Used `useRef` to track the latest transcript value properly

---

## 🔧 How to Test Voice Input

### Step 1: Check Microphone Permission
1. Open http://localhost:5173/
2. Click the **Voice** button (microphone icon)
3. **Browser will ask for microphone permission** - Click **Allow**
4. Button should turn RED and show "Recording..."

### Step 2: Speak Clearly
1. **Speak your legal issue in clear voice**
2. Examples:
   - "My landlord won't return my deposit"
   - "मुझे अपना वेतन नहीं मिला" (Hindi: I didn't get my salary)
   - "माझा मालक माझी जमा रक्कम परत करत नाही" (Marathi)

### Step 3: Stop Recording
1. Click the **RED Voice button again** to stop
2. Text should appear in the **query box**
3. You should see the transcribed text

### Step 4: Submit
1. Click **"Get Analysis"** button
2. App processes your query

---

## ⚠️ Common Issues & Solutions

### Issue 1: Browser Says "Not Supported"
**Cause**: Your browser doesn't support Web Speech API
**Solution**: Use Chrome, Firefox, Safari, or Edge (all support it)
```
✅ Works: Chrome, Firefox, Safari, Edge
❌ Doesn't Work: Internet Explorer
```

### Issue 2: Browser Asks for Microphone Permission
**Cause**: First time using voice input
**Solution**: Click **Allow** when browser asks
- Chrome: Top right notification
- Firefox: URL bar notification
- Safari: Pop-up dialog

### Issue 3: No Sound is Detected
**Cause**: Microphone not working or muted
**Solution**:
1. Check Windows volume (bottom right)
2. Check mic is plugged in
3. Test mic in system settings
4. Try different browser

### Issue 4: Text Doesn't Appear After Speaking
**Cause**: 
- Didn't speak long enough (needs 2-3 seconds)
- Spoke too quietly
- Too much background noise
**Solution**:
- Speak louder and clearer
- Speak for at least 3-5 seconds
- Reduce background noise
- Click button again to retry

### Issue 5: "No Speech Detected" Error
**Cause**: App didn't hear any speech
**Solution**:
- Make sure microphone is on
- Speak louder
- Wait 2-3 seconds before stopping
- Try clicking and speaking again immediately

---

## 🎯 What Changed in the Fix

### Before (Broken)
```tsx
recognizer.onend = () => {
  setIsListening(false);
  if (transcript) {  // ❌ STALE - not updated yet!
    onTranscribed(transcript);
  }
};
```

### After (Fixed)
```tsx
const transcriptRef = useRef(''); // Track current value

recognizer.onresult = (event: any) => {
  for (let i = event.resultIndex; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      transcriptRef.current += transcript; // ✅ Always current
      setTranscript(transcriptRef.current);
    }
  }
};

recognizer.onend = () => {
  if (transcriptRef.current) {  // ✅ NOW WORKS!
    onTranscribed(transcriptRef.current);
  }
};
```

---

## 🎙️ How Voice Input Works Now

1. **User clicks Voice button**
   → Button turns RED
   → Microphone activates

2. **User speaks issue**
   → Real-time transcription happens
   → Text gets accumulated in `transcriptRef`

3. **User clicks Voice button again (or speaks 2+ seconds of silence)**
   → Recording stops
   → `onend` event fires
   → `transcriptRef.current` has LATEST text
   → Text gets sent to parent
   → Text appears in query box

4. **User can edit or submit**
   → Click "Get Analysis"
   → Rest of app works normally

---

## 🧪 Testing Checklist

- [ ] Click Voice button
- [ ] Browser asks for microphone permission
- [ ] Button turns RED with "Recording..."
- [ ] Speak clearly (3-5 seconds)
- [ ] Click Voice button again to stop
- [ ] Text appears in query box
- [ ] Text is accurate
- [ ] Click Get Analysis
- [ ] Get legal advice

---

## 💡 Pro Tips

### For Best Results:
1. **Speak clearly** - Not too fast, not too slow
2. **Speak long enough** - Minimum 2-3 seconds
3. **Wait for stop** - Let it process after you stop
4. **Good microphone** - Built-in mics work fine
5. **Quiet room** - Less background noise = better accuracy

### Supported Languages:
- ✅ English (en-IN) - Indian English
- ✅ Hindi (hi-IN) - हिंदी
- ✅ Marathi (mr-IN) - मराठी

**Note**: Regional accents work fine! The API understands Indian English, Hinglish, etc.

---

## 🐛 If Still Not Working

1. **Open browser console** (F12)
2. Click Voice button and speak
3. Look for errors or messages
4. Share the console output

The fix should now make it work properly!

✅ **Try it now at http://localhost:5173/**
