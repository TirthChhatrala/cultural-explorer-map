
import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Shirt } from 'lucide-react';
import StateCard from '../components/StateCard';
import { useTheme } from '../context/ThemeContext';

const TraditionalClothing = () => {
  const { theme } = useTheme();

  // Example traditional clothing data
  const clothingData = [
    {
      region: "North India",
      states: ["Punjab", "Haryana", "Uttar Pradesh", "Rajasthan"],
      womenAttire: "Women wear colorful Salwar Kameez, Lehenga Choli, and Patiala suits with intricate embroidery. In Punjab, the Phulkari embroidery is famous.",
      menAttire: "Men typically wear Kurta Pajama, Dhoti Kurta, or Sherwani for special occasions. In Rajasthan, colorful turbans (Pagri) are an essential part of men's attire.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Phulkari_Work_from_Punjab.jpg/800px-Phulkari_Work_from_Punjab.jpg",
      special: "Bandhani tie-dye technique from Rajasthan and Gujarat; Phulkari embroidery from Punjab."
    },
    {
      region: "South India",
      states: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"],
      womenAttire: "Women traditionally wear Sarees draped in distinctive regional styles. Kerala is known for the white and gold Kasavu saree, while Tamil Nadu has the Kanjeevaram silk sarees.",
      menAttire: "Men wear Dhoti or Lungi with Angavastram (shoulder cloth). In Kerala, men wear the Mundu, often with a gold border for special occasions.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Grand_Ladies_in_Grand_Sarees.jpg/800px-Grand_Ladies_in_Grand_Sarees.jpg",
      special: "Kanjeevaram silk from Tamil Nadu; Pochampally Ikat from Telangana."
    },
    {
      region: "East India",
      states: ["West Bengal", "Odisha", "Bihar", "Jharkhand", "Assam"],
      womenAttire: "Sarees are common, with the Jamdani and Tant sarees of West Bengal being particularly famous. In Assam, women wear the Mekhela Chador.",
      menAttire: "Men typically wear Dhoti-Kurta. In Bengal, the traditional Dhuti-Panjabi is worn during cultural events.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Mekhela_Sador.jpg/800px-Mekhela_Sador.jpg",
      special: "Kantha embroidery from West Bengal; Sambalpuri Ikat from Odisha."
    },
    {
      region: "West India",
      states: ["Gujarat", "Maharashtra", "Goa"],
      womenAttire: "In Gujarat, women wear the Chaniya Choli with mirror work. Maharashtrian women wear the nine-yard Nauvari saree draped in a unique style.",
      menAttire: "Men in Maharashtra traditionally wear Dhoti with Pheta (turban). In Gujarat, men wear Kediyu (short round kurta) with Dhoti.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Gujarati_people.jpg/800px-Gujarati_people.jpg",
      special: "Mirror work and Bandhani from Gujarat; Paithani weaving from Maharashtra."
    },
    {
      region: "Northeast India",
      states: ["Nagaland", "Manipur", "Mizoram", "Arunachal Pradesh", "Meghalaya", "Tripura", "Sikkim"],
      womenAttire: "Each tribe has its distinct attire with vibrant colors and unique patterns. In Manipur, women wear the Phanek and Innaphi.",
      menAttire: "Men wear distinctive tribal garments, often with colorful patterns and accessories. In Nagaland, men wear the warrior shawl with tribal patterns.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Nagalim_Hornbill_festival.jpg/800px-Nagalim_Hornbill_festival.jpg",
      special: "Naga shawls with tribal motifs; Manipuri weaving with intricate designs."
    },
    {
      region: "Central India",
      states: ["Madhya Pradesh", "Chhattisgarh"],
      womenAttire: "Women wear traditional sarees with distinctive tribal patterns. The Chanderi and Maheshwari sarees from Madhya Pradesh are famous.",
      menAttire: "Men wear Dhoti-Kurta, often with a turban or headgear that varies by community.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Gonds_culture_and_beauty.jpg/800px-Gonds_culture_and_beauty.jpg",
      special: "Chanderi and Maheshwari weaving from Madhya Pradesh; Tribal hand-painting techniques."
    }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <section className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium mb-4">
              Cultural Explorer
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Traditional Clothing
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the diverse textile traditions and attire across Indian regions
            </p>
          </motion.div>
        </section>
        
        <section className="mb-12">
          <div className={`rounded-xl p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg mb-8`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Shirt />
              </div>
              <h2 className="text-2xl font-display font-semibold">Textile Traditions</h2>
            </div>
            <p className="text-muted-foreground">
              India's rich textile heritage spans centuries, with each region developing distinctive styles, 
              weaves, and embroidery techniques. From the Banarasi brocades of Uttar Pradesh to the Kanjeevaram 
              silks of Tamil Nadu, the Chanderi weaves of Madhya Pradesh to the Phulkari embroidery of Punjab, 
              India's traditional clothing reflects its cultural diversity, historical influences, and artistic craftsmanship.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {clothingData.slice(0, 4).map((clothing, index) => (
              <div 
                key={clothing.region}
                className={`rounded-xl overflow-hidden shadow-sm ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={clothing.image} 
                    alt={clothing.region} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Shirt size={18} />
                    </div>
                    <h3 className="text-xl font-display font-semibold">{clothing.region}</h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium">States: </span>{clothing.states.join(", ")}
                  </p>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="font-medium mb-1">Women's Traditional Attire</h4>
                      <p className="text-sm text-muted-foreground">{clothing.womenAttire}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Men's Traditional Attire</h4>
                      <p className="text-sm text-muted-foreground">{clothing.menAttire}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Special Techniques</h4>
                      <p className="text-sm text-muted-foreground">{clothing.special}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {clothingData.slice(4, 6).map((clothing, index) => (
              <StateCard
                key={clothing.region}
                title={clothing.region}
                icon={<Shirt size={24} />}
                delay={index * 0.1}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <img 
                      src={clothing.image} 
                      alt={clothing.region} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">States: </span>{clothing.states.join(", ")}
                    </p>
                    
                    <div>
                      <h4 className="font-medium mb-1">Women's Traditional Attire</h4>
                      <p className="text-sm text-muted-foreground">{clothing.womenAttire}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Men's Traditional Attire</h4>
                      <p className="text-sm text-muted-foreground">{clothing.menAttire}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Special Techniques</h4>
                      <p className="text-sm text-muted-foreground">{clothing.special}</p>
                    </div>
                  </div>
                </div>
              </StateCard>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-display font-semibold mb-6">Significance in Culture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="text-xl font-display font-semibold mb-3">Festivals & Celebrations</h3>
              <p className="text-muted-foreground">
                Traditional clothing plays a vital role during festivals and celebrations, with specific attire 
                reserved for particular occasions, symbolizing cultural identity and festive spirit.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="text-xl font-display font-semibold mb-3">Rituals & Ceremonies</h3>
              <p className="text-muted-foreground">
                Specific clothing is worn during life events like weddings, naming ceremonies, and religious rituals, 
                often carrying deep symbolic significance within the community.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="text-xl font-display font-semibold mb-3">Artisan Communities</h3>
              <p className="text-muted-foreground">
                Traditional textile crafts support numerous artisan communities across India, with skills passed 
                down through generations, contributing significantly to cultural heritage and local economies.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default TraditionalClothing;
