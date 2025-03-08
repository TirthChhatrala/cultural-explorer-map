
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
  Twitter 
} from 'lucide-react';

const About = () => {
  const { theme } = useTheme();
  
  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "Lead Developer",
      bio: "Passionate about creating intuitive digital experiences that celebrate India's rich cultural heritage.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      contact: {
        email: "rajesh@example.com",
        phone: "+91 98765 43210",
        location: "Bangalore, Karnataka"
      },
      social: {
        github: "https://github.com/rajesh",
        linkedin: "https://linkedin.com/in/rajesh",
        twitter: "https://twitter.com/rajesh"
      }
    },
    {
      name: "Priya Sharma",
      role: "UI/UX Designer",
      bio: "Combines traditional Indian artistic elements with modern design principles to create visually stunning interfaces.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      contact: {
        email: "priya@example.com",
        phone: "+91 87654 32109",
        location: "Delhi, Delhi"
      },
      social: {
        github: "https://github.com/priya",
        linkedin: "https://linkedin.com/in/priya",
        twitter: "https://twitter.com/priya"
      }
    },
    {
      name: "Amit Patel",
      role: "Cultural Researcher",
      bio: "Dedicated to ensuring accurate representation of India's diverse cultural heritage across all states.",
      image: "https://randomuser.me/api/portraits/men/62.jpg",
      contact: {
        email: "amit@example.com",
        phone: "+91 76543 21098",
        location: "Mumbai, Maharashtra"
      },
      social: {
        github: "https://github.com/amit",
        linkedin: "https://linkedin.com/in/amit",
        twitter: "https://twitter.com/amit"
      }
    },
    {
      name: "Lakshmi Reddy",
      role: "Full-Stack Developer",
      bio: "Specializes in creating responsive and accessible web applications that work seamlessly across all devices.",
      image: "https://randomuser.me/api/portraits/women/26.jpg",
      contact: {
        email: "lakshmi@example.com",
        phone: "+91 65432 10987",
        location: "Chennai, Tamil Nadu"
      },
      social: {
        github: "https://github.com/lakshmi",
        linkedin: "https://linkedin.com/in/lakshmi",
        twitter: "https://twitter.com/lakshmi"
      }
    }
  ];
  
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
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
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
                <p className="text-muted-foreground mb-4">
                  To create a comprehensive digital platform that accurately represents India's cultural tapestry, making it accessible to both Indians and people around the world.
                </p>
                <p className="text-muted-foreground">
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
                <p className="text-muted-foreground mb-4">
                  We meticulously research and validate all cultural information to ensure accuracy, working with experts from each region to provide authentic insights.
                </p>
                <p className="text-muted-foreground">
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
                The People Behind Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
                Meet Our Team
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our diverse team brings together expertise in technology, design, and cultural research to create an authentic representation of India's heritage.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`rounded-xl overflow-hidden shadow-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } hover:shadow-xl transition-shadow`}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-semibold mb-1">{member.name}</h3>
                  <p className="text-india-orange font-medium text-sm mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">{member.contact.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">{member.contact.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">{member.contact.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-3 mt-4">
                    <a href={member.social.github} className="text-muted-foreground hover:text-foreground transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href={member.social.linkedin} className="text-muted-foreground hover:text-foreground transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href={member.social.twitter} className="text-muted-foreground hover:text-foreground transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're always looking to improve. Feel free to reach out with questions, suggestions, or corrections.
              </p>
            </motion.div>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-india-orange" />
                <span>contact@indianculturalexplorer.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-india-orange" />
                <span>+91 123 456 7890</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-india-orange" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
