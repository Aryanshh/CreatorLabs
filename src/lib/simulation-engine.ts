// Creator Labs Algorithm Simulation Engine
// Simulates social media platform algorithms with weighted scoring

export interface PostInput {
  platform: string;
  contentType: string;
  body: string;
  title?: string;
  hashtags: string[];
  keywords: string[];
  scheduledFor?: string;
  seoTitle?: string;
  seoDescription?: string;
  userLevel: number;
}

export interface SimulationResult {
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: number;
  viralityScore: number;
  algorithmFactors: Record<string, { score: number; weight: number; feedback: string }>;
  recommendations: string[];
  timeline: { hour: number; impressions: number; likes: number; comments: number }[];
}

const PLATFORM_ALGORITHMS: Record<string, Record<string, number>> = {
  INSTAGRAM: {
    content_quality: 0.25, caption_engagement: 0.15, hashtag_relevance: 0.15,
    posting_time: 0.10, content_type_boost: 0.10, trend_alignment: 0.10,
    seo_optimization: 0.05, account_authority: 0.10,
  },
  TWITTER: {
    text_quality: 0.20, hook_strength: 0.20, thread_structure: 0.10,
    hashtag_relevance: 0.10, trend_alignment: 0.15, posting_time: 0.10,
    engagement_bait: 0.05, account_authority: 0.10,
  },
  TIKTOK: {
    hook_first_3sec: 0.25, content_quality: 0.20, trend_sound_usage: 0.15,
    hashtag_strategy: 0.10, watch_time_prediction: 0.15, posting_time: 0.05,
    account_authority: 0.10,
  },
  YOUTUBE: {
    title_ctr: 0.20, content_quality: 0.20, seo_optimization: 0.15,
    watch_time: 0.15, engagement_signals: 0.10, posting_time: 0.05,
    trend_alignment: 0.05, account_authority: 0.10,
  },
  LINKEDIN: {
    professional_value: 0.25, text_quality: 0.20, engagement_hooks: 0.15,
    hashtag_relevance: 0.10, posting_time: 0.10, content_type_boost: 0.10,
    account_authority: 0.10,
  },
  THREADS: {
    text_quality: 0.25, hook_strength: 0.20, conversation_starter: 0.15,
    trend_alignment: 0.15, posting_time: 0.10, hashtag_relevance: 0.05,
    account_authority: 0.10,
  },
};

const ENGAGEMENT_WORDS = ['you', 'your', 'free', 'new', 'how', 'why', 'best', 'top', 'guide', 'tips', 'secret', 'amazing', 'proven', 'exclusive', 'limited'];
const CTA_PATTERNS = ['comment', 'share', 'like', 'follow', 'save', 'click', 'link', 'dm', 'check out', 'tag', 'tell me', 'what do you think', 'agree?', 'thoughts?'];
const BANNED_HASHTAGS = ['followforfollow', 'f4f', 'likeforlike', 'l4l', 'instagood', 'photooftheday'];

function analyzeTextQuality(body: string): { score: number; feedback: string } {
  let score = 0.5;
  const wordCount = body.split(/\s+/).length;
  if (wordCount >= 20 && wordCount <= 300) score += 0.2;
  else if (wordCount < 10) score -= 0.2;
  const engagementCount = ENGAGEMENT_WORDS.filter(w => body.toLowerCase().includes(w)).length;
  score += Math.min(engagementCount * 0.05, 0.2);
  const sentences = body.split(/[.!?]+/).filter(s => s.trim());
  if (sentences.length >= 3) score += 0.1;
  return { score: Math.min(Math.max(score, 0.1), 1.0), feedback: score > 0.7 ? 'Strong, engaging copy' : score > 0.4 ? 'Decent text, could use more hooks' : 'Text needs improvement — add hooks and calls to action' };
}

function analyzeHookStrength(body: string): { score: number; feedback: string } {
  const firstLine = body.split('\n')[0] || body.substring(0, 100);
  let score = 0.4;
  if (firstLine.endsWith('?')) score += 0.2;
  if (firstLine.length < 80) score += 0.1;
  const hookWords = ['stop', 'wait', 'breaking', 'attention', 'secret', 'nobody', 'most people', 'here\'s why', 'unpopular opinion'];
  if (hookWords.some(w => firstLine.toLowerCase().includes(w))) score += 0.2;
  if (/\d/.test(firstLine)) score += 0.1;
  return { score: Math.min(score, 1.0), feedback: score > 0.7 ? 'Great hook! Will stop scrollers' : 'Hook could be stronger — try a question or bold statement' };
}

