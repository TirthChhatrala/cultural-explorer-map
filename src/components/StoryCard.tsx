import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";
import type { Story } from "@/lib/stories";

interface Props { story: Story; index?: number }

const StoryCard: React.FC<Props> = ({ story, index = 0 }) => {
  const date = story.published_at ? new Date(story.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "";
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-all flex flex-col"
    >
      <Link to={`/stories/${story.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-muted">
        {story.featured_image ? (
          <img src={story.featured_image} alt={story.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-india-orange/30 to-india-blue/30" />
        )}
        {story.category && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-india-orange text-white text-xs rounded-full font-medium">{story.category}</span>
        )}
        {story.ai_generated && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-purple-600 text-white text-[10px] rounded-full font-medium flex items-center gap-1"><Sparkles size={10} /> AI</span>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          {date && (<span className="flex items-center gap-1"><Calendar size={12} />{date}</span>)}
          {story.location && (<span className="flex items-center gap-1"><MapPin size={12} />{story.location}</span>)}
        </div>
        <h3 className="font-display font-semibold text-lg leading-snug mb-2 group-hover:text-india-orange transition-colors line-clamp-2">
          <Link to={`/stories/${story.slug}`}>{story.title}</Link>
        </h3>
        {story.summary && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{story.summary}</p>
        )}
        <Link to={`/stories/${story.slug}`} className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-india-orange hover:gap-2 transition-all">
          Read More <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  );
};

export default StoryCard;