import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { TrendingDown, Brain, MapPin, ArrowRight, Play, CheckCircle2, Users, IndianRupee } from 'lucide-react';
import { motion } from 'motion/react';
import { categories } from '../components/CategoryIcons';

export function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1764116371568-5a47889b3556?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzaG9wa2VlcGVyJTIwc3RvcmV8ZW58MXx8fHwxNzY1NTMxODAzfDA&ixlib=rb-4.1.0&q=80&w=1080")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <motion.h1
              className="text-4xl md:text-6xl text-white mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Turn Dead Stock into Working Capital
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              India's first hyperlocal marketplace for shopkeepers. Swap, Sell, or Liquidate expiring inventory in seconds.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <Link to="/signup">
                <Button size="lg" className="bg-[#10B981] hover:bg-[#10B981]/90 h-14 px-8 text-lg w-full sm:w-auto">
                  Start Swapping
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white/10 border-white/30 text-white hover:bg-white/20 w-full sm:w-auto">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-12 flex flex-wrap items-center gap-8 text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <span>Hyperlocal B2B Trading</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <span>AI-Powered Fair Trade</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <span>GST Verified</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why StockSwap Section */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl text-[#0F172A] mb-4">
              Why StockSwap?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The smart way to manage inventory and recover value from slow-moving stock
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Stop Losses */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="relative overflow-hidden backdrop-blur-lg bg-white/80 border-2 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F43F5E]/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative p-8">
                  <motion.div
                    className="bg-[#F43F5E]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <TrendingDown className="w-8 h-8 text-[#F43F5E]" />
                  </motion.div>
                  <h3 className="text-[#0F172A] mb-4">Stop Losses</h3>
                  <p className="text-muted-foreground">
                    Don't let inventory expire. Recover value instantly by connecting with retailers who need what you have.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span>Recover up to 70% of dead stock value</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span>Real-time expiry alerts</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </motion.div>

            {/* Card 2: AI Fair Trade */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="relative overflow-hidden backdrop-blur-lg bg-white/80 border-2 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative p-8">
                  <motion.div
                    className="bg-[#10B981]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Brain className="w-8 h-8 text-[#10B981]" />
                  </motion.div>
                  <h3 className="text-[#0F172A] mb-4">AI Fair Trade</h3>
                  <p className="text-muted-foreground">
                    Our AI calculator ensures fair barter exchange rates based on market value, condition, and demand.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span>Instant fairness score calculation</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span>Transparent pricing algorithm</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </motion.div>

            {/* Card 3: Hyperlocal Network */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="relative overflow-hidden backdrop-blur-lg bg-white/80 border-2 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0F172A]/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative p-8">
                  <motion.div
                    className="bg-[#0F172A]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <MapPin className="w-8 h-8 text-[#0F172A]" />
                  </motion.div>
                  <h3 className="text-[#0F172A] mb-4">Hyperlocal Network</h3>
                  <p className="text-muted-foreground">
                    Connect with verified retailers within 2km. No shipping costs, instant exchanges, build local trust.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span>GST-verified sellers only</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span>Meet within 15 minutes</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl text-[#0F172A] mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse products across all grocery categories
            </p>
          </motion.div>

          {/* Categories Grid - Show first 8 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {categories.slice(0, 8).map((category, index) => {
              const IconComponent = category.Icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Link to={`/category/${category.id}`}>
                    <Card className="p-4 md:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-[#10B981] bg-white group">
                      <div className="flex flex-col items-center text-center gap-3">
                        <motion.div
                          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <IconComponent className="w-16 h-16 md:w-20 md:h-20" />
                        </motion.div>
                        <h3 className="text-sm md:text-base text-[#0F172A] group-hover:text-[#10B981] transition-colors">
                          {category.name}
                        </h3>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* View All Categories Button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/categories">
              <Button size="lg" variant="outline" className="border-2 border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white">
                View All {categories.length} Categories
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl text-[#0F172A] mb-4">
              Built for Indian Shopkeepers
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to liquidate dead stock and maximize profits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: TrendingDown, title: 'Zero Shipping', desc: 'Meet sellers within 2km', delay: 0.1 },
              { icon: Brain, title: 'AI Calculator', desc: 'Fair trade scoring', delay: 0.2 },
              { icon: CheckCircle2, title: 'GST Verified', desc: 'Only trusted retailers', delay: 0.3 },
              { icon: MapPin, title: 'Instant Alerts', desc: 'Expiry notifications', delay: 0.4 }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: stat.delay }}
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
              >
                <motion.div
                  className="flex items-center justify-center mb-4"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                >
                  <stat.icon className="w-12 h-12 text-[#10B981]" />
                </motion.div>
                <h3 className="text-[#0F172A] mb-2">{stat.title}</h3>
                <p className="text-muted-foreground">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl md:text-4xl text-white mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            Ready to Stop Losing Money on Dead Stock?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join retailers nationwide who are recovering value from dead inventory
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/signup">
              <Button size="lg" className="bg-[#10B981] hover:bg-[#10B981]/90 h-14 px-8 text-lg">
                Get Started Now - It's Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}