// Extiende la interfaz Window para incluir recaptchaVerifier y confirmationResult
declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

import { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function PhoneVerification() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          console.log('reCAPTCHA verificado correctamente ✅');
        },
        'expired-callback': () => {
          console.warn('reCAPTCHA expiró, se reiniciará.');
        },
      });
      window.recaptchaVerifier.render().then((widgetId: any) => {
        console.log('reCAPTCHA renderizado con id:', widgetId);
      });
    }
  }, []);

  const sendCode = async () => {
    if (!phone.startsWith('+')) {
      alert('Ingresa un número. Ejemplo: +573001234567');
      return;
    }

    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmation;
      setIsCodeSent(true);
      alert('📲 Código enviado al número ' + phone);
    } catch (error: any) {
      console.error('Error al enviar el código:', error);
      if (error.message.includes('reCAPTCHA')) {
        alert('Hubo un problema con reCAPTCHA. Intenta actualizar la página.');
      } else {
        alert('Error al enviar el código. Verifica el número o intenta más tarde.');
      }
    }
  };

  const verifyCode = async () => {
    try {
      const result = await window.confirmationResult.confirm(code);
      alert('✅ Teléfono verificado correctamente. Usuario autenticado.');
      console.log('Usuario:', result.user);
    } catch (error) {
      console.error('Error al verificar el código:', error);
      alert('❌ Código incorrecto o expirado');
    }
  };

  return (
    <div style={{ maxWidth: '320px', margin: '2rem auto', textAlign: 'center' }}>
      <div id="recaptcha-container"></div>

      <h2>Verificación por teléfono</h2>

      <PhoneInput
        country={'co'}
        value={phone}
        onChange={(value) => setPhone('+' + value)}
        inputStyle={{ width: '100%' }}
        placeholder="Número de teléfono"
        disableDropdown={false}
      />

      {!isCodeSent ? (
        <button onClick={sendCode} style={{ marginTop: '10px', width: '100%' }}>
          Enviar código
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Código SMS"
            onChange={(e) => setCode(e.target.value)}
            style={{ display: 'block', marginTop: '10px', width: '100%' }}
          />
          <button onClick={verifyCode} style={{ marginTop: '10px', width: '100%' }}>
            Verificar
          </button>
        </>
      )}
    </div>
  );
}
