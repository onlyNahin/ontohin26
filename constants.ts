import { Event, GalleryItem, AboutSectionData, HistoryPageData, FooterData, HeroData, Announcement } from './types';

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'এসএসসি ২০২৬ ব্যাচের রেজিস্ট্রেশন শুরু',
    date: '2024-03-15',
    content: 'আমাদের ব্যাচের সকল ছাত্রের ডাটাবেজ তৈরির কাজ চলছে। শীঘ্রই রেজিস্ট্রেশন ফর্ম পূরণ করার জন্য অনুরোধ করা হচ্ছে।',
    priority: 'High',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'আসন্ন ক্রিকেট টুর্নামেন্ট',
    date: '2024-04-10',
    content: 'আগামী মাসে আন্তঃসেকশন ক্রিকেট টুর্নামেন্ট অনুষ্ঠিত হবে। দল গঠনের জন্য ক্যাপ্টেনদের যোগাযোগ করতে বলা হচ্ছে।',
    priority: 'Normal',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'রমজান উপলক্ষ্যে ইফতার মাহফিল',
    date: '2024-03-25',
    content: 'পবিত্র রমজান মাসে আমাদের ব্যাচের পক্ষ থেকে ইফতার মাহফিলের আয়োজন করা হবে। স্থান ও সময় শীঘ্রই জানানো হবে।',
    priority: 'Normal'
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    title: 'বার্ষিক নাট্য উৎসব ২০২৪',
    date: '2024-10-24',
    time: 'সন্ধ্যা ৬:০০',
    location: 'মূল অডিটোরিয়াম',
    description: 'নাটক এবং সঙ্গীতের এক জমকালো সন্ধ্যা।',
    status: 'Published',
    category: 'সাংস্কৃতিক',
    imageUrl: 'https://images.unsplash.com/photo-1503095392237-fc989d3d455d?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'ইম্প্রুভ ওয়ার্কশপ',
    date: '2024-11-02',
    time: 'দুপুর ২:০০',
    location: 'রুম ৩০৪',
    description: 'সিনিয়রদের সাথে ইম্প্রোভাইজেশন শিখুন।',
    status: 'Draft',
    category: 'কর্মশালা',
    imageUrl: 'https://images.unsplash.com/photo-1516565922369-a6df9182aa47?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'ওপেন মাইক নাইট',
    date: '2024-11-15',
    time: 'রাত ৭:৩০',
    location: 'ক্যাফেটেরিয়া',
    description: 'আপনার প্রতিভা দেখান! গান, কবিতা, এবং স্ট্যান্ড-আপ।',
    status: 'Published',
    category: 'সামাজিক',
    imageUrl: 'https://images.unsplash.com/photo-1595123985166-5154378f8956?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'অ্যালামনাই মিটআপ',
    date: '2024-12-01',
    time: 'বিকেল ৫:০০',
    location: 'রিইউনিয়ন হল',
    description: 'অতীতের কিংবদন্তিদের সাথে সংযোগ।',
    status: 'Draft',
    category: 'পুনর্মিলনী',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    title: 'বার্ষিক পুনর্মিলনী ২০২৪',
    category: 'ইভেন্ট',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop',
    date: '2024-10-24'
  },
  {
    id: '2',
    title: 'নাট্য উৎসবের মুহূর্ত',
    category: 'গ্যালারি',
    imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=1000&auto=format&fit=crop',
    date: '2024-09-15'
  },
  {
    id: '3',
    title: 'ব্যাচ ফটো সেশন',
    category: 'কমিউনিটি',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop',
    date: '2024-08-20'
  },
  {
    id: '4',
    title: 'কালচারাল নাইট ২০২৫',
    category: 'আসন্ন',
    imageUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1000&auto=format&fit=crop',
    date: '2025-01-10'
  }
];

