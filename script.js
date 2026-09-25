(() => {
  const $ = (s) => document.querySelector(s);
  const key = new URLSearchParams(location.search).get('invite');
  const config = window.INVITATIONS[key];
  if (!config) { $('#gallery').hidden = false; return; }
  document.body.className = config.theme;
  $('#invitation').hidden = false;
  $('#demo').hidden = !config.demo;
  const names = `${config.groom} و ${config.bride}`;
  document.title = `${names} — دعوة زفاف`;
  document.querySelectorAll('.names').forEach(el => el.textContent = names);
  document.querySelectorAll('.seal').forEach(el => el.textContent = config.initials);
  const date = new Date(config.date);
  const dateLabel = new Intl.DateTimeFormat('ar-IQ', { timeZone: config.timezone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  ['.cover-date', '.hero-date', '.event-date'].forEach(s => $(s).textContent = dateLabel);
  $('.event-time').textContent = 'الساعة ' + new Intl.DateTimeFormat('ar-IQ', {timeZone: config.timezone, hour: 'numeric', minute: '2-digit'}).format(date) + ' · بتوقيت العراق';
  $('#groom-family').textContent = config.families[0];
  $('#bride-family').textContent = config.families[1];
  $('#venue').textContent = config.venue;
  $('#city').textContent = config.city;
  $('#map').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(config.mapQuery);
  const music = $('#music');
  music.volume = 0.5;
  const audioState = () => {
    const playing = !music.paused;
    $('#music-toggle').setAttribute('aria-pressed', String(playing));
    $('#music-toggle').setAttribute('aria-label', playing ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى');
    $('#music-toggle span').textContent = playing ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى';
  };
  ['play', 'pause', 'error'].forEach(type => music.addEventListener(type, audioState));
  $('#music-toggle').addEventListener('click', () => { if (music.paused) music.play().catch(audioState); else music.pause(); });
  let opened = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function open() {
    if (opened) return;
    opened = true;
    $('#open').classList.add('opened');
    $('#open').disabled = true;
    $('#open-text').disabled = true;
    music.play().catch(audioState);
    setTimeout(() => {
      $('#cover').hidden = true;
      $('#content').hidden = false;
      $('#content-heading').focus({preventScroll: true});
      window.scrollTo(0, 0);
      if (!reduced) {
        for (let i = 0; i < 28; i++) {
          const particle = document.createElement('span'); particle.className = 'confetti';
          particle.style.cssText = `left:${Math.random()*100}%;animation-delay:${Math.random()*0.5}s;--drift:${Math.random()*160-80}px`;
          particle.setAttribute('aria-hidden', 'true'); document.body.append(particle);
          setTimeout(() => particle.remove(), 3500);
        }
      }
    }, reduced ? 0 : 950);
  }
  $('#open').addEventListener('click', open);
  $('#open-text').addEventListener('click', open);
  function tick() {
    const remaining = Math.max(0, Math.floor((date.getTime() - Date.now())/1000));
    const values = [Math.floor(remaining/86400), Math.floor(remaining/3600)%24, Math.floor(remaining/60)%60, remaining%60];
    ['days','hours','minutes','seconds'].forEach((id,i) => $('#'+id).textContent = String(values[i]).padStart(2,'0'));
    if (remaining === 0) $('#countdown-title').textContent = 'حان موعد فرحتنا';
    return remaining;
  }
  if (tick() > 0) { const timer = setInterval(() => {if (!tick()) clearInterval(timer);},1000); }
})();
