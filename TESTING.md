# 🧪 Testing Your Schiedule Web App

## 🚀 Quick Start Testing

### 1. Start the App
```bash
npm run dev
```
Open: `http://localhost:8081`

### 2. Basic Feature Tests

#### ✅ **Test 1: Add a Course**
1. Click "Add Course" button in header
2. Fill out the form:
   - Title: "Computer Science 101"
   - Professor: "Dr. Smith"
   - Room: "CS-201"
   - Start Time: "09:00"
   - End Time: "10:30"
   - Day: "Monday"
   - Credits: 3
   - Color: "CS"
3. Click "Save Course"
4. **Expected**: Course appears in Monday column

#### ✅ **Test 2: Edit a Course**
1. Hover over a course card
2. Click the edit (pencil) icon
3. Change the title to "Advanced CS 101"
4. Click "Save Course"
5. **Expected**: Course title updates

#### ✅ **Test 3: Delete a Course**
1. Hover over a course card
2. Click the delete (trash) icon
3. **Expected**: Course disappears

#### ✅ **Test 4: Change Semester/Year**
1. Use dropdowns in header
2. Change year to "2025"
3. Change semester to "Spring"
4. **Expected**: Schedule updates, courses filtered

#### ✅ **Test 5: Data Persistence**
1. Add some courses
2. Refresh the page
3. **Expected**: Courses are still there (localStorage)

## 🐛 Common Issues to Check

### Issue 1: Modal Not Opening
- **Check**: Console for JavaScript errors
- **Fix**: Make sure all components are imported

### Issue 2: Courses Not Saving
- **Check**: Browser localStorage in DevTools
- **Fix**: Check if localStorage is enabled

### Issue 3: Styling Issues
- **Check**: Tailwind CSS is loading
- **Fix**: Run `npm run dev` and check console

### Issue 4: Time Validation
- **Test**: Try invalid times (25:00, backwards times)
- **Expected**: Should show validation errors

## 📊 Manual Testing Checklist

- [ ] App loads without errors
- [ ] Header displays correctly
- [ ] Add Course button works
- [ ] Course modal opens/closes
- [ ] Form validation works
- [ ] Courses display in correct day columns
- [ ] Edit functionality works
- [ ] Delete functionality works
- [ ] Year/semester switching works
- [ ] Data persists after refresh
- [ ] Responsive design works on mobile
- [ ] Toast notifications appear
- [ ] No console errors

## 🎯 Test Data

Use this sample data to test:

**Course 1:**
- Title: Advanced Algorithms
- Professor: Dr. Johnson
- Room: CS-301
- Time: 09:00 - 10:30
- Day: Monday
- Credits: 4

**Course 2:**
- Title: Database Systems
- Professor: Prof. Williams
- Room: CS-205
- Time: 14:00 - 15:30
- Day: Wednesday
- Credits: 3

**Course 3:**
- Title: Web Development
- Professor: Dr. Brown
- Room: CS-101
- Time: 11:00 - 12:30
- Day: Friday
- Credits: 3

## 🔧 Debugging Tips

1. **Open DevTools** (F12)
2. **Check Console** for errors
3. **Check Network** tab for failed requests
4. **Check Application > Local Storage** for saved data
5. **Use React DevTools** if installed

## ✅ Success Criteria

Your app is working if:
- ✅ No console errors
- ✅ Can add/edit/delete courses
- ✅ Data persists after refresh
- ✅ UI is responsive and looks good
- ✅ All interactions work smoothly
