document.addEventListener('DOMContentLoaded', () => {
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }

    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise(resolve => (this.resolve = resolve));
      this.queue = [];

      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }

      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }

    update() {
      let output = '';
      let complete = 0;

      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="dud">${char}</span>`;
        } else {
          output += from;
        }
      }

      this.el.innerHTML = output;

      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }

    startContinuous(phrases, interval = 1600) {
      let counter = 0;
      const next = () => {
        this.setText(phrases[counter]).then(() => {
          setTimeout(next, interval);
        });
        counter = (counter + 1) % phrases.length;
      };
      next();
    }
  }

  const phrases = [
    'i found you.',
    'but you were just a recording,',
    'a looping shadow of your',
    'former self.'
  ];

  const textEl = document.querySelector('.main-text');
  if (textEl) {
    const fx1 = new TextScramble(textEl);
    fx1.startContinuous(phrases);
  }

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (
      (e.ctrlKey && ['u','U','c','C','s','S','a','A'].includes(e.key))
    ) {
      e.preventDefault();
    }
  });
});
