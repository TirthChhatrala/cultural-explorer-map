
import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Github, 
  Linkedin, 
  Code,
  Terminal,
  Cpu
} from 'lucide-react';

const About = () => {
  const { theme } = useTheme();
  
  const developerInfo = {
    name: "Chhatrala Tirth",
    role: "Project Developer",
    bio: "Created the entire Indian Cultural Explorer project, dedicated to showcasing India's rich heritage and cultural diversity.",
    image: "https://randomuser.me/api/portraits/men/32.jpg", // You might want to replace this with your actual photo
    contact: {
      email: "tirthchhatrala@gmail.com",
      phone: "+91 9328971214",
      location: "Junagadh, Gujarat"
    },
    social: {
      github: "https://github.com/TirthChhatrala",
      linkedin: "https://www.linkedin.com/in/tirth-chhatrala-b7815a219/"
    },
    skills: [
      "Full Stack Development",
      "React & React Native",
      "Node.js",
      "UI/UX Design",
      "Database Management",
      "API Integration"
    ]
  };
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mb-4">
              Our Mission
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              About Indian Cultural Explorer
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-sans">
              We are dedicated to showcasing the rich cultural diversity of India, connecting people to the country's heritage, art, and traditions across its many vibrant states.
            </p>
          </motion.div>
        </section>
        
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`rounded-xl overflow-hidden shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="p-8">
                <h2 className="text-2xl font-display font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground mb-4 font-sans">
                  To create a comprehensive digital platform that accurately represents India's cultural tapestry, making it accessible to both Indians and people around the world.
                </p>
                <p className="text-muted-foreground font-sans">
                  We believe that understanding cultural diversity is essential for fostering appreciation, respect, and unity in our increasingly globalized world.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className={`rounded-xl overflow-hidden shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="p-8">
                <h2 className="text-2xl font-display font-bold mb-4">Our Approach</h2>
                <p className="text-muted-foreground mb-4 font-sans">
                  We meticulously research and validate all cultural information to ensure accuracy, working with experts from each region to provide authentic insights.
                </p>
                <p className="text-muted-foreground font-sans">
                  Our platform combines educational content with interactive features, making cultural exploration engaging and accessible for users of all backgrounds.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
        
        <section className="mb-20">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-3 py-1 bg-secondary rounded-full text-sm font-medium mb-4">
                The Person Behind Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
                Meet The Developer
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
                This project is the work of a passionate developer committed to showcasing India's rich cultural heritage through technology.
              </p>
            </motion.div>
          </div>
          
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`max-w-2xl rounded-xl overflow-hidden shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="h-full">
                    <img 
                      src={developerInfo.image} 
                      alt={developerInfo.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-8 md:w-2/3">
                  <h3 className="text-2xl font-display font-semibold mb-1">{developerInfo.name}</h3>
                  <p className="text-india-orange font-medium text-sm mb-4">{developerInfo.role}</p>
                  <p className="text-muted-foreground mb-6 font-sans">{developerInfo.bio}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm font-sans">
                      <Mail className="w-4 h-4 mr-2 text-india-orange" />
                      <span className="text-muted-foreground">{developerInfo.contact.email}</span>
                    </div>
                    <div className="flex items-center text-sm font-sans">
                      <Phone className="w-4 h-4 mr-2 text-india-orange" />
                      <span className="text-muted-foreground">{developerInfo.contact.phone}</span>
                    </div>
                    <div className="flex items-center text-sm font-sans">
                      <MapPin className="w-4 h-4 mr-2 text-india-orange" />
                      <span className="text-muted-foreground">{developerInfo.contact.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 mb-6">
                    <a 
                      href={developerInfo.social.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-sans"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                    <a 
                      href={developerInfo.social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-sans"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 font-sans">
                      <Code className="w-4 h-4 text-india-orange" />
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {developerInfo.skills.map(skill => (
                        <span 
                          key={skill}
                          className="text-xs px-2 py-1 rounded-full bg-india-orange/10 text-india-orange font-sans"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-xl overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="p-8">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-display font-semibold mb-4">Project Features</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
                  This project combines various technologies to create an interactive experience of India's cultural heritage.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-india-orange/10 flex items-center justify-center text-india-orange">
                    <Terminal className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">Interactive Map</h3>
                  <p className="text-muted-foreground font-sans">
                    Navigate through an interactive map of India to explore different states and their cultural highlights.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-india-orange/10 flex items-center justify-center text-india-orange">
                    <Code className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">Modern Tech Stack</h3>
                  <p className="text-muted-foreground font-sans">
                    Built with React, Tailwind CSS, and framer-motion to provide a smooth and responsive user experience.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-india-orange/10 flex items-center justify-center text-india-orange">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">Admin Dashboard</h3>
                  <p className="text-muted-foreground font-sans">
                    A comprehensive admin panel for maintaining and updating the content across all sections of the website.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        
        <section className="mb-16">
          <div className={`rounded-xl p-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-display font-semibold mb-4">
                Get in Touch
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
                Have questions or feedback? Feel free to reach out directly to the developer.
              </p>
            </motion.div>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <div className="flex items-center gap-2 font-sans">
                <Mail className="w-5 h-5 text-india-orange" />
                <span>{developerInfo.contact.email}</span>
              </div>
              <div className="flex items-center gap-2 font-sans">
                <Phone className="w-5 h-5 text-india-orange" />
                <span>{developerInfo.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2 font-sans">
                <MapPin className="w-5 h-5 text-india-orange" />
                <span>{developerInfo.contact.location}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
