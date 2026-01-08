import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Utensils, Download, ChefHat, Clock, Users, Star } from 'lucide-react';
import StateCard from '../components/StateCard';
import { useTheme } from '../context/ThemeContext';
import { states } from '../data/states';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface Recipe {
  id: string;
  name: string;
  state: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  tips: string[];
  image: string;
  rating: number;
}

const CuisineFood = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const cuisineData = [
    {
      state: "Punjab",
      dishes: ["Chole Bhature", "Butter Chicken", "Sarson Da Saag", "Makki Di Roti"],
      description: "Punjabi cuisine is known for its rich, buttery flavors and extensive use of dairy products."
    },
    {
      state: "Kerala",
      dishes: ["Appam", "Kerala Fish Curry", "Puttu", "Malabar Biryani"],
      description: "Kerala cuisine features coconut-infused dishes and an abundance of seafood options."
    },
    {
      state: "Gujarat",
      dishes: ["Dhokla", "Thepla", "Fafda", "Khandvi"],
      description: "Gujarati cuisine is primarily vegetarian and known for its distinctive sweet, salty, and spicy flavors."
    },
    {
      state: "West Bengal",
      dishes: ["Rasgulla", "Fish Curry", "Mishti Doi", "Sandesh"],
      description: "Bengali cuisine is known for its subtle flavors, fish dishes, and sweet delicacies."
    },
    {
      state: "Tamil Nadu",
      dishes: ["Dosa", "Idli", "Sambar", "Chettinad Chicken"],
      description: "Tamil cuisine is characterized by its use of rice, lentils and distinct flavors of tamarind, curry leaves and mustard seeds."
    },
    {
      state: "Rajasthan",
      dishes: ["Dal Baati Churma", "Laal Maas", "Gatte ki Sabzi", "Ker Sangri"],
      description: "Rajasthani cuisine is known for its spicy flavors and unique cooking methods suited for the desert climate."
    },
    {
      state: "Maharashtra",
      dishes: ["Vada Pav", "Pav Bhaji", "Puran Poli", "Misal Pav"],
      description: "Maharashtrian cuisine offers a blend of mild and spicy dishes with diverse regional variations."
    },
    {
      state: "Andhra Pradesh",
      dishes: ["Hyderabadi Biryani", "Gongura", "Pesarattu", "Pulihora"],
      description: "Andhra cuisine is famous for its spiciness and extensive use of chillies and tamarind."
    }
  ];

  const recipes: Recipe[] = [
    {
      id: 'butter-chicken',
      name: 'Butter Chicken (Murgh Makhani)',
      state: 'Punjab',
      description: 'Creamy, rich and flavorful curry made with tender chicken pieces in a tomato-based sauce.',
      prepTime: '30 mins',
      cookTime: '45 mins',
      servings: 4,
      difficulty: 'Medium',
      ingredients: [
        '500g chicken thighs, boneless',
        '1 cup yogurt',
        '2 tbsp ginger-garlic paste',
        '1 tsp red chilli powder',
        '1 tsp turmeric powder',
        '1 tsp garam masala',
        '2 cups tomato puree',
        '1 cup heavy cream',
        '4 tbsp butter',
        '1 tbsp kasuri methi',
        'Salt to taste',
        'Fresh coriander for garnish'
      ],
      instructions: [
        'Marinate chicken with yogurt, ginger-garlic paste, chilli powder, turmeric, and salt for at least 2 hours.',
        'Grill or pan-fry the marinated chicken until charred and cooked through. Set aside.',
        'In a heavy-bottomed pan, melt 2 tbsp butter and add tomato puree. Cook for 10-15 minutes until oil separates.',
        'Add remaining spices and cook for 2 minutes.',
        'Add cream and remaining butter, stir well.',
        'Add the grilled chicken pieces and simmer for 10-15 minutes.',
        'Add kasuri methi, adjust seasoning.',
        'Garnish with fresh cream and coriander. Serve with naan or rice.'
      ],
      tips: [
        'Marinate overnight for best results',
        'Use kashmiri red chilli for vibrant color without too much heat',
        'Add a pinch of sugar to balance the tanginess'
      ],
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
      rating: 4.8
    },
    {
      id: 'masala-dosa',
      name: 'Masala Dosa',
      state: 'Karnataka',
      description: 'Crispy fermented rice crepe filled with spiced potato filling, a South Indian breakfast favorite.',
      prepTime: '8 hours (fermentation)',
      cookTime: '30 mins',
      servings: 6,
      difficulty: 'Medium',
      ingredients: [
        '2 cups rice',
        '1/2 cup urad dal',
        '1/4 cup chana dal',
        '1 tsp fenugreek seeds',
        'Salt to taste',
        'Oil for cooking',
        'For filling:',
        '4 large potatoes, boiled and mashed',
        '2 onions, sliced',
        '1 tsp mustard seeds',
        '1 tsp turmeric',
        'Green chillies, curry leaves'
      ],
      instructions: [
        'Soak rice, urad dal, chana dal, and fenugreek seeds separately for 4-6 hours.',
        'Grind to smooth batter, mix together with salt, and ferment overnight.',
        'For filling: Temper mustard seeds, add curry leaves, green chillies, and onions.',
        'Add turmeric and mashed potatoes, mix well. Set aside.',
        'Heat a dosa tawa, pour a ladleful of batter and spread in circular motion.',
        'Drizzle oil around edges, cook until golden and crispy.',
        'Place potato filling in center, fold and serve.',
        'Serve with coconut chutney and sambar.'
      ],
      tips: [
        'Fermentation is key - batter should double in size',
        'The tawa should be at medium-high heat for crispy dosa',
        'Add a little poha while grinding for crispier texture'
      ],
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400',
      rating: 4.9
    },
    {
      id: 'dhokla',
      name: 'Dhokla',
      state: 'Gujarat',
      description: 'Soft, spongy steamed savory cake made from fermented chickpea flour.',
      prepTime: '15 mins',
      cookTime: '20 mins',
      servings: 8,
      difficulty: 'Easy',
      ingredients: [
        '2 cups besan (gram flour)',
        '1 cup curd',
        '1 tsp ginger-green chilli paste',
        '1 tsp sugar',
        '1 tsp fruit salt (Eno)',
        'Salt to taste',
        'For tempering:',
        '2 tbsp oil',
        '1 tsp mustard seeds',
        '2-3 green chillies',
        '10-12 curry leaves',
        'Fresh coriander and coconut for garnish'
      ],
      instructions: [
        'Mix besan, curd, ginger-chilli paste, sugar, salt, and 1 cup water to make a smooth batter.',
        'Let it rest for 10 minutes.',
        'Add fruit salt and mix gently. Pour into a greased plate.',
        'Steam for 15-20 minutes until a toothpick comes out clean.',
        'For tempering: Heat oil, add mustard seeds, green chillies, and curry leaves.',
        'Pour the tempering over the dhokla.',
        'Cut into pieces and garnish with coriander and coconut.',
        'Serve with green chutney.'
      ],
      tips: [
        'Do not over-mix after adding Eno',
        'Steam immediately after adding fruit salt',
        'Add a pinch of turmeric for yellow color'
      ],
      image: 'https://images.unsplash.com/photo-1606491048802-8342506d6471?w=400',
      rating: 4.7
    },
    {
      id: 'biryani',
      name: 'Hyderabadi Biryani',
      state: 'Telangana',
      description: 'Aromatic layered rice dish with marinated meat, cooked with saffron and spices.',
      prepTime: '1 hour',
      cookTime: '1 hour',
      servings: 6,
      difficulty: 'Hard',
      ingredients: [
        '500g basmati rice',
        '750g mutton/chicken',
        '2 cups yogurt',
        '4 onions, fried golden',
        '1/4 cup ginger-garlic paste',
        'Biryani masala',
        'Saffron strands in warm milk',
        'Ghee',
        'Fresh mint and coriander',
        'Whole spices (bay leaves, cardamom, cloves, cinnamon)',
        'Salt to taste'
      ],
      instructions: [
        'Marinate meat with yogurt, half the fried onions, ginger-garlic paste, and spices for 2-4 hours.',
        'Soak rice for 30 minutes, then parboil with whole spices until 70% cooked. Drain.',
        'In a heavy pot, layer the marinated meat at the bottom.',
        'Add a layer of parboiled rice, then remaining fried onions, mint, and coriander.',
        'Drizzle saffron milk and ghee over the top.',
        'Seal the pot with dough or foil and cook on low heat for 45 minutes.',
        'Let it rest for 10 minutes before opening.',
        'Gently mix layers and serve with raita and mirchi ka salan.'
      ],
      tips: [
        'Use aged basmati rice for best results',
        'The dum (slow cooking) is crucial - don\'t lift the lid',
        'Let meat marinate overnight for more flavor'
      ],
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
      rating: 4.9
    },
    {
      id: 'rasgulla',
      name: 'Rasgulla',
      state: 'West Bengal',
      description: 'Soft, spongy cheese balls soaked in light sugar syrup, a beloved Bengali sweet.',
      prepTime: '30 mins',
      cookTime: '30 mins',
      servings: 15,
      difficulty: 'Medium',
      ingredients: [
        '1 liter full-fat milk',
        '2 tbsp lemon juice or vinegar',
        '1.5 cups sugar',
        '4 cups water',
        '1 tsp rose water (optional)',
        '2-3 cardamom pods'
      ],
      instructions: [
        'Boil milk, then add lemon juice to curdle it. Strain through muslin cloth.',
        'Rinse the chenna (paneer) with cold water to remove sourness.',
        'Hang for 30 minutes, then knead for 8-10 minutes until smooth and no cracks.',
        'Make small balls from the chenna.',
        'Boil sugar and water with cardamom to make syrup.',
        'Add the balls to boiling syrup and cover. Cook for 15-20 minutes.',
        'The rasgullas will double in size. Turn off heat and let cool in syrup.',
        'Add rose water if using. Refrigerate before serving.'
      ],
      tips: [
        'Knead the chenna very well - this is the secret to spongy rasgullas',
        'Don\'t make the balls too big as they expand',
        'Use fresh milk for best chenna quality'
      ],
      image: 'https://images.unsplash.com/photo-1605197161470-5d8e3d8bcd83?w=400',
      rating: 4.8
    },
    {
      id: 'appam',
      name: 'Appam with Stew',
      state: 'Kerala',
      description: 'Lacy, crispy-edged rice hoppers with a fluffy center, served with coconut milk stew.',
      prepTime: '8 hours',
      cookTime: '30 mins',
      servings: 8,
      difficulty: 'Medium',
      ingredients: [
        '2 cups raw rice',
        '1/2 cup cooked rice',
        '1/2 cup grated coconut',
        '1 tsp yeast',
        '2 tbsp sugar',
        'Salt to taste',
        'For stew:',
        '500g chicken/vegetables',
        '2 cups coconut milk',
        'Potatoes, carrots, onions',
        'Whole spices, curry leaves'
      ],
      instructions: [
        'Soak raw rice for 4-6 hours. Grind with cooked rice and coconut to smooth batter.',
        'Add yeast dissolved in warm water with sugar. Ferment overnight.',
        'Add salt before making appams. Batter should be flowing consistency.',
        'Heat appam pan, pour ladle of batter, swirl to coat sides.',
        'Cover and cook until edges are crispy and center is spongy.',
        'For stew: Sauté vegetables with whole spices, add coconut milk and simmer.',
        'Serve hot appams with vegetable or chicken stew.'
      ],
      tips: [
        'Use an appam pan for authentic shape',
        'The batter should ferment well for fluffy center',
        'Don\'t flip the appam - just cover and cook'
      ],
      image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400',
      rating: 4.6
    }
  ];

  const downloadRecipePDF = (recipe: Recipe) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Header with gradient effect
    pdf.setFillColor(255, 87, 34);
    pdf.rect(0, 0, pageWidth, 45, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(recipe.name, pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${recipe.state} Cuisine`, pageWidth / 2, 32, { align: 'center' });
    pdf.text(`Rating: ${'★'.repeat(Math.floor(recipe.rating))} (${recipe.rating}/5)`, pageWidth / 2, 40, { align: 'center' });
    
    // Reset text color
    pdf.setTextColor(0, 0, 0);
    
    // Recipe info box
    let yPos = 55;
    pdf.setFillColor(255, 243, 224);
    pdf.rect(15, yPos - 5, pageWidth - 30, 25, 'F');
    
    pdf.setFontSize(10);
    pdf.text(`Prep Time: ${recipe.prepTime}`, 25, yPos + 5);
    pdf.text(`Cook Time: ${recipe.cookTime}`, 80, yPos + 5);
    pdf.text(`Servings: ${recipe.servings}`, 135, yPos + 5);
    pdf.text(`Difficulty: ${recipe.difficulty}`, 25, yPos + 15);
    
    yPos = 85;
    
    // Description
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'italic');
    const descLines = pdf.splitTextToSize(recipe.description, pageWidth - 40);
    pdf.text(descLines, 20, yPos);
    yPos += descLines.length * 6 + 10;
    
    // Ingredients
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(255, 87, 34);
    pdf.text('Ingredients', 20, yPos);
    pdf.setTextColor(0, 0, 0);
    yPos += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    recipe.ingredients.forEach((ingredient) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(`• ${ingredient}`, 25, yPos);
      yPos += 6;
    });
    
    yPos += 5;
    
    // Instructions
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(255, 87, 34);
    pdf.text('Instructions', 20, yPos);
    pdf.setTextColor(0, 0, 0);
    yPos += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    recipe.instructions.forEach((instruction, index) => {
      if (yPos > 265) {
        pdf.addPage();
        yPos = 20;
      }
      const instrLines = pdf.splitTextToSize(`${index + 1}. ${instruction}`, pageWidth - 50);
      pdf.text(instrLines, 25, yPos);
      yPos += instrLines.length * 5 + 4;
    });
    
    yPos += 5;
    
    // Tips
    if (yPos > 240) {
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(255, 87, 34);
    pdf.text('Chef Tips', 20, yPos);
    pdf.setTextColor(0, 0, 0);
    yPos += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    recipe.tips.forEach((tip) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      const tipLines = pdf.splitTextToSize(`💡 ${tip}`, pageWidth - 50);
      pdf.text(tipLines, 25, yPos);
      yPos += tipLines.length * 5 + 3;
    });
    
    // Footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128);
      pdf.text('Indian Cultural Explorer - Recipe Collection', pageWidth / 2, 290, { align: 'center' });
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 20, 290, { align: 'right' });
    }
    
    pdf.save(`recipe-${recipe.id}.pdf`);
    
    toast({
      title: 'Recipe Downloaded',
      description: `${recipe.name} recipe has been downloaded as PDF`,
    });
  };

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
              Cuisine & Food
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the diverse culinary traditions across Indian states with authentic recipes
            </p>
          </motion.div>
        </section>
        
        <section className="mb-16">
          <div className={`rounded-xl p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg mb-8`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <Utensils />
              </div>
              <h2 className="text-2xl font-display font-semibold">Indian Cuisine Overview</h2>
            </div>
            <p className="text-muted-foreground">
              Indian cuisine encompasses a wide variety of regional culinary traditions, each with its own distinctive ingredients, 
              spices, and cooking methods. From the rich, creamy curries of North India to the coconut-infused dishes of the South, 
              the tangy seafood delicacies of the coastal regions to the vegetarian specialties of Gujarat, India's food reflects 
              its cultural diversity and historical influences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {cuisineData.map((cuisine, index) => (
              <StateCard 
                key={cuisine.state}
                title={cuisine.state}
                icon={<Utensils size={24} />}
                delay={index * 0.1}
                collapsible
              >
                <div className="space-y-4">
                  <p className="text-muted-foreground">{cuisine.description}</p>
                  <h3 className="font-medium text-lg">Popular Dishes</h3>
                  <ul className="space-y-2">
                    {cuisine.dishes.map((dish, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span>{dish}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StateCard>
            ))}
          </div>
        </section>

        {/* Featured Recipes Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-3">
            <ChefHat className="text-india-orange" />
            Featured Recipes
          </h2>
          <p className="text-muted-foreground mb-8">
            Try these authentic recipes from various regions of India. Download any recipe as a PDF for offline use!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img 
                      src={recipe.image} 
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {recipe.rating}
                    </div>
                    <div className="absolute top-2 left-2 bg-india-orange text-white px-2 py-1 rounded-full text-xs">
                      {recipe.state}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {recipe.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.cookTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {recipe.servings}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedRecipe(recipe)}
                      >
                        View Recipe
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-india-orange hover:bg-orange-600"
                        onClick={() => downloadRecipePDF(recipe)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-display font-semibold mb-6">Explore State Cuisines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {states.slice(0, 6).map((state) => (
              <motion.div
                key={state.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`block h-full p-6 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                } transition-all duration-300 shadow-sm hover:shadow`}
              >
                <h3 className="text-xl font-display font-semibold mb-3">{state.name}</h3>
                <div className="h-40 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={state.image} 
                    alt={state.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-muted-foreground mb-4">
                  Explore the unique flavors of {state.name}'s traditional cuisine.
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-2xl`}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={selectedRecipe.image} 
                  alt={selectedRecipe.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="absolute top-4 right-4 bg-white/90 rounded-full p-2 hover:bg-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedRecipe.name}</h2>
                    <p className="text-india-orange">{selectedRecipe.state} Cuisine</p>
                  </div>
                  <Button
                    onClick={() => downloadRecipePDF(selectedRecipe)}
                    className="bg-india-orange hover:bg-orange-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                
                <p className="text-muted-foreground mb-6">{selectedRecipe.description}</p>
                
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-india-orange" />
                    <p className="text-xs text-muted-foreground">Prep</p>
                    <p className="font-medium text-sm">{selectedRecipe.prepTime}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-india-orange" />
                    <p className="text-xs text-muted-foreground">Cook</p>
                    <p className="font-medium text-sm">{selectedRecipe.cookTime}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Users className="w-5 h-5 mx-auto mb-1 text-india-orange" />
                    <p className="text-xs text-muted-foreground">Serves</p>
                    <p className="font-medium text-sm">{selectedRecipe.servings}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <ChefHat className="w-5 h-5 mx-auto mb-1 text-india-orange" />
                    <p className="text-xs text-muted-foreground">Level</p>
                    <p className="font-medium text-sm">{selectedRecipe.difficulty}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-india-orange mt-1">•</span>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((inst, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 bg-india-orange text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {idx + 1}
                        </span>
                        {inst}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Chef Tips</h3>
                  <ul className="space-y-2">
                    {selectedRecipe.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span>💡</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CuisineFood;
