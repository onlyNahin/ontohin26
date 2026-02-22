import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GALLERY_ITEMS, INITIAL_EVENTS, INITIAL_HERO_DATA } from '../constants';
import { useNavigate } from 'react-router-dom';
import { AboutSectionData, HistoryPageData, FooterData, HeroData, Event, EventRegistration, GalleryItem } from '../types';
import { EventRegistrationModal } from '../components/EventRegistrationModal';
import { ThankYouModal } from '../components/ThankYouModal';

interface HomeProps {
  darkMode: boolean;
  toggleTheme: () => void;
  aboutData?: AboutSectionData;
  historyData?: HistoryPageData;
  footerData?: FooterData;
  heroData?: HeroData;
  events?: Event[];
  galleryItems?: GalleryItem[];
  onRegister?: (data: EventRegistration, event: Event) => void;
}

export const Home: React.FC<HomeProps> = ({ darkMode, toggleTheme, aboutData, historyData, footerData, heroData, events, galleryItems, onRegister }) => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState<{ name: string, event: string }>({ name: '', event: '' });

  // Fallback defaults
  const data = aboutData || {
    title: 'একটি ব্যাচের চেয়েও বেশি কিছু',
    subtitle: 'আমরা কারা',
    description: 'আমরা রাজশাহী কলিজিয়েট স্কুলের এসএসসি ২০২৬ ব্যাচ। ক্লাসরুমে গঠিত, খেলার মাঠে শক্তিশালী, এবং মহত্বের জন্য নির্ধারিত এক ভ্রাতৃত্ব। অন্তহীন ২৬ আমাদের অটুট বন্ধন এবং সামনে থাকা অসীম সম্ভাবনার প্রতিনিধিত্ব করে।',
    cards: []
  };

  const hero = heroData || INITIAL_HERO_DATA;
  const history = historyData || {
    headerSubtitle: 'আমাদের ঐতিহ্য',
    headerTitle: '১৮২৮ এর প্রতিধ্বনি',
    mainDescription: 'রাজশাহী কলিজিয়েট স্কুল বাংলায় শিক্ষার একটি স্মৃতিস্তম্ভ হিসেবে দাঁড়িয়ে আছে। ১৮২৮ সালে প্রতিষ্ঠিত, এটি প্রজন্মের পর প্রজন্ম ধরে নেতা, চিন্তাবিদ এবং স্বপ্নদ্রষ্টাদের তৈরি করেছে।',
    imageUrl: 'https://images.unsplash.com/photo-1523050853051-f050590c41ac?q=80&w=1000&auto=format&fit=crop'
  };

  const handleHeroAction = () => {
    const { type, url } = hero.button;
    if (type === 'scroll') {
      const element = document.getElementById(url);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'route') {
      navigate(url);
    } else if (type === 'external') {
      window.open(url, '_blank');
    }
  };

  const scrollToEvents = () => {
    const element = document.getElementById('events');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRegistrationSubmit = (formData: EventRegistration) => {
    if (selectedEvent && onRegister) {
      onRegister(formData, selectedEvent);
      setRegistrationDetails({
        name: formData.firstName,
        event: selectedEvent.title
      });
    }
    setSelectedEvent(null);
    setShowThankYou(true);
  };

  return (
    <div className="overflow-x-hidden">
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Hero Preload Hint */}
      <img src={hero.imageUrl} className="hidden" fetchPriority="high" alt="" />

      {/* Hero Section */}
      <div
        className="relative h-screen min-h-[600px] flex items-center justify-center fixed-bg"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)), url('${hero.imageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-black text-white tracking-tight leading-none mb-6 drop-shadow-lg">
            {hero.title}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 font-light tracking-[0.2em] mb-12 uppercase drop-shadow-md">
            {hero.subtitle}
          </p>
          <div className="flex justify-center">
            <button onClick={handleHeroAction} className="bg-primary text-white font-bold py-4 px-10 text-lg uppercase tracking-wider hover:bg-white hover:text-primary transition-all duration-300 shadow-lg transform hover:-translate-y-1 rounded-sm">
              {hero.button.text}
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <span className="material-icons text-white text-4xl opacity-70">keyboard_arrow_down</span>
        </div>
      </div>

      {/* Wrapper for sections */}
      <div className="relative z-20 bg-background-light dark:bg-background-dark transition-colors duration-300">

        {/* ABOUT SECTION */}
        <section id="about" className="-mt-20 pt-32 pb-20 rounded-t-[3rem] bg-background-light dark:bg-background-dark shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-primary font-bold tracking-widest uppercase text-sm">{data.subtitle}</span>
              <h2 className="text-4xl md:text-5xl font-header font-bold text-gray-900 dark:text-white mt-4 mb-6">
                {data.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {data.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {data.cards.map(card => (
                <div key={card.id} className="p-8 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary transition-colors group">
                  <span className="material-icons text-5xl text-gray-400 group-hover:text-primary mb-4 transition-colors">{card.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HISTORY SECTION */}
        <section id="history" className="py-20 bg-gray-50 dark:bg-[#202020] border-y border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img
                src={history.imageUrl}
                alt="School History"
                className="rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 w-full"
              />
            </div>
            <div className="md:w-1/2">
              <span className="text-primary font-bold tracking-widest uppercase text-sm">{history.headerSubtitle}</span>
              <h2 className="text-4xl font-header font-bold text-gray-900 dark:text-white mt-4 mb-6">
                {history.headerTitle}
              </h2>
              <div className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed line-clamp-6">
                {history.mainDescription}
              </div>
              <button onClick={() => navigate('/history')} className="text-primary font-bold uppercase tracking-widest text-sm border-b-2 border-primary pb-1 hover:text-red-700 hover:border-red-700 transition-colors">
                সম্পূর্ণ ইতিহাস পড়ুন
              </button>
            </div>
          </div>
        </section>

        {/* EVENTS SECTION */}
        <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-sm">দিনপঞ্জিকা</span>
              <h2 className="text-4xl font-header font-bold text-gray-900 dark:text-white mt-2">আসন্ন ইভেন্টসমূহ</h2>
            </div>
            <button onClick={scrollToEvents} className="hidden md:block text-gray-500 hover:text-primary transition-colors">সব ইভেন্ট দেখুন &rarr;</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(events || INITIAL_EVENTS).map(event => (
              <div key={event.id} className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur text-center px-3 py-1 rounded">
                    <div className="text-xs font-bold uppercase text-red-500">{new Date(event.date).toLocaleString('bn-BD', { month: 'short' })}</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{new Date(event.date).getDate()}</div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs font-bold text-primary uppercase mb-2 block">{event.category}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{event.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>
                  <div className="flex items-center text-gray-400 text-xs mb-4">
                    <span className="material-icons text-sm mr-1">location_on</span>
                    {event.location}
                    <span className="mx-2">•</span>
                    <span>{event.time}</span>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white text-gray-900 dark:text-white font-bold py-2 rounded transition-colors text-sm uppercase tracking-wide mt-auto flex items-center justify-center"
                  >
                    <span className="material-icons text-sm mr-2">person_add</span>
                    ইভেন্টে যোগ দিন
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <button onClick={scrollToEvents} className="text-primary font-bold">সব ইভেন্ট দেখুন &rarr;</button>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section id="gallery" className="py-20 bg-gray-50 dark:bg-black transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-primary font-bold tracking-widest uppercase text-sm">চিত্রসমূহ</span>
              <h2 className="text-4xl font-header font-bold mt-2 text-gray-900 dark:text-white">স্মৃতির অ্যালবাম</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
              {(() => {
                const realItems = galleryItems || [];
                const displayItems = realItems.length > 0
                  ? [...realItems].sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                  }).slice(0, 4)
                  : GALLERY_ITEMS.slice(0, 4);

                return displayItems.map((item, index) => (
                  <div key={item.id} className={`group relative overflow-hidden rounded-sm cursor-pointer ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : ''}`} onClick={() => navigate('/gallery')}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1 block">{item.category}</span>
                      <h3 className={`font-display font-bold text-white ${index === 0 || index === 3 ? 'text-2xl' : 'text-lg'}`}>{item.title}</h3>
                    </div>
                  </div>
                ));
              })()}
            </div>
            <div className="mt-12 text-center">
              <button onClick={() => navigate('/gallery')} className="bg-transparent border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold py-3 px-8 uppercase tracking-widest hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                সম্পূর্ণ গ্যালারি দেখুন
              </button>
            </div>
          </div>
        </section>

      </div>

      <Footer footerData={footerData} />

      {/* Registration Modal */}
      {selectedEvent && (
        <EventRegistrationModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSubmit={handleRegistrationSubmit}
        />
      )}

      {/* Thank You Modal */}
      <ThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        userName={registrationDetails.name}
        eventName={registrationDetails.event}
      />
    </div>
  );
};