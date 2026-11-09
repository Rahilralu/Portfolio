<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="modal open" @click.self="closeContact()" @keydown.esc="closeContact()">
        <div ref="dlg" class="modal__panel" data-lenis-prevent role="dialog" aria-modal="true" aria-label="Hire me" tabindex="-1">
          <button class="x-btn" aria-label="Close" @click="closeContact()">✕</button>

          <template v-if="stage === 'ask'">
            <p class="eyebrow">Hire me</p>
            <h3 v-if="step === 0">Tell me what you need built.</h3>
            <p v-if="step === 0" class="intro">Five quick questions. Projects start at <b>$500</b>.</p>
            <div class="bar"><i :style="{ width: ((step + 1) / 5) * 100 + '%' }"></i></div>
            <p class="count tnum">{{ step + 1 }} of 5</p>

            <template v-if="step < 4">
              <h4>{{ steps[step].q }}</h4>
              <div v-if="step === 1" class="cur" role="tablist" aria-label="Currency">
                <button v-for="c in currencies" :key="c.code" role="tab" :aria-selected="cur === c.code" :class="{ on: cur === c.code }" @click="setCur(c.code)">{{ c.label }}</button>
              </div>
              <div class="mform qzl" role="radiogroup" :aria-label="steps[step].q">
                <label v-for="o in options" :key="o" class="qc" :class="{ chk: answers[step] === o }"><input type="radio" :name="'q' + step" :checked="answers[step] === o" @change="pick(o)" /><span>{{ o }}</span></label>
              </div>
            </template>
            <form v-else id="cf" @submit.prevent="review">
              <h4>Last step: how do I reach you?</h4>
              <label>Name<input v-model.trim="name" required autocomplete="name" /></label>
              <label>Work email<input v-model.trim="email" required type="email" autocomplete="email" /></label>
              <label>Phone<input v-model.trim="phone" type="tel" autocomplete="tel" /></label>
              <label>Company or website <small>(optional)</small><input v-model.trim="company" autocomplete="organization" /></label>
              <label>About the project<textarea v-model.trim="msg" rows="4"></textarea></label>
              <label class="hp" aria-hidden="true">Leave this empty<input v-model="trap" tabindex="-1" autocomplete="off" /></label>
            </form>

            <div class="nav">
              <button v-if="step > 0" class="btn ghost" @click="step--">Back</button>
              <p v-if="step === 4" class="reply">I reply within one business day.</p>
              <button v-if="step === 4" class="btn" type="submit" form="cf">Write the email <span class="badge">→</span></button>
              <button v-else class="btn" :disabled="!answers[step]" @click="step++">Next <span class="badge">→</span></button>
            </div>
          </template>

          <template v-else>
            <p class="eyebrow">Almost there</p>
            <h3>Thanks for asking{{ name ? ', ' + name : '' }}.</h3>
            <p class="intro">Your email app has opened with your message ready to go. Press send there and I'll reply within one business day.</p>
            <p class="intro">Email app didn't open? Write to <a :href="mailto" class="u">{{ profile.email }}</a>.</p>
            <div class="nav">
              <button class="btn ghost" @click="stage = 'ask'; step = 4">Change my answer</button>
              <button class="btn" @click="closeContact()">Close <span class="badge">✓</span></button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup lang="ts">
