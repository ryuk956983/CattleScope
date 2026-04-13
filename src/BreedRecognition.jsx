import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Play, 
  Square, 
  RefreshCcw, 
  ChevronRight,
  Loader2,
  X,
  AlertCircle,
  Info
} from 'lucide-react';

const BreedRecognition = () => {
  const URL_BASE = "https://teachablemachine.withgoogle.com/models/th9ehIWKx/";
  
  // UI & General State
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [status, setStatus] = useState('Initializing AI System...');
  const [error, setError] = useState(null);

  // AI & Webcam State (Using Refs for non-UI engine state to prevent re-render loops)
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [predictions, setPredictions] = useState([]); // For Live Feed
  const [staticPredictions, setStaticPredictions] = useState([]); // For Uploaded Photo
  const [devices, setDevices] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);

  const modelRef = useRef(null);
  const webcamRef = useRef(null);
  const requestRef = useRef();
  const webcamContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // 1. Dynamic Script Loader
  useEffect(() => {
    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) return resolve();
        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.async = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const initAI = async () => {
      try {
        setStatus('Loading TensorFlow...');
        await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js", "tf-js");
        
        setStatus('Loading Image Engine...');
        await loadScript("https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js", "tm-js");
        
        if (!window.tmImage) throw new Error("AI Library failed to bind to window.");

        setStatus('Downloading Model...');
        const modelURL = URL_BASE + "model.json";
        const metadataURL = URL_BASE + "metadata.json";
        modelRef.current = await window.tmImage.load(modelURL, metadataURL);

        setStatus('Scanning Hardware...');
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(d => d.kind === "videoinput");
        setDevices(videoDevices);
        
        setStatus('Ready');
      } catch (err) {
        console.error("AI Init Error:", err);
        setError("AI Engine Error: " + err.message);
        setStatus('Engine Offline');
      }
    };

    initAI();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (webcamRef.current) webcamRef.current.stop();
    };
  }, []);

  // 2. Prediction Logic
  const predict = async () => {
    if (modelRef.current && webcamRef.current && webcamRef.current.canvas) {
      const prediction = await modelRef.current.predict(webcamRef.current.canvas);
      // Sort live predictions as well for consistency
      const sorted = [...prediction].sort((a, b) => b.probability - a.probability);
      setPredictions(sorted);
    }
  };

  const loop = async () => {
    if (webcamRef.current) {
      webcamRef.current.update(); // Update webcam frame
      await predict(); // Run inference
      requestRef.current = window.requestAnimationFrame(loop);
    }
  };

  // 3. Camera Controls
  const startCamera = async () => {
    if (!modelRef.current) return;
    setError(null);
    setStatus('Waking Camera...');
    
    try {
      const tmImage = window.tmImage;
      const deviceId = devices[currentDeviceIndex]?.deviceId;
      
      // Match snippet: width, height, flip
      const newWebcam = new tmImage.Webcam(400, 400, true); 
      
      // Setup with device constraints
      const setupOptions = deviceId ? { deviceId: { exact: deviceId } } : {};
      await newWebcam.setup(setupOptions);
      await newWebcam.play();
      
      // Render to container
      if (webcamContainerRef.current) {
        webcamContainerRef.current.innerHTML = "";
        webcamContainerRef.current.appendChild(newWebcam.canvas);
        newWebcam.canvas.style.width = "100%";
        newWebcam.canvas.style.height = "100%";
        newWebcam.canvas.style.objectFit = "cover";
        newWebcam.canvas.style.borderRadius = "1.5rem";
      }

      webcamRef.current = newWebcam;
      setIsCameraActive(true);
      setStatus('Live Analysis');
      requestRef.current = window.requestAnimationFrame(loop);
    } catch (err) {
      console.error("Camera Error:", err);
      setError("Camera Error: Ensure you have granted permissions.");
      setStatus('Ready');
    }
  };

  const stopCamera = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (webcamRef.current) {
      webcamRef.current.stop();
      webcamRef.current = null;
    }
    setIsCameraActive(false);
    setPredictions([]);
    if (webcamContainerRef.current) webcamContainerRef.current.innerHTML = "";
    setStatus('Ready');
  };

  const switchCamera = () => {
    if (devices.length > 1) {
      const nextIndex = (currentDeviceIndex + 1) % devices.length;
      setCurrentDeviceIndex(nextIndex);
      if (isCameraActive) {
        stopCamera();
        // Delay allows hardware to release before re-acquisition
        setTimeout(startCamera, 400); 
      }
    }
  };

  // File Upload Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result);
        setStaticPredictions([]); // Clear old results when new file chosen
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAnalysis = async () => {
    if (!selectedFile || !modelRef.current || !uploadPreview) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      const img = new Image();
      img.src = uploadPreview;
      img.onload = async () => {
        const results = await modelRef.current.predict(img);
        // Sort results by probability descending so the highest is at the top
        const sortedResults = [...results].sort((a, b) => b.probability - a.probability);
        setStaticPredictions(sortedResults);
        setIsAnalyzing(false);
      };
      img.onerror = () => {
        setError("Could not load image for analysis.");
        setIsAnalyzing(false);
      };
    } catch (err) {
      console.error("Static Analysis Error:", err);
      setError("Analysis failed: " + err.message);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-sans flex flex-col items-center p-4 md:p-8text-white">


      <div className="relative z-10 text-center space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">AI Breed Recognition</h1>
        <p className="opacity-70 text-sm font-medium">Field-ready identification for cattle and buffalo breeds</p>
      </div>

      <div className="relative z-10 w-full max-w-6xl space-y-6">
        

        <div className="bg-black/30 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${error ? 'bg-red-500' : isCameraActive ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-80">
              System: {status}
            </span>
          </div>
          {error && <span className="text-[10px] font-bold text-red-300 uppercase truncate ml-4">{error}</span>}
        </div>

        {/* Top Section: Upload & Results - Added items-start to prevent vertical stretching */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Section 1: Image Upload */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col shadow-2xl h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/10 rounded-lg">
                <Upload className="w-5 h-5 text-orange-300" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">Static Analysis</span>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 border-2 border-dashed border-white/20 rounded-[2rem] flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-white/5 transition-all group relative overflow-hidden min-h-[300px]"
            >
              {uploadPreview ? (
                <img src={uploadPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
              ) : (
                <div className="flex flex-col items-center text-center space-y-4">
                  <ImageIcon className="w-12 h-12 opacity-20 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-bold text-lg">Click to Upload</p>
                    <p className="text-xs opacity-40 uppercase tracking-widest mt-1">PNG or JPG preferred</p>
                  </div>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={triggerAnalysis}
                disabled={!selectedFile || isAnalyzing || !modelRef.current}
                className={`flex-1 ${selectedFile && modelRef.current ? 'bg-orange-500 hover:bg-orange-600' : 'bg-white/5 cursor-not-allowed opacity-40'} py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-2`}
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Identify Breed"}
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col shadow-2xl min-h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Info className="w-5 h-5 text-[#fde047]" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider">Recognition Results</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              {isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-medium opacity-60">Scanning image for breed markers...</p>
                </div>
              ) : staticPredictions.length > 0 ? (
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">
                    Analysis Results (Top Match First)
                  </h4>
                  {staticPredictions.map((p, i) => (
                    <div key={i} className={`space-y-2 p-3 rounded-xl transition-all ${i === 0 ? 'bg-white/10 border border-white/20' : ''}`}>
                      <div className="flex justify-between items-end">
                        <span className={`text-xl font-bold tracking-tight ${i === 0 ? 'text-[#fde047]' : 'opacity-90'}`}>
                          {p.className} 
                        </span>
                        <span className="text-[10px] font-mono opacity-50">{(p.probability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r transition-all duration-700 ease-out ${i === 0 ? 'from-yellow-400 to-orange-500' : 'from-white/40 to-white/10'}`} 
                          style={{ width: `${p.probability * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 space-y-4">
                  <Info className="w-12 h-12 mx-auto" />
                  <p className="font-medium">Upload a photo and click Identify to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>


        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Camera className="w-5 h-5 text-yellow-300" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">Live AI Feed</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={switchCamera}
                disabled={devices.length <= 1}
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-20 border border-white/10"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={isCameraActive ? stopCamera : startCamera}
                disabled={!modelRef.current}
                className={`${isCameraActive ? 'bg-red-500/80' : 'bg-green-500/80'} px-6 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-lg`}
              >
                {isCameraActive ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                {isCameraActive ? 'Stop' : 'Start'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
            <div className="relative aspect-square md:aspect-video bg-black/40 rounded-[2rem] overflow-hidden border border-white/10 flex items-center justify-center shadow-inner">
              {!isCameraActive && (
                <div className="flex flex-col items-center gap-4 opacity-10">
                  <Camera className="w-20 h-20" />
                  <span className="text-xs font-black tracking-[0.3em] uppercase">Sensor Offline</span>
                </div>
              )}
              <div 
                ref={webcamContainerRef} 
                className={`w-full h-full transition-opacity duration-1000 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
              />
              {isCameraActive && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full text-[10px] font-black animate-pulse shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full" /> LIVE AI
                </div>
              )}
            </div>

          
            <div className="bg-black/20 rounded-[2rem] p-6 border border-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6 flex items-center gap-2">
                Live Confidence Panel
              </h4>
              <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {predictions.length > 0 ? (
                  predictions.map((p, i) => (
                    <div key={i} className={`space-y-2 p-2 rounded-lg ${i === 0 ? 'bg-white/5 border border-white/10' : ''}`}>
                      <div className="flex justify-between items-end">
                        <span className={`text-xs font-bold tracking-tight ${i === 0 ? 'text-yellow-400' : 'opacity-90'}`}>{p.className}</span>
                        <span className="text-[10px] font-mono opacity-50">{(p.probability * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ease-out ${i === 0 ? 'bg-gradient-to-r from-orange-400 to-yellow-300' : 'bg-white/20'}`} 
                          style={{ width: `${p.probability * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 opacity-20 italic text-xs">
                    {isCameraActive ? 'Processing initial frames...' : 'Activate sensor to view predictions'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default BreedRecognition;