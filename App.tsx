import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { History } from './pages/History';
import { Announcements } from './pages/Announcements';
import { Login } from './pages/Login';
import { PublicFormView } from './pages/PublicFormView';
import { AdminLayout } from './layouts/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { EventManager } from './pages/admin/EventManager';
import { EventInbox } from './pages/admin/EventInbox';
import { SiteIdentity } from './pages/admin/SiteIdentity';
import { GalleryRedirects } from './pages/admin/GalleryRedirects';
import { AboutManager } from './pages/admin/AboutManager';
import { HistoryManager } from './pages/admin/HistoryManager';
import { FooterManager } from './pages/admin/FooterManager';
import { Settings } from './pages/admin/Settings';
import { FormBuilder } from './pages/admin/FormBuilder';
import { AnnouncementManager } from './pages/admin/AnnouncementManager';
import { INITIAL_EVENTS, GALLERY_ITEMS, INITIAL_ABOUT_DATA, INITIAL_HISTORY_DATA, INITIAL_FOOTER_DATA, INITIAL_HERO_DATA, INITIAL_ANNOUNCEMENTS } from './constants';
import { Event, RedirectLink, GalleryItem, AboutSectionData, HistoryPageData, FooterData, HeroData, RegistrationSubmission, EventRegistration, CustomForm, Announcement, FormSubmission, AnalyticsData } from './types';
import { Footer } from './components/Footer';
import { FormInbox } from './pages/admin/FormInbox';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy, doc, addDoc, updateDoc, deleteDoc, setDoc, increment } from 'firebase/firestore';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  // Persist authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ontohin_auth') === 'true';
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [aboutData, setAboutData] = useState<AboutSectionData>(INITIAL_ABOUT_DATA);
  const [historyData, setHistoryData] = useState<HistoryPageData>(INITIAL_HISTORY_DATA);
  const [footerData, setFooterData] = useState<FooterData>(INITIAL_FOOTER_DATA);
  const [heroData, setHeroData] = useState<HeroData>(INITIAL_HERO_DATA);
  const [registrations, setRegistrations] = useState<RegistrationSubmission[]>([]);
  const [customForms, setCustomForms] = useState<CustomForm[]>([]);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  // Shared state for Redirect Links (accessible in Admin and Gallery)
  const [redirectLinks, setRedirectLinks] = useState<RedirectLink[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({ views: 0 });

  // Firestore Data Fetching
  useEffect(() => {
    const unsubEvents = onSnapshot(query(collection(db, 'events'), orderBy('date', 'desc')), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Event));
      setEvents(snapshot.empty && !isAuthenticated ? INITIAL_EVENTS : data);
    });

    const unsubAnnouncements = onSnapshot(query(collection(db, 'announcements'), orderBy('date', 'desc')), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Announcement));
      setAnnouncements(snapshot.empty && !isAuthenticated ? INITIAL_ANNOUNCEMENTS : data);
    });

    const unsubGallery = onSnapshot(query(collection(db, 'gallery'), orderBy('date', 'desc')), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as GalleryItem));
      setGalleryItems(snapshot.empty && !isAuthenticated ? GALLERY_ITEMS : data);
    });

    const unsubAbout = onSnapshot(doc(db, 'metadata', 'about'), (doc) => {
      if (doc.exists()) setAboutData(doc.data() as AboutSectionData);
    });

    const unsubHistory = onSnapshot(doc(db, 'metadata', 'history'), (doc) => {
      if (doc.exists()) setHistoryData(doc.data() as HistoryPageData);
    });

    const unsubFooter = onSnapshot(doc(db, 'metadata', 'footer'), (doc) => {
      if (doc.exists()) setFooterData(doc.data() as FooterData);
    });

    const unsubHero = onSnapshot(doc(db, 'metadata', 'hero'), (doc) => {
      if (doc.exists()) setHeroData(doc.data() as HeroData);
    });

    const unsubRegistrations = onSnapshot(query(collection(db, 'registrations'), orderBy('submittedAt', 'desc')), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as RegistrationSubmission));
      setRegistrations(data);
    });

    const unsubForms = onSnapshot(query(collection(db, 'forms'), orderBy('createdAt', 'desc')), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CustomForm));
      setCustomForms(data);
    });

    const unsubSubmissions = onSnapshot(query(collection(db, 'submissions'), orderBy('submittedAt', 'desc')), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as FormSubmission));
      setFormSubmissions(data);
    });

    const unsubLinks = onSnapshot(query(collection(db, 'links'), orderBy('label', 'asc')), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as RedirectLink));
      setRedirectLinks(data);
    });

    const unsubAnalytics = onSnapshot(doc(db, 'metadata', 'analytics'), (doc) => {
      if (doc.exists()) setAnalytics(doc.data() as AnalyticsData);
    });

    setLoading(false);

    return () => {
      unsubEvents();
      unsubAnnouncements();
      unsubGallery();
      unsubAbout();
      unsubHistory();
      unsubFooter();
      unsubHero();
      unsubRegistrations();
      unsubForms();
      unsubSubmissions();
      unsubLinks();
      unsubAnalytics();
    };
  }, [isAuthenticated]);

  // Increment views only once per session/mount
  useEffect(() => {
    const incrementViews = async () => {
      try {
        const analyticsRef = doc(db, 'metadata', 'analytics');
        await setDoc(analyticsRef, { views: increment(1) }, { merge: true });
      } catch (error) {
        console.error("Error incrementing views:", error);
      }
    };
    incrementViews();
  }, []);

  useEffect(() => {
    // Initial theme setup
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync Favicon from Firestore
  useEffect(() => {
    if (heroData.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = heroData.favicon;
    }
  }, [heroData.favicon]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = () => {
    localStorage.setItem('ontohin_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ontohin_auth');
    setIsAuthenticated(false);
  };

  // Handler passed to Home -> EventRegistrationModal
  const handleRegistrationSubmit = async (formData: EventRegistration, event: Event) => {
    const newSubmission = {
      ...formData,
      eventId: event.id,
      eventName: event.title,
      submittedAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'registrations'), newSubmission);
    } catch (error) {
      console.error("Error adding registration: ", error);
      alert("রেজিস্ট্রেশন করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} toggleTheme={toggleTheme} aboutData={aboutData} footerData={footerData} heroData={heroData} events={events} onRegister={handleRegistrationSubmit} />} />
        <Route path="/gallery" element={<Gallery darkMode={darkMode} toggleTheme={toggleTheme} redirectLinks={redirectLinks} galleryItems={galleryItems} footerData={footerData} />} />
        <Route path="/history" element={<History darkMode={darkMode} toggleTheme={toggleTheme} historyData={historyData} footerData={footerData} />} />
        <Route path="/announcements" element={<Announcements darkMode={darkMode} toggleTheme={toggleTheme} announcements={announcements} footerData={footerData} />} />

        {/* Public Form View */}
        <Route path="/form/:token" element={<PublicFormView forms={customForms} setSubmissions={setFormSubmissions} darkMode={darkMode} />} />

        {/* Auth Route */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            isAuthenticated ? (
              <AdminLayout toggleTheme={toggleTheme} darkMode={darkMode} onLogout={handleLogout}>
                <Routes>
                  <Route path="dashboard" element={<Dashboard events={events} redirectLinks={redirectLinks} analytics={analytics} />} />
                  <Route path="events" element={<EventManager events={events} />} />
                  <Route path="announcements" element={<AnnouncementManager announcements={announcements} />} />
                  <Route path="inbox" element={<EventInbox registrations={registrations} />} />
                  <Route path="form-inbox" element={<FormInbox forms={customForms} submissions={formSubmissions} />} />
                  <Route path="forms" element={<FormBuilder forms={customForms} />} />
                  <Route path="identity" element={<SiteIdentity heroData={heroData} />} />
                  <Route path="about" element={<AboutManager aboutData={aboutData} />} />
                  <Route path="history" element={<HistoryManager historyData={historyData} />} />
                  <Route path="gallery" element={<GalleryRedirects galleryItems={galleryItems} links={redirectLinks} />} />
                  <Route path="footer" element={<FooterManager footerData={footerData} />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </AdminLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;