(function () {
  var root = document.getElementById('sms-consent-banner');
  if (!root) return;
  var shop = root.getAttribute('data-shop');
  var proxy = root.getAttribute('data-proxy') || '/apps/sms-blossom';
  var form = root.querySelector('form');
  var input = root.querySelector('#sms-phone');
  var btnClose = root.querySelector('.sms-close');
  var msg = root.querySelector('.sms-msg');

  function show(m, ok) {
    msg.textContent = m;
    msg.style.color = ok ? '#9fef00' : '#ffd6d6';
  }

  form.addEventListener('submit', async function (ev) {
    ev.preventDefault();
    var phone = (input.value || '').trim();
    if (!phone) {
      show('Please enter your mobile number', false);
      return;
    }
    try {
      show('Submitting...', true);
      var res = await fetch(proxy + '/public/storefront/consent?shop=' + encodeURIComponent(shop), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone, optInLevel: 'SINGLE_OPT_IN' }),
      });
      var json = await res.json().catch(function () {
        return {};
      });
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed');
      }
      show('Thanks! SMS consent saved.', true);
    } catch (e) {
      show(e && e.message ? e.message : 'Failed to save consent', false);
    }
  });

  btnClose &&
    btnClose.addEventListener('click', function () {
      root.remove();
    });
})();
