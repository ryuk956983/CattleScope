import React,{useRef} from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {    
    const dropdownRef = useRef(null);
  return (
   <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-md:text-sm">
        <div className="flex items-center gap-3">
         
          <div>
            <h1 className="text-xl font-bold leading-tight">CattleScope</h1>
      
          </div>
        </div>

        <div className="flex items-center gap-4">
         <div className="relative overflow-hidden" >
          
          <button
            className="focus:outline-none relative z-9 flex gap-2 items-center text-white"
        
            aria-label="Select Language"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQadidhcrDRq9goW5I0-lqPwkAH_cB0E8H04Q&s"
              alt="Language"
              className="h-8 w-8 rounded-full object-cover border-2 border-white hover:border-orange-500 transition"
            />
            <div id="google_translate_element" ref={dropdownRef} className="h-4 absolute top-0 "></div>
          </button>

        </div>
          <Link to="/" className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-1.5 rounded-lg border border-white/10 transition-all text-sm font-medium">
            Home
          </Link>
        </div>
      </nav>
  )
}

export default Navbar