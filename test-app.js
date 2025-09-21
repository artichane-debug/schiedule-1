#!/usr/bin/env node

// Simple test to check if the Schiedule app is working
// Run this after starting your dev server

console.log('🧪 Testing Schiedule Web App...\n');

// Test 1: Check if dev server is running
console.log('📡 Checking if dev server is running...');
const http = require('http');

const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:8081', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Dev server is running on http://localhost:8081');
        resolve(true);
      } else {
        console.log('❌ Dev server returned status:', res.statusCode);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Dev server is not running');
      console.log('   Run: npm run dev');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      console.log('❌ Server timeout - make sure npm run dev is running');
      resolve(false);
    });
  });
};

// Test 2: Check if files exist
console.log('\n📁 Checking if core files exist...');

const fs = require('fs');
const path = require('path');

const coreFiles = [
  'src/pages/Index.tsx',
  'src/components/Header.tsx',
  'src/components/WeeklySchedule.tsx',
  'src/components/CourseModal.tsx',
  'src/components/CourseCard.tsx',
  'src/types/schedule.ts',
  'package.json',
  'vite.config.ts'
];

let allFilesExist = true;

coreFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
    allFilesExist = false;
  }
});

// Test 3: Check package.json dependencies
console.log('\n📦 Checking dependencies...');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['react', 'react-dom', 'typescript', 'vite', 'tailwindcss'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - missing dependency`);
    }
  });
} catch (error) {
  console.log('❌ Could not read package.json');
}

// Main test function
async function runTests() {
  const serverRunning = await checkServer();
  
  console.log('\n📋 Test Summary:');
  console.log('================');
  
  if (serverRunning && allFilesExist) {
    console.log('🎉 All basic tests passed!');
    console.log('\n🚀 Next steps:');
    console.log('1. Open http://localhost:8081 in your browser');
    console.log('2. Try adding a course');
    console.log('3. Check the TESTING.md file for detailed tests');
  } else {
    console.log('❌ Some tests failed');
    console.log('\n🔧 To fix:');
    if (!serverRunning) {
      console.log('- Run: npm install');
      console.log('- Run: npm run dev');
    }
    if (!allFilesExist) {
      console.log('- Make sure all core files exist');
    }
  }
  
  console.log('\n💡 For detailed testing, see TESTING.md');
}

runTests();