export const INITIAL_ABOUT_DATA: AboutSectionData = {
  title: 'একটি ব্যাচের চেয়েও বেশি কিছু',
  subtitle: 'আমরা কারা',
  description: 'আমরা রাজশাহী কলিজিয়েট স্কুলের এসএসসি ২০২৬ ব্যাচ। ক্লাসরুমে গঠিত, খেলার মাঠে শক্তিশালী, এবং মহত্বের জন্য নির্ধারিত এক ভ্রাতৃত্ব। অন্তহীন ২৬ আমাদের অটুট বন্ধন এবং সামনে থাকা অসীম সম্ভাবনার প্রতিনিধিত্ব করে।',
  cards: [
    {
      id: '1',
      icon: 'school',
      title: 'একাডেমিক উৎকর্ষ',
      description: 'শীর্ষে পৌঁছানোর প্রচেষ্টা, এই অঞ্চলের প্রাচীনতম স্কুলের মশাল বহন করে চলা।'
    },
    {
      id: '2',
      icon: 'diversity_3',
      title: 'অটুট একতা',
      description: 'কাঁধে কাঁধ মিলিয়ে, প্রতিটি চ্যালেঞ্জ এবং বিজয়ে আমরা একসাথে দাঁড়াই।'
    },
    {
      id: '3',
      icon: 'theater_comedy',
      title: 'সাংস্কৃতিক ঐতিহ্য',
      description: 'নাটক থেকে শুরু করে সঙ্গীত, আমরা আমাদের ক্যাম্পাসের সাংস্কৃতিক স্পন্দনকে জীবিত রাখি।'
    }
  ]
};

export const INITIAL_HISTORY_DATA: HistoryPageData = {
  headerSubtitle: 'স্থাপিত ১৮২৮',
  headerTitle: 'কলিজিয়েটের উপাখ্যান',
  mainDescription: 'রাজশাহী কলিজিয়েট স্কুল কেবল একটি শিক্ষা প্রতিষ্ঠান নয়; এটি ইতিহাসের সাক্ষী। ব্রিটিশ রাজের সময় ১৮২৮ সালে "বাউলিয়া ইংলিশ স্কুল" হিসেবে প্রতিষ্ঠিত, এটি বাংলায় প্রথম আধুনিক শিক্ষা প্রতিষ্ঠান এবং ভারতীয় উপমহাদেশের অন্যতম প্রাচীন প্রতিষ্ঠান হিসেবে দাঁড়িয়ে আছে।',
  imageUrl: 'https://images.unsplash.com/photo-1577030838186-b41314787a71?q=80&w=1000&auto=format&fit=crop',
  contentBlocks: [
    {
      id: '1',
      title: 'সূচনা',
      description: 'বাংলার যুবকদের আধুনিক শিক্ষা প্রদানের লক্ষ্য নিয়ে এই যাত্রা শুরু হয়েছিল। ভারতের তৎকালীন গভর্নর-জেনারেল লর্ড উইলিয়াম বেন্টিঙ্ক এর সূচনায় গুরুত্বপূর্ণ ভূমিকা পালন করেছিলেন। মূলত রামপুর বোয়ালিয়ার ইংরেজ বাসিন্দাদের দ্বারা একটি ব্যক্তিগত উদ্যোগ হিসেবে শুরু হলেও, পরে এটি সরকার গ্রহণ করে, যা এমন এক ঐতিহ্যের সূচনা করে যা শতাব্দীর পর শতাব্দী ধরে টিকে থাকবে।'
    },
    {
      id: '2',
      title: 'শ্রেষ্ঠত্বের ঐতিহ্য',
      description: 'প্রায় দুই শতাব্দী ধরে, এই স্কুল অসংখ্য কৃতি সন্তান তৈরি করেছে যারা জাতিকে রূপ দিয়েছে। বিজ্ঞানী ও সাহিত্যিক থেকে শুরু করে রাজনীতিবিদ ও সমাজ সংস্কারক, কলিজিয়েটের প্রাক্তন ছাত্ররা বিশ্বে এক অমোঘ ছাপ রেখে গেছেন। লাল ইটের ভবনগুলো কিংবদন্তিদের পদচারণায় মুখরিত, এবং শ্রেণীকক্ষগুলো প্রজন্মের পর প্রজন্ম ধরে চলে আসা জ্ঞানে প্রতিধ্বনিত হয়।'
    },
    {
      id: '3',
      title: '২০২৬ ব্যাচ',
      description: 'আজ, এসএসসি ২০২৬ ব্যাচ হিসেবে, আমরা সেই মহানদের কাঁধে দাঁড়িয়ে আছি। আমরা স্থিতিস্থাপকতা, বুদ্ধি এবং ভ্রাতৃত্বের এক ঐতিহ্যের উত্তরাধিকারী। আমরা কেবল ছাত্র নই; আমরা এমন এক ঐতিহ্যের মশাল বহনকারী যা সাম্রাজ্য, বিভাজন এবং বিপ্লবকে জয় করেছে। "অন্তহীন ২৬" আমাদের আলমা ম্যাটারের সম্মান অক্ষুণ্ণ রাখার প্রতি আমাদের অসীম প্রতিশ্রুতির প্রতীক।'
    }
  ],
  quote: '"শিক্ষা হলো মানুষের মধ্যে বিদ্যমান পূর্ণতার প্রকাশ।"'
};

