# Frontend Rate Limiting Integration - Summary

## Changes Made

### 1. Enhanced Error Handling in `useExecutionStore.js`

**File**: `frontend/src/store/useExecutionStore.js`

Added comprehensive error handling for both `runCode` and `submitCode` functions:

#### Rate Limit Error Handling (429)
- Detects when rate limit is exceeded
- Extracts retry time from server response
- Displays user-friendly toast message with countdown
- Shows which specific limit was exceeded (per minute/hour/problem)

```javascript
if (error.response?.status === 429) {
  const retryAfter = error.response.data.retryAfter || 60;
  const limitType = error.response.data.limit || "Rate limit";
  
  toast.error(
    `${limitType} exceeded! Wait ${retryAfter}s before trying again.`,
    { duration: 5000 }
  );
}
```

#### Service Unavailable Error (503)
- Handles Redis/Queue service failures
- Shows appropriate user message

```javascript
else if (error.response?.status === 503) {
  toast.error("Service temporarily unavailable. Please try again later.", {
    duration: 4000
  });
}
```

#### Generic Error Handling
- Falls back to server error message or generic error
- Provides clear feedback to user

### 2. Enhanced Error Handling in `useContestStore.js`

**File**: `frontend/src/store/useContestStore.js`

Added same rate limit error handling to `contestSubmitCode` function for contest submissions.

### 3. Button Disabling (Already Implemented)

Buttons are automatically disabled during execution using existing state flags:

**ProblemPage.jsx:**
```jsx
<button
  disabled={isRunExecuting}
  className="btn-primary"
>
  {isRunExecuting ? "Running..." : "Run Code"}
</button>

<button
  disabled={isSubmitExecuting}
  className="btn-success"
>
  {isSubmitExecuting ? "Submitting..." : "Submit"}
</button>
```

**ContestProblemExecPage.jsx:**
- Uses `isContestLoading` for button disabling
- Shows loading state during execution

---

## User Experience Flow

### Normal Execution
1. User clicks "Run Code" or "Submit"
2. Button disables immediately
3. Loading indicator appears
4. Request sent to backend
5. Success toast shows result
6. Button re-enables

### Rate Limit Hit
1. User clicks "Run Code" or "Submit"
2. Button disables immediately
3. Request sent to backend
4. Backend returns 429 with retry information
5. **Toast shows**: "5 runs per minute exceeded! Wait 45s before trying again."
6. Button re-enables (user can see the message and wait)

### Service Down
1. User clicks action button
2. Backend Redis/Queue is unavailable
3. Backend returns 503
4. **Toast shows**: "Service temporarily unavailable. Please try again later."
5. Button re-enables

---

## Toast Message Examples

### Rate Limit - Per Minute
```
❌ 5 runs per minute exceeded! Wait 45s before trying again.
```

### Rate Limit - Per Hour
```
❌ 20 runs per hour exceeded! Wait 1800s before trying again.
```

### Rate Limit - Per Problem
```
❌ 3 runs per 30 seconds for this problem exceeded! Wait 25s before trying again.
```

### Service Unavailable
```
❌ Service temporarily unavailable. Please try again later.
```

### Generic Error
```
❌ Error in execution
```

---

## Technical Details

### Toast Duration
- **Rate limit errors**: 5000ms (5 seconds) - gives user time to read retry information
- **Service errors**: 4000ms (4 seconds)
- **Default errors**: Default toast duration

### Button States
- **isRunExecuting**: Disables "Run Code" button during execution
- **isSubmitExecuting**: Disables "Submit" button during submission  
- **isContestLoading**: Disables contest submission button

### Error Response Structure
Backend sends rate limit errors in this format:
```json
{
  "error": "Rate limit exceeded",
  "limit": "5 runs per minute",
  "current": 6,
  "retryAfter": 45,
  "resetAt": "2026-01-03T13:00:00Z"
}
```

Frontend extracts:
- `retryAfter` - seconds until retry allowed
- `limit` - descriptive limit type

---

## Files Modified

1. ✅ `frontend/src/store/useExecutionStore.js` - Enhanced error handling for runCode & submitCode
2. ✅ `frontend/src/store/useContestStore.js` - Enhanced error handling for contestSubmitCode
3. ℹ️ `frontend/src/page/ProblemPage.jsx` - Already has button disabling (no changes needed)
4. ℹ️ `frontend/src/page/ContestProblemExecPage.jsx` - Already has button disabling (no changes needed)

---

## Testing

### Test Rate Limiting
1. Open browser dev tools → Network tab
2. Click "Run Code" 6 times rapidly
3. **Expected**: 
   - First 5 requests: Success toasts
   - 6th request: Rate limit toast with retry countdown

### Test Service Down
1. Stop Redis: `docker-compose stop redis`
2. Click "Run Code"
3. **Expected**: "Service temporarily unavailable" toast
4. Restart: `docker-compose start redis`

### Test Button Disabling
1. Click "Run Code"
2. **Expected**: Button immediately shows "Running..." and is disabled
3. Try clicking again - should not trigger another request
4. After completion - button re-enables with "Run Code"

---

## Benefits

✅ **Clear User Feedback** - Users know exactly why their request failed  
✅ **Retry Guidance** - Shows how long to wait before trying again  
✅ **Prevents Spam** - Button disabling prevents accidental double-clicks  
✅ **Service Status** - Different messages for different error types  
✅ **Professional UX** - Proper error handling improves user experience  

---

## Next Steps (Optional Enhancements)

### 1. Countdown Timer in Toast
Show live countdown instead of static seconds:
```javascript
toast.error((t) => (
  <CountdownToast 
    initialSeconds={retryAfter} 
    message={limitType}
    onClose={() => toast.dismiss(t.id)} 
  />
))
```

### 2. Disable Button Until Retry Time
Store `retryAfter` time and keep button disabled:
```javascript
const [retryTime, setRetryTime] = useState(null);

// In error handler
setRetryTime(Date.now() + (retryAfter * 1000));

// In button
disabled={isRunExecuting || (retryTime && Date.now() < retryTime)}
```

### 3. Rate Limit Status Display
Show current usage in UI:
```jsx
<div className="text-sm text-gray-500">
  Runs: {currentRuns}/5 per minute
</div>
```

These enhancements are optional - current implementation is complete and functional! ✅
