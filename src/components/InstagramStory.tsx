import React, { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

interface InstagramStoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstagramStory: React.FC<InstagramStoryProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const stories = [
    {
      id: 1,
      type: 'coding',
      title: "Late Night Coding 🌙",
      subtitle: "Building something cool... 👨‍💻",
      gradient: "from-gray-900 via-gray-800 to-black"
    },
    {
      id: 2,
      type: 'terminal',
      title: "Deploy Success ✅",
      subtitle: "When everything works perfectly 🔥",
      gradient: "from-green-900 via-green-800 to-black"
    },
    {
      id: 3,
      type: 'debug',
      title: "Debug Mode ON 🐛",
      subtitle: "Finding bugs like a detective 🕵️",
      gradient: "from-red-900 via-orange-800 to-black"
    },
    {
      id: 4,
      type: 'stats',
      title: "Code Stats 📊",
      subtitle: "Numbers don't lie... 💪",
      gradient: "from-blue-900 via-purple-800 to-black"
    }
  ];

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentSlide < stories.length - 1) {
            setCurrentSlide(prev => prev + 1);
            return 0;
          } else {
            onClose();
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen, currentSlide, stories.length, onClose]);

  const handleNext = () => {
    if (currentSlide < stories.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setProgress(0);
    }
  };

  if (!isOpen) return null;

  const currentStory = stories[currentSlide];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Story Container */}
      <div className="relative w-full max-w-sm h-full bg-black overflow-hidden">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-20 flex space-x-1">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-100"
                style={{ 
                  width: index < currentSlide ? '100%' : 
                         index === currentSlide ? `${progress}%` : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-12 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">📚</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">schiedule_app</p>
              <p className="text-white/70 text-xs">2h</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Story Content */}
        <div className={`w-full h-full bg-gradient-to-br ${currentStory.gradient} flex flex-col items-center justify-center relative`}>
          {/* Navigation Areas */}
          <div className="absolute left-0 top-0 w-1/3 h-full z-10" onClick={handlePrev} />
          <div className="absolute right-0 top-0 w-1/3 h-full z-10" onClick={handleNext} />

          {/* Content based on story type */}
          {currentStory.type === 'coding' && (
            <div className="text-left px-4 py-8">
              <div className="text-center mb-6">
                <h2 className="text-white text-xl font-bold mb-2">{currentStory.title}</h2>
                <p className="text-white/90 text-sm">{currentStory.subtitle}</p>
              </div>
              
              {/* Mock VS Code Interface */}
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                {/* VS Code Header */}
                <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-white text-xs ml-4">📁 schiedule-main/src/components/CourseCard.tsx</div>
                </div>
                
                {/* Code Content */}
                <div className="p-3 text-xs font-mono">
                  <div className="text-gray-500">1</div>
                  <div className="text-blue-400">2  <span className="text-purple-400">import</span> <span className="text-white">React</span> <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;</div>
                  <div className="text-gray-500">3</div>
                  <div className="text-blue-400">4  <span className="text-purple-400">interface</span> <span className="text-yellow-400">CourseCardProps</span> {'{'}</div>
                  <div className="text-blue-400">5    <span className="text-white">course</span>: <span className="text-yellow-400">Course</span>;</div>
                  <div className="text-blue-400">6    <span className="text-white">onEdit</span>: <span className="text-gray-400">(course: Course) =&gt; void;</span></div>
                  <div className="text-blue-400">7  {'}'}</div>
                  <div className="text-gray-500">8</div>
                  <div className="text-blue-400">9  <span className="text-purple-400">const</span> <span className="text-yellow-400">CourseCard</span> = <span className="text-gray-400">({'{'}</span> <span className="text-white">course, onEdit</span> <span className="text-gray-400">{'}'}) =&gt; {'{'}</span></div>
                  <div className="text-blue-400">10   <span className="text-purple-400">return</span> (</div>
                  <div className="text-blue-400">11     <span className="text-red-400">&lt;Card</span> <span className="text-green-400">className=</span><span className="text-yellow-400">"group bg-card..."</span><span className="text-red-400">&gt;</span></div>
                  <div className="text-blue-400">12       <span className="text-gray-400">// Beautiful course card UI ✨</span></div>
                  <div className="text-blue-400">13     <span className="text-red-400">&lt;/Card&gt;</span></div>
                  <div className="text-blue-400">14   );</div>
                  <div className="text-blue-400">15 {'}'}</div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <div className="text-white/70 text-xs">⚡ TypeScript + React + Tailwind CSS</div>
              </div>
            </div>
          )}

          {currentStory.type === 'terminal' && (
            <div className="text-left px-4 py-8">
              <div className="text-center mb-6">
                <h2 className="text-white text-xl font-bold mb-2">{currentStory.title}</h2>
                <p className="text-white/90 text-sm">{currentStory.subtitle}</p>
              </div>
              
              {/* Mock Terminal */}
              <div className="bg-black rounded-lg overflow-hidden border border-green-700">
                {/* Terminal Header */}
                <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-white text-xs ml-4">💻 Terminal</div>
                </div>
                
                {/* Terminal Content */}
                <div className="p-3 text-xs font-mono space-y-1">
                  <div className="text-green-400">$ npm run build</div>
                  <div className="text-white">✓ Building for production...</div>
                  <div className="text-white">✓ Optimizing assets...</div>
                  <div className="text-white">✓ Generating static files...</div>
                  <div className="text-green-400">✓ Build completed in 2.3s</div>
                  <div className="text-white"></div>
                  <div className="text-green-400">$ npm run deploy</div>
                  <div className="text-white">🚀 Deploying to production...</div>
                  <div className="text-white">✓ Files uploaded successfully</div>
                  <div className="text-green-400">✅ Deployment successful!</div>
                  <div className="text-blue-400">🌐 https://schiedule-app.netlify.app</div>
                  <div className="text-white"></div>
                  <div className="text-green-400">$ git status</div>
                  <div className="text-white">On branch main</div>
                  <div className="text-green-400">nothing to commit, working tree clean</div>
                  <div className="text-green-400 animate-pulse">█</div>
                </div>
              </div>
            </div>
          )}

          {currentStory.type === 'debug' && (
            <div className="text-left px-4 py-8">
              <div className="text-center mb-6">
                <h2 className="text-white text-xl font-bold mb-2">{currentStory.title}</h2>
                <p className="text-white/90 text-sm">{currentStory.subtitle}</p>
              </div>
              
              {/* Mock Browser DevTools */}
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-orange-700">
                {/* DevTools Header */}
                <div className="bg-gray-800 px-4 py-2 flex items-center space-x-4">
                  <div className="text-white text-xs">🔍 DevTools</div>
                  <div className="flex space-x-2 text-xs">
                    <span className="text-blue-400">Console</span>
                    <span className="text-gray-400">Elements</span>
                    <span className="text-gray-400">Network</span>
                  </div>
                </div>
                
                {/* Console Content */}
                <div className="p-3 text-xs font-mono space-y-1">
                  <div className="text-blue-400">▶ Schiedule App initialized</div>
                  <div className="text-green-400">✓ React components loaded</div>
                  <div className="text-green-400">✓ Tailwind CSS applied</div>
                  <div className="text-yellow-400">⚠ localStorage: 15 courses loaded</div>
                  <div className="text-blue-400">📊 Performance: 98.5/100</div>
                  <div className="text-white">🎯 0 errors, 0 warnings</div>
                  <div className="text-green-400">✓ All tests passing</div>
                  <div className="text-orange-400">🔥 Hot reload active</div>
                  <div className="text-purple-400">🚀 App running on localhost:8081</div>
                  <div className="text-white"></div>
                  <div className="text-gray-400">// Clean code = happy developer 😊</div>
                  <div className="text-green-400 animate-pulse">█</div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <div className="text-white/70 text-xs">🐛 Zero bugs found! Perfect code ✨</div>
              </div>
            </div>
          )}

          {currentStory.type === 'stats' && (
            <div className="text-center px-6 py-8">
              <div className="text-center mb-6">
                <h2 className="text-white text-xl font-bold mb-2">{currentStory.title}</h2>
                <p className="text-white/90 text-sm">{currentStory.subtitle}</p>
              </div>
              
              {/* GitHub-style Stats */}
              <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-blue-700">
                <div className="text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-400">📊 Project Stats</span>
                    <span className="text-white">schiedule-main</span>
                  </div>
                  <div className="h-px bg-gray-700"></div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lines of Code:</span>
                      <span className="text-green-400 font-mono">2,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Components:</span>
                      <span className="text-blue-400 font-mono">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">TypeScript:</span>
                      <span className="text-purple-400 font-mono">89.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">CSS:</span>
                      <span className="text-pink-400 font-mono">8.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Commits:</span>
                      <span className="text-yellow-400 font-mono">47</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tech Stack */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-2xl mb-1">⚛️</div>
                  <div className="text-white text-sm font-bold">React 18</div>
                  <div className="text-white/70 text-xs">Frontend</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-2xl mb-1">🔷</div>
                  <div className="text-white text-sm font-bold">TypeScript</div>
                  <div className="text-white/70 text-xs">Type Safety</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-2xl mb-1">🎨</div>
                  <div className="text-white text-sm font-bold">Tailwind</div>
                  <div className="text-white/70 text-xs">Styling</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-white text-sm font-bold">Vite</div>
                  <div className="text-white/70 text-xs">Build Tool</div>
                </div>
              </div>
              
              <div className="mt-4 text-white/70 text-xs">
                💻 Built with passion and lots of coffee ☕
              </div>
            </div>
          )}


          {/* Story Actions */}
          <div className="absolute bottom-8 left-4 right-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`transition-colors ${isLiked ? 'text-red-500' : 'text-white'}`}
                >
                  <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                </button>
                <button className="text-white">
                  <MessageCircle size={24} />
                </button>
                <button className="text-white">
                  <Send size={24} />
                </button>
              </div>
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`transition-colors ${isBookmarked ? 'text-yellow-400' : 'text-white'}`}
              >
                <Bookmark size={24} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramStory;