export const INITIAL_FOOTER_DATA: FooterData = {
  brandDescription: 'রাজশাহী কলিজিয়েট স্কুলের এসএসসি ২০২৬ ব্যাচ। ইতিহাস, ঐতিহ্য এবং ভ্রাতৃত্বের এক অবিচ্ছেদ্য বন্ধন। আমরা কেবল একটি ব্যাচ নই, আমরা একটি পরিবার।',
  facebookUrl: '#',
  instagramUrl: '#',
  contactAddress: 'রাজশাহী কলিজিয়েট স্কুল, রাজশাহী, বাংলাদেশ',
  contactEmail: 'contact@ontohin26.com',
  establishedYear: '১৮২৮',
  quoteText: 'শিক্ষা জাতির মেরুদণ্ড, আর ঐক্য আমাদের শক্তি।',
  copyrightText: '© ২০২৬ অন্তহীন ২৬। সর্বস্বত্ব সংরক্ষিত।'
};

export const INITIAL_HERO_DATA: HeroData = {
  title: 'অন্তহীন ২৬',
  subtitle: 'কলিজিয়েটের ঐতিহ্য',
  imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop',
  button: {
    text: 'ইভেন্ট দেখুন',
    url: 'events',
    type: 'scroll'
  }
};

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * Google Apps Script for Ontohin 26 Form Integration
 * This script will receive form submissions, append data to a spreadsheet,
 * and upload file attachments to a specific folder in Google Drive.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { formTitle, submittedAt, formData, attachments } = data;

    // 1. Manage Spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(formTitle);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(formTitle);
      const headers = ["Submitted At", ...Object.keys(formData)];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
    }

    // 2. Handle Attachments (Optional)
    const attachmentUrls = {};
    if (attachments && Object.keys(attachments).length > 0) {
      // Find or create "Form Uploads" folder
      let folder;
      const folders = DriveApp.getFoldersByName("Ontohin26_Uploads");
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder("Ontohin26_Uploads");
      }

      for (const fieldId in attachments) {
        const fileData = attachments[fieldId]; // { name, type, base64 }
        if (fileData && fileData.base64) {
          const blob = Utilities.newBlob(Utilities.base64Decode(fileData.base64), fileData.type, fileData.name);
          const file = folder.createFile(blob);
          attachmentUrls[fieldId] = file.getUrl();
        }
      }
    }

    // 3. Append Data
    const fullRow = [submittedAt];
    const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    for (let i = 1; i < headerRow.length; i++) {
        const header = headerRow[i];
        let val = formData[header] || attachmentUrls[header] || "";
        fullRow.push(val);
    }
    
    sheet.appendRow(fullRow);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;