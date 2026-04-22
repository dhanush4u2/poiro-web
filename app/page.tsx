import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ScrollCardSplitSection from "@/components/ScrollCardSplitSection";
import StorytellingSection from "@/components/StorytellingSection";
import LayerByLayer from "@/components/LayerByLayer";
import OperatingSystemSection from "@/components/OperatingSystemSection";
import VideoScrub from "@/components/VideoScrub";
import MasonryGallerySection from "@/components/MasonryGallerySection";
import SendIdea from "@/components/SendIdea";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Sticky so Hero stays pinned while About card slides over it */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 0 }}>
        <Hero />
      </div>
      <AboutSection />
      <ScrollCardSplitSection />
      <StorytellingSection />
      <LayerByLayer />
      <OperatingSystemSection />
      <VideoScrub />
      <MasonryGallerySection />
      <SendIdea />
      <Footer />
    </>
  );
}
