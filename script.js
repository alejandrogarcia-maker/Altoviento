// ═══ REVEALS ═══
const allReveals=document.querySelectorAll('.reveal,.scale-in,.slide-left,.slide-right');
const revealObs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');revealObs.unobserve(x.target)}})},{threshold:0.1,rootMargin:'0px 0px -30px 0px'});
allReveals.forEach(el=>revealObs.observe(el));

// ═══ NAV + PROGRESS BAR ═══
const navEl=document.querySelector('nav');
const progressBar=document.getElementById('progressBar');
const sections=document.querySelectorAll('section[id]');
const keyHint=document.getElementById('keyHint');

window.addEventListener('scroll',()=>{
  const y=window.pageYOffset;
  // Nav shadow
  navEl.classList.toggle('scrolled',y>50);
  // Hide key hint after scrolling
  if(y>200&&keyHint)keyHint.classList.add('hidden');
  // Progress bar
  const h=document.documentElement.scrollHeight-window.innerHeight;
  if(progressBar)progressBar.style.width=(y/h*100)+'%';
  // Active nav links
  const scrollY=y+100;
  sections.forEach(s=>{
    const link=document.querySelector('.nav-links a[href="#'+s.id+'"]');
    if(link)link.classList.toggle('active',scrollY>=s.offsetTop&&scrollY<s.offsetTop+s.offsetHeight);
  });
});

// ═══ CUSTOM CURSOR ═══
const dot=document.getElementById('cursorDot');
const ring=document.getElementById('cursorRing');
const glow=document.getElementById('cursorGlow');
let mouseX=0,mouseY=0,dotX=0,dotY=0,ringX=0,ringY=0;

document.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY});

function animateCursor(){
  dotX+=(mouseX-dotX)*0.2;dotY+=(mouseY-dotY)*0.2;
  ringX+=(mouseX-ringX)*0.1;ringY+=(mouseY-ringY)*0.1;
  if(dot){dot.style.left=dotX-4+'px';dot.style.top=dotY-4+'px'}
  if(ring){ring.style.left=ringX+'px';ring.style.top=ringY+'px'}
  if(glow){glow.style.left=mouseX+'px';glow.style.top=mouseY+'px'}
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effect on interactive elements
document.querySelectorAll('a,button,.faq-item,.how-card,.provide-card,.aud-card,.sp-card,.showcase-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring&&ring.classList.add('hovering'));
  el.addEventListener('mouseleave',()=>ring&&ring.classList.remove('hovering'));
});

// ═══ MOUSE PARALLAX ═══
document.addEventListener('mousemove',e=>{
  const cx=window.innerWidth/2;const cy=window.innerHeight/2;
  const dx=(e.clientX-cx)/cx;const dy=(e.clientY-cy)/cy;
  document.querySelectorAll('.mouse-parallax').forEach(el=>{
    const speed=parseFloat(el.dataset.speed)||1;
    el.style.transform=`translate(${dx*speed*15}px,${dy*speed*10}px)`;
  });
});

