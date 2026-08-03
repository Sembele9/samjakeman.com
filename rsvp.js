(() => {
  const translations = {
    en: {
      eyebrow: 'You are invited', title: 'Celebrate with us', intro: 'Please let us know if you can join us by completing the form below.',
      languageLegend: 'Choose your language', attendingLegend: 'Will you be attending?', attendingYes: 'Joyfully accepts', attendingNo: 'Regretfully declines',
      guestStep: 'Your party', guestHeading: 'Guest details', addGuest: 'Add another person', guest: 'Guest', removeGuest: 'Remove guest',
      nameLabel: 'Full name', dietaryLegend: 'Dietary requirements', dietaryHelp: 'Select all that apply.', dietNone: 'None', dietVegetarian: 'Vegetarian',
      dietVegan: 'Vegan', dietPescatarian: 'Pescatarian', dietGlutenFree: 'Gluten free', contactStep: 'Contact', contactHeading: 'Phone number',
      contactHelp: 'In case we need to contact you about the celebration.', countryCode: 'Country code', phoneNumber: 'Mobile phone number', submit: 'Send RSVP',
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
      contactHelp: 'Siltä varalta, että meidän tarvitsee ottaa yhteyttä juhlaan liittyen.', countryCode: 'Maatunnus', phoneNumber: 'Matkapuhelinnumero', submit: 'Lähetä vastaus',
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
  let locale = 'en';

  function t(key) { return translations[locale][key]; }

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

    const countryCode = document.querySelector('#countryCode');
    const phoneNumber = document.querySelector('#phoneNumber');
    const phoneValid = /^\+\d{1,4}$/.test(countryCode.value.trim()) && phoneNumber.value.replace(/\D/g, '').length >= 6;
    countryCode.classList.toggle('invalid', !phoneValid);
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
        countryCode: document.querySelector('#countryCode').value.trim(),
        number: document.querySelector('#phoneNumber').value.trim()
      }
    };
  }

  document.querySelectorAll('input[name="language"]').forEach((input) => {
    input.addEventListener('change', () => {
      applyLanguage(input.value);
      if (!document.querySelector('#phoneNumber').value) document.querySelector('#countryCode').value = input.value === 'fi' ? '+358' : '+44';
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
      const response = await fetch('/api/rsvps', {
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
    document.querySelector('#countryCode').value = locale === 'fi' ? '+358' : '+44';
    document.querySelector(`input[name="language"][value="${locale}"]`).checked = true;
    form.hidden = false;
    successCard.hidden = true;
    formStatus.textContent = '';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  addGuest();
  applyLanguage('en');
})();