function analyzeHashtags(hashtags: string[], platform: string): { score: number; feedback: string } {
  if (hashtags.length === 0) return { score: 0.2, feedback: 'No hashtags — add relevant ones for discoverability' };
  let score = 0.5;
  const hasBanned = hashtags.some(h => BANNED_HASHTAGS.includes(h.toLowerCase().replace('#', '')));
  if (hasBanned) score -= 0.3;
  const optimalCounts: Record<string, [number, number]> = { INSTAGRAM: [5, 15], TWITTER: [1, 3], TIKTOK: [3, 7], YOUTUBE: [5, 10], LINKEDIN: [3, 5], THREADS: [1, 3] };
  const [min, max] = optimalCounts[platform] || [3, 10];
  if (hashtags.length >= min && hashtags.length <= max) score += 0.3;
  else if (hashtags.length > max) score -= 0.1;
  const avgLen = hashtags.reduce((a, h) => a + h.length, 0) / hashtags.length;
  if (avgLen > 5 && avgLen < 25) score += 0.1;
  return { score: Math.min(Math.max(score, 0.1), 1.0), feedback: hasBanned ? 'Remove flagged or spammy hashtags' : score > 0.7 ? 'Solid hashtag strategy' : `Use ${min}-${max} targeted hashtags for ${platform}` };
}

function analyzeSEO(title?: string, description?: string, keywords: string[] = []): { score: number; feedback: string } {
  let score = 0.3;
  if (title && title.length > 10 && title.length < 70) score += 0.25;
  if (description && description.length > 50 && description.length < 160) score += 0.25;
  if (keywords.length >= 3) score += 0.2;
  return { score: Math.min(score, 1.0), feedback: score > 0.7 ? 'SEO well optimized' : 'Add a clear title, description, and target keywords' };
}

function analyzePostingTime(scheduledFor?: string): { score: number; feedback: string } {
  if (!scheduledFor) return { score: 0.5, feedback: 'No posting time set — peak hours are 9-11 AM and 7-9 PM' };
  const hour = new Date(scheduledFor).getHours();
  const peakHours = [9, 10, 11, 12, 17, 18, 19, 20, 21];
  if (peakHours.includes(hour)) return { score: 0.9, feedback: 'Great timing! This is a peak engagement hour' };
  if (hour >= 6 && hour <= 22) return { score: 0.6, feedback: 'Decent timing, but peak hours perform better' };
  return { score: 0.3, feedback: 'Off-peak hours — consider posting between 9-11 AM or 7-9 PM' };
}

function analyzeContentType(contentType: string, platform: string): { score: number; feedback: string } {
  const boosts: Record<string, Record<string, number>> = {
    INSTAGRAM: { REEL: 1.0, CAROUSEL: 0.85, STORY: 0.7, IMAGE: 0.6, TEXT: 0.3 },
    TWITTER: { THREAD: 0.9, TEXT: 0.8, IMAGE: 0.7, VIDEO: 0.75 },
    TIKTOK: { VIDEO: 1.0, REEL: 0.9 },
    YOUTUBE: { VIDEO: 1.0, TEXT: 0.2 },
    LINKEDIN: { TEXT: 0.8, CAROUSEL: 0.9, IMAGE: 0.7, VIDEO: 0.75 },
    THREADS: { TEXT: 0.85, IMAGE: 0.75, THREAD: 0.9 },
  };
  const score = boosts[platform]?.[contentType] ?? 0.5;
  return { score, feedback: score > 0.8 ? `${contentType} performs great on ${platform}!` : `Consider switching to a higher-performing format on ${platform}` };
}

function analyzeCTA(body: string): { score: number; feedback: string } {
  const ctaCount = CTA_PATTERNS.filter(p => body.toLowerCase().includes(p)).length;
  const score = Math.min(0.3 + ctaCount * 0.15, 1.0);
  return { score, feedback: ctaCount > 0 ? `Found ${ctaCount} CTA(s) — good engagement drivers` : 'Add a call-to-action to boost engagement' };
}

function estimateFollowers(level: number): number {
  const bases = [100, 300, 800, 2000, 5000, 10000, 25000, 50000, 100000, 200000];
  const idx = Math.min(Math.floor(level / 5), bases.length - 1);
  return bases[idx] + (level * 50);
}

function generateTimeline(predictions: { impressions: number; likes: number; comments: number }, platform: string): { hour: number; impressions: number; likes: number; comments: number }[] {
  const timeline: { hour: number; impressions: number; likes: number; comments: number }[] = [];
  const peakFactors: Record<string, number[]> = {
    INSTAGRAM: [0.02, 0.01, 0.01, 0.01, 0.01, 0.02, 0.03, 0.05, 0.08, 0.10, 0.09, 0.07, 0.06, 0.05, 0.04, 0.04, 0.03, 0.04, 0.05, 0.06, 0.05, 0.04, 0.03, 0.02],
    DEFAULT: [0.02, 0.01, 0.01, 0.01, 0.01, 0.02, 0.03, 0.04, 0.07, 0.09, 0.08, 0.07, 0.06, 0.05, 0.05, 0.04, 0.04, 0.05, 0.06, 0.07, 0.05, 0.04, 0.03, 0.02],
  };
  const factors = peakFactors[platform] || peakFactors.DEFAULT;
  for (let h = 0; h < 24; h++) {
    const f = factors[h] * (0.85 + Math.random() * 0.3);
    timeline.push({
      hour: h,
      impressions: Math.round(predictions.impressions * f),
      likes: Math.round(predictions.likes * f),
      comments: Math.round(predictions.comments * f),
    });
  }
  return timeline;
}

