import React, { useEffect, useState } from 'react';
import {Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const BreedDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(()=>{
    console.log(searchQuery);
  },[])

  const breeds = [

    { name: "Alambadi", location: "Tamil Nadu", description: "Medium; Grey/white/black; Draught." },
    { name: "Amritmahal", location: "Karnataka", description: "Large; Grey; Draught (famous war bullocks)." },
    { name: "Ayrshire", location: "Scotland", description: "Medium-large; Red & white; Milk." },
    { name: "Banni", location: "Gujarat", description: "Large; Black; Milk (buffalo breed resilient to night grazing)." },
    { name: "Bargur", location: "Tamil Nadu", description: "Medium; Brown with white; Draught." },
    { name: "Bhadawari", location: "Uttar Pradesh", description: "Medium; Copper-colored; Milk (high fat buffalo breed)." },
    { name: "Brown_Swiss", location: "Switzerland", description: "Large; Brown-grey; Milk (high fat)." },
    { name: "Dangi", location: "Maharashtra", description: "Medium; Grey-black; Draught & Milk (dual)." },
    { name: "Deoni", location: "Maharashtra", description: "Medium-large; White with black spots; Dual-purpose (milk & draught)." },
    { name: "Gir", location: "Gujarat", description: "Large; Red with white; Milk." },
    { name: "Guernsey", location: "Isle of Guernsey", description: "Medium; Fawn and white; High-quality golden milk." },
    { name: "Hallikar", location: "Karnataka", description: "Medium; Grey to dark grey; Premier draught breed." },
    { name: "Hariana", location: "Haryana", description: "Medium; White/Light grey; Dual-purpose." },
    { name: "Holstein_Friesian", location: "Netherlands", description: "Large; Black & white; Highest milk production." },
    { name: "Jaffrabadi", location: "Gujarat", description: "Massive; Black; Heavy milk producer (buffalo)." },
    { name: "Jersey", location: "Isle of Jersey", description: "Small-medium; Fawn; High milk fat content." },
    { name: "Kangayam", location: "Tamil Nadu", description: "Medium; Grey/white; Hardworking draught breed." },
    { name: "Kankrej", location: "Gujarat/Rajasthan", description: "Large; Silver-grey; Dual-purpose (powerful gait)." },
    { name: "Kenkatha", location: "UP/MP Border", description: "Small; Grey; Draught." },
    { name: "Kherigarh", location: "Uttar Pradesh", description: "Medium; White; Active draught breed." },
    { name: "Khillari", location: "Maharashtra/Karnataka", description: "Medium-large; Grey-white; Fast draught." },
    { name: "Krishna_Valley", location: "Karnataka", description: "Large; Grey-white; Heavy draught." },
    { name: "Malnad_gidda", location: "Karnataka", description: "Small/Dwarf; Various colors; Milk & Manure." },
    { name: "Mehsana", location: "Gujarat", description: "Medium-large; Black; Regular milk producer (buffalo)." },
    { name: "Murrah", location: "Haryana/Punjab", description: "Large; Jet black, The black gold" },
    { name: "Nagori", location: "Rajasthan", description: "Large; White; Excellent trotting draught breed." },
    { name: "Nagpuri", location: "Maharashtra", description: "Medium; Black; Dual-purpose buffalo (milk & draught)." },
    { name: "Nili_Ravi", location: "Punjab (Pakistan/India)", description: "Large; Black with white markings; High milk yield (buffalo)." },
    { name: "Nimari", location: "Madhya Pradesh", description: "Medium-large; Red with white patches; Draught." },
    { name: "Ongole", location: "Andhra Pradesh", description: "Large; White/Glossy; Dual-purpose (world-renowned)." },
    { name: "Pulikulam", location: "Tamil Nadu", description: "Small; Dark grey/black; Draught (Jallikattu bull)." },
    { name: "Rathi", location: "Rajasthan", description: "Medium; Brown with white patches; Dual-purpose." },
    { name: "Red_Dane", location: "Denmark", description: "Large; Red/Brown; Milk." },
    { name: "Red_Sindhi", location: "Sindh (Pakistan)", description: "Medium; Deep red; High milk yield." },
    { name: "Sahiwal", location: "Punjab (Pakistan/India)", description: "Medium; Reddish-brown; Best Indian milk breed." },
    { name: "Surti", location: "Gujarat", description: "Medium; Black/Grey; Efficient milk producer (buffalo)." },
    { name: "Tharparkar", location: "Rajasthan", description: "Medium; White/Grey; Dual-purpose (drought resistant)." },
    { name: "Toda", location: "Tamil Nadu", description: "Large; Ash grey; Semi-wild buffalo breed." },
    { name: "Umblachery", location: "Tamil Nadu", description: "Medium; Grey with white stars; Draught (paddy fields)." },
    { name: "Vechur", location: "Kerala", description: "Dwarf; Light red/grey/white; Extremely low maintenance milk." }

  ];

  const filteredBreeds = breeds.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||  b.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-sans text-white flex flex-col">
      
   

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-8 md:px-24 pb-20 scrollbar-hide">
        <div className="text-center space-y-4 mb-10 mt-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Breed <span className="text-[#fde047]">Database</span>
          </h1>
          <p className="opacity-70 font-medium text-sm md:text-base">
            Comprehensive database of cattle and buffalo breeds
          </p>
          
          {/* Search Input */}
          <div className="max-w-xl mx-auto relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
            <input 
              type="text"
              placeholder="Search breeds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-md border border-white/20 rounded-xl py-3 pl-12 pr-4 outline-none focus:bg-white/10 transition-all placeholder:text-white/30 text-sm"
            />
          </div>
        </div>

        {/* Grid of Breed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBreeds.map((breed, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] hover:bg-white/15 transition-all cursor-pointer group shadow-xl shadow-black/5"
            >
              <h4 className="text-xl font-bold mb-1 tracking-tight group-hover:text-[#fde047] transition-colors">
                {breed.name}
              </h4>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] mb-6">
                {breed.location}
              </p>
              <p className="text-sm opacity-70 leading-relaxed font-medium">
                {breed.description}
              </p>
            </div>
          ))}
          
          {/* Empty State */}
          {filteredBreeds.length === 0 && (
            <div className="col-span-full py-20 text-center opacity-40 font-medium italic">
              No breeds found in the database matching "{searchQuery}"
            </div>
          )}
        </div>
      </main>

     
    </div>
  );
};

export default BreedDatabase;