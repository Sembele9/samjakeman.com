(() => {
  const API_ORIGIN = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? ''
    : 'https://api.samjakeman.com';
  const COUNTRY_CALLING_CODES = 'AC:247 AD:376 AE:971 AF:93 AG:1 AI:1 AL:355 AM:374 AO:244 AR:54 AS:1 AT:43 AU:61 AW:297 AX:358 AZ:994 BA:387 BB:1 BD:880 BE:32 BF:226 BG:359 BH:973 BI:257 BJ:229 BL:590 BM:1 BN:673 BO:591 BQ:599 BR:55 BS:1 BT:975 BW:267 BY:375 BZ:501 CA:1 CC:61 CD:243 CF:236 CG:242 CH:41 CI:225 CK:682 CL:56 CM:237 CN:86 CO:57 CR:506 CU:53 CV:238 CW:599 CX:61 CY:357 CZ:420 DE:49 DJ:253 DK:45 DM:1 DO:1 DZ:213 EC:593 EE:372 EG:20 EH:212 ER:291 ES:34 ET:251 FI:358 FJ:679 FK:500 FM:691 FO:298 FR:33 GA:241 GB:44 GD:1 GE:995 GF:594 GG:44 GH:233 GI:350 GL:299 GM:220 GN:224 GP:590 GQ:240 GR:30 GT:502 GU:1 GW:245 GY:592 HK:852 HN:504 HR:385 HT:509 HU:36 ID:62 IE:353 IL:972 IM:44 IN:91 IO:246 IQ:964 IR:98 IS:354 IT:39 JE:44 JM:1 JO:962 JP:81 KE:254 KG:996 KH:855 KI:686 KM:269 KN:1 KP:850 KR:82 KW:965 KY:1 KZ:7 LA:856 LB:961 LC:1 LI:423 LK:94 LR:231 LS:266 LT:370 LU:352 LV:371 LY:218 MA:212 MC:377 MD:373 ME:382 MF:590 MG:261 MH:692 MK:389 ML:223 MM:95 MN:976 MO:853 MP:1 MQ:596 MR:222 MS:1 MT:356 MU:230 MV:960 MW:265 MX:52 MY:60 MZ:258 NA:264 NC:687 NE:227 NF:672 NG:234 NI:505 NL:31 NO:47 NP:977 NR:674 NU:683 NZ:64 OM:968 PA:507 PE:51 PF:689 PG:675 PH:63 PK:92 PL:48 PM:508 PR:1 PS:970 PT:351 PW:680 PY:595 QA:974 RE:262 RO:40 RS:381 RU:7 RW:250 SA:966 SB:677 SC:248 SD:249 SE:46 SG:65 SH:290 SI:386 SJ:47 SK:421 SL:232 SM:378 SN:221 SO:252 SR:597 SS:211 ST:239 SV:503 SX:1 SY:963 SZ:268 TA:290 TC:1 TD:235 TG:228 TH:66 TJ:992 TK:690 TL:670 TM:993 TN:216 TO:676 TR:90 TT:1 TV:688 TW:886 TZ:255 UA:380 UG:256 US:1 UY:598 UZ:998 VA:39 VC:1 VE:58 VG:1 VI:1 VN:84 VU:678 WF:681 WS:685 XK:383 YE:967 YT:262 ZA:27 ZM:260 ZW:263'
    .split(' ')
    .map((entry) => {
      const [region, code] = entry.split(':');
      return { region, code: `+${code}` };
    });
  const translations = {
    en: {
      eyebrow: 'You are invited', title: 'Celebrate with us', intro: 'Please let us know if you can join us by completing the form below.',
      languageLegend: 'Choose your language', attendingLegend: 'Will you be attending?', attendingYes: 'Joyfully accepts', attendingNo: 'Regretfully declines',
      guestStep: 'Your party', guestHeading: 'Guest details', addGuest: 'Add another person', guest: 'Guest', removeGuest: 'Remove guest',
      nameLabel: 'Full name', dietaryLegend: 'Dietary requirements', dietaryHelp: 'Select all that apply.', dietNone: 'None', dietVegetarian: 'Vegetarian',
      dietVegan: 'Vegan', dietPescatarian: 'Pescatarian', dietGlutenFree: 'Gluten free', contactStep: 'Contact', contactHeading: 'Phone number',
      contactHelp: 'In case we need to contact you about the celebration.', countryCode: 'Country or region', phoneNumber: 'Mobile phone number', phonePlaceholder: 'e.g. 07835 799105',
      phoneFormatHelp: 'Local numbers beginning with 0 are accepted.', submit: 'Send RSVP',
      submitting: 'Sending…', attendingError: 'Please select whether you will be attending.', guestError: 'Please enter this guest’s full name.',
      phoneError: 'Please enter a valid country code and phone number.', requestError: 'We could not save your RSVP. Please try again.',
      thankYouEyebrow: 'Thank you', thankYouTitle: 'Your RSVP has been received', thankYouBody: 'We have saved your response and look forward to celebrating with you.',
      declinedBody: 'We have saved your response. Thank you for letting us know — you will be missed.', anotherResponse: 'Send another response', footer: 'With love, Sam & Viivi'
    },
    fi: {
      eyebrow: 'Olette lämpimästi tervetulleita', title: 'Juhlistakaa kanssamme', intro: 'Ilmoitattehan alla olevalla lomakkeella, pääsettekö mukaan juhlapäiväämme.',
      languageLegend: 'Valitse kieli', attendingLegend: 'Pääsettekö osallistumaan?', attendingYes: 'Tulen mielelläni', attendingNo: 'Valitettavasti en pääse',
      guestStep: 'Seurueenne', guestHeading: 'Vieraiden tiedot', addGuest: 'Lisää toinen vieras', guest: 'Vieras', removeGuest: 'Poista vieras',
      nameLabel: 'Koko nimi', dietaryLegend: 'Ruokavaliot', dietaryHelp: 'Valitse kaikki sopivat vaihtoehdot.', dietNone: 'Ei erityisruokavaliota', dietVegetarian: 'Kasvisruokavalio',
      dietVegan: 'Vegaaninen', dietPescatarian: 'Pescovegetaarinen', dietGlutenFree: 'Gluteeniton', contactStep: 'Yhteystiedot', contactHeading: 'Puhelinnumero',
      contactHelp: 'Siltä varalta, että meidän tarvitsee ottaa yhteyttä juhlaan liittyen.', countryCode: 'Maa tai alue', phoneNumber: 'Matkapuhelinnumero', phonePlaceholder: 'esim. 040 123 4567',
      phoneFormatHelp: 'Myös paikallinen 0-alkuinen numero hyväksytään.', submit: 'Lähetä vastaus',
      submitting: 'Lähetetään…', attendingError: 'Valitkaa, pääsettekö osallistumaan.', guestError: 'Kirjoittakaa vieraan koko nimi.',
      phoneError: 'Kirjoittakaa kelvollinen maatunnus ja puhelinnumero.', requestError: 'Vastauksen tallentaminen epäonnistui. Yrittäkää uudelleen.',
      thankYouEyebrow: 'Kiitos', thankYouTitle: 'Vastauksenne on vastaanotettu', thankYouBody: 'Olemme tallentaneet vastauksenne ja odotamme innolla yhteistä juhlapäivää.',
      declinedBody: 'Olemme tallentaneet vastauksenne. Kiitos ilmoituksesta — teitä jäädään kaipaamaan.', anotherResponse: 'Lähetä toinen vastaus', footer: 'Rakkaudella, Sam & Viivi'
    }
  };

  const form = document.querySelector('#rsvpForm');
  const guestList = document.querySelector('#guestList');
  const template = document.querySelector('#guestTemplate');
  const addGuestButton = document.querySelector('#addGuestButton');
  const submitButton = document.querySelector('#submitButton');
  const formStatus = document.querySelector('#formStatus');
  const successCard = document.querySelector('#successCard');
  const countryCodeSelect = document.querySelector('#countryCode');
  let locale = 'en';

  function t(key) { return translations[locale][key]; }

  function countryFlag(region) {
    return [...region].map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0))).join('');
  }

  function populateCountryCodes(selectedRegion) {
    const displayNames = typeof Intl.DisplayNames === 'function'
      ? new Intl.DisplayNames([locale], { type: 'region' })
      : null;
    const countries = COUNTRY_CALLING_CODES.map((country) => ({
      ...country,
      name: displayNames?.of(country.region) || country.region
    })).sort((a, b) => a.name.localeCompare(b.name, locale));

    countryCodeSelect.replaceChildren(...countries.map((country) => {
      const option = document.createElement('option');
      option.value = country.region;
      option.dataset.callingCode = country.code;
      option.textContent = `${countryFlag(country.region)} ${country.name} (${country.code})`;
      return option;
    }));
    countryCodeSelect.value = selectedRegion;
    if (!countryCodeSelect.value) countryCodeSelect.value = locale === 'fi' ? 'FI' : 'GB';
  }

  function updateGuestLabels() {
    [...guestList.querySelectorAll('.guest-card')].forEach((card, index) => {
      card.querySelector('h3').textContent = `${t('guest')} ${index + 1}`;
      const removeButton = card.querySelector('.remove-guest');
      removeButton.setAttribute('aria-label', t('removeGuest'));
      removeButton.hidden = guestList.children.length === 1;
    });
  }

  function applyLanguage(nextLocale) {
    locale = nextLocale;
    document.documentElement.lang = locale;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (translations[locale][key]) element.textContent = translations[locale][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    populateCountryCodes(countryCodeSelect.value || (locale === 'fi' ? 'FI' : 'GB'));
    if (document.querySelector('input[name="attending"]:checked')?.value === 'no') {
      document.querySelector('[data-i18n="thankYouBody"]').textContent = t('declinedBody');
    }
    updateGuestLabels();
  }

  function addGuest() {
    if (guestList.children.length >= 10) return;
    const card = template.content.firstElementChild.cloneNode(true);
    const checkboxes = [...card.querySelectorAll('.dietary-options input')];
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const none = checkboxes.find((item) => item.value === 'none');
        if (checkbox === none && checkbox.checked) {
          checkboxes.filter((item) => item !== none).forEach((item) => { item.checked = false; });
        } else if (checkbox.checked) {
          none.checked = false;
        }
        if (!checkboxes.some((item) => item.checked)) none.checked = true;
      });
    });
    card.querySelector('.guest-name').addEventListener('input', (event) => {
      event.currentTarget.classList.remove('invalid');
      card.querySelector('.guest-error').textContent = '';
    });
    card.querySelector('.remove-guest').addEventListener('click', () => {
      card.remove();
      updateGuestLabels();
    });
    guestList.append(card);
    applyLanguage(locale);
    if (guestList.children.length > 1) card.querySelector('.guest-name').focus();
  }

  function validate() {
    let valid = true;
    const attending = form.querySelector('input[name="attending"]:checked');
    const attendingError = document.querySelector('#attendingError');
    attendingError.textContent = attending ? '' : t('attendingError');
    valid = Boolean(attending);

    guestList.querySelectorAll('.guest-card').forEach((card) => {
      const input = card.querySelector('.guest-name');
      const guestValid = input.value.trim().length >= 2;
      input.classList.toggle('invalid', !guestValid);
      card.querySelector('.guest-error').textContent = guestValid ? '' : t('guestError');
      valid = valid && guestValid;
    });

    const phoneNumber = document.querySelector('#phoneNumber');
    const selectedCountry = countryCodeSelect.selectedOptions[0];
    const phoneValid = /^\+\d{1,4}$/.test(selectedCountry?.dataset.callingCode || '')
      && phoneNumber.value.replace(/\D/g, '').length >= 6;
    countryCodeSelect.classList.toggle('invalid', !phoneValid);
    phoneNumber.classList.toggle('invalid', !phoneValid);
    document.querySelector('#phoneError').textContent = phoneValid ? '' : t('phoneError');
    return valid && phoneValid;
  }

  function payload() {
    return {
      locale,
      attending: form.querySelector('input[name="attending"]:checked').value === 'yes',
      guests: [...guestList.querySelectorAll('.guest-card')].map((card) => ({
        name: card.querySelector('.guest-name').value.trim(),
        dietary: [...card.querySelectorAll('.dietary-options input:checked')].map((item) => item.value)
      })),
      phone: {
        country: countryCodeSelect.value,
        countryCode: countryCodeSelect.selectedOptions[0].dataset.callingCode,
        number: document.querySelector('#phoneNumber').value.trim()
      }
    };
  }

  document.querySelectorAll('input[name="language"]').forEach((input) => {
    input.addEventListener('change', () => {
      const defaultCountry = input.value === 'fi' ? 'FI' : 'GB';
      applyLanguage(input.value);
      if (!document.querySelector('#phoneNumber').value) countryCodeSelect.value = defaultCountry;
    });
  });
  document.querySelectorAll('input[name="attending"]').forEach((input) => input.addEventListener('change', () => {
    document.querySelector('#attendingError').textContent = '';
  }));
  document.querySelectorAll('#countryCode, #phoneNumber').forEach((input) => input.addEventListener('input', () => {
    input.classList.remove('invalid');
    document.querySelector('#phoneError').textContent = '';
  }));
  addGuestButton.addEventListener('click', addGuest);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    formStatus.textContent = '';
    if (!validate()) {
      form.querySelector('.invalid, input[name="attending"]')?.focus();
      return;
    }
    const responseData = payload();
    submitButton.disabled = true;
    submitButton.querySelector('[data-i18n="submit"]').textContent = t('submitting');
    try {
      const response = await fetch(`${API_ORIGIN}/api/rsvps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData)
      });
      if (!response.ok) throw new Error('Request failed');
      form.hidden = true;
      document.querySelector('[data-i18n="thankYouBody"]').textContent = responseData.attending ? t('thankYouBody') : t('declinedBody');
      successCard.hidden = false;
      successCard.focus();
    } catch (error) {
      formStatus.textContent = t('requestError');
    } finally {
      submitButton.disabled = false;
      submitButton.querySelector('[data-i18n="submit"]').textContent = t('submit');
    }
  });

  document.querySelector('#anotherResponse').addEventListener('click', () => {
    form.reset();
    guestList.replaceChildren();
    addGuest();
    countryCodeSelect.value = locale === 'fi' ? 'FI' : 'GB';
    document.querySelector(`input[name="language"][value="${locale}"]`).checked = true;
    form.hidden = false;
    successCard.hidden = true;
    formStatus.textContent = '';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  addGuest();
  applyLanguage('en');
})();