export function runSimulation(input: PostInput): SimulationResult {
  const weights = PLATFORM_ALGORITHMS[input.platform] || PLATFORM_ALGORITHMS.INSTAGRAM;
  const factors: Record<string, { score: number; weight: number; feedback: string }> = {};

  // Run all analyzers
  const textResult = analyzeTextQuality(input.body);
  const hookResult = analyzeHookStrength(input.body);
  const hashtagResult = analyzeHashtags(input.hashtags, input.platform);
  const seoResult = analyzeSEO(input.seoTitle, input.seoDescription, input.keywords);
  const timingResult = analyzePostingTime(input.scheduledFor);
  const typeResult = analyzeContentType(input.contentType, input.platform);
  const ctaResult = analyzeCTA(input.body);
  const authorityScore = Math.min(0.3 + (input.userLevel * 0.014), 1.0);

  // Map to platform-specific algorithm factors
  const analyzerMap: Record<string, { score: number; feedback: string }> = {
    content_quality: textResult, text_quality: textResult, caption_engagement: ctaResult,
    hook_strength: hookResult, hook_first_3sec: hookResult, hashtag_relevance: hashtagResult,
    hashtag_strategy: hashtagResult, posting_time: timingResult, content_type_boost: typeResult,
    trend_alignment: { score: 0.4 + Math.random() * 0.4, feedback: 'Trend alignment is subject to current platform trends' },
    seo_optimization: seoResult, account_authority: { score: authorityScore, feedback: `Account authority based on level ${input.userLevel}` },
    thread_structure: textResult, engagement_bait: ctaResult, trend_sound_usage: { score: 0.3 + Math.random() * 0.5, feedback: 'Consider incorporating trending audio' },
    watch_time_prediction: { score: textResult.score * 0.8 + hookResult.score * 0.2, feedback: 'Watch time is influenced by hook strength and content quality' },
    watch_time: { score: textResult.score * 0.8, feedback: 'Aim for high watch-through rates' },
    title_ctr: hookResult, engagement_signals: ctaResult, professional_value: textResult,
    engagement_hooks: ctaResult, conversation_starter: hookResult,
  };

  let totalScore = 0;
  for (const [factor, weight] of Object.entries(weights)) {
    const analysis = analyzerMap[factor] || { score: 0.5, feedback: 'N/A' };
    factors[factor] = { score: Math.round(analysis.score * 100) / 100, weight, feedback: analysis.feedback };
    totalScore += analysis.score * weight;
  }

  // Generate engagement predictions
  const followers = estimateFollowers(input.userLevel);
  const variance = 0.85 + Math.random() * 0.3;
  const baseRates: Record<string, Record<string, number>> = {
    INSTAGRAM: { impression: 0.6, reach: 0.7, like: 0.04, comment: 0.008, share: 0.005, save: 0.01 },
    TWITTER: { impression: 0.8, reach: 0.5, like: 0.03, comment: 0.01, share: 0.015, save: 0.003 },
    TIKTOK: { impression: 2.0, reach: 0.6, like: 0.06, comment: 0.012, share: 0.02, save: 0.015 },
    YOUTUBE: { impression: 0.5, reach: 0.8, like: 0.035, comment: 0.005, share: 0.008, save: 0.012 },
    LINKEDIN: { impression: 0.4, reach: 0.65, like: 0.03, comment: 0.015, share: 0.01, save: 0.008 },
    THREADS: { impression: 0.5, reach: 0.55, like: 0.035, comment: 0.012, share: 0.01, save: 0.005 },
  };
  const rates = baseRates[input.platform] || baseRates.INSTAGRAM;

  const impressions = Math.round(followers * rates.impression * totalScore * variance);
  const reach = Math.round(impressions * rates.reach);
  const likes = Math.round(reach * rates.like * totalScore);
  const comments = Math.round(likes * rates.comment * totalScore * 10);
  const shares = Math.round(likes * rates.share * Math.pow(totalScore, 1.5) * 10);
  const saves = Math.round(likes * rates.save * totalScore * 10);
  const engagementRate = reach > 0 ? Math.round(((likes + comments + shares + saves) / reach) * 10000) / 100 : 0;
  const viralityScore = Math.min(100, Math.round(totalScore * 100 * (1 + shares / Math.max(likes, 1))));

  // Generate recommendations
  const recommendations: string[] = [];
  const sortedFactors = Object.entries(factors).sort((a, b) => a[1].score - b[1].score);
  for (const [name, data] of sortedFactors.slice(0, 3)) {
    if (data.score < 0.7) recommendations.push(`Improve ${name.replace(/_/g, ' ')}: ${data.feedback}`);
  }
  if (recommendations.length === 0) recommendations.push('Excellent post! Keep up the great content strategy.');

  const timeline = generateTimeline({ impressions, likes, comments }, input.platform);

  return { impressions, reach, likes, comments, shares, saves, engagementRate, viralityScore, algorithmFactors: factors, recommendations, timeline };
}
