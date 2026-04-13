import React,{useRef} from 'react';
import { Camera, CheckCircle2, Circle, Eye, ArrowRight} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {


  return (
    <div className="min-h-screen w-full relative overflow-hidden font-sans text-white  flex flex-col">

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-12 px-8 md:px-24 pb-20">
        
        {/* Left Column: Info and Actions */}
        <div className="flex-1 max-w-2xl space-y-8">
          <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-xs font-medium tracking-wide uppercase opacity-80">AI-Powered Breed Recognition</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
              Accurate Livestock
              <span className="block text-[#fde047] mt-2 italic">Breed Identification</span>
            </h2>
          </div>

          <p className="text-lg leading-relaxed text-white/90 max-w-xl font-medium">
        Bharat Livestock App revolutionizes cattle and buffalo breed identification. 
Quick and accurate AI-powered identification to assist field-level workers across India.
          </p>

          <div className="space-y-3">
            {[
              { icon: <Camera className="w-5 h-5" />, text: "Real-time Analysis" },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: "90%+ Accuracy" },
              { icon: <Circle className="w-5 h-5" />, text: "BPA Integration" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 bg-black/20 backdrop-blur-sm border border-white/5 py-2 px-4 rounded-xl w-fit">
                <span className="opacity-70">{feature.icon}</span>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="recognition" className="bg-[#fb923c] hover:bg-[#f97316] text-white font-bold py-4 px-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 transition-all group">
              Start Recognition
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/database" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-12 rounded-xl flex items-center justify-center gap-2 transition-all">
              <Eye className="w-5 h-5" />
              View Breed Database
            </Link>
          </div>
        </div>

        {/* Right Column: System Performance Card */}
        <div className="w-full md:w-[400px]">
          <div className="bg-[#b4863c]/40 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-xl font-bold mb-8">System Performance</h3>
            
            <div className="space-y-8">
              {/* Stat 1 */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-semibold opacity-90">
                  <span>Breed Accuracy</span>
                  <span>90%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[90%] bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"></div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-semibold opacity-90">
                  <span>Processing Speed</span>
                  <span>&lt; 3 sec</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-semibold opacity-90">
                  <span>Coverage</span>
                  <span>40+ Breeds</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

     

    </div>
  );
};

export default LandingPage;
