import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ChatRequestForm from "@/components/landing/ChatRequestForm";
import WaitingRoom from "@/components/landing/WaitingRoom";
import FooterSection from "@/components/landing/FooterSection";

export default function Home() {
  const [topics, setTopics] = useState([]);
  const [chatSession, setChatSession] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    base44.entities.Topic.filter({ is_active: true }).then(setTopics);
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById("chat-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitChat = async (formData) => {
    setIsSubmitting(true);
    const waitingSessions = await base44.entities.ChatSession.filter({ status: "waiting" });
    const queuePosition = waitingSessions.length + 1;
    const selectedTopic = topics.find(t => t.id === formData.topic_id);
    const estimatedWait = Math.min((selectedTopic?.avg_wait_minutes || 3) * queuePosition, 30);

    const session = await base44.entities.ChatSession.create({
      ...formData,
      status: "waiting",
      queue_position: queuePosition,
      estimated_wait_minutes: estimatedWait,
    });
    setChatSession(session);
    setIsSubmitting(false);
  };

  return (
    <div dir="rtl">
      <HeroSection onStartChat={scrollToForm} />
      <FeaturesSection />
      {chatSession ? (
        <WaitingRoom session={chatSession} onCancel={() => setChatSession(null)} />
      ) : (
        <ChatRequestForm topics={topics} onSubmit={handleSubmitChat} isLoading={isSubmitting} />
      )}
      <FooterSection />
    </div>
  );
}