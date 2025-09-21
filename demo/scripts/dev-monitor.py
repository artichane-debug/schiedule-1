#!/usr/bin/env python3
"""
🔥 Development Monitor Script
Simulates real-time development monitoring with fancy output
Perfect for showing off your development environment!

Usage: python scripts/dev-monitor.py
"""

import time
import random
import sys
from datetime import datetime
import threading

# ANSI color codes
class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    GRAY = '\033[90m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_banner():
    """Display the application banner"""
    print(f"{Colors.CYAN}")
    banner = """
    ╔══════════════════════════════════════════════════════════════════════╗
    ║                    🚀 SCHIEDULE DEV MONITOR 🚀                      ║
    ║                                                                      ║
    ║              Real-time Development Environment Monitor               ║
    ║                   React + TypeScript + Tailwind                     ║
    ╚══════════════════════════════════════════════════════════════════════╝
    """
    print(banner)
    print(f"{Colors.END}")

def get_timestamp():
    """Get formatted timestamp"""
    return datetime.now().strftime("%H:%M:%S.%f")[:-3]

def simulate_file_changes():
    """Simulate file change events"""
    files = [
        "src/components/CourseCard.tsx",
        "src/components/WeeklySchedule.tsx", 
        "src/components/Header.tsx",
        "src/pages/Index.tsx",
        "src/index.css",
        "src/types/schedule.ts",
        "src/hooks/use-toast.ts"
    ]
    
    change_types = [
        ("📝", "Modified", Colors.BLUE),
        ("💾", "Saved", Colors.GREEN),
        ("🔄", "Auto-formatted", Colors.YELLOW),
        ("✨", "Optimized", Colors.PURPLE)
    ]
    
    while True:
        file = random.choice(files)
        icon, action, color = random.choice(change_types)
        timestamp = get_timestamp()
        
        print(f"{Colors.GRAY}[{timestamp}]{Colors.END} {icon} {color}{action}{Colors.END} {Colors.WHITE}{file}{Colors.END}")
        time.sleep(random.uniform(2, 8))

def simulate_build_events():
    """Simulate build and compilation events"""
    events = [
        ("⚡", "Hot reload triggered", Colors.CYAN),
        ("🔷", "TypeScript compilation complete", Colors.BLUE),
        ("🎨", "Tailwind CSS updated", Colors.GREEN),
        ("📦", "Bundle size optimized", Colors.YELLOW),
        ("🧪", "Tests passed", Colors.GREEN),
        ("🔍", "ESLint check complete", Colors.PURPLE),
        ("🚀", "Performance optimized", Colors.CYAN)
    ]
    
    while True:
        time.sleep(random.uniform(5, 15))
        icon, message, color = random.choice(events)
        timestamp = get_timestamp()
        
        print(f"{Colors.GRAY}[{timestamp}]{Colors.END} {icon} {color}{message}{Colors.END}")

def simulate_performance_metrics():
    """Simulate performance monitoring"""
    while True:
        time.sleep(random.uniform(10, 20))
        timestamp = get_timestamp()
        
        # Generate realistic metrics
        memory_usage = random.uniform(45, 85)
        cpu_usage = random.uniform(15, 45)
        bundle_size = random.uniform(800, 900)
        load_time = random.uniform(1.2, 2.8)
        
        print(f"{Colors.GRAY}[{timestamp}]{Colors.END} 📊 {Colors.WHITE}Performance Metrics:{Colors.END}")
        print(f"    {Colors.GRAY}├─{Colors.END} 🧠 Memory: {Colors.YELLOW}{memory_usage:.1f}MB{Colors.END}")
        print(f"    {Colors.GRAY}├─{Colors.END} ⚡ CPU: {Colors.YELLOW}{cpu_usage:.1f}%{Colors.END}")
        print(f"    {Colors.GRAY}├─{Colors.END} 📦 Bundle: {Colors.YELLOW}{bundle_size:.1f}KB{Colors.END}")
        print(f"    {Colors.GRAY}└─{Colors.END} ⏱️  Load Time: {Colors.YELLOW}{load_time:.2f}s{Colors.END}")

def simulate_git_activity():
    """Simulate git activity"""
    git_events = [
        ("📝", "Working on feature/course-management", Colors.BLUE),
        ("💾", "Auto-saved changes", Colors.GREEN),
        ("🔀", "Branch switched to main", Colors.YELLOW),
        ("📤", "Changes staged for commit", Colors.PURPLE),
        ("✅", "Commit ready: 'Fix course card styling'", Colors.GREEN)
    ]
    
    while True:
        time.sleep(random.uniform(15, 30))
        icon, message, color = random.choice(git_events)
        timestamp = get_timestamp()
        
        print(f"{Colors.GRAY}[{timestamp}]{Colors.END} {icon} {color}Git: {message}{Colors.END}")

def simulate_network_activity():
    """Simulate network requests and API calls"""
    endpoints = [
        "/api/courses",
        "/api/schedule", 
        "/api/user/settings",
        "/api/notifications",
        "/health"
    ]
    
    methods = ["GET", "POST", "PUT", "DELETE"]
    status_codes = [200, 201, 204, 304, 404, 500]
    
    while True:
        time.sleep(random.uniform(3, 12))
        endpoint = random.choice(endpoints)
        method = random.choice(methods)
        status = random.choice(status_codes)
        response_time = random.uniform(50, 300)
        timestamp = get_timestamp()
        
        # Color based on status code
        if status < 300:
            status_color = Colors.GREEN
        elif status < 400:
            status_color = Colors.YELLOW
        else:
            status_color = Colors.RED
            
        print(f"{Colors.GRAY}[{timestamp}]{Colors.END} 🌐 {Colors.WHITE}{method}{Colors.END} {Colors.CYAN}{endpoint}{Colors.END} {status_color}{status}{Colors.END} {Colors.GRAY}({response_time:.0f}ms){Colors.END}")

def main():
    """Main function to run the development monitor"""
    try:
        print_banner()
        print(f"{Colors.GREEN}🚀 Development monitor started...{Colors.END}")
        print(f"{Colors.GRAY}Press Ctrl+C to stop{Colors.END}\n")
        
        # Start all monitoring threads
        threads = [
            threading.Thread(target=simulate_file_changes, daemon=True),
            threading.Thread(target=simulate_build_events, daemon=True),
            threading.Thread(target=simulate_performance_metrics, daemon=True),
            threading.Thread(target=simulate_git_activity, daemon=True),
            threading.Thread(target=simulate_network_activity, daemon=True)
        ]
        
        for thread in threads:
            thread.start()
        
        # Keep main thread alive
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}🛑 Development monitor stopped{Colors.END}")
        print(f"{Colors.CYAN}Thanks for using Schiedule Dev Monitor! 🎉{Colors.END}")
        sys.exit(0)

if __name__ == "__main__":
    main()
