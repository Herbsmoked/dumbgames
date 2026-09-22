export class GameAudio {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  sfx: GainNode | null = null;
  music: GainNode | null = null;
  muted = false;
  sfxVol = 0.8;
  musicVol = 0.35;
  private drone: OscillatorNode | null = null;
  private drone2: OscillatorNode | null = null;

  unlock() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx({ latencyHint: "interactive" });
      this.master = this.ctx.createGain();
      this.sfx = this.ctx.createGain();
      this.music = this.ctx.createGain();
      this.sfx.connect(this.master);
      this.music.connect(this.master);
      this.master.connect(this.ctx.destination);
      this.apply();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  apply() {
    if (!this.master || !this.sfx || !this.music || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(this.muted ? 0 : 1, t, 0.03);
    this.sfx.gain.setTargetAtTime(this.sfxVol * this.sfxVol, t, 0.03);
    this.music.gain.setTargetAtTime(this.musicVol * this.musicVol, t, 0.03);
  }

  hit(crit = false) {
    this.noise(0.05, crit ? 0.35 : 0.22, crit ? 900 : 280, crit ? 0.08 : 0.05);
    this.tone(crit ? 520 : 180, crit ? 0.12 : 0.07, "square", crit ? 0.08 : 0.05);
  }

  swing() {
    this.noise(0.04, 0.12, 700, 0.06);
  }

  death() {
    this.noise(0.18, 0.4, 140, 0.16);
    this.tone(90, 0.2, "sawtooth", 0.12);
  }

  legendary() {
    this.tone(220, 0.45, "sine", 0.12);
    this.tone(330, 0.5, "sine", 0.1);
    this.tone(440, 0.55, "sine", 0.08);
    this.tone(554, 0.7, "sine", 0.07);
  }

  potion() {
    this.tone(320, 0.15, "sine", 0.06);
    this.tone(480, 0.18, "sine", 0.05);
  }

  pickup() {
    this.tone(660, 0.08, "square", 0.04);
  }

  rift() {
    this.tone(55, 0.6, "sawtooth", 0.16);
    this.noise(0.3, 0.25, 80, 0.2);
  }

  ui() {
    this.tone(420, 0.05, "square", 0.03);
  }

  startDrone(hell = false) {
    this.stopDrone();
    if (!this.ctx || !this.music) return;
    const o = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    g.gain.value = 0.04;
    o.type = "sine";
    o2.type = "sine";
    o.frequency.value = hell ? 46 : 58;
    o2.frequency.value = hell ? 92.2 : 87.5;
    o.connect(g);
    o2.connect(g);
    g.connect(this.music);
    o.start();
    o2.start();
    this.drone = o;
    this.drone2 = o2;
  }

  stopDrone() {
    try {
      this.drone?.stop();
      this.drone2?.stop();
    } catch {
      /* already stopped */
    }
    this.drone = null;
    this.drone2 = null;
  }

  private tone(freq: number, dur: number, type: OscillatorType, vol: number) {
    if (!this.ctx || !this.sfx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq * (0.96 + Math.random() * 0.08);
    g.gain.setValueAtTime(vol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
    o.connect(g);
    g.connect(this.sfx);
    o.start();
    o.stop(this.ctx.currentTime + dur + 0.02);
  }

  private noise(dur: number, vol: number, hp: number, release: number) {
    if (!this.ctx || !this.sfx) return;
    const n = this.ctx.sampleRate * dur;
    const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = hp;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + release);
    src.connect(f);
    f.connect(g);
    g.connect(this.sfx);
    src.start();
  }
}
