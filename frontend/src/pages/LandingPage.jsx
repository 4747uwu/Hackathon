import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import {
  Calendar,
  Clock,
  MessageSquare,
  Brain,
  FileText,
  Users,
  PieChart,
  Video,
  Notebook,
  Linkedin,
  Bot,
  GitMerge,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

const LandingPage = () => {
  const navigate = useNavigate()
  const { scrollY, scrollYProgress } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Update mouse position using motion values
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth parallax transforms
  const y1 = useSpring(useTransform(scrollY, [0, 1000], [0, -150]));
  const y2 = useSpring(useTransform(scrollY, [0, 1000], [0, -50]));
  const opacity = useSpring(useTransform(scrollY, [0, 300], [1, 0]));
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.1]));

  // Enhanced Circle component with fixed motion values
  const Circle = ({ delay, size, speed, initialX, initialY }) => {
    const x = useTransform(mouseX, [0, 1], [initialX - 30, initialX + 30]);
    const y = useTransform(mouseY, [0, 1], [initialY - 30, initialY + 30]);

    return (
      <motion.div
        style={{ 
          width: size, 
          height: size,
          x: useSpring(x, { stiffness: 50, damping: 20 }),
          y: useSpring(y, { stiffness: 50, damping: 20 })
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay }}
        className="absolute rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl"
      />
    );
  };

  // Add scroll-triggered animations
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    },
    viewport: { once: true, margin: "-100px" }
  };

  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Agents",
      description:
        "Revolutionary AI agents that streamline workflows, automate repetitive tasks, and provide intelligent suggestions for optimal project management.",
      benefits: "Save 5+ hours weekly on administrative tasks",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Smart Task & Deadline Tracking",
      description:
        "Intelligent system that prioritizes tasks, predicts potential delays, and ensures project milestones are met consistently.",
      benefits: "Reduce missed deadlines by 90%",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Discussion Hub",
      description:
        "Centralized communication platform with threaded discussions, real-time updates, and smart notification filtering for focused collaboration.",
      benefits: "Improve team communication by 75%",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "AI Project Scheduler",
      description:
        "Smart scheduling system that syncs with Google Calendar, analyzes team availability, and suggests optimal meeting times automatically.",
      benefits: "Cut scheduling time by 60%",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Smart Tagging",
      description:
        "AI-powered tagging system that automatically categorizes content, making information retrieval lightning-fast and intuitive.",
      benefits: "Find documents 3x faster",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Analytics",
      description:
        "Comprehensive team performance analytics with burnout prevention indicators and productivity optimization suggestions.",
      benefits: "Boost team efficiency by 40%",
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: "Collaboration Insights",
      description:
        "Deep dive into collaboration patterns with AI-generated insights for improving team dynamics and project outcomes.",
      benefits: "Enhance team synergy by 50%",
    },
    {
      icon: <GitMerge className="w-8 h-8" />,
      title: "Project Merging",
      description:
        "Seamlessly combine multiple projects while maintaining data integrity and resolving conflicts intelligently.",
      benefits: "Reduce integration time by 70%",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Smart Meeting Planner",
      description:
        "AI-powered meeting scheduler with automatic agenda generation and post-meeting action item tracking.",
      benefits: "Make meetings 45% more productive",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Brainstorming Hub",
      description:
        "Virtual workspace for creative collaboration with AI-assisted idea generation and organization tools.",
      benefits: "Generate 2x more innovative ideas",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart Storage",
      description:
        "Intelligent file management system with version control, automatic categorization, and predictive file retrieval.",
      benefits: "Reduce file search time by 80%",
    },
    {
      icon: <Notebook className="w-8 h-8" />,
      title: "Quick Notes",
      description:
        "Context-aware note-taking system that automatically links related content and suggests relevant team members to collaborate.",
      benefits: "Improve knowledge sharing by 65%",
    },
  ]

  const founders = [
    {
      name: "Abhishek Shukla",
      role: "CEO & Co-founder",
      image: "/api/placeholder/150/150",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Navneet Kumar",
      role: "CTO & Co-founder",
      image: "/api/placeholder/150/150",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Shantanu Singh",
      role: "Head of Product",
      image: "/api/placeholder/150/150",
      linkedin: "https://linkedin.com",
    },
  ]

  // Enhanced hero section with parallax
  const heroSection = (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 text-white relative overflow-hidden"
    >
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        style={{ scale }}
      >
        {/* Enhanced background circles */}
        <Circle delay={0} size={400} speed={15} initialX={100} initialY={100} />
        <Circle delay={0.2} size={300} speed={20} initialX={500} initialY={200} />
        <Circle delay={0.4} size={350} speed={18} initialX={800} initialY={400} />
        <motion.div 
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          style={{ opacity }}
        />
      </motion.div>

      <motion.div 
        className="container mx-auto px-6 py-20 relative z-10"
        style={{ y: y1 }}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center pt-40 max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-7xl font-bold  mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
            whileHover={{ scale: 1.02 }}
          >
            Streamline Your Workflow
          </motion.h1>
          <p className="text-3xl mb-8 text-blue-200">AI-Powered Collaboration for the Modern Workplace</p>
          <p className="text-xl mb-10 text-gray-300">
            Tired of juggling multiple tools and losing productivity? Streamline integrates AI to automate tasks,
            enhance communication, and boost your team's efficiency by up to 40%. Say goodbye to workflow chaos and
            hello to seamless collaboration.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1"
          >
            Start Boosting Productivity
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  );

  // Add floating elements
  const FloatingElement = ({ children, xRange, yRange, duration }) => {
    return (
      <motion.div
        animate={{
          y: yRange,
          x: xRange,
        }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    );
  };

  // Enhance features grid with stagger effect
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="overflow-x-hidden bg-gray-900">
      {heroSection}

      {/* Enhanced Key Benefits Section */}
      <motion.section 
        className="py-16 bg-gray-800 relative"
        style={{ y: y2 }}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">40% Increase in Productivity</h3>
              <p className="text-gray-300">
                Our AI-powered tools automate repetitive tasks, allowing your team to focus on high-value work.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">75% Better Communication</h3>
              <p className="text-gray-300">
                Centralized discussions and smart notifications keep everyone in sync, reducing miscommunication.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">90% Fewer Missed Deadlines</h3>
              <p className="text-gray-300">
                Our AI project scheduler and smart task tracking ensure projects stay on track and milestones are met.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Features Grid */}
      <motion.section 
        className="py-20 bg-gray-900"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {/* Add floating decorative elements */}
        <FloatingElement xRange={[0, 20]} yRange={[0, 30]} duration={5}>
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
        </FloatingElement>
        
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Powerful Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
                className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300"
              >
                <div className="text-blue-400 mb-4 transform hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <div className="text-sm font-medium text-blue-400 bg-blue-900/50 py-2 px-3 rounded-full inline-block">
                  {feature.benefits}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enhanced Team Section */}
      <motion.section 
        className="py-20 bg-gray-800 relative"
        {...fadeInUp}
      >
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-16 text-white"
          >
            Who We Are
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <motion.div whileHover={{ scale: 1.05 }} className="relative inline-block">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-40 h-40 rounded-full mx-auto mb-4 object-cover"
                  />
                  <motion.a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Linkedin size={20} />
                  </motion.a>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-white">{founder.name}</h3>
                <p className="text-gray-300">{founder.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 Streamline. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

