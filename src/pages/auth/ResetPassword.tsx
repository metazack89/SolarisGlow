import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function ResetPassword() {
  const [email, setEmail] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert('¡Correo de restablecimiento enviado!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleReset}>
      <input type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Restablecer Contraseña</button>
    </form>
  );
}