// ═══ HERO PARTICLE SYSTEM ═══
const canvas=document.getElementById('hero-particles');
if(canvas){
  const ctx=canvas.getContext('2d');
  let particles=[];let heroRect;
  const colors=['rgba(0,150,200,0.15)','rgba(93,185,99,0.12)','rgba(115,201,45,0.1)','rgba(184,232,245,0.2)'];

  function resizeCanvas(){
    const hero=document.querySelector('.hero');
    if(!hero)return;
    heroRect=hero.getBoundingClientRect();
    canvas.width=heroRect.width;canvas.height=heroRect.height;
  }
  resizeCanvas();window.addEventListener('resize',resizeCanvas);

  class Particle{
    constructor(){this.reset()}
    reset(){
      this.x=Math.random()*canvas.width;this.y=Math.random()*canvas.height;
      this.size=Math.random()*3+1;this.speedX=(Math.random()-0.5)*0.5;this.speedY=(Math.random()-0.5)*0.3-0.2;
      this.opacity=Math.random()*0.5+0.1;this.color=colors[Math.floor(Math.random()*colors.length)];
      this.life=Math.random()*200+100;this.maxLife=this.life;
    }
    update(mx,my){
      this.x+=this.speedX;this.y+=this.speedY;this.life--;
      // Mouse repulsion
      if(mx&&my){
        const dx=this.x-mx;const dy=this.y-my;const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<150){const force=(150-dist)/150*0.8;this.x+=dx/dist*force;this.y+=dy/dist*force}
      }
      if(this.life<=0||this.x<-20||this.x>canvas.width+20||this.y<-20)this.reset();
    }
    draw(){
      const fade=Math.min(this.life/30,1,(this.maxLife-this.life)/30);
      ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fillStyle=this.color.replace(/[\d.]+\)$/,fade*this.opacity+')');ctx.fill();
    }
  }

  for(let i=0;i<80;i++)particles.push(new Particle());
  let heroMouseX=0,heroMouseY=0;
  document.querySelector('.hero').addEventListener('mousemove',e=>{
    const r=canvas.getBoundingClientRect();heroMouseX=e.clientX-r.left;heroMouseY=e.clientY-r.top;
  });

  function animateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{p.update(heroMouseX,heroMouseY);p.draw()});
    // Draw connections
    for(let i=0;i<particles.length;i++){for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x;const dy=particles[i].y-particles[j].y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<100){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle='rgba(0,150,200,'+(0.03*(1-dist/100))+')';ctx.lineWidth=0.5;ctx.stroke()}
    }}
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ═══ ANIMATED COUNTERS ═══
function animateCounter(el,target,suffix,duration,prefix){
  prefix=prefix||'';let start=0;
  const step=ts=>{if(!start)start=ts;const p=Math.min((ts-start)/duration,1);const e=1-Math.pow(1-p,3);
  el.textContent=prefix+Math.floor(e*target)+suffix;if(p<1)requestAnimationFrame(step)};
  requestAnimationFrame(step);
}
const metricObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){
  e.target.querySelectorAll('.metric-num').forEach(n=>{
    const t=n.dataset.target,s=n.dataset.suffix||'',pf=n.dataset.prefix||'';
    if(t&&!isNaN(t))animateCounter(n,parseInt(t),s,1800,pf);
    else{n.style.opacity='0';n.style.transform='translateY(20px)';n.style.transition='all 0.6s';
    setTimeout(()=>{n.style.opacity='1';n.style.transform='translateY(0)'},200)}
  });metricObs.unobserve(e.target)}})},{threshold:0.3});
const metricsEl=document.querySelector('.metrics');if(metricsEl)metricObs.observe(metricsEl);

// ═══ PARALLAX ORBS ON SCROLL ═══
let ticking=false;
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{
  const y=window.pageYOffset;
  document.querySelectorAll('.orb').forEach((o,i)=>{
    const baseTransform=o.style.animation?'':'';
    o.style.marginTop=`${y*0.02*(i%2?-1:1)}px`;
  });
  ticking=false});ticking=true}});

// ═══ KEYBOARD NAV ═══
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'||e.key===' '){
    e.preventDefault();
    const y=window.pageYOffset+window.innerHeight*0.8;
    window.scrollTo({top:y,behavior:'smooth'});
  }
  if(e.key==='ArrowUp'){
    e.preventDefault();
    const y=window.pageYOffset-window.innerHeight*0.8;
    window.scrollTo({top:Math.max(0,y),behavior:'smooth'});
  }
});

