'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Settings, Save, CheckCircle, AlertCircle, Loader2, 
  Phone, Mail, MapPin, Play, Globe, MessageSquare, 
  Sparkles, Users, Award, BookOpen 
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

function SettingsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('branding');

  useEffect(() => {
    if (tabParam && ['branding', 'contacts', 'homepage', 'leadership', 'testimonials', 'about'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Form Fields State
  // 1. Branding & Global Settings
  const [siteLogoUrl, setSiteLogoUrl] = useState('');
  const [mapIframeUrl, setMapIframeUrl] = useState('');

  // 2. Telephone & WhatsApp Channels
  const [phonePrimary, setPhonePrimary] = useState('');
  const [phoneAlt1, setPhoneAlt1] = useState('');
  const [phoneAlt2, setPhoneAlt2] = useState('');
  const [phoneAlt3, setPhoneAlt3] = useState('');
  const [phoneAlt4, setPhoneAlt4] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [poBox, setPoBox] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [youtubeHeroUrl, setYoutubeHeroUrl] = useState('');

  // 3. Homepage Banner & Headers
  const [homeExclusiveOfferBannerTag, setHomeExclusiveOfferBannerTag] = useState('');
  const [homeExclusiveOfferBannerText, setHomeExclusiveOfferBannerText] = useState('');
  const [homeFeaturedPropertiesTag, setHomeFeaturedPropertiesTag] = useState('');
  const [homeFeaturedPropertiesTitle, setHomeFeaturedPropertiesTitle] = useState('');
  const [homeFeaturedPropertiesDesc, setHomeFeaturedPropertiesDesc] = useState('');

  // 4. Homepage Identity & Pillars
  const [homeIdentityTag, setHomeIdentityTag] = useState('');
  const [homeIdentityTitle, setHomeIdentityTitle] = useState('');
  const [homeIdentityDesc1, setHomeIdentityDesc1] = useState('');
  const [homeIdentityDesc2, setHomeIdentityDesc2] = useState('');
  const [homePillar1Title, setHomePillar1Title] = useState('');
  const [homePillar1Desc, setHomePillar1Desc] = useState('');
  const [homePillar2Title, setHomePillar2Title] = useState('');
  const [homePillar2Desc, setHomePillar2Desc] = useState('');
  const [homePillar3Title, setHomePillar3Title] = useState('');
  const [homePillar3Desc, setHomePillar3Desc] = useState('');
  const [homePillar4Title, setHomePillar4Title] = useState('');
  const [homePillar4Desc, setHomePillar4Desc] = useState('');

  // 5. Co-Founders & Cinematic Video
  const [cofounder1Name, setCofounder1Name] = useState('');
  const [cofounder1Title, setCofounder1Title] = useState('');
  const [cofounder1Image, setCofounder1Image] = useState('');
  const [cofounder1Statement, setCofounder1Statement] = useState('');
  const [cofounder2Name, setCofounder2Name] = useState('');
  const [cofounder2Title, setCofounder2Title] = useState('');
  const [cofounder2Image, setCofounder2Image] = useState('');
  const [cofounder2Statement, setCofounder2Statement] = useState('');
  const [homeVideoTitle, setHomeVideoTitle] = useState('');
  const [homeVideoThumbnail, setHomeVideoThumbnail] = useState('');

  // 6. Homepage Testimonials
  const [testimonial1Name, setTestimonial1Name] = useState('');
  const [testimonial1Role, setTestimonial1Role] = useState('');
  const [testimonial1Text, setTestimonial1Text] = useState('');
  const [testimonial2Name, setTestimonial2Name] = useState('');
  const [testimonial2Role, setTestimonial2Role] = useState('');
  const [testimonial2Text, setTestimonial2Text] = useState('');
  const [testimonial3Name, setTestimonial3Name] = useState('');
  const [testimonial3Role, setTestimonial3Role] = useState('');
  const [testimonial3Text, setTestimonial3Text] = useState('');

  // 7. About Us Page hero & stories
  const [aboutHeroTag, setAboutHeroTag] = useState('');
  const [aboutHeroTitle, setAboutHeroTitle] = useState('');
  const [aboutHeroDesc, setAboutHeroDesc] = useState('');
  const [aboutStoryTag, setAboutStoryTag] = useState('');
  const [aboutStoryTitle, setAboutStoryTitle] = useState('');
  const [aboutStoryDesc1, setAboutStoryDesc1] = useState('');
  const [aboutStoryDesc2, setAboutStoryDesc2] = useState('');
  const [aboutStoryDesc3, setAboutStoryDesc3] = useState('');
  const [aboutStoryCoffeeQuote, setAboutStoryCoffeeQuote] = useState('');
  const [aboutDesignPhilosophyImage, setAboutDesignPhilosophyImage] = useState('');
  const [aboutDesignPhilosophyTitle, setAboutDesignPhilosophyTitle] = useState('');
  const [aboutDesignPhilosophyCaption, setAboutDesignPhilosophyCaption] = useState('');

  // 8. About Us Pillars & Mission
  const [aboutPillar1Title, setAboutPillar1Title] = useState('');
  const [aboutPillar1Desc, setAboutPillar1Desc] = useState('');
  const [aboutPillar2Title, setAboutPillar2Title] = useState('');
  const [aboutPillar2Desc, setAboutPillar2Desc] = useState('');
  const [aboutPillar3Title, setAboutPillar3Title] = useState('');
  const [aboutPillar3Desc, setAboutPillar3Desc] = useState('');
  const [aboutPillar4Title, setAboutPillar4Title] = useState('');
  const [aboutPillar4Desc, setAboutPillar4Desc] = useState('');
  const [aboutMissionTag, setAboutMissionTag] = useState('');
  const [aboutMissionTitle, setAboutMissionTitle] = useState('');
  const [aboutMissionDesc, setAboutMissionDesc] = useState('');
  const [aboutMissionItem1Title, setAboutMissionItem1Title] = useState('');
  const [aboutMissionItem1Desc, setAboutMissionItem1Desc] = useState('');
  const [aboutMissionItem2Title, setAboutMissionItem2Title] = useState('');
  const [aboutMissionItem2Desc, setAboutMissionItem2Desc] = useState('');
  const [aboutMissionItem3Title, setAboutMissionItem3Title] = useState('');
  const [aboutMissionItem3Desc, setAboutMissionItem3Desc] = useState('');
  const [aboutMissionItem4Title, setAboutMissionItem4Title] = useState('');
  const [aboutMissionItem4Desc, setAboutMissionItem4Desc] = useState('');

  // 9. About Us Global Standards
  const [aboutGlobalTag, setAboutGlobalTag] = useState('');
  const [aboutGlobalTitle, setAboutGlobalTitle] = useState('');
  const [aboutGlobalDesc1, setAboutGlobalDesc1] = useState('');
  const [aboutGlobalDesc2, setAboutGlobalDesc2] = useState('');
  const [aboutGlobalCtaTitle, setAboutGlobalCtaTitle] = useState('');
  const [aboutGlobalCtaDesc, setAboutGlobalCtaDesc] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) throw new Error('Failed to load settings');
        const json = await res.json();
        
        if (json.success && json.data) {
          const s = json.data;
          // Branding
          setSiteLogoUrl(s.site_logo_url || '');
          setMapIframeUrl(s.map_iframe_url || '');

          // Contacts
          setPhonePrimary(s.phone_primary || '');
          setPhoneAlt1(s.phone_alt1 || '');
          setPhoneAlt2(s.phone_alt2 || '');
          setPhoneAlt3(s.phone_alt3 || '');
          setPhoneAlt4(s.phone_alt4 || '');
          setWhatsappNumber(s.whatsapp_number || '');
          setContactEmail(s.contact_email || '');
          setOfficeAddress(s.office_address || '');
          setPoBox(s.po_box || '');
          setBusinessHours(s.business_hours || '');
          setYoutubeHeroUrl(s.youtube_hero_url || '');

          // Homepage Header & Banner
          setHomeExclusiveOfferBannerTag(s.home_exclusive_offer_banner_tag || '');
          setHomeExclusiveOfferBannerText(s.home_exclusive_offer_banner_text || '');
          setHomeFeaturedPropertiesTag(s.home_featured_properties_tag || '');
          setHomeFeaturedPropertiesTitle(s.home_featured_properties_title || '');
          setHomeFeaturedPropertiesDesc(s.home_featured_properties_desc || '');

          // Homepage Identity & Pillars
          setHomeIdentityTag(s.home_identity_tag || '');
          setHomeIdentityTitle(s.home_identity_title || '');
          setHomeIdentityDesc1(s.home_identity_desc1 || '');
          setHomeIdentityDesc2(s.home_identity_desc2 || '');
          setHomePillar1Title(s.home_pillar1_title || '');
          setHomePillar1Desc(s.home_pillar1_desc || '');
          setHomePillar2Title(s.home_pillar2_title || '');
          setHomePillar2Desc(s.home_pillar2_desc || '');
          setHomePillar3Title(s.home_pillar3_title || '');
          setHomePillar3Desc(s.home_pillar3_desc || '');
          setHomePillar4Title(s.home_pillar4_title || '');
          setHomePillar4Desc(s.home_pillar4_desc || '');

          // Co-founders
          setCofounder1Name(s.cofounder1_name || '');
          setCofounder1Title(s.cofounder1_title || '');
          setCofounder1Image(s.cofounder1_image || '');
          setCofounder1Statement(s.cofounder1_statement || '');
          setCofounder2Name(s.cofounder2_name || '');
          setCofounder2Title(s.cofounder2_title || '');
          setCofounder2Image(s.cofounder2_image || '');
          setCofounder2Statement(s.cofounder2_statement || '');
          setHomeVideoTitle(s.home_video_title || '');
          setHomeVideoThumbnail(s.home_video_thumbnail || '');

          // Testimonials
          setTestimonial1Name(s.testimonial1_name || '');
          setTestimonial1Role(s.testimonial1_role || '');
          setTestimonial1Text(s.testimonial1_text || '');
          setTestimonial2Name(s.testimonial2_name || '');
          setTestimonial2Role(s.testimonial2_role || '');
          setTestimonial2Text(s.testimonial2_text || '');
          setTestimonial3Name(s.testimonial3_name || '');
          setTestimonial3Role(s.testimonial3_role || '');
          setTestimonial3Text(s.testimonial3_text || '');

          // About Page
          setAboutHeroTag(s.about_hero_tag || '');
          setAboutHeroTitle(s.about_hero_title || '');
          setAboutHeroDesc(s.about_hero_desc || '');
          setAboutStoryTag(s.about_story_tag || '');
          setAboutStoryTitle(s.about_story_title || '');
          setAboutStoryDesc1(s.about_story_desc1 || '');
          setAboutStoryDesc2(s.about_story_desc2 || '');
          setAboutStoryDesc3(s.about_story_desc3 || '');
          setAboutStoryCoffeeQuote(s.about_story_coffee_quote || '');
          setAboutDesignPhilosophyImage(s.about_design_philosophy_image || '');
          setAboutDesignPhilosophyTitle(s.about_design_philosophy_title || '');
          setAboutDesignPhilosophyCaption(s.about_design_philosophy_caption || '');

          // About Pillars & Mission
          setAboutPillar1Title(s.about_pillar1_title || '');
          setAboutPillar1Desc(s.about_pillar1_desc || '');
          setAboutPillar2Title(s.about_pillar2_title || '');
          setAboutPillar2Desc(s.about_pillar2_desc || '');
          setAboutPillar3Title(s.about_pillar3_title || '');
          setAboutPillar3Desc(s.about_pillar3_desc || '');
          setAboutPillar4Title(s.about_pillar4_title || '');
          setAboutPillar4Desc(s.about_pillar4_desc || '');
          setAboutMissionTag(s.about_mission_tag || '');
          setAboutMissionTitle(s.about_mission_title || '');
          setAboutMissionDesc(s.about_mission_desc || '');
          setAboutMissionItem1Title(s.about_mission_item1_title || '');
          setAboutMissionItem1Desc(s.about_mission_item1_desc || '');
          setAboutMissionItem2Title(s.about_mission_item2_title || '');
          setAboutMissionItem2Desc(s.about_mission_item2_desc || '');
          setAboutMissionItem3Title(s.about_mission_item3_title || '');
          setAboutMissionItem3Desc(s.about_mission_item3_desc || '');
          setAboutMissionItem4Title(s.about_mission_item4_title || '');
          setAboutMissionItem4Desc(s.about_mission_item4_desc || '');

          // About Global Standards
          setAboutGlobalTag(s.about_global_tag || '');
          setAboutGlobalTitle(s.about_global_title || '');
          setAboutGlobalDesc1(s.about_global_desc1 || '');
          setAboutGlobalDesc2(s.about_global_desc2 || '');
          setAboutGlobalCtaTitle(s.about_global_cta_title || '');
          setAboutGlobalCtaDesc(s.about_global_cta_desc || '');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error loading configurations');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const payload = {
      site_logo_url: siteLogoUrl,
      map_iframe_url: mapIframeUrl,
      phone_primary: phonePrimary,
      phone_alt1: phoneAlt1,
      phone_alt2: phoneAlt2,
      phone_alt3: phoneAlt3,
      phone_alt4: phoneAlt4,
      whatsapp_number: whatsappNumber,
      contact_email: contactEmail,
      office_address: officeAddress,
      po_box: poBox,
      business_hours: businessHours,
      youtube_hero_url: youtubeHeroUrl,
      home_exclusive_offer_banner_tag: homeExclusiveOfferBannerTag,
      home_exclusive_offer_banner_text: homeExclusiveOfferBannerText,
      home_featured_properties_tag: homeFeaturedPropertiesTag,
      home_featured_properties_title: homeFeaturedPropertiesTitle,
      home_featured_properties_desc: homeFeaturedPropertiesDesc,
      home_identity_tag: homeIdentityTag,
      home_identity_title: homeIdentityTitle,
      home_identity_desc1: homeIdentityDesc1,
      home_identity_desc2: homeIdentityDesc2,
      home_pillar1_title: homePillar1Title,
      home_pillar1_desc: homePillar1Desc,
      home_pillar2_title: homePillar2Title,
      home_pillar2_desc: homePillar2Desc,
      home_pillar3_title: homePillar3Title,
      home_pillar3_desc: homePillar3Desc,
      home_pillar4_title: homePillar4Title,
      home_pillar4_desc: homePillar4Desc,
      cofounder1_name: cofounder1Name,
      cofounder1_title: cofounder1Title,
      cofounder1_image: cofounder1Image,
      cofounder1_statement: cofounder1Statement,
      cofounder2_name: cofounder2Name,
      cofounder2_title: cofounder2Title,
      cofounder2_image: cofounder2Image,
      cofounder2_statement: cofounder2Statement,
      home_video_title: homeVideoTitle,
      home_video_thumbnail: homeVideoThumbnail,
      testimonial1_name: testimonial1Name,
      testimonial1_role: testimonial1Role,
      testimonial1_text: testimonial1Text,
      testimonial2_name: testimonial2Name,
      testimonial2_role: testimonial2Role,
      testimonial2_text: testimonial2Text,
      testimonial3_name: testimonial3Name,
      testimonial3_role: testimonial3Role,
      testimonial3_text: testimonial3Text,
      about_hero_tag: aboutHeroTag,
      about_hero_title: aboutHeroTitle,
      about_hero_desc: aboutHeroDesc,
      about_story_tag: aboutStoryTag,
      about_story_title: aboutStoryTitle,
      about_story_desc1: aboutStoryDesc1,
      about_story_desc2: aboutStoryDesc2,
      about_story_desc3: aboutStoryDesc3,
      about_story_coffee_quote: aboutStoryCoffeeQuote,
      about_design_philosophy_image: aboutDesignPhilosophyImage,
      about_design_philosophy_title: aboutDesignPhilosophyTitle,
      about_design_philosophy_caption: aboutDesignPhilosophyCaption,
      about_pillar1_title: aboutPillar1Title,
      about_pillar1_desc: aboutPillar1Desc,
      about_pillar2_title: aboutPillar2Title,
      about_pillar2_desc: aboutPillar2Desc,
      about_pillar3_title: aboutPillar3Title,
      about_pillar3_desc: aboutPillar3Desc,
      about_pillar4_title: aboutPillar4Title,
      about_pillar4_desc: aboutPillar4Desc,
      about_mission_tag: aboutMissionTag,
      about_mission_title: aboutMissionTitle,
      about_mission_desc: aboutMissionDesc,
      about_mission_item1_title: aboutMissionItem1Title,
      about_mission_item1_desc: aboutMissionItem1Desc,
      about_mission_item2_title: aboutMissionItem2Title,
      about_mission_item2_desc: aboutMissionItem2Desc,
      about_mission_item3_title: aboutMissionItem3Title,
      about_mission_item3_desc: aboutMissionItem3Desc,
      about_mission_item4_title: aboutMissionItem4Title,
      about_mission_item4_desc: aboutMissionItem4Desc,
      about_global_tag: aboutGlobalTag,
      about_global_title: aboutGlobalTitle,
      about_global_desc1: aboutGlobalDesc1,
      about_global_desc2: aboutGlobalDesc2,
      about_global_cta_title: aboutGlobalCtaTitle,
      about_global_cta_desc: aboutGlobalCtaDesc,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      const json = await res.json();
      
      if (json.success) {
        setSuccessMsg('Configurations updated successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'branding', label: 'Branding & General', icon: Globe },
    { id: 'contacts', label: 'Contacts Desk', icon: Phone },
    { id: 'homepage', label: 'Homepage Content', icon: BookOpen },
    { id: 'leadership', label: 'Leadership & Video', icon: Users },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'about', label: 'About Us Page', icon: Award },
  ];

  return (
    <div className="max-w-6xl flex flex-col gap-6">
      {/* Alert Notices */}
      {successMsg && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-2xl flex items-center gap-2.5">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-2xl flex items-center gap-2.5">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-zinc-900 border border-white/5 p-24 rounded-3xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-[#dfc28c]" size={36} />
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Loading configurations...</span>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Navigation Tabs */}
          <div className="w-full lg:w-64 bg-zinc-900 border border-white/5 p-4 rounded-3xl flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-semibold tracking-wide transition-all whitespace-nowrap lg:whitespace-normal shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-[#dfc28c] text-[#020c1b]'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Area */}
          <form onSubmit={handleSubmit} className="flex-1 w-full bg-zinc-900 border border-white/5 rounded-3xl p-8 flex flex-col gap-8 shadow-md">
            
            {/* TAB 1: BRANDING & GENERAL */}
            {activeTab === 'branding' && (
              <div className="flex flex-col gap-6">
                <div className="pb-3 border-b border-white/5">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Branding & Office Details</h3>
                  <p className="text-[10px] text-zinc-500 mt-1">Manage global logos, office locations, hours, and map markers.</p>
                </div>
                
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Header/Footer Logo URL Path</label>
                    <ImageUploader
                      value={siteLogoUrl}
                      onChange={setSiteLogoUrl}
                      placeholder="/assets/images/edifice-logo.svg"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Business Operating Hours</label>
                    <input
                      type="text"
                      required
                      value={businessHours}
                      onChange={(e) => setBusinessHours(e.target.value)}
                      placeholder="Mon - Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM"
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Main Office Address Copy</label>
                    <textarea
                      required
                      value={officeAddress}
                      onChange={(e) => setOfficeAddress(e.target.value)}
                      rows={3}
                      placeholder="Plot 8, Kanjokya Street, Kololo, Kampala, Uganda."
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c] resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">P.O. Box Address Details</label>
                    <input
                      type="text"
                      required
                      value={poBox}
                      onChange={(e) => setPoBox(e.target.value)}
                      placeholder="P.O. Box 108048 Kampala Nakawa."
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Google Map Embed iframe Source URL</label>
                    <textarea
                      required
                      value={mapIframeUrl}
                      onChange={(e) => setMapIframeUrl(e.target.value)}
                      rows={3}
                      placeholder="https://www.google.com/maps/embed?..."
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONTACT CHANNELS */}
            {activeTab === 'contacts' && (
              <div className="flex flex-col gap-6">
                <div className="pb-3 border-b border-white/5">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Contact & Support Hotlines</h3>
                  <p className="text-[10px] text-zinc-500 mt-1">Configure desk telephones, support emails, and WhatsApp number.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Primary Hotline Phone</label>
                    <input
                      type="text"
                      required
                      value={phonePrimary}
                      onChange={(e) => setPhonePrimary(e.target.value)}
                      placeholder="+256786000112"
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">WhatsApp Number (No spaces or +)</label>
                    <input
                      type="text"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="256786000112"
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">General Inquiry Email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="edificepropertiesltd@gmail.com"
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Secondary hotline (Alt Phone 1)</label>
                    <input
                      type="text"
                      value={phoneAlt1}
                      onChange={(e) => setPhoneAlt1(e.target.value)}
                      placeholder="+256763700206"
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Sales Office desk (Alt Phone 2)</label>
                    <input
                      type="text"
                      value={phoneAlt2}
                      onChange={(e) => setPhoneAlt2(e.target.value)}
                      placeholder="+256766759416"
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Support desk (Alt Phone 3)</label>
                    <input
                      type="text"
                      value={phoneAlt3}
                      onChange={(e) => setPhoneAlt3(e.target.value)}
                      placeholder="+256709269168"
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Lead Specialist desk (Alt Phone 4)</label>
                    <input
                      type="text"
                      value={phoneAlt4}
                      onChange={(e) => setPhoneAlt4(e.target.value)}
                      placeholder="+256770833189"
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HOMEPAGE CONTENT */}
            {activeTab === 'homepage' && (
              <div className="flex flex-col gap-8">
                
                {/* Subsection: Top Banner */}
                <div className="flex flex-col gap-6">
                  <div className="pb-2 border-b border-white/5">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-white">Homepage Promo Banner</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Promo tag name</label>
                      <input
                        type="text"
                        required
                        value={homeExclusiveOfferBannerTag}
                        onChange={(e) => setHomeExclusiveOfferBannerTag(e.target.value)}
                        placeholder="Exclusive Portfolio Offer"
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Promo banner text</label>
                      <input
                        type="text"
                        required
                        value={homeExclusiveOfferBannerText}
                        onChange={(e) => setHomeExclusiveOfferBannerText(e.target.value)}
                        placeholder="Discount of up to 3% on specific suites..."
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                      />
                    </div>
                  </div>
                </div>

                {/* Subsection: Featured Headers */}
                <div className="flex flex-col gap-6">
                  <div className="pb-2 border-b border-white/5">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-white">Featured Properties Section Header</h4>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Section tag label</label>
                        <input
                          type="text"
                          required
                          value={homeFeaturedPropertiesTag}
                          onChange={(e) => setHomeFeaturedPropertiesTag(e.target.value)}
                          placeholder="Exclusive Portfolio"
                          className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Section Main Title</label>
                        <input
                          type="text"
                          required
                          value={homeFeaturedPropertiesTitle}
                          onChange={(e) => setHomeFeaturedPropertiesTitle(e.target.value)}
                          placeholder="Beyond shaping skylines, Edifice is shaping futures"
                          className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Section Description Paragraph</label>
                      <textarea
                        required
                        value={homeFeaturedPropertiesDesc}
                        onChange={(e) => setHomeFeaturedPropertiesDesc(e.target.value)}
                        rows={2}
                        placeholder="Dive into our world where architectural prowess meets natural design..."
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                      />
                    </div>
                  </div>
                </div>

                {/* Subsection: Identity & Pillars */}
                <div className="flex flex-col gap-6">
                  <div className="pb-2 border-b border-white/5">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-white">Identity & Mission Pillars</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Identity Section tag</label>
                      <input
                        type="text"
                        required
                        value={homeIdentityTag}
                        onChange={(e) => setHomeIdentityTag(e.target.value)}
                        placeholder="Our Identity"
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Identity Section Title</label>
                      <input
                        type="text"
                        required
                        value={homeIdentityTitle}
                        onChange={(e) => setHomeIdentityTitle(e.target.value)}
                        placeholder="Redefining urban spaces for future living"
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Identity description paragraph 1</label>
                    <textarea
                      required
                      value={homeIdentityDesc1}
                      onChange={(e) => setHomeIdentityDesc1(e.target.value)}
                      rows={3}
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Identity description paragraph 2</label>
                    <textarea
                      required
                      value={homeIdentityDesc2}
                      onChange={(e) => setHomeIdentityDesc2(e.target.value)}
                      rows={3}
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    />
                  </div>

                  {/* 4 Pillars inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="border border-white/5 p-4 rounded-2xl flex flex-col gap-4">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">Pillar 1 Content</span>
                      <input
                        type="text" required value={homePillar1Title} onChange={(e) => setHomePillar1Title(e.target.value)}
                        placeholder="Title" className="w-full bg-black/40 border border-white/5 px-3 py-2 rounded-xl text-xs"
                      />
                      <textarea
                        required value={homePillar1Desc} onChange={(e) => setHomePillar1Desc(e.target.value)}
                        placeholder="Description" rows={3} className="w-full bg-black/40 border border-white/5 px-3 py-2 rounded-xl text-xs resize-none"
                      />
                    </div>
                    <div className="border border-white/5 p-4 rounded-2xl flex flex-col gap-4">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">Pillar 2 Content</span>
                      <input
                        type="text" required value={homePillar2Title} onChange={(e) => setHomePillar2Title(e.target.value)}
                        placeholder="Title" className="w-full bg-black/40 border border-white/5 px-3 py-2 rounded-xl text-xs"
                      />
                      <textarea
                        required value={homePillar2Desc} onChange={(e) => setHomePillar2Desc(e.target.value)}
                        placeholder="Description" rows={3} className="w-full bg-black/40 border border-white/5 px-3 py-2 rounded-xl text-xs resize-none"
                      />
                    </div>
                    <div className="border border-white/5 p-4 rounded-2xl flex flex-col gap-4">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">Pillar 3 Content</span>
                      <input
                        type="text" required value={homePillar3Title} onChange={(e) => setHomePillar3Title(e.target.value)}
                        placeholder="Title" className="w-full bg-black/40 border border-white/5 px-3 py-2 rounded-xl text-xs"
                      />
                      <textarea
                        required value={homePillar3Desc} onChange={(e) => setHomePillar3Desc(e.target.value)}
                        placeholder="Description" rows={3} className="w-full bg-black/40 border border-white/5 px-3 py-2 rounded-xl text-xs resize-none"
                      />
                    </div>
                    <div className="border border-white/5 p-4 rounded-2xl flex flex-col gap-4">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">Pillar 4 Content</span>
                      <input
                        type="text" required value={homePillar4Title} onChange={(e) => setHomePillar4Title(e.target.value)}
                        placeholder="Title" className="w-full bg-black/40 border border-white/5 px-3 py-2 rounded-xl text-xs"
                      />
                      <textarea
                        required value={homePillar4Desc} onChange={(e) => setHomePillar4Desc(e.target.value)}
                        placeholder="Description" rows={3} className="w-full bg-black/40 border border-white/5 px-3 py-2 rounded-xl text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: LEADERSHIP & VIDEO */}
            {activeTab === 'leadership' && (
              <div className="flex flex-col gap-8">
                
                {/* Subsection: Cinematic video */}
                <div className="flex flex-col gap-6">
                  <div className="pb-3 border-b border-white/5">
                    <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Cinematic Video Walkthrough</h3>
                    <p className="text-[10px] text-zinc-500 mt-1">Configure video section overlay headers and thumbnail preview images.</p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Cinematic Video Section Title</label>
                        <input
                          type="text"
                          required
                          value={homeVideoTitle}
                          onChange={(e) => setHomeVideoTitle(e.target.value)}
                          placeholder="Horizon Residency & Edifice Property Developments"
                          className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Video YouTube URL</label>
                        <input
                          type="text"
                          required
                          value={youtubeHeroUrl}
                          onChange={(e) => setYoutubeHeroUrl(e.target.value)}
                          placeholder="https://youtu.be/LYgWq4vRT8c"
                          className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Cinematic Thumbnail Image URL Path</label>
                      <ImageUploader
                        value={homeVideoThumbnail}
                        onChange={setHomeVideoThumbnail}
                        placeholder="/assets/images/horizon.png"
                      />
                    </div>
                  </div>
                </div>

                {/* Subsection: Co-Founders details */}
                <div className="flex flex-col gap-6">
                  <div className="pb-3 border-b border-white/5">
                    <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Co-Founders & Leadership Messages</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Founder 1 */}
                    <div className="border border-white/5 p-6 rounded-2xl flex flex-col gap-4 bg-black/20">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">Co-Founder 1 (CEO) Details</span>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Full Name</label>
                        <input type="text" required value={cofounder1Name} onChange={(e) => setCofounder1Name(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Job Title / Designation</label>
                        <input type="text" required value={cofounder1Title} onChange={(e) => setCofounder1Title(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Portrait Image Path</label>
                        <ImageUploader
                          value={cofounder1Image}
                          onChange={setCofounder1Image}
                          placeholder="/assets/images/Mr.-abbas-Message-02-1.jpg"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Statement Quote Message</label>
                        <textarea required value={cofounder1Statement} onChange={(e) => setCofounder1Statement(e.target.value)} rows={6} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs resize-none" />
                      </div>
                    </div>

                    {/* Founder 2 */}
                    <div className="border border-white/5 p-6 rounded-2xl flex flex-col gap-4 bg-black/20">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">Co-Founder 2 (Director) Details</span>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Full Name</label>
                        <input type="text" required value={cofounder2Name} onChange={(e) => setCofounder2Name(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Job Title / Designation</label>
                        <input type="text" required value={cofounder2Title} onChange={(e) => setCofounder2Title(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Portrait Image Path</label>
                        <ImageUploader
                          value={cofounder2Image}
                          onChange={setCofounder2Image}
                          placeholder="/assets/images/WhatsApp-Image-2025-10-01-at-1.01.10-PM.jpeg"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-bold text-zinc-400">Statement Quote Message</label>
                        <textarea required value={cofounder2Statement} onChange={(e) => setCofounder2Statement(e.target.value)} rows={6} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs resize-none" />
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: HOMEPAGE TESTIMONIALS */}
            {activeTab === 'testimonials' && (
              <div className="flex flex-col gap-6">
                <div className="pb-3 border-b border-white/5">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Homeowner Testimonials</h3>
                  <p className="text-[10px] text-zinc-500 mt-1">Manage names, roles, and review contents for homepage feedback cards.</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {/* Testimonial 1 */}
                  <div className="border border-white/5 p-6 rounded-2xl flex flex-col gap-4 bg-black/20">
                    <span className="text-[10px] text-[#dfc28c] font-black uppercase">Testimonial card 1</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" required placeholder="Client Name" value={testimonial1Name} onChange={(e) => setTestimonial1Name(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs" />
                      <input type="text" required placeholder="Role / Location" value={testimonial1Role} onChange={(e) => setTestimonial1Role(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <textarea required placeholder="Feedback message content" value={testimonial1Text} onChange={(e) => setTestimonial1Text(e.target.value)} rows={3} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs resize-none" />
                  </div>

                  {/* Testimonial 2 */}
                  <div className="border border-white/5 p-6 rounded-2xl flex flex-col gap-4 bg-black/20">
                    <span className="text-[10px] text-[#dfc28c] font-black uppercase">Testimonial card 2</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" required placeholder="Client Name" value={testimonial2Name} onChange={(e) => setTestimonial2Name(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs" />
                      <input type="text" required placeholder="Role / Location" value={testimonial2Role} onChange={(e) => setTestimonial2Role(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <textarea required placeholder="Feedback message content" value={testimonial2Text} onChange={(e) => setTestimonial2Text(e.target.value)} rows={3} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs resize-none" />
                  </div>

                  {/* Testimonial 3 */}
                  <div className="border border-white/5 p-6 rounded-2xl flex flex-col gap-4 bg-black/20">
                    <span className="text-[10px] text-[#dfc28c] font-black uppercase">Testimonial card 3</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" required placeholder="Client Name" value={testimonial3Name} onChange={(e) => setTestimonial3Name(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs" />
                      <input type="text" required placeholder="Role / Location" value={testimonial3Role} onChange={(e) => setTestimonial3Role(e.target.value)} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <textarea required placeholder="Feedback message content" value={testimonial3Text} onChange={(e) => setTestimonial3Text(e.target.value)} rows={3} className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-xs resize-none" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: ABOUT US PAGE */}
            {activeTab === 'about' && (
              <div className="flex flex-col gap-8">
                
                {/* About Page Hero */}
                <div className="flex flex-col gap-6">
                  <div className="pb-2 border-b border-white/5">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-gold-500">About Us Page Hero Header</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Hero Section tag</label>
                      <input type="text" required value={aboutHeroTag} onChange={(e) => setAboutHeroTag(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Hero Title</label>
                      <input type="text" required value={aboutHeroTitle} onChange={(e) => setAboutHeroTitle(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Hero Subtitle / Description</label>
                    <textarea required value={aboutHeroDesc} onChange={(e) => setAboutHeroDesc(e.target.value)} rows={2} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs resize-none" />
                  </div>
                </div>

                {/* About Page Story */}
                <div className="flex flex-col gap-6">
                  <div className="pb-2 border-b border-white/5">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-gold-500">Who We Are & Story Details</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Story tag</label>
                      <input type="text" required value={aboutStoryTag} onChange={(e) => setAboutStoryTag(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Story Section Title</label>
                      <input type="text" required value={aboutStoryTitle} onChange={(e) => setAboutStoryTitle(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Story description paragraph 1</label>
                    <textarea required value={aboutStoryDesc1} onChange={(e) => setAboutStoryDesc1(e.target.value)} rows={3} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Story description paragraph 2</label>
                    <textarea required value={aboutStoryDesc2} onChange={(e) => setAboutStoryDesc2(e.target.value)} rows={3} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Story description paragraph 3</label>
                    <textarea required value={aboutStoryDesc3} onChange={(e) => setAboutStoryDesc3(e.target.value)} rows={3} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Coffee meeting quote callout</label>
                    <input type="text" required value={aboutStoryCoffeeQuote} onChange={(e) => setAboutStoryCoffeeQuote(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                  </div>
                </div>

                {/* Design Philosophy */}
                <div className="flex flex-col gap-6">
                  <div className="pb-2 border-b border-white/5">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-gold-500">Design Philosophy Image block</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Image Path URL</label>
                      <ImageUploader
                        value={aboutDesignPhilosophyImage}
                        onChange={setAboutDesignPhilosophyImage}
                        placeholder="/assets/images/horizon.png"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Philosophy block tag text</label>
                      <input type="text" required value={aboutDesignPhilosophyTitle} onChange={(e) => setAboutDesignPhilosophyTitle(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Philosophy Title Caption</label>
                      <input type="text" required value={aboutDesignPhilosophyCaption} onChange={(e) => setAboutDesignPhilosophyCaption(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                  </div>
                </div>

                {/* About Pillars */}
                <div className="flex flex-col gap-6">
                  <div className="pb-2 border-b border-white/5">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-gold-500">About Page 4 Key Pillars</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-white/5 p-4 rounded-2xl flex flex-col gap-4">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">About Pillar 1</span>
                      <input type="text" required value={aboutPillar1Title} onChange={(e) => setAboutPillar1Title(e.target.value)} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs" />
                      <textarea required value={aboutPillar1Desc} onChange={(e) => setAboutPillar1Desc(e.target.value)} rows={3} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs resize-none" />
                    </div>
                    <div className="border border-white/5 p-4 rounded-2xl flex flex-col gap-4">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">About Pillar 2</span>
                      <input type="text" required value={aboutPillar2Title} onChange={(e) => setAboutPillar2Title(e.target.value)} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs" />
                      <textarea required value={aboutPillar2Desc} onChange={(e) => setAboutPillar2Desc(e.target.value)} rows={3} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs resize-none" />
                    </div>
                    <div className="border border-white/5 p-4 rounded-2xl flex flex-col gap-4">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">About Pillar 3</span>
                      <input type="text" required value={aboutPillar3Title} onChange={(e) => setAboutPillar3Title(e.target.value)} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs" />
                      <textarea required value={aboutPillar3Desc} onChange={(e) => setAboutPillar3Desc(e.target.value)} rows={3} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs resize-none" />
                    </div>
                    <div className="border border-white/5 p-4 rounded-2xl flex flex-col gap-4">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">About Pillar 4</span>
                      <input type="text" required value={aboutPillar4Title} onChange={(e) => setAboutPillar4Title(e.target.value)} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs" />
                      <textarea required value={aboutPillar4Desc} onChange={(e) => setAboutPillar4Desc(e.target.value)} rows={3} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs resize-none" />
                    </div>
                  </div>
                </div>

                {/* About Mission & Sub-Items */}
                <div className="flex flex-col gap-6">
                  <div className="pb-2 border-b border-white/5">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-gold-500">Corporate Vision & Mission Points</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Mission Section Tag</label>
                      <input type="text" required value={aboutMissionTag} onChange={(e) => setAboutMissionTag(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Mission Section Title</label>
                      <input type="text" required value={aboutMissionTitle} onChange={(e) => setAboutMissionTitle(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Mission Section Description Summary</label>
                      <textarea required value={aboutMissionDesc} onChange={(e) => setAboutMissionDesc(e.target.value)} rows={2} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs resize-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="border border-white/5 p-4 rounded-2xl flex flex-col gap-4">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">Mission Point 1</span>
                      <input type="text" required value={aboutMissionItem1Title} onChange={(e) => setAboutMissionItem1Title(e.target.value)} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs" />
                      <textarea required value={aboutMissionItem1Desc} onChange={(e) => setAboutMissionItem1Desc(e.target.value)} rows={3} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs resize-none" />
                    </div>
                    <div className="border border-white/5 p-4 rounded-2xl flex flex-col gap-4">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">Mission Point 2</span>
                      <input type="text" required value={aboutMissionItem2Title} onChange={(e) => setAboutMissionItem2Title(e.target.value)} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs" />
                      <textarea required value={aboutMissionItem2Desc} onChange={(e) => setAboutMissionItem2Desc(e.target.value)} rows={3} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs resize-none" />
                    </div>
                    <div className="border border-white/5 p-4 rounded-2xl flex flex-col gap-4">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">Mission Point 3</span>
                      <input type="text" required value={aboutMissionItem3Title} onChange={(e) => setAboutMissionItem3Title(e.target.value)} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs" />
                      <textarea required value={aboutMissionItem3Desc} onChange={(e) => setAboutMissionItem3Desc(e.target.value)} rows={3} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs resize-none" />
                    </div>
                    <div className="border border-white/5 p-4 rounded-2xl flex flex-col gap-4">
                      <span className="text-[10px] text-[#dfc28c] font-black uppercase">Mission Point 4</span>
                      <input type="text" required value={aboutMissionItem4Title} onChange={(e) => setAboutMissionItem4Title(e.target.value)} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs" />
                      <textarea required value={aboutMissionItem4Desc} onChange={(e) => setAboutMissionItem4Desc(e.target.value)} rows={3} className="w-full bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl text-xs resize-none" />
                    </div>
                  </div>
                </div>

                {/* About Global Standards */}
                <div className="flex flex-col gap-6">
                  <div className="pb-2 border-b border-white/5">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-gold-500">Global Standards section</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Section Tag</label>
                      <input type="text" required value={aboutGlobalTag} onChange={(e) => setAboutGlobalTag(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Section Title</label>
                      <input type="text" required value={aboutGlobalTitle} onChange={(e) => setAboutGlobalTitle(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Paragraph 1 description</label>
                      <textarea required value={aboutGlobalDesc1} onChange={(e) => setAboutGlobalDesc1(e.target.value)} rows={3} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Paragraph 2 description</label>
                      <textarea required value={aboutGlobalDesc2} onChange={(e) => setAboutGlobalDesc2(e.target.value)} rows={3} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Sidebar CTA widget Title</label>
                      <input type="text" required value={aboutGlobalCtaTitle} onChange={(e) => setAboutGlobalCtaTitle(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Sidebar CTA widget Description</label>
                      <textarea required value={aboutGlobalCtaDesc} onChange={(e) => setAboutGlobalCtaDesc(e.target.value)} rows={2} className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs" />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-6 py-3.5 bg-[#dfc28c] hover:bg-[#d4af37] disabled:opacity-50 text-[#020c1b] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                <span>Save Configurations</span>
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={
      <div className="bg-zinc-950 p-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#dfc28c]" size={36} />
        <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Loading configurations...</span>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
