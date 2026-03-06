const ICON_MAP: Record<string, string> = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

export function getWeatherEmoji(iconCode: string): string {
  return ICON_MAP[iconCode] || '🌤️';
}

export function getWeatherAdvice(description: string, temp: number): string {
  const desc = description.toLowerCase();
  if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('thunderstorm')) {
    return `Currently ${Math.round(temp)}C and ${description}. Suggest indoor activities, museums, cafes, and covered markets.`;
  }
  if (temp > 35) {
    return `Currently ${Math.round(temp)}C and ${description}. Very hot — suggest beaches, pools, air-conditioned venues. Remind about sunscreen and hydration.`;
  }
  if (temp > 28) {
    return `Currently ${Math.round(temp)}C and ${description}. Warm — suggest outdoor activities, beaches, parks. Mention sunscreen.`;
  }
  if (temp < 10) {
    return `Currently ${Math.round(temp)}C and ${description}. Cold — suggest warm indoor spots, cozy cafes, heated venues.`;
  }
  return `Currently ${Math.round(temp)}C and ${description}. Pleasant weather for exploring outdoors.`;
}