// ═══ AI AGENT LOGIC ═══
const AGENT_CONTEXT = `You are Altoviento's AI assistant embedded on their website. Altoviento is an AI-first startup studio that co-builds SaaS companies alongside domain experts.

KEY FACTS:
- Altoviento is a venture builder, not a consultancy, agency, or accelerator
- They partner with domain experts who have deep industry knowledge but lack technical execution capabilities
- Altoviento provides: technical execution, product development, operational structure, and go-to-market systems
- Business model: co-ownership with shared risk — no consulting fees, aligned incentives
- Typical timeline: discovery in weeks 1-2, MVP launch in weeks 3-8, validation months 3-6, scale month 6+
- AI is embedded in every build they execute
- They build multiple ventures simultaneously creating a diversified portfolio
- Target audience: domain experts (10+ years in an industry), traditional businesses seeking digital transformation, aspiring founders with insights but no team
- The global SaaS market exceeds $300B
- Value is realized through company growth and strategic exits

YOUR ROLES:
1. ANSWER QUESTIONS about Altoviento accurately and concisely
2. QUALIFY LEADS by understanding their background, industry, and problem — then tell them if they seem like a good fit
3. GUIDE visitors to relevant sections of the website when appropriate (use section names like "How it works", "What we offer", "The model", "FAQ")
4. COLLECT INFO naturally — ask for their name, industry, and what problem they want to solve, but don't be pushy

TONE: Professional but warm. Confident but not salesy. Direct and concise — keep responses under 3 sentences when possible. Use the visitor's name once you know it.

If someone seems like a strong fit, encourage them to schedule a discovery call. If they ask something you don't know, be honest and suggest they reach out directly.`;

let conversationHistory = [];
let agentOpen = false;

function toggleAgent() {
  agentOpen = !agentOpen;
  document.getElementById('agentPanel').classList.toggle('open', agentOpen);
  document.getElementById('agentFab').classList.toggle('open', agentOpen);
  if (agentOpen) document.getElementById('agentInput').focus();
}

function sendQuick(text) {
  document.getElementById('agentQuickBtns').style.display = 'none';
  addMessage(text, 'user');
  getAIResponse(text);
}

function sendMessage() {
  const input = document.getElementById('agentInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  // Hide quick buttons after first message
  document.getElementById('agentQuickBtns').style.display = 'none';
  addMessage(text, 'user');
  getAIResponse(text);
}

function addMessage(text, type) {
  const messages = document.getElementById('agentMessages');
  const msg = document.createElement('div');
  msg.className = 'agent-msg ' + type;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const messages = document.getElementById('agentMessages');
  const typing = document.createElement('div');
  typing.className = 'agent-msg typing';
  typing.id = 'typingIndicator';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

async function getAIResponse(userMessage) {
  conversationHistory.push({ role: 'user', content: userMessage });
  showTyping();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: AGENT_CONTEXT,
        messages: conversationHistory
      })
    });

    const data = await response.json();
    removeTyping();

    const botReply = data.content && data.content[0] && data.content[0].text
      ? data.content[0].text
      : "I'm having trouble connecting right now. Please try again or reach out directly through our contact page.";

    conversationHistory.push({ role: 'assistant', content: botReply });
    addMessage(botReply, 'bot');

    // If the response mentions a section, offer to scroll there
    const sectionMap = {
      'how it works': '#how',
      'what we offer': '#provide',
      'the model': '#model',
      'testimonials': '#proof',
      'faq': '#faq',
      'who it\'s for': '#audience',
      'discovery call': '#cta',
      'get started': '#cta',
      'schedule': '#cta'
    };

    const lowerReply = botReply.toLowerCase();
    for (const [keyword, anchor] of Object.entries(sectionMap)) {
      if (lowerReply.includes(keyword)) {
        setTimeout(() => {
          const messages = document.getElementById('agentMessages');
          const guideBtn = document.createElement('div');
          guideBtn.className = 'agent-msg bot';
          guideBtn.innerHTML = `<span style="cursor:pointer;color:var(--teal);font-weight:500;text-decoration:underline" onclick="document.querySelector('${anchor}').scrollIntoView({behavior:'smooth'});toggleAgent()">↓ Jump to that section</span>`;
          messages.appendChild(guideBtn);
          messages.scrollTop = messages.scrollHeight;
        }, 500);
        break;
      }
    }

  } catch (error) {
    removeTyping();
    addMessage("I'm having trouble connecting right now. Feel free to scroll through the site or schedule a call directly!", 'bot');
  }
}