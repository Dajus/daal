import { useState } from "react";
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
  Award
} from "lucide-react";
import { t } from "@/lib/translations";

export default function Landing() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  className="h-10 w-auto" 
                  src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=80" 
                  alt="DAAL Logo" 
                />
              </div>
              <div className="hidden md:block ml-8">
                <div className="flex items-baseline space-x-4">
                  <a href="#hero" className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Domů</a>
                  <a href="#about" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">O nás</a>
                  <a href="#services" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Služby</a>
                  <a href="#contact" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Kontakt</a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setLoginModalOpen(true)}
                className="bg-primary text-white hover:bg-primary-dark"
              >
                Přístup ke kurzům
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-16 bg-gradient-to-br from-primary-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bezpečnost práce je naší prioritou
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Profesionální bezpečnostní školení a certifikační programy navržené k ochraně vaší pracovní síly a dodržování nejnovějších předpisů.
            </p>
            <Button 
              onClick={() => setLoginModalOpen(true)}
              className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-dark shadow-lg"
            >
              Přístup ke kurzům
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Naše výukové kurzy</h2>
            <p className="text-xl text-gray-600">Komplexní bezpečnostní školící programy přizpůsobené potřebám vašeho odvětví</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border border-gray-100">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                    <course.icon className="text-primary text-xl h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <span className="inline-block bg-primary-light text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {course.code}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-primary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="DAAL Training Center" 
                className="rounded-xl shadow-lg w-full h-auto" 
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About DAAL</h2>
              <p className="text-lg text-gray-600 mb-6">
                With over 15 years of experience in workplace safety training, DAAL has become a trusted partner for companies across Europe. We specialize in comprehensive safety education that combines theoretical knowledge with practical application.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our certified instructors and modern e-learning platform ensure that your employees receive the highest quality training while maintaining flexibility and convenience.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Award className="text-primary mr-2 h-5 w-5" />
                  <span className="text-gray-700">ISO 9001 Certified</span>
                </div>
                <div className="flex items-center">
                  <Shield className="text-primary mr-2 h-5 w-5" />
                  <span className="text-gray-700">EU Compliant</span>
                </div>
                <div className="flex items-center">
                  <Globe className="text-primary mr-2 h-5 w-5" />
                  <span className="text-gray-700">Multi-language</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600">Ready to get started with workplace safety training?</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
                <form className="space-y-6">
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company"
                      type="text" 
                      placeholder="Your Company" 
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="contact@company.com" 
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message"
                      rows={4} 
                      placeholder="Tell us about your training needs..." 
                      className="mt-2"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
            <div>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600">Prague, Czech Republic<br />Available throughout EU</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mr-4">
                    <Mail className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Email</h4>
                    <p className="text-gray-600">info@daal.cz</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mr-4">
                    <Phone className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Phone</h4>
                    <p className="text-gray-600">+420 XXX XXX XXX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">DAAL Training</h3>
              <p className="text-gray-400 text-sm">Professional workplace safety training and certification for European companies.</p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>BOZP Training</li>
                <li>Driver Education</li>
                <li>First Aid Courses</li>
                <li>Certificate Management</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Certifications</li>
                <li>Privacy Policy</li>
                <li>GDPR Compliance</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>info@daal.cz</li>
                <li>Prague, Czech Republic</li>
                <li>EU Training Provider</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 DAAL Training Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
}