const { open, closeContact } = useContact()
const currencies = [{ code: 'USD', label: 'USD $' }, { code: 'GBP', label: 'GBP £' }, { code: 'INR', label: 'INR ₹' }]
const budgets: Record<string, string[]> = {
  USD: ['Under $500', '$500 – $1,500', '$1,500 – $5,000', '$5,000 or more'],
  GBP: ['Under £400', '£400 – £1,200', '£1,200 – £4,000', '£4,000 or more'],
  INR: ['Under ₹40,000', '₹40,000 – ₹1,25,000', '₹1,25,000 – ₹4,00,000', '₹4,00,000 or more'],
}
const steps = [
  { q: 'What do you need?', opts: ['Website or web app', 'Backend or API', 'AI integration', 'UI/UX design for a product', 'Internship or full-time role', 'I have a question about this website'] },
  { q: "What's your budget for this project?", opts: [] as string[] },
  { q: 'When do you want to start?', opts: ['Within a month', 'In 1 to 3 months', "I'm flexible", 'Just exploring for now'] },
  { q: 'Who is this for?', opts: ['An established business', 'A startup', 'An agency, for one of its clients', 'A personal project', 'A recruiting team'] },
]
const step = ref(0), stage = ref<'ask' | 'done'>('ask'), cur = ref('USD')
const answers = reactive<string[]>([])
const name = ref(''), email = ref(''), phone = ref(''), company = ref(''), msg = ref(''), trap = ref('')
const dlg = ref<HTMLElement>()
const options = computed(() => (step.value === 1 ? budgets[cur.value] : steps[step.value]?.opts || []))
const pick = (o: string) => { answers[step.value] = o }
function setCur(c: string) { cur.value = c; answers[1] = '' }
const mailto = computed(() => {
  const lines: (string | null)[] = [
    `Name: ${name.value}`, `Email: ${email.value}`,
    phone.value ? `Phone: ${phone.value}` : null, company.value ? `Company: ${company.value}` : null, '',
    `Looking for: ${answers[0]}`, `Budget: ${answers[1]}`, `Start: ${answers[2]}`, `Who it's for: ${answers[3]}`, '', msg.value,
  ]
  const body = lines.filter((l): l is string => l !== null).join('\n')
  return `mailto:${profile.email}?subject=${encodeURIComponent('Project enquiry from ' + (name.value || 'your website'))}&body=${encodeURIComponent(body)}`
})
function review() {
  if (trap.value) { stage.value = 'done'; return } // bot: pretend success, send nothing
  window.location.href = mailto.value
  stage.value = 'done'
}
watch(open, async (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
  if (v) { await nextTick(); dlg.value?.focus() }
  else setTimeout(() => { step.value = 0; stage.value = 'ask'; answers.length = 0; cur.value = 'USD' }, 350)
})
</script>
<style scoped>
.modal{position:fixed;inset:0;z-index:110;display:flex;align-items:flex-end;justify-content:center;padding:1rem;background:var(--scrim);backdrop-filter:blur(16px)}
@media(min-width:640px){.modal{align-items:center}}
.modal__panel{position:relative;width:100%;max-width:32rem;max-height:calc(100dvh - 2rem);overflow:auto;border-radius:var(--radius-card);background:var(--panel);padding:1.5rem;display:grid;gap:1rem;outline:none;box-shadow:0 0 0 1px var(--line),0 25px 50px -12px rgba(0,0,0,.25)}
@media(min-width:640px){.modal__panel{padding:2rem}}
.x-btn{position:absolute;right:1rem;top:1rem;width:2.25rem;height:2.25rem;display:grid;place-items:center;border-radius:9999px;background:var(--surface);color:rgba(var(--fg-rgb),.6);font-size:.9rem;transition:background .2s,color .2s}
.x-btn:hover{background:var(--surface-2);color:var(--foreground)}
.eyebrow{font-size:.875rem;font-weight:500;color:rgba(var(--fg-rgb),.6)}.eyebrow::before{background:var(--accent)}
h3{font-size:1.5rem;font-weight:600;letter-spacing:-.01em;text-wrap:balance;padding-right:2.5rem}@media(min-width:640px){h3{font-size:1.875rem}}
h4{font-size:1.125rem;font-weight:600;letter-spacing:-.01em}
.intro{font-size:.8125rem;color:rgba(var(--fg-rgb),.62)}.intro b{color:var(--foreground)}
.bar{height:.25rem;border-radius:99px;background:var(--line);overflow:hidden}.bar i{display:block;height:100%;background:var(--foreground);border-radius:inherit;transition:width .45s var(--e-spring)}
.count{font-size:.75rem;font-weight:600;color:rgba(var(--fg-rgb),.55)}
.cur{display:flex;gap:.25rem;align-self:flex-start;padding:.25rem;border-radius:99px;background:var(--surface);width:fit-content}
.cur button{min-height:2.25rem;padding:0 .9rem;border-radius:99px;font-size:.8125rem;font-weight:600;color:rgba(var(--fg-rgb),.62)}.cur button.on{background:var(--panel);color:var(--foreground);box-shadow:0 1px 3px rgba(0,0,0,.12)}
.mform{display:flex;flex-direction:column;gap:.5rem}
label.qc{position:relative;display:flex;align-items:center;gap:.75rem;min-height:3rem;padding:.7rem 1rem;border:1px solid var(--line);border-radius:var(--radius-control);background:var(--field);cursor:pointer;transition:border-color .2s,background .2s,box-shadow .2s}
label.qc:hover{border-color:rgba(var(--fg-rgb),.3)}
label.qc span{font-size:.9375rem;font-weight:500;color:var(--foreground)}
label.qc::before{content:"";flex:none;width:1.125rem;height:1.125rem;border-radius:50%;border:1.5px solid rgba(var(--fg-rgb),.45);box-sizing:border-box;transition:border .2s}
label.qc input{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}
label.qc.chk{border-color:var(--foreground);background:var(--panel);box-shadow:0 0 0 1px var(--foreground)}
label.qc.chk::before{border:5px solid var(--foreground)}
label.qc:has(input:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
form{display:flex;flex-direction:column;gap:1rem}
form label{display:flex;flex-direction:column;gap:.4rem;font-size:.75rem;font-weight:500;text-transform:uppercase;letter-spacing:.025em;color:rgba(var(--fg-rgb),.5)}
form label small{text-transform:none;letter-spacing:0;opacity:.75}
input[type=text],input[type=email],input[type=tel],form input:not([type]),textarea{width:100%;border:1px solid var(--line);background:var(--field);border-radius:var(--radius-control);padding:.75rem 1rem;font:inherit;font-size:.875rem;color:var(--foreground);outline:none;transition:border-color .2s,background .2s;text-transform:none;letter-spacing:0}
textarea{resize:none}input:focus,textarea:focus{border-color:rgba(var(--fg-rgb),.3);background:var(--panel)}
.hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}
.nav{display:flex;justify-content:flex-end;align-items:center;gap:.6rem;margin-top:.4rem;flex-wrap:wrap}
.reply{margin-right:auto;font-size:.75rem;color:rgba(var(--fg-rgb),.45)}
.btn{display:inline-flex;align-items:center;gap:.75rem;border-radius:9999px;padding:.375rem .375rem .375rem 1.5rem;font-size:.875rem;font-weight:500;background:var(--btn-bg);color:var(--btn-fg)}
.btn .badge{display:grid;place-items:center;width:2.25rem;height:2.25rem;border-radius:50%;background:var(--btn-badge-bg);color:var(--btn-badge-fg)}
.btn.ghost{padding:0 1.1rem;min-height:2.75rem;background:none;color:var(--foreground);border:1px solid var(--line)}.btn.ghost:hover{background:var(--surface)}
.btn:disabled{opacity:.4;pointer-events:none}.u{text-decoration:underline;color:var(--foreground);text-underline-offset:.2em}
.fade-enter-active,.fade-leave-active{transition:opacity .4s var(--e-spring)}.fade-enter-from,.fade-leave-to{opacity:0}
</style>
