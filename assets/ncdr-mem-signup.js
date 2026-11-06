/*
 * Northcrest Membership — sign-up pop-up
 * - Any element with [data-mem-open] opens the pop-up (falls back to its href if the pop-up isn't on the page).
 * - Steps: payment (only if a prepay option is on) → how it works → review and agree.
 * - Continue stays disabled (aria-disabled) until the step is complete; a hint explains why.
 * - Keyboard: Tab is kept inside the pop-up, Esc closes, focus returns to the button that opened it.
 * - Choices are kept when going Back and when the pop-up is closed and reopened.
 */
(function () {
  if (window.NcdrMemSignup) return;

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([hidden]), select, textarea, [tabindex]:not([tabindex="-1"]), a[role="link"]';

  function SignUp(dialog) {
    this.dialog = dialog;
    this.form = dialog.querySelector('form');
    this.steps = Array.prototype.slice.call(dialog.querySelectorAll('[data-mem-step]'));
    this.index = 0;
    this.opener = null;
    try { this.text = JSON.parse(dialog.querySelector('[data-mem-text]').textContent); } catch (e) { this.text = {}; }

    this.progress = dialog.querySelector('[data-mem-progress]');
    this.hint = dialog.querySelector('[data-mem-hint]');
    this.back = dialog.querySelector('[data-mem-back]');
    this.next = dialog.querySelector('[data-mem-next]');
    this.checkout = dialog.querySelector('[data-mem-checkout]');
    this.partner = dialog.querySelector('[data-mem-partner]');
    this.missing = dialog.querySelector('[data-mem-missing]');

    var self = this;
    dialog.querySelector('[data-mem-close]').addEventListener('click', function () { self.close(); });
    this.back.addEventListener('click', function () { self.go(self.index - 1); });
    this.next.addEventListener('click', function () {
      if (self.isComplete()) self.go(self.index + 1);
      else self.focusFirstIncomplete();
    });
    this.checkout.addEventListener('click', function (event) {
      if (self.checkout.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
        self.focusFirstIncomplete();
      }
    });
    this.checkout.addEventListener('keydown', function (event) {
      if (event.key === ' ' && self.checkout.getAttribute('aria-disabled') !== 'true') {
        event.preventDefault();
        self.checkout.click();
      }
    });
    this.form.addEventListener('change', function () { self.update(); });
    this.form.addEventListener('submit', function (event) { event.preventDefault(); });

    // Esc: the browser fires "cancel" on a modal <dialog>. Route it through close() so focus returns.
    dialog.addEventListener('cancel', function (event) { event.preventDefault(); self.close(); });
    // Click on the backdrop (outside the panel) closes.
    dialog.addEventListener('click', function (event) { if (event.target === dialog) self.close(); });
    // Keep Tab inside the pop-up.
    dialog.addEventListener('keydown', function (event) { if (event.key === 'Tab') self.trapTab(event); });
  }

  SignUp.prototype.selected = function () {
    return this.form.querySelector('input[type="radio"]:checked');
  };

  SignUp.prototype.isComplete = function (step) {
    step = step || this.steps[this.index];
    if (!step) return false;
    if (step.dataset.memStep === 'payment') return !!this.selected();
    var required = step.querySelectorAll('[data-mem-required]');
    for (var i = 0; i < required.length; i++) if (!required[i].checked) return false;
    return true;
  };

  SignUp.prototype.focusFirstIncomplete = function () {
    var step = this.steps[this.index];
    var target = step.dataset.memStep === 'payment'
      ? step.querySelector('input[type="radio"]')
      : step.querySelector('[data-mem-required]:not(:checked)');
    if (target) target.focus();
  };

  SignUp.prototype.update = function () {
    var step = this.steps[this.index];
    var complete = this.isComplete();
    var last = this.index === this.steps.length - 1;
    var name = step.dataset.memStep;

    this.progress.textContent = (this.text.progress || 'Step [N] of [TOTAL]')
      .replace('[N]', this.index + 1)
      .replace('[TOTAL]', this.steps.length);

    this.back.hidden = this.index === 0;
    this.next.hidden = last;
    this.checkout.hidden = !last;
    if (this.partner) this.partner.hidden = !last;

    var hintKey = name === 'payment' ? 'hintPayment' : name === 'how' ? 'hintHow' : 'hintReview';
    this.hint.textContent = complete ? '' : (this.text[hintKey] || '');

    if (!last) {
      this.next.setAttribute('aria-disabled', complete ? 'false' : 'true');
      return;
    }

    // Review step: fill the summary from the chosen option.
    var option = this.selected();
    var url = option ? option.dataset.url : '';
    this.dialog.querySelector('[data-mem-summary="label"]').textContent = option ? option.dataset.label : '';
    this.dialog.querySelector('[data-mem-summary="price"]').textContent = option ? option.dataset.price : '';
    this.dialog.querySelector('[data-mem-summary="renewal"]').textContent = option ? option.dataset.renewal : '';
    this.missing.hidden = !!url;

    var ready = complete && !!url;
    this.checkout.setAttribute('aria-disabled', ready ? 'false' : 'true');
    if (ready) {
      this.checkout.href = url;
      this.checkout.removeAttribute('role');
      this.checkout.removeAttribute('tabindex');
    } else {
      // An <a> without href can't be focused or announced as a link, so restore both.
      this.checkout.removeAttribute('href');
      this.checkout.setAttribute('role', 'link');
      this.checkout.setAttribute('tabindex', '0');
    }
  };

  SignUp.prototype.go = function (index, skipFocus) {
    if (index < 0 || index >= this.steps.length) return;
    this.index = index;
    this.steps.forEach(function (step, i) { step.hidden = i !== index; });
    this.update();
    if (!skipFocus) {
      var heading = this.steps[index].querySelector('.mem-signup__heading');
      if (heading) heading.focus();
    }
    this.form.scrollTop = 0;
  };

  SignUp.prototype.open = function (opener) {
    this.opener = opener || document.activeElement;
    this.go(0, true);
    if (typeof this.dialog.showModal === 'function') this.dialog.showModal();
    else this.dialog.setAttribute('open', '');
    document.documentElement.classList.add('mem-signup-open');
    var heading = this.steps[0].querySelector('.mem-signup__heading');
    if (heading) heading.focus();
  };

  SignUp.prototype.close = function () {
    if (typeof this.dialog.close === 'function' && this.dialog.open) this.dialog.close();
    else this.dialog.removeAttribute('open');
    document.documentElement.classList.remove('mem-signup-open');
    if (this.opener && document.contains(this.opener)) this.opener.focus();
  };

  SignUp.prototype.trapTab = function (event) {
    var nodes = Array.prototype.filter.call(this.dialog.querySelectorAll(FOCUSABLE), function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
    if (!nodes.length) return;
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    var active = document.activeElement;
    var inside = this.dialog.contains(active);
    if (event.shiftKey && (active === first || !inside || active.classList.contains('mem-signup__heading'))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !inside)) {
      event.preventDefault();
      first.focus();
    }
  };

  var instances = new WeakMap();
  function instanceFor(dialog) {
    if (!instances.has(dialog)) instances.set(dialog, new SignUp(dialog));
    return instances.get(dialog);
  }
  function findDialog() { return document.querySelector('[data-mem-signup]'); }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-mem-open]');
    if (!trigger) return;
    var dialog = findDialog();
    if (!dialog) return; // No pop-up on the page (e.g. Coming soon): let the link work normally.
    event.preventDefault();
    instanceFor(dialog).open(trigger);
  });

  // Theme editor: open the pop-up while its section is selected.
  document.addEventListener('shopify:section:select', function (event) {
    var dialog = document.querySelector('[data-mem-signup][data-section-id="' + event.detail.sectionId + '"]');
    if (dialog) instanceFor(dialog).open(null);
  });
  document.addEventListener('shopify:section:deselect', function (event) {
    var dialog = document.querySelector('[data-mem-signup][data-section-id="' + event.detail.sectionId + '"]');
    if (dialog && dialog.open) instanceFor(dialog).close();
  });

  window.NcdrMemSignup = { open: function (opener) { var d = findDialog(); if (d) instanceFor(d).open(opener); } };
})();
