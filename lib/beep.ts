"use client";

/** Play a short alarm using Web Audio (no audio files needed). */
export function beep(times = 3) {
  try {
    const ac = new AudioContext();
    for (let i = 0; i < times; i++) {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      const t = ac.currentTime + i * 0.45;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + 0.4);
    }
    setTimeout(() => ac.close(), times * 450 + 200);
  } catch {}
}

export function notify(title: string, body: string) {
  try {
    if ("Notification" in window && Notification.permission === "granted" && document.hidden) new Notification(title, { body });
  } catch {}
}

export const mmss = (sec: number) => {
  const s = Math.max(0, Math.ceil(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return (h ? `${h}:${String(m).padStart(2, "0")}` : String(m).padStart(2, "0")) + ":" + String(r).padStart(2, "0");
};
