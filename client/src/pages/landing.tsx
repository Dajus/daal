import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LoginModal from "@/components/login-modal";
import { 
  Car, 
  HardHat, 
  Mountain, 
  Heart, 
  Recycle, 
  Truck,
  Shield,
  MapPin,
  Mail,
  Phone,
  Check,
  Globe,
  Award,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";
import { t } from "@/lib/translations";

export default function Landing() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const courses = [
    {
      icon: Car,
      title: "Školení řidičů",
      description: "Profesionální školení řidičů pro operátory firemních vozidel",
      code: "DRIV"
    },
    {
      icon: HardHat,
      title: "BOZP a požární ochrana",
      description: "Školení bezpečnosti a ochrany zdraví při práci včetně požární ochrany",
      code: "BOZP"
    },
    {
      icon: Mountain,
      title: "Práce ve výškách",
      description: "Specializované školení pro práci ve zvýšených polohách",
      code: "HEIG"
    },
    {
      icon: Heart,
      title: "První pomoc a hygiena",
      description: "Základní první pomoc a pracovní hygienické protokoly",
      code: "HYGI"
    },
    {
      icon: Recycle,
      title: "Nakládání s odpady",
      description: "Správné zacházení a likvidace pracovních odpadů",
      code: "WAST"
    },
    {
      icon: Truck,
      title: "Nebezpečný transport",
      description: "ADR školení pro přepravu nebezpečného zboží",
      code: "HADR"
    }
  ];

  const stats = [
    { value: "2,500+", label: "Absolventů" },
    { value: "13", label: "Typů kurzů" },
    { value: "15+", label: "Let zkušeností" },
    { value: "98%", label: "Úspěšnost" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.01}px)`
          }}
        />
        <div 
          className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.02}px)`
          }}
        />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/10 rotate-45 animate-bounce delay-500" />
        <div className="absolute top-40 right-32 w-6 h-6 bg-blue-400/20 rounded-full animate-bounce delay-1000" />
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-purple-400/30 rotate-12 animate-spin" style={{ animationDuration: '10s' }} />
        <div className="absolute top-64 right-20 w-8 h-8 bg-pink-400/20 rotate-45 animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="text-white h-6 w-6" />
                </div>
                <span className="ml-3 text-xl font-bold text-white">DAAL</span>
              </div>
              <div className="hidden md:block ml-8">
                <div className="flex items-baseline space-x-4">
                  <a href="#hero" className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Domů</a>
                  <a href="#about" className="text-white/70 hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">O nás</a>
                  <a href="#services" className="text-white/70 hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Služby</a>
                  <a href="#contact" className="text-white/70 hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Kontakt</a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setLoginModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Sparkles className="mr-2 h-4 w-4 group-hover:animate-spin" />
                Přístup ke kurzům
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90 text-sm font-medium">
                <Zap className="mr-2 h-4 w-4 text-yellow-400" />
                Moderní e-learning platforma
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Bezpečnost práce je <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
                naší prioritou
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Profesionální bezpečnostní školení a certifikační programy navržené k ochraně vaší pracovní síly a dodržování nejnovějších předpisů.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => setLoginModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group border-0"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
                Začít učení
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Zjistit více
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white/5 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Naše výukové kurzy</h2>
            <p className="text-xl text-white/70">Komplexní bezpečnostní školící programy přizpůsobené potřebám vašeho odvětví</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:animate-pulse">
                    <course.icon className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{course.title}</h3>
                  <p className="text-white/70 mb-4">{course.description}</p>
                  <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    {course.code}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-white/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white/5 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="DAAL Training Center" 
                className="relative rounded-2xl shadow-2xl w-full h-auto border border-white/20" 
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">About DAAL</h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                With over 15 years of experience in workplace safety training, DAAL has become a trusted partner for companies across Europe. We specialize in comprehensive safety education that combines theoretical knowledge with practical application.
              </p>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Our certified instructors and modern e-learning platform ensure that your employees receive the highest quality training while maintaining flexibility and convenience.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <Award className="text-yellow-400 mr-2 h-5 w-5" />
                  <span className="text-white font-medium">ISO 9001 Certified</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <Shield className="text-green-400 mr-2 h-5 w-5" />
                  <span className="text-white font-medium">EU Compliant</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <Globe className="text-blue-400 mr-2 h-5 w-5" />
                  <span className="text-white font-medium">Multi-language</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-purple-900/20 to-slate-900/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kontaktujte nás</h2>
            <p className="text-xl text-white/70">Jste připraveni začít s bezpečnostním školením na pracovišti?</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
              <Card className="relative bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-white mb-8 flex items-center">
                    <Mail className="mr-3 h-6 w-6 text-blue-400" />
                    Napište nám
                  </h3>
                  <form className="space-y-6">
                    <div className="relative group">
                      <Input 
                        id="company"
                        type="text" 
                        placeholder=" "
                        className="peer bg-white/5 border-white/20 text-white placeholder-transparent focus:border-blue-400 focus:bg-white/10 transition-all duration-300 pt-6"
                      />
                      <Label 
                        htmlFor="company"
                        className="absolute left-3 top-2 text-white/60 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400"
                      >
                        Název společnosti
                      </Label>
                    </div>
                    <div className="relative group">
                      <Input 
                        id="email"
                        type="email" 
                        placeholder=" "
                        className="peer bg-white/5 border-white/20 text-white placeholder-transparent focus:border-blue-400 focus:bg-white/10 transition-all duration-300 pt-6"
                      />
                      <Label 
                        htmlFor="email"
                        className="absolute left-3 top-2 text-white/60 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400"
                      >
                        E-mailová adresa
                      </Label>
                    </div>
                    <div className="relative group">
                      <Textarea 
                        id="message"
                        rows={5} 
                        placeholder=" "
                        className="peer bg-white/5 border-white/20 text-white placeholder-transparent focus:border-blue-400 focus:bg-white/10 transition-all duration-300 pt-6 resize-none"
                      />
                      <Label 
                        htmlFor="message"
                        className="absolute left-3 top-2 text-white/60 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400"
                      >
                        Zpráva o vašich školicích potřebách...
                      </Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 py-3 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group border-0"
                    >
                      <Mail className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                      Odeslat zprávu
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:animate-pulse">
                    <MapPin className="text-white h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Adresa</h4>
                    <p className="text-white/70">Praha, Česká republika<br />Dostupné v celé EU</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:animate-pulse">
                    <Mail className="text-white h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">E-mail</h4>
                    <p className="text-white/70">info@daal.cz</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 group-hover:animate-pulse">
                    <Phone className="text-white h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Telefon</h4>
                    <p className="text-white/70">+420 XXX XXX XXX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-md text-white py-12 relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="text-white h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">DAAL Training</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">Professional workplace safety training and certification for European companies.</p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4 text-white">Služby</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="hover:text-white transition-colors cursor-pointer">BOZP školení</li>
                <li className="hover:text-white transition-colors cursor-pointer">Školení řidičů</li>
                <li className="hover:text-white transition-colors cursor-pointer">Kurzy první pomoci</li>
                <li className="hover:text-white transition-colors cursor-pointer">Správa certifikátů</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4 text-white">Společnost</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="hover:text-white transition-colors cursor-pointer">O nás</li>
                <li className="hover:text-white transition-colors cursor-pointer">Certifikace</li>
                <li className="hover:text-white transition-colors cursor-pointer">Ochrana soukromí</li>
                <li className="hover:text-white transition-colors cursor-pointer">GDPR</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4 text-white">Kontakt</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-center hover:text-white transition-colors">
                  <Mail className="mr-2 h-4 w-4" />
                  info@daal.cz
                </li>
                <li className="flex items-center hover:text-white transition-colors">
                  <MapPin className="mr-2 h-4 w-4" />
                  Praha, Česká republika
                </li>
                <li className="flex items-center hover:text-white transition-colors">
                  <Globe className="mr-2 h-4 w-4" />
                  EU Training Provider
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
            <p>&copy; 2024 DAAL Training Platform. Všechna práva vyhrazena.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
}
